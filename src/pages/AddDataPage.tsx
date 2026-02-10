import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as XLSX from 'xlsx';
import { Download, Upload, Plus, Check, AlertCircle, FileSpreadsheet, Loader2, X, UserPlus, Building2, Users2, BarChart3, Globe2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';

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
import { createStartup, bulkCreateStartups, getServiceProviders, getFundingEntities } from '../utils/api';
import { logger } from '../utils/logger';
import { cn } from '../lib/utils';
import { downloadExcelTemplate } from '../utils/excelTemplateGenerator';

export default function AddDataPage() {
    const { startups, availableIndustries, refetch } = useStartups();
    const [existingProviders, setExistingProviders] = useState<string[]>([]);
    const [existingFundingEntities, setExistingFundingEntities] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [lang, setLang] = useState<'en' | 'ar'>('en');

    const t = (en: string, ar: string) => (lang === 'en' ? en : ar);

    // Fetch existing providers on mount or when startups change
    useEffect(() => {
        if (startups.length > 0) {
            setExistingProviders(getServiceProviders(startups));
            setExistingFundingEntities(getFundingEntities(startups));
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
            openClosed: 'Open',
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
    const [openFundingCombobox, setOpenFundingCombobox] = useState(false);
    const [openIndustryCombobox, setOpenIndustryCombobox] = useState(false);
    const [isFundingDateUnknown, setIsFundingDateUnknown] = useState(false);
    const [customProvider, setCustomProvider] = useState("");
    const [customFunding, setCustomFunding] = useState("");
    const [customIndustry, setCustomIndustry] = useState("");
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                form.setValue('logo', base64String);
                setLogoPreview(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    // Helper function to get user-friendly field labels
    const getFieldLabel = (fieldName: string): string => {
        const labels: Record<string, { en: string; ar: string }> = {
            name: { en: 'Startup Name', ar: 'اسم الشركة' },
            ceoName: { en: 'CEO Name', ar: 'اسم المؤسس' },
            phone: { en: 'Phone', ar: 'الهاتف' },
            email: { en: 'Email', ar: 'البريد الإلكتروني' },
            industry: { en: 'Industry', ar: 'القطاع' },
            governorate: { en: 'Governorate', ar: 'المحافظة' },
            revenue: { en: 'Revenue', ar: 'الإيرادات' },
            profitability: { en: 'Profitability', ar: 'الربحية' },
            ceoGender: { en: 'CEO Gender', ar: 'نوع المؤسس' },
            description: { en: 'Description', ar: 'الوصف' },
            startupType: { en: 'Startup Type', ar: 'نوع الشركة' },
            website: { en: 'Website', ar: 'الموقع الإلكتروني' },
            foundingDate: { en: 'Founding Date', ar: 'تاريخ التأسيس' },
            legalStatus: { en: 'Legal Status', ar: 'الوضع القانوني' },
            teamSize: { en: 'Team Size', ar: 'حجم الفريق' },
            femaleFounders: { en: 'Female Founders', ar: 'المؤسسات الإناث' },
            employees: { en: 'Employees', ar: 'الموظفين' },
            freelancersCount: { en: 'Freelancers', ar: 'العمالة الحرة' },
            hasDedicatedPlace: { en: 'Dedicated Place', ar: 'مكان مخصص' },
            workplaceType: { en: 'Workplace Type', ar: 'نوع المكان' },
            fundingRaised: { en: 'Funding Raised', ar: 'التمويل' },
            monthlyIncome: { en: 'Monthly Income', ar: 'الدخل الشهري' },
            serviceProvider: { en: 'Service Provider', ar: 'مقدم الخدمة' },
            lastFundingDate: { en: 'Last Funding Date', ar: 'تاريخ آخر تمويل' },
        };
        return labels[fieldName]?.[lang] || fieldName;
    };

    const onSubmitSingle = async (data: StartupFormData) => {
        setIsSubmitting(true);
        try {
            const result = await createStartup(data);
            if (result.success) {
                toast.success(t('Startup added successfully!', 'تم إضافة الشركة بنجاح!'));
                form.reset();
                setCustomProvider("");
                setCustomFunding("");
                setCustomIndustry("");
                setLogoPreview(null);
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

    // Error handler for form validation - scrolls to first error
    const onFormError = (errors: any) => {
        const firstErrorField = Object.keys(errors)[0];

        // Try to find the input element by name
        const element = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;

        if (element) {
            // Scroll to element with smooth behavior
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Focus the element after a short delay to ensure scroll completes
            setTimeout(() => {
                element.focus();
            }, 300);
        }

        // Show toast notification
        toast.error(
            t(
                `Please fill in all required fields (${Object.keys(errors).length} errors)`,
                `يرجى ملء جميع الحقول المطلوبة (${Object.keys(errors).length} أخطاء)`
            )
        );
    };

    // --- Bulk Upload Logic ---
    const [bulkData, setBulkData] = useState<any[]>([]);
    const [uploadStats, setUploadStats] = useState({ total: 0, valid: 0, invalid: 0, currentProcessing: 0, filtered: 0 });
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

                // Filter out example rows (where company name starts with "Example")
                const filteredData = data.filter((row: any) => {
                    const startupName = row['Startup Name'] || row['startup name'] || row['STARTUP NAME'] || '';
                    const nameStr = String(startupName).trim().toLowerCase();
                    // Skip rows that start with "example"
                    return !nameStr.startsWith('example');
                });

                const filteredCount = data.length - filteredData.length;
                logger.log(`📊 Total rows in Excel: ${data.length}, After filtering examples: ${filteredData.length}`);

                // Show notification if any rows were filtered
                if (filteredCount > 0) {
                    toast.info(
                        t(
                            `${filteredCount} example row(s) automatically skipped`,
                            `تم تجاهل ${filteredCount} صف مثال تلقائياً`
                        ),
                        { duration: 3000 }
                    );
                }

                validateBulkData(filteredData);
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
                name: getVal(['Startup Name']),
                ceoName: getVal(['CEO Name']),
                phone: String(getVal(['Phone']) || ''),
                email: getVal(['Email']),
                industry: getVal(['Industry']),
                governorate: getVal(['Governerate']),
                revenue: Number(getVal(['Revenue (Total) (Yearly)']) || 0),
                profitability: getVal(['profitability']),
                ceoGender: getVal(['CEO Gender']),
                description: getVal(['Description']),
                startupType: getVal(['Startup type']),
                website: getVal(['Website/ app links/ social media']),
                openClosed: getVal(['Open/Closed']),
                foundingDate: String(getVal(['Date of company stabilished']) || ''),
                legalStatus: getVal(['Legal Status']),
                teamSize: Number(getVal(['Founding team size']) || 0),
                femaleFounders: Number(getVal(['Female founders']) || 0),
                maleFounders: Number(getVal(['male founders']) || 0),
                freelancersCount: Number(getVal(['Freelancers']) || 0),
                employees: Number(getVal(['Employees']) || 0),
                hasDedicatedPlace: getVal(['Do you have a dedicated place']),
                workplaceType: getVal(['own or rent a workplace']),
                lastFundingDate: String(getVal(['Last Fundind Date']) || getVal(['Last Funding Date']) || ''),
                fundingEntity: getVal(['What is the Funding entity name?']),
                fundingRaised: String(getVal(['Funding raised']) || ''),
                monthlyIncome: String(getVal(['How much is your monthly income from the project?']) || ''),
                serviceProvider: getVal(['Service Provider']),
                logo: getVal(['Company logo']),
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
        setUploadStats({ total: data.length, valid: validCount, invalid: invalidCount, currentProcessing: 0, filtered: 0 });
    };

    const onSubmitBulk = async () => {
        if (uploadStats.valid === 0) return;
        setIsSubmitting(true);
        try {
            const validRows = bulkData.filter(r => r._isValid).map(({ _isValid, _errors, ...rest }) => rest);

            let successCount = 0;
            for (let i = 0; i < validRows.length; i++) {
                setUploadStats(prev => ({ ...prev, currentProcessing: i + 1 }));

                try {
                    const result = await createStartup(validRows[i] as any);
                    if (result.success) {
                        successCount++;
                    }
                } catch (err) {
                    console.error(`Row ${i + 1} failed:`, err);
                }

                // 1 second delay between rows for safety
                if (i < validRows.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            if (successCount > 0) {
                toast.success(t(`Successfully uploaded ${successCount} startups!`, `تم رفع ${successCount} شركة بنجاح!`));
                setBulkData([]);
                setUploadStats({ total: 0, valid: 0, invalid: 0, currentProcessing: 0, filtered: 0 });
                refetch();
            } else {
                toast.error(t('Upload failed for all rows', 'فشل الرفع لجميع الصفوف'));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const clearBulkUpload = () => {
        setBulkData([]);
        setUploadStats({ total: 0, valid: 0, invalid: 0, currentProcessing: 0, filtered: 0 });
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    const downloadTemplate = () => {
        // Use the enhanced template generator with dropdown lists
        downloadExcelTemplate(
            availableIndustries.length > 0 ? availableIndustries : FALLBACK_INDUSTRIES,
            existingProviders,
            existingFundingEntities
        );

        // Show success message
        toast.success(
            t(
                'Template downloaded! Check the "Options" sheet for dropdown values.',
                'تم تحميل النموذج! تحقق من ورقة "Options" لقيم القوائم المنسدلة.'
            ),
            { duration: 5000 }
        );
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
                                <form onSubmit={form.handleSubmit(onSubmitSingle, onFormError)} className="space-y-12">
                                    {/* Section 1: Personal Information of Founder */}
                                    <div className="space-y-6 p-6 rounded-2xl bg-white border shadow-sm">
                                        <div className="flex items-center gap-3 border-b pb-4">
                                            <div className="h-10 w-10 rounded-xl bg-athar-blue/10 flex items-center justify-center">
                                                <UserPlus className="h-6 w-6 text-athar-blue" />
                                            </div>
                                            <h3 className="text-xl font-bold text-athar-black">{t('Personal Information of Founder', 'معلومات شخصية عن المؤسس')}</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                                <Label>{t('Phone *', 'الهاتف *')}</Label>
                                                <Input {...form.register('phone')} placeholder="01..." />
                                                {form.formState.errors.phone && <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label>{t('Email *', 'البريد الإلكتروني *')}</Label>
                                                <Input {...form.register('email')} />
                                                {form.formState.errors.email && <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 2: Company Information */}
                                    <div className="space-y-8">
                                        {/* Subsection 2.1: General Company Information */}
                                        <div className="space-y-6 p-6 rounded-2xl bg-slate-50/50 border border-slate-100 shadow-sm">
                                            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                                                <div className="h-10 w-10 rounded-xl bg-slate-200 flex items-center justify-center">
                                                    <Building2 className="h-6 w-6 text-slate-600" />
                                                </div>
                                                <h3 className="text-xl font-bold text-athar-black">{t('General Company Information', 'معلومات عامة عن الشركة')}</h3>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label>{t('Startup Name *', 'اسم الشركة *')}</Label>
                                                    <Input {...form.register('name')} placeholder={t('e.g. Acme Corp', 'مثال: شركة النصر')} />
                                                    {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>{t('Startup Type *', 'نوع الشركة *')}</Label>
                                                    <Select onValueChange={(val: string) => form.setValue('startupType', val)}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={t('Select Type', 'اختر النوع')} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Startup">{t('Startup', 'شركة ناشئة')}</SelectItem>
                                                            <SelectItem value="MSME">{t('MSME', 'شركة صغيرة/متوسطة/متناهية الصغر')}</SelectItem>
                                                            <SelectItem value="Livelihood">{t('Livelihood', 'مشروع معيشي')}</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    {form.formState.errors.startupType && <p className="text-sm text-red-500">{form.formState.errors.startupType.message}</p>}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>{t('Industry *', 'القطاع / الصناعة *')}</Label>
                                                    <Popover open={openIndustryCombobox} onOpenChange={setOpenIndustryCombobox}>
                                                        <PopoverTrigger asChild>
                                                            <Button variant="outline" role="combobox" className="w-full justify-between">
                                                                {form.watch('industry') || t('Select or enter...', 'اختر أو أدخل...')}
                                                                <Plus className="ml-2 h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-[400px] p-0" align="start">
                                                            <Command>
                                                                <CommandInput
                                                                    placeholder={t("Search industries...", "بحث...")}
                                                                    onValueChange={setCustomIndustry}
                                                                />
                                                                <CommandList>
                                                                    <CommandEmpty>
                                                                        <Button
                                                                            variant="ghost"
                                                                            className="w-full justify-start text-primary"
                                                                            onClick={() => {
                                                                                if (customIndustry) {
                                                                                    form.setValue('industry', customIndustry);
                                                                                    setOpenIndustryCombobox(false);
                                                                                }
                                                                            }}
                                                                        >
                                                                            <Plus className="mr-2 h-4 w-4" />
                                                                            {t(`Create "${customIndustry}"`, `إنشاء "${customIndustry}"`)}
                                                                        </Button>
                                                                    </CommandEmpty>
                                                                    <CommandGroup>
                                                                        {availableIndustries.map((industry) => (
                                                                            <CommandItem
                                                                                key={industry}
                                                                                value={industry}
                                                                                onSelect={(currentValue) => {
                                                                                    form.setValue('industry', currentValue);
                                                                                    setOpenIndustryCombobox(false);
                                                                                }}
                                                                            >
                                                                                <Check
                                                                                    className={cn(
                                                                                        "mr-2 h-4 w-4",
                                                                                        form.watch('industry') === industry ? "opacity-100" : "opacity-0"
                                                                                    )}
                                                                                />
                                                                                {industry}
                                                                            </CommandItem>
                                                                        ))}
                                                                    </CommandGroup>
                                                                </CommandList>
                                                            </Command>
                                                        </PopoverContent>
                                                    </Popover>
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
                                                <div className="space-y-2 md:col-span-2">
                                                    <Label>{t('Company logo', 'شعار الشركة')}</Label>
                                                    <div className="flex items-center gap-4">
                                                        <Input type="file" accept="image/*" onChange={handleLogoChange} className="cursor-pointer" />
                                                        {logoPreview && (
                                                            <div className="h-12 w-12 rounded border overflow-hidden bg-slate-100 flex items-center justify-center">
                                                                <img src={logoPreview} alt="Logo preview" className="max-h-full max-w-full object-contain" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {t('Will be stored in Google Drive.', 'سيتم تخزين الشعار في جوجل درايف.')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Subsection 2.2: Human Resources Information */}
                                        <div className="space-y-6 p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
                                            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                                                <div className="h-10 w-10 rounded-xl bg-athar-yellow/10 flex items-center justify-center">
                                                    <Users2 className="h-6 w-6 text-athar-yellow" />
                                                </div>
                                                <h3 className="text-xl font-bold text-athar-black">{t('Human Resources Information', 'معلومات الموارد البشرية')}</h3>
                                            </div>

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
                                                    <Input type="number" {...form.register('maleFounders', { valueAsNumber: true })} readOnly className="bg-white/50" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>{t('Nu. of employees *', 'عدد الموظفين *')}</Label>
                                                    <Input type="number" {...form.register('employees', { valueAsNumber: true })} />
                                                    {form.formState.errors.employees && <p className="text-sm text-red-500">{form.formState.errors.employees.message}</p>}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>{t('Number of freelancers *', 'العمالة الحرة *')}</Label>
                                                    <Input type="number" {...form.register('freelancersCount', { valueAsNumber: true })} />
                                                    {form.formState.errors.freelancersCount && <p className="text-sm text-red-500">{form.formState.errors.freelancersCount.message}</p>}
                                                </div>
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
                                                            <SelectItem value="online">{t('online', 'أونلاين')}</SelectItem>
                                                            <SelectItem value="Co-working">{t('Co-working', 'مساحة عمل مشتركة')}</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    {form.formState.errors.workplaceType && <p className="text-sm text-red-500">{form.formState.errors.workplaceType.message}</p>}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Subsection 2.3: Financial Information */}
                                        <div className="space-y-6 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
                                            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                                                <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center">
                                                    <BarChart3 className="h-6 w-6 text-green-600" />
                                                </div>
                                                <h3 className="text-xl font-bold text-athar-black">{t('Financial Information', 'المعلومات المالية')}</h3>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                                    <Label>{t('Funding raised *', 'التمويل الذي تم الحصول عليه *')}</Label>
                                                    <Input {...form.register('fundingRaised')} placeholder="e.g. 1M EGP Seed (Write 'None' if none)" />
                                                    {form.formState.errors.fundingRaised && <p className="text-sm text-red-500">{form.formState.errors.fundingRaised.message}</p>}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>{t('What is the Funding entity name?', 'ما هي جهة التمويل؟')} {form.watch('fundingRaised') && form.watch('fundingRaised').toLowerCase() !== 'none' && '*'}</Label>
                                                    <div className="flex flex-col gap-2">
                                                        <Popover open={openFundingCombobox} onOpenChange={setOpenFundingCombobox}>
                                                            <PopoverTrigger asChild>
                                                                <Button variant="outline" role="combobox" className="w-full justify-between">
                                                                    {t('Select or enter...', 'اختر أو أدخل...')}
                                                                    <Plus className="ml-2 h-4 w-4 opacity-50" />
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-[400px] p-0" align="start">
                                                                <Command>
                                                                    <CommandInput
                                                                        placeholder={t("Search entities...", "بحث...")}
                                                                        onValueChange={setCustomFunding}
                                                                    />
                                                                    <CommandList>
                                                                        <CommandEmpty>
                                                                            <Button
                                                                                variant="ghost"
                                                                                className="w-full justify-start text-primary"
                                                                                onClick={() => {
                                                                                    if (customFunding) {
                                                                                        const current = form.getValues('fundingEntity') || '';
                                                                                        const newVal = current ? `${current}, ${customFunding}` : customFunding;
                                                                                        form.setValue('fundingEntity', newVal);
                                                                                        setOpenFundingCombobox(false);
                                                                                    }
                                                                                }}
                                                                            >
                                                                                <Plus className="mr-2 h-4 w-4" />
                                                                                {t(`Add "${customFunding}"`, `إضافة "${customFunding}"`)}
                                                                            </Button>
                                                                        </CommandEmpty>
                                                                        <CommandGroup>
                                                                            {existingFundingEntities.map((entity) => (
                                                                                <CommandItem
                                                                                    key={entity}
                                                                                    value={entity}
                                                                                    onSelect={(currentValue) => {
                                                                                        const current = form.getValues('fundingEntity') || '';
                                                                                        const newVal = current ? `${current}, ${currentValue}` : currentValue;
                                                                                        form.setValue('fundingEntity', newVal);
                                                                                        setOpenFundingCombobox(false);
                                                                                    }}
                                                                                >
                                                                                    <Check
                                                                                        className={cn(
                                                                                            "mr-2 h-4 w-4",
                                                                                            (form.watch('fundingEntity') || '').includes(entity) ? "opacity-100" : "opacity-0"
                                                                                        )}
                                                                                    />
                                                                                    {entity}
                                                                                </CommandItem>
                                                                            ))}
                                                                        </CommandGroup>
                                                                    </CommandList>
                                                                </Command>
                                                            </PopoverContent>
                                                        </Popover>
                                                        <Input
                                                            {...form.register('fundingEntity')}
                                                            placeholder={t('Selected entities (can edit manually)', 'الجهات المختارة (يمكنك التعديل يدوياً)')}
                                                        />
                                                    </div>
                                                    {form.formState.errors.fundingEntity && <p className="text-sm text-red-500">{form.formState.errors.fundingEntity.message}</p>}
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <Label>{t('Last Funding Date *', 'تاريخ آخر تمويل *')}</Label>
                                                        <div className="flex items-center space-x-2 space-x-reverse">
                                                            <Checkbox
                                                                id="unknown-date"
                                                                checked={isFundingDateUnknown}
                                                                onCheckedChange={(checked: boolean) => {
                                                                    const isChecked = !!checked;
                                                                    setIsFundingDateUnknown(isChecked);
                                                                    if (isChecked) {
                                                                        form.setValue('lastFundingDate', t('Unknown / Not Disclosed', 'لم يتم الافصاح عن تاريخ التمويل'));
                                                                    } else {
                                                                        form.setValue('lastFundingDate', '');
                                                                    }
                                                                }}
                                                            />
                                                            <label htmlFor="unknown-date" className="text-xs text-muted-foreground cursor-pointer">
                                                                {t('Unknown / Not Disclosed', 'غير معروف / لم يتم الإفصاح')}
                                                            </label>
                                                        </div>
                                                    </div>
                                                    {!isFundingDateUnknown ? (
                                                        <Input {...form.register('lastFundingDate')} type="date" />
                                                    ) : (
                                                        <div className="p-2 bg-slate-50 border rounded-md text-sm text-slate-500 italic">
                                                            {t('Date marked as Unknown', 'تم وضع التاريخ كغير معروف')}
                                                        </div>
                                                    )}
                                                    {form.formState.errors.lastFundingDate && <p className="text-sm text-red-500">{form.formState.errors.lastFundingDate.message}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
                                        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                                            <div className="h-10 w-10 rounded-xl bg-athar-blue/10 flex items-center justify-center">
                                                <Globe2 className="h-6 w-6 text-athar-blue" />
                                            </div>
                                            <h3 className="text-xl font-bold text-athar-black">{t('Service Provider', 'مقدم الخدمة')}</h3>
                                        </div>
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
                                                    <CommandInput placeholder={t('Select or enter...', 'اختر أو أدخل...')} onValueChange={setCustomProvider} />
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

                                    {/* Error Summary - Shows all validation errors */}
                                    {Object.keys(form.formState.errors).length > 0 && (
                                        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <div className="flex items-center gap-2 text-red-800 font-semibold text-lg">
                                                <AlertCircle className="h-6 w-6 flex-shrink-0" />
                                                <span>{t('Please fix the following errors:', 'يرجى تصحيح الأخطاء التالية:')}</span>
                                            </div>
                                            <ul className="list-none space-y-2 text-sm">
                                                {Object.entries(form.formState.errors).map(([field, error]) => (
                                                    <li key={field} className="flex items-start gap-2 text-red-700">
                                                        <span className="text-red-500 mt-0.5">•</span>
                                                        <span>
                                                            <strong className="font-semibold">{getFieldLabel(field)}:</strong>{' '}
                                                            {error?.message as string}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

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
                                <CardDescription>
                                    {t('Upload an Excel file to add multiple startups at once.', 'قم برفع ملف إكسيل لإضافة عدة شركات مرة واحدة.')}
                                    <br />
                                    <span className="text-xs text-muted-foreground mt-1 inline-block">
                                        💡 {t('Rows starting with "Example" will be automatically skipped.', 'الصفوف التي تبدأ بـ "Example" سيتم تجاهلها تلقائياً.')}
                                    </span>
                                </CardDescription>
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
                                            <div className="flex gap-2 items-center">
                                                <Badge variant="outline">{uploadStats.total} {t('Total', 'إجمالي')}</Badge>
                                                <Badge variant="outline" className="bg-green-100 text-green-700">{uploadStats.valid} {t('Valid', 'صحيح')}</Badge>
                                                <Badge variant="outline" className="bg-red-100 text-red-700">{uploadStats.invalid} {t('Invalid', 'غير صحيح')}</Badge>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
                                                    onClick={clearBulkUpload}
                                                    disabled={isSubmitting}
                                                >
                                                    <X className="h-4 w-4 mr-1" />
                                                    {t('Clear All', 'مسح الكل')}
                                                </Button>
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

                                        <Button className="w-full h-14" onClick={onSubmitBulk} disabled={isSubmitting || uploadStats.valid === 0}>
                                            {isSubmitting ? (
                                                <div className="flex flex-col items-center w-full">
                                                    <div className="flex items-center">
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        {t(`Uploading ${uploadStats.currentProcessing} of ${uploadStats.valid}...`, `جاري رفع ${uploadStats.currentProcessing} من ${uploadStats.valid}...`)}
                                                    </div>
                                                    <div className="w-full bg-slate-200 h-1.5 mt-2 rounded-full overflow-hidden">
                                                        <div
                                                            className="bg-white h-full transition-all duration-300"
                                                            style={{ width: `${(uploadStats.currentProcessing / uploadStats.valid) * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <Upload className="mr-2 h-4 w-4" />
                                                    {t(`Upload ${uploadStats.valid} Startups`, `رفع ${uploadStats.valid} شركة`)}
                                                </>
                                            )}
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
