import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as XLSX from 'xlsx';
import { Download, Upload, Plus, Check, AlertCircle, FileSpreadsheet, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/ui/table";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "../components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../components/ui/popover";

import { useStartups } from '../context/StartupsContext';
import { startupSchema, StartupFormData, FALLBACK_GOVERNORATES, FALLBACK_INDUSTRIES } from '../types';
import { createStartup, bulkCreateStartups, getServiceProviders } from '../utils/api';
import { cn } from '../lib/utils';

export default function AddDataPage() {
    const { startups, refetch } = useStartups();
    const [existingProviders, setExistingProviders] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [lang, setLang] = useState<'en' | 'ar'>('en');

    const t = (en: string, ar: string) => (lang === 'en' ? en : ar);

    // Fetch existing providers on mount or when startups change
    useEffect(() => {
        if (startups.length > 0) {
            setExistingProviders(getServiceProviders(startups));
        }
    }, [startups]);

    // --- Single Entry Logic ---
    const form = useForm<StartupFormData>({
        resolver: zodResolver(startupSchema) as any,
        defaultValues: {
            name: '',
            ceoName: '',
            phone: '',
            email: '',
            industry: '',
            governorate: '',
            employees: 0,
            revenue: 0,
            profitability: '',
            ceoGender: '',
            description: '',
            startupType: '',
            website: '',
            openClosed: '',
            foundingDate: '',
            legalStatus: '',
            teamSize: 0,
            femaleFounders: 0,
            maleFounders: 0,
            freelancersCount: 0,
            hasDedicatedPlace: '',
            workplaceType: '',
            fundingEntity: '',
            fundingRaised: '',
            monthlyIncome: '',
            serviceProvider: '',
        }
    });

    // Auto-calculate Male Founders
    const teamSize = form.watch('teamSize');
    const femaleFounders = form.watch('femaleFounders');

    useEffect(() => {
        const maleCount = Math.max(0, (teamSize || 0) - (femaleFounders || 0));
        form.setValue('maleFounders', maleCount);
    }, [teamSize, femaleFounders, form]);

    const [openProviderCombobox, setOpenProviderCombobox] = useState(false);
    const [customProvider, setCustomProvider] = useState("");

    const onSubmitSingle = async (data: StartupFormData) => {
        setIsSubmitting(true);
        try {
            const result = await createStartup(data);
            if (result.success) {
                toast.success(t('Startup added successfully!', 'تم إضافة الشركة بنجاح!'));
                form.reset();
                setCustomProvider("");
                refetch();
            } else {
                toast.error(t('Failed to add startup.', 'فشل في إضافة الشركة.'));
            }
        } catch (error) {
            console.error(error);
            toast.error(t('An unexpected error occurred.', 'حدث خطأ غير متوقع.'));
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Bulk Upload Logic ---
    const [bulkData, setBulkData] = useState<any[]>([]);
    const [uploadStats, setUploadStats] = useState({ total: 0, valid: 0, invalid: 0 });
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsAnalyzing(true);
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const bstr = event.target?.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);

                validateBulkData(data);
            } catch (error) {
                console.error("Error parsing Excel:", error);
                toast.error("Failed to parse the file.");
                setBulkData([]);
            } finally {
                setIsAnalyzing(false);
            }
        };
        reader.readAsBinaryString(file);
    };

    const validateBulkData = (data: any[]) => {
        const errors: { row: number; errors: any[] }[] = [];
        let validCount = 0;
        let invalidCount = 0;

        const processedData = data.map((row, index) => {
            // Helper to get value from row using case-insensitive and trimmed key
            const getVal = (aliases: string[]) => {
                const rowKeys = Object.keys(row);
                for (const alias of aliases) {
                    const cleanAlias = alias.trim().toLowerCase();
                    const matchingKey = rowKeys.find(k => k.trim().toLowerCase() === cleanAlias);
                    if (matchingKey !== undefined) return row[matchingKey];
                }
                return undefined;
            };

            const mappedRow = {
                name: getVal(['Startup Name', 'اسم الشركة', 'أسم الشركة', 'Name', 'Company Name', 'Business Name', 'الشركة', 'startupName']),
                ceoName: getVal(['CEO Name', 'اسم المؤسس', 'Founder', 'ceoName']),
                phone: String(getVal(['Phone', 'الهاتف', 'Mobile', 'phone']) || ''),
                email: getVal(['Email', 'البريد الالكتروني', 'email']),
                industry: getVal(['Industry', 'قطاع المشروع الصناعة', 'Sector', 'industry']),
                governorate: getVal(['Governerate', 'Governorate', 'المحافظة', 'governorate']),
                revenue: Number(getVal(['Revenue (Total) (Yearly)', 'الايرادات سنوي', 'Revenue', 'Total Revenue', 'revenue']) || 0),
                profitability: getVal(['profitability', 'مرحلة المشروع', 'Stage', 'Current Stage', 'الربحية']),
                ceoGender: getVal(['CEO Gender', 'النوع', 'Gender', 'ceoGender']),
                description: getVal(['Description', 'الوصف', 'وصف مختصر للشركة', 'Brief', 'description']),
                startupType: getVal(['Startup type', 'نوع الشركة', 'Startup Type', 'startupType', 'نوع المشروع']),
                website: getVal(['Website/ app links/ social media', 'التطبيق /رابط الموقع', 'Website', 'website', 'روابط']),
                openClosed: getVal(['Open/Closed', 'Operational status', 'Status', 'حالة العمل', 'openClosed']),
                foundingDate: String(getVal(['Date of company stabilished', 'تاريخ التأسيس', 'Date of establishment', 'Founding Date', 'foundingDate']) || ''),
                legalStatus: getVal(['Legal Status', 'هل المشروع مسجل', 'الوضع القانوني', 'legalStatus']),
                teamSize: Number(getVal(['Founding team size', 'عدد المؤسسين', 'Team Size', 'عدد فريق التأسيس', 'teamSize']) || 0),
                femaleFounders: Number(getVal(['Female founders', 'عدد المؤسسات الإناث', 'Female Founders', 'عدد الإناث المؤسسات', 'femaleFounders']) || 0),
                maleFounders: Number(getVal(['male founders', 'عدد المؤسسين الذكور', 'Male Founders', 'عدد الذكور المؤسسين', 'maleFounders']) || 0),
                freelancersCount: Number(getVal(['Number of freelancers', 'عدد المتدرّبين/الفريلانسرز', 'Freelancers', 'عدد الفريلانسرز', 'freelancersCount']) || 0),
                employees: Number(getVal(['Nu. of employees', 'عدد الموظفين كلهم بدون المؤسسين', 'Employees', 'Staff', 'عدد الموظفين', 'employees']) || 0),
                hasDedicatedPlace: getVal(['Do you have a dedicated place', 'مكان مخصص', 'Has Dedicated Place', 'hasDedicatedPlace']),
                workplaceType: getVal(['own or rent a workplace', 'نوع مكان العمل', 'Workplace Type', 'workplaceType']),
                fundingEntity: getVal(['What is the Funding entity?', 'جهة التمويل', 'fundingEntity']),
                fundingRaised: getVal(['Funding raised', 'قيمة تمويل', 'Total Funding', 'Funding Raised', 'fundingRaised', 'تمويل']),
                monthlyIncome: getVal(['How much is your monthly income from the project?', 'الدخل الشهري', 'Monthly Income', 'monthlyIncome']),
                serviceProvider: getVal(['Service Provider', 'Incubator', 'مقدم الخدمة', 'serviceProvider']),
            };

            const result = startupSchema.safeParse(mappedRow);
            if (!result.success) {
                errors.push({ row: index + 2, errors: result.error.issues });
                invalidCount++;
                return { ...mappedRow, _isValid: false, _errors: result.error.issues };
            } else {
                validCount++;
                return { ...result.data, _isValid: true };
            }
        });

        setBulkData(processedData);
        setUploadStats({ total: data.length, valid: validCount, invalid: invalidCount });
    };

    const onSubmitBulk = async () => {
        if (uploadStats.valid === 0) return;
        setIsSubmitting(true);
        try {
            const validRows = bulkData.filter(r => r._isValid).map(({ _isValid, _errors, ...rest }) => rest);
            const result = await bulkCreateStartups(validRows);
            if (result.success) {
                toast.success(t('Uploaded successfully!', 'تم الرفع بنجاح!'));
                setBulkData([]);
                setUploadStats({ total: 0, valid: 0, invalid: 0 });
                refetch();
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const downloadTemplate = () => {
        const templateRow = {
            "Startup Name": "Example Startup Name",
            "CEO Name": "Founder Name",
            "Phone": "01000000000",
            "Email": "info@example.com",
            "Industry": "Services",
            "Governerate": "Minya",
            "Revenue (Total) (Yearly)": 300000,
            "profitability": "Breaking Even",
            "CEO Gender": "Female",
            "Description": "Startup description goes here...",
            "Startup type": "Startup",
            "Website/ app links/ social media": "https://example.com",
            "Open/Closed": "Open",
            "Date of company stabilished": "2022",
            "Legal Status": "Not Registered",
            "Founding team size": 1,
            "Female founders": 1,
            "Number of freelancers": 3,
            "Nu. of employees": 4,
            "Do you have a dedicated place": "Yes",
            "own or rent a workplace": "Rent",
            "What is the Funding entity?": "Tiech",
            "Funding raised": "180000",
            "How much is your monthly income from the project?": "25000",
            "Service Provider": "Athar Accelerator"
        };
        const ws = XLSX.utils.json_to_sheet([templateRow]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Template");
        XLSX.writeFile(wb, "Startup_Template.xlsx");
    };

    return (
        <div className={cn("min-h-screen bg-slate-50 p-6 md:p-12", lang === 'ar' && "font-arabic")} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">{t('Data Ingestion Portal', 'بوابة إدخال البيانات')}</h1>
                        <p className="text-slate-500 mt-2">{t('Add new startups to the ecosystem mapping.', 'إضافة شركات ناشئة جديدة إلى خريطة النظام البيئي.')}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-white border rounded-lg p-1 flex shadow-sm">
                            <button
                                onClick={() => setLang('en')}
                                className={cn("px-3 py-1 rounded text-sm transition-colors", lang === 'en' ? "bg-slate-900 text-white" : "hover:bg-slate-100")}
                            >
                                English
                            </button>
                            <button
                                onClick={() => setLang('ar')}
                                className={cn("px-3 py-1 rounded text-sm transition-colors", lang === 'ar' ? "bg-slate-900 text-white" : "hover:bg-slate-100")}
                            >
                                العربية
                            </button>
                        </div>
                        {/* <Button variant="outline" asChild>
                            <a href="/">{t('Back to Home', 'العودة للرئيسية')}</a>
                        </Button> */}
                    </div>
                </div>

                <Tabs defaultValue="single" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                        <TabsTrigger value="single">{t('Single Entry', 'إدخال فردي')}</TabsTrigger>
                        <TabsTrigger value="bulk">{t('Bulk Upload', 'رفع جماعي')}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="single">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('Add New Startup', 'إضافة شركة ناشئة جديدة')}</CardTitle>
                                <CardDescription>{t('Enter the details of a single startup manually.', 'أدخل تفاصيل شركة ناشئة واحدة يدوياً.')}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={form.handleSubmit(onSubmitSingle)} className="space-y-8">
                                    {/* Section 1: Basic Information */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold border-b pb-2">{t('Basic Information', 'المعلومات الأساسية')}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label>{t('Startup Name *', 'اسم الشركة *')}</Label>
                                                <Input {...form.register('name')} placeholder={t('e.g. Acme Corp', 'مثال: شركة النصر')} />
                                                {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label>{t('CEO Name *', 'اسم المؤسس *')}</Label>
                                                <Input {...form.register('ceoName')} placeholder={t('e.g. John Doe', 'مثال: أحمد محمد')} />
                                                {form.formState.errors.ceoName && <p className="text-sm text-red-500">{form.formState.errors.ceoName.message}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label>{t('CEO Gender *', 'نوع المؤسس *')}</Label>
                                                <Select onValueChange={(val: string) => form.setValue('ceoGender', val)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t('Select Gender', 'اختر النوع')} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Male">{t('Male', 'ذكر')}</SelectItem>
                                                        <SelectItem value="Female">{t('Female', 'أنثى')}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {form.formState.errors.ceoGender && <p className="text-sm text-red-500">{form.formState.errors.ceoGender.message}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label>{t('Startup Type *', 'نوع الشركة *')}</Label>
                                                <Select onValueChange={(val: string) => form.setValue('startupType', val)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t('Select Type', 'اختر النوع')} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Startup">{t('Startup', 'شركة ناشئة')}</SelectItem>
                                                        <SelectItem value="SME">{t('SME', 'شركة صغيرة/متوسطة')}</SelectItem>
                                                        <SelectItem value="Livelihood">{t('Livelihood', 'مشروع معيشي')}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {form.formState.errors.startupType && <p className="text-sm text-red-500">{form.formState.errors.startupType.message}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label>{t('Industry *', 'القطاع / الصناعة *')}</Label>
                                                <Select onValueChange={(val: string) => form.setValue('industry', val)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t('Select Industry', 'اختر القطاع')} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {FALLBACK_INDUSTRIES.map(i => (
                                                            <SelectItem key={i} value={i}>{i}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {form.formState.errors.industry && <p className="text-sm text-red-500">{form.formState.errors.industry.message}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label>{t('Governorate *', 'المحافظة *')}</Label>
                                                <Select onValueChange={(val: string) => form.setValue('governorate', val)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t('Select Governorate', 'اختر المحافظة')} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {FALLBACK_GOVERNORATES.map(g => (
                                                            <SelectItem key={g} value={g}>{g}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {form.formState.errors.governorate && <p className="text-sm text-red-500">{form.formState.errors.governorate.message}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label>{t('Date of company stabilished *', 'تاريخ التأسيس *')}</Label>
                                                <Input {...form.register('foundingDate')} placeholder={t('e.g. 2022', 'مثال: 2022')} />
                                                {form.formState.errors.foundingDate && <p className="text-sm text-red-500">{form.formState.errors.foundingDate.message}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label>{t('Legal Status *', 'الوضع القانوني *')}</Label>
                                                <Select onValueChange={(val: string) => form.setValue('legalStatus', val)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t('Select Legal Status', 'اختر الوضع')} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Sole Proprietorship">{t('Sole Proprietorship', 'منشأة فردية')}</SelectItem>
                                                        <SelectItem value="Partnership">{t('Partnership', 'شركة تضامن')}</SelectItem>
                                                        <SelectItem value="LLC">{t('LLC', 'شركة ذات مسؤولية محدودة')}</SelectItem>
                                                        <SelectItem value="Not Registered">{t('Not Registered', 'غير مسجل')}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {form.formState.errors.legalStatus && <p className="text-sm text-red-500">{form.formState.errors.legalStatus.message}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 2: Contact & Presence */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold border-b pb-2">{t('Contact & Presence', 'التواصل والتواجد الرقمي')}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label>{t('Phone *', 'الهاتف *')}</Label>
                                                <Input {...form.register('phone')} placeholder="01..." />
                                                {form.formState.errors.phone && <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label>{t('Email *', 'البريد الإلكتروني *')}</Label>
                                                <Input {...form.register('email')} />
                                                {form.formState.errors.email && <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>}
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <Label>{t('Website/ app links/ social media *', 'الموقع الإلكتروني / الروابط *')}</Label>
                                                <Input {...form.register('website')} />
                                                {form.formState.errors.website && <p className="text-sm text-red-500">{form.formState.errors.website.message}</p>}
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <Label>{t('Description *', 'الوصف *')}</Label>
                                                <Textarea {...form.register('description')} />
                                                {form.formState.errors.description && <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 3: Team */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold border-b pb-2">{t('Team & Workspace', 'الفريق ومكان العمل')}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <Label>{t('Founding team size *', 'عدد فريق التأسيس *')}</Label>
                                                <Input type="number" {...form.register('teamSize', { valueAsNumber: true })} />
                                                {form.formState.errors.teamSize && <p className="text-sm text-red-500">{form.formState.errors.teamSize.message}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label>{t('Female founders *', 'عدد الإناث المؤسسات *')}</Label>
                                                <Input type="number" {...form.register('femaleFounders', { valueAsNumber: true })} />
                                                {form.formState.errors.femaleFounders && <p className="text-sm text-red-500">{form.formState.errors.femaleFounders.message}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label>{t('male founders', 'عدد الذكور المؤسسين')}</Label>
                                                <Input type="number" {...form.register('maleFounders', { valueAsNumber: true })} readOnly className="bg-slate-50" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>{t('Nu. of employees *', 'عدد الموظفين *')}</Label>
                                                <Input type="number" {...form.register('employees', { valueAsNumber: true })} />
                                                {form.formState.errors.employees && <p className="text-sm text-red-500">{form.formState.errors.employees.message}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label>{t('Number of freelancers *', 'عدد الفريلانسرز *')}</Label>
                                                <Input type="number" {...form.register('freelancersCount', { valueAsNumber: true })} />
                                                {form.formState.errors.freelancersCount && <p className="text-sm text-red-500">{form.formState.errors.freelancersCount.message}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label>{t('Do you have a dedicated place *', 'هل يوجد مكان مخصص؟ *')}</Label>
                                            <Select onValueChange={(val: string) => form.setValue('hasDedicatedPlace', val)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t('Select Option', 'اختر الخيار')} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Yes">{t('Yes', 'نعم')}</SelectItem>
                                                    <SelectItem value="No">{t('No', 'لا')}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {form.formState.errors.hasDedicatedPlace && <p className="text-sm text-red-500">{form.formState.errors.hasDedicatedPlace.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label>{t('own or rent a workplace *', 'ملك أم إيجار؟ *')}</Label>
                                            <Select onValueChange={(val: string) => form.setValue('workplaceType', val)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t('Select Option', 'اختر الخيار')} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Own">{t('Own', 'ملك')}</SelectItem>
                                                    <SelectItem value="Rent">{t('Rent', 'إيجار')}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {form.formState.errors.workplaceType && <p className="text-sm text-red-500">{form.formState.errors.workplaceType.message}</p>}
                                        </div>
                                    </div>

                                    {/* Section 4: Operations & Financials */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold border-b pb-2">{t('Financials & Funding', 'المالية والتمويل')}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label>{t('Open/Closed', 'حالة العمل (مفتوح/مغلق)')}</Label>
                                                <Select onValueChange={(val: string) => form.setValue('openClosed', val)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t('Select Status', 'اختر الحالة')} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Open">{t('Open', 'مفتوح')}</SelectItem>
                                                        <SelectItem value="Closed">{t('Closed', 'مغلق')}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {form.formState.errors.openClosed && <p className="text-sm text-red-500">{form.formState.errors.openClosed.message}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label>{t('profitability', 'مرحلة المشروع (الربحية)')}</Label>
                                                <Select onValueChange={(val: string) => form.setValue('profitability', val)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t('Select Status', 'اختر الحالة')} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Profitable">{t('Profitable', 'رابح')}</SelectItem>
                                                        <SelectItem value="Breaking Even">{t('Breaking Even', 'نقطة التعادل')}</SelectItem>
                                                        <SelectItem value="Loss-making">{t('Loss-making', 'خاسر')}</SelectItem>
                                                        <SelectItem value="Pre-revenue">{t('Pre-revenue', 'قبل الإيرادات')}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {form.formState.errors.profitability && <p className="text-sm text-red-500">{form.formState.errors.profitability.message}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label>{t('Revenue (Total) (Yearly) *', 'إجمالي الإيرادات السنوية *')}</Label>
                                                <Input type="number" {...form.register('revenue', { valueAsNumber: true })} />
                                                {form.formState.errors.revenue && <p className="text-sm text-red-500">{form.formState.errors.revenue.message}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label>{t('How much is your monthly income from the project? *', 'ما هو دخلك الشهري من المشروع؟ *')}</Label>
                                                <Input {...form.register('monthlyIncome')} placeholder="e.g. 50k - 100k EGP" />
                                                {form.formState.errors.monthlyIncome && <p className="text-sm text-red-500">{form.formState.errors.monthlyIncome.message}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label>{t('What is the Funding entity?', 'ما هي جهة التمويل؟')} {form.watch('fundingRaised') && form.watch('fundingRaised').toLowerCase() !== 'none' && '*'}</Label>
                                                <Input {...form.register('fundingEntity')} placeholder={t('e.g. Angel Investor', 'مثال: مستثمر ملاك')} />
                                                {form.formState.errors.fundingEntity && <p className="text-sm text-red-500">{form.formState.errors.fundingEntity.message}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label>{t('Funding raised *', 'التمويل الذي تم رفعه *')}</Label>
                                                <Input {...form.register('fundingRaised')} placeholder="e.g. 1M EGP Seed (Write 'None' if none)" />
                                                {form.formState.errors.fundingRaised && <p className="text-sm text-red-500">{form.formState.errors.fundingRaised.message}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold border-b pb-2">{t('Service Provider', 'مقدم الخدمة')}</h3>
                                        <div className="space-y-2">
                                            <Label>{t('Service Provider *', 'مقدم الخدمة *')}</Label>
                                            <Popover open={openProviderCombobox} onOpenChange={setOpenProviderCombobox}>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" role="combobox" className="w-full justify-between">
                                                        {form.watch('serviceProvider') || t('Select or enter...', 'اختر أو أدخل...')}
                                                        <Plus className="ml-2 h-4 w-4 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[400px] p-0" align="start">
                                                    <Command>
                                                        <CommandInput placeholder={t('Search...', 'بحث...')} onValueChange={setCustomProvider} />
                                                        <CommandList>
                                                            <CommandEmpty>
                                                                <Button variant="ghost" className="w-full justify-start text-blue-600" onClick={() => {
                                                                    form.setValue('serviceProvider', customProvider);
                                                                    setOpenProviderCombobox(false);
                                                                }}>
                                                                    <Plus className="mr-2 h-4 w-4" />
                                                                    {t(`Create "${customProvider}"`, `إنشاء "${customProvider}"`)}
                                                                </Button>
                                                            </CommandEmpty>
                                                            <CommandGroup>
                                                                {existingProviders.map((p) => (
                                                                    <CommandItem key={p} value={p} onSelect={(v) => {
                                                                        form.setValue('serviceProvider', v);
                                                                        setOpenProviderCombobox(false);
                                                                    }}>
                                                                        <Check className={cn("mr-2 h-4 w-4", form.watch('serviceProvider') === p ? "opacity-100" : "opacity-0")} />
                                                                        {p}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
                                        {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : t('Finalize and Add Startup', 'تأكيد وإضافة الشركة')}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="bulk">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('Bulk Upload', 'رفع جماعي')}</CardTitle>
                                <CardDescription>{t('Upload an Excel file to add multiple startups at once.', 'قم برفع ملف إكسيل لإضافة عدة شركات مرة واحدة.')}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between bg-slate-100 p-4 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <FileSpreadsheet className="h-8 w-8 text-green-600" />
                                        <div>
                                            <p className="font-medium">{t('Step 1: Download Template', 'الخطوة 1: تحميل النموذج')}</p>
                                            <p className="text-xs text-muted-foreground">{t('Use this template for correct format.', 'استخدم هذا النموذج لضمان التنسيق الصحيح.')}</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={downloadTemplate}>
                                        <Download className="mr-2 h-4 w-4" />
                                        {t('Download Template', 'تحميل النموذج')}
                                    </Button>
                                </div>

                                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-50 cursor-pointer relative">
                                    <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                    <div className="flex flex-col items-center gap-2">
                                        <Upload className="h-10 w-10 text-slate-400" />
                                        <p className="font-medium text-slate-600">{t('Click to upload or drag and drop', 'انقر للرفع أو قم بالسحب والإفلات')}</p>
                                        <p className="text-xs text-muted-foreground">.xlsx, .xls, .csv</p>
                                    </div>
                                </div>

                                {isAnalyzing && <div className="flex items-center justify-center p-4"><Loader2 className="h-6 w-6 animate-spin mr-2" /><span>{t('Analyzing...', 'جاري التحليل...')}</span></div>}

                                {bulkData.length > 0 && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold">{t('Preview Data', 'معاينة البيانات')}</h3>
                                            <div className="flex gap-2">
                                                <Badge variant="outline">{uploadStats.total} {t('Total', 'إجمالي')}</Badge>
                                                <Badge variant="outline" className="bg-green-100 text-green-700">{uploadStats.valid} {t('Valid', 'صحيح')}</Badge>
                                                <Badge variant="outline" className="bg-red-100 text-red-700">{uploadStats.invalid} {t('Invalid', 'غير صحيح')}</Badge>
                                            </div>
                                        </div>

                                        <div className="border rounded-md max-h-[300px] overflow-auto">
                                            <Table>
                                                <TableHeader><TableRow><TableHead>{t('Status', 'الحالة')}</TableHead><TableHead>{t('Name', 'الاسم')}</TableHead><TableHead>{t('Provider', 'مقدم الخدمة')}</TableHead><TableHead>{t('Issues', 'المشاكل')}</TableHead></TableRow></TableHeader>
                                                <TableBody>
                                                    {bulkData.slice(0, 50).map((row, i) => (
                                                        <TableRow key={i} className={!row._isValid ? "bg-red-50" : ""}>
                                                            <TableCell>{row._isValid ? <Check className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4 text-red-600" />}</TableCell>
                                                            <TableCell>{row.name || '-'}</TableCell>
                                                            <TableCell>{row.serviceProvider || '-'}</TableCell>
                                                            <TableCell>{!row._isValid && row._errors?.map((e: any, idx: number) => <span key={idx} className="block text-xs text-red-600">{e.path[0]}: {e.message}</span>)}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>

                                        <Button className="w-full" onClick={onSubmitBulk} disabled={isSubmitting || uploadStats.valid === 0}>
                                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                            {t(`Upload ${uploadStats.valid} Startups`, `رفع ${uploadStats.valid} شركة`)}
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
