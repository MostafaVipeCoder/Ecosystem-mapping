import { useState, useMemo } from 'react';
import { useStartups } from '../context/StartupsContext';
import {
    MapPin,
    Users,
    DollarSign,
    Briefcase,
    Building2,
    Calendar,
    Phone,
    Mail,
    Globe,
    TrendingUp,
    Target,
    Loader2,
    RefreshCcw,
    X,
    Filter
} from 'lucide-react';

import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetTrigger } from '../components/ui/sheet';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Startup } from '../types';
import { formatCurrency } from '../utils/api';
import FilterSidebar from '../components/FilterSidebar';

// --- Components ---
const StartupDetails = ({ startup, open, onOpenChange }: { startup: Startup | null, open: boolean, onOpenChange: (open: boolean) => void }) => {
    if (!startup) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="left" className="w-[100vw] sm:w-[600px] p-0 overflow-hidden flex flex-col" dir="rtl">
                {/* Header */}
                <div className="bg-slate-900 text-white p-6 relative overflow-hidden shrink-0">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <Badge variant="secondary" className="bg-blue-500/20 text-blue-100 hover:bg-blue-500/30 border-0">
                                {startup.industry}
                            </Badge>
                            <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                                <span className="text-xs font-bold text-yellow-400">{startup.score}</span>
                                <span className="text-xs text-slate-300">/ 100 Quality Score</span>
                            </div>
                        </div>
                        <SheetTitle className="text-3xl font-bold mb-2 text-white">{startup.name}</SheetTitle>
                        <SheetDescription className="sr-only">
                            تفاصيل ومعلومات كاملة عن شركة {startup.name}
                        </SheetDescription>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                            <div className="flex items-center gap-1.5">
                                <MapPin size={14} />
                                {startup.governorate}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Briefcase size={14} />
                                {startup.stage}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Calendar size={14} />
                                تأسست {startup.foundingYear}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto bg-slate-50">
                    <div className="p-6">
                        <Tabs defaultValue="overview" className="w-full" dir="rtl">
                            <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-auto p-0 mb-6 gap-6">
                                <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-2">نظرة عامة</TabsTrigger>
                                <TabsTrigger value="financials" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-2">البيانات المالية</TabsTrigger>
                                <TabsTrigger value="team" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-2">الفريق</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-6 mt-0">
                                <Card className="border-none shadow-sm">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Building2 className="h-5 w-5 text-primary" />
                                            نبذة عن الشركة
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {startup.description || 'لا يوجد وصف متاح'}
                                        </p>
                                    </CardContent>
                                </Card>

                                {startup.story && (
                                    <Card className="border-none shadow-sm">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <Target className="h-5 w-5 text-primary" />
                                                القصة
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground leading-relaxed italic">
                                                "{startup.story}"
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-lg border shadow-sm space-y-1">
                                        <span className="text-xs text-muted-foreground">الشكل القانوني</span>
                                        <div className="font-semibold">{startup.legalStatus}</div>
                                    </div>
                                    {startup.challenges && (
                                        <div className="bg-white p-4 rounded-lg border shadow-sm space-y-1">
                                            <span className="text-xs text-muted-foreground">التحديات</span>
                                            <div className="font-semibold text-sm line-clamp-2">{startup.challenges}</div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        بيانات التواصل
                                    </h3>
                                    <div className="bg-white rounded-lg border divide-y">
                                        {startup.phone && (
                                            <div className="p-3 flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                                    <Phone size={14} />
                                                </div>
                                                <div className="text-sm">
                                                    <div className="text-muted-foreground text-xs">الهاتف</div>
                                                    <div dir="ltr" className="font-medium">{startup.phone}</div>
                                                </div>
                                            </div>
                                        )}
                                        {startup.email && (
                                            <div className="p-3 flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                                    <Mail size={14} />
                                                </div>
                                                <div className="text-sm">
                                                    <div className="text-muted-foreground text-xs">البريد الإلكتروني</div>
                                                    <div className="font-medium">{startup.email}</div>
                                                </div>
                                            </div>
                                        )}
                                        {startup.website && startup.website !== '#' && (
                                            <div className="p-3 flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                                    <Globe size={14} />
                                                </div>
                                                <div className="text-sm">
                                                    <div className="text-muted-foreground text-xs">الموقع الإلكتروني</div>
                                                    <a href={startup.website} target="_blank" rel="noreferrer" className="font-medium text-blue-600 hover:underline break-all">{startup.website}</a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="financials" className="space-y-6 mt-0">
                                <div className="grid grid-cols-2 gap-4">
                                    <Card>
                                        <CardHeader className="p-4 pb-2">
                                            <CardTitle className="text-sm font-medium text-muted-foreground">الإيرادات السنوية</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-0">
                                            <div className="text-2xl font-bold">{(startup.revenue || 0).toLocaleString()}</div>
                                            <span className="text-xs text-muted-foreground">ج.م</span>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="p-4 pb-2">
                                            <CardTitle className="text-sm font-medium text-muted-foreground">حالة الربحية</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-0">
                                            <Badge variant="outline" className={`${startup.profitStatus === 'إيرادات' ? 'text-green-600 border-green-200 bg-green-50' : 'text-amber-600 border-amber-200 bg-amber-50'}`}>
                                                {startup.profitStatus}
                                            </Badge>
                                        </CardContent>
                                    </Card>
                                </div>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-base">
                                            <TrendingUp className="h-5 w-5 text-primary" />
                                            التمويل والاستثمار
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between items-center py-2 border-b last:border-0">
                                            <span className="text-sm text-muted-foreground">حجم التمويل</span>
                                            <span className="font-semibold">{startup.fundingRaised}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="team" className="space-y-6 mt-0">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">هيكل الفريق</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                                                    <Users className="h-5 w-5 text-slate-600" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">إجمالي الموظفين</div>
                                                    <div className="text-xs text-muted-foreground">العاملين بدوام كامل</div>
                                                </div>
                                            </div>
                                            <div className="text-2xl font-bold">{startup.employees}</div>
                                        </div>

                                        <Separator />

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                                                    <Briefcase className="h-5 w-5 text-slate-600" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">المدير التنفيذي</div>
                                                    <div className="text-xs text-muted-foreground">القيادة الحالية</div>
                                                </div>
                                            </div>
                                            <div className="font-semibold">{startup.ceoName}</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

function StartupCard({ startup, onClick }: { startup: Startup, onClick: () => void }) {
    return (
        <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border-slate-200 hover:border-primary/50 overflow-hidden flex flex-col h-full bg-white" onClick={onClick}>
            <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <CardHeader className="space-y-4 p-5 pb-2">
                <div className="flex justify-between items-start gap-2">
                    <Badge variant="secondary" className="font-normal text-[11px] px-2.5 py-0.5 text-slate-600 bg-slate-100 hover:bg-slate-200 border-0">
                        {startup.industry}
                    </Badge>
                    <div className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${startup.profitStatus === 'إيرادات' ? 'text-emerald-700 border-emerald-200 bg-emerald-50' : 'text-amber-700 border-amber-200 bg-amber-50'}`}>
                        {startup.profitStatus}
                    </div>
                </div>

                <div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-1 leading-tight" title={startup.name}>
                        {startup.name}
                    </CardTitle>
                </div>
            </CardHeader>

            <CardContent className="p-5 pt-2 pb-4 space-y-4 flex-1">
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                            <MapPin size={16} />
                        </div>
                        <span className="truncate">{startup.governorate}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                            <Users size={16} />
                        </div>
                        <span className="truncate">{startup.employees} موظف</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 group-hover:border-blue-100 transition-colors">
                    <div className="h-8 w-8 rounded-full bg-white border shadow-sm flex items-center justify-center shrink-0 text-green-600">
                        <DollarSign size={16} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">العوائد السنوية</span>
                        <span className="text-sm font-bold text-slate-900">{formatCurrency(startup.revenue)} ج.م</span>
                    </div>
                </div>
            </CardContent>

            <Separator className="bg-slate-100" />

            <CardFooter className="p-4 bg-slate-50/50 flex justify-between items-center mt-auto">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 ring-2 ring-white">
                        {(startup.ceoName || '?').charAt(0)}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground">الرئيس التنفيذي</span>
                        <span className="text-xs font-medium text-slate-700 truncate max-w-[120px]">{startup.ceoName || 'غير متوفر'}</span>
                    </div>
                </div>

                <Button variant="ghost" size="sm" className="h-8 text-xs px-3 hover:bg-white hover:shadow-sm hover:text-primary transition-all rounded-full group-hover:translate-x-[-4px] duration-300">
                    التفاصيل
                </Button>
            </CardFooter>
        </Card>
    );
}

export default function HomePage() {
    const { startups, availableIndustries, isLoading, error, refetch } = useStartups();

    const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    // Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
    const [employeeRange, setEmployeeRange] = useState<number[]>([0, 200]);
    const [revenueRange, setRevenueRange] = useState<number[]>([0, 5000000]);

    // Mobile Filter Sheet State
    const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

    // Filter Logic
    const filteredStartups = useMemo(() => {
        return startups.filter(startup => {
            const name = startup.name || '';
            const ceoName = startup.ceoName || '';

            const matchesSearch = name.includes(searchQuery) || ceoName.includes(searchQuery);
            const matchesIndustry = selectedIndustries.length === 0 || selectedIndustries.includes(startup.industry);
            const matchesEmployees = (startup.employees || 0) >= employeeRange[0] && (startup.employees || 0) <= employeeRange[1];
            const matchesRevenue = (startup.revenue || 0) >= revenueRange[0] && (startup.revenue || 0) <= revenueRange[1];

            return matchesSearch && matchesIndustry && matchesEmployees && matchesRevenue;
        });
    }, [startups, searchQuery, selectedIndustries, employeeRange, revenueRange]);

    const handleReset = () => {
        setSearchQuery('');
        setSelectedIndustries([]);
        setEmployeeRange([0, 200]);
        setRevenueRange([0, 5000000]);
    };

    const handleCardClick = (startup: Startup) => {
        setSelectedStartup(startup);
        setIsDetailsOpen(true);
    };

    if (isLoading) {
        return (
            <div className="container px-4 md:px-8 py-12 mx-auto">
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-muted-foreground">جاري تحميل البيانات...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container px-4 md:px-8 py-12 mx-auto">
                <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center">
                    <div className="bg-red-50 p-4 rounded-full">
                        <X className="h-8 w-8 text-red-500" />
                    </div>
                    <h3 className="font-semibold text-lg">حدث خطأ في جلب البيانات</h3>
                    <p className="text-red-500 max-w-md">{error}</p>
                    <Button variant="outline" onClick={refetch} className="gap-2">
                        <RefreshCcw className="h-4 w-4" />
                        إعادة المحاولة
                    </Button>
                </div>
            </div>
        );
    }

    const filterProps = {
        searchQuery,
        setSearchQuery,
        availableIndustries,
        selectedIndustries,
        setSelectedIndustries,
        employeeRange,
        setEmployeeRange,
        revenueRange,
        setRevenueRange,
        onReset: handleReset
    };

    return (
        <>
            {/* Fixed Top Bar - Always Visible */}
            <div className="fixed top-16 left-0 right-0 z-20 bg-white border-b shadow-sm">
                <div className="px-6 py-3">
                    <div className="flex items-center justify-between gap-4">
                        {/* Mobile Filter Button - Hidden on Desktop */}
                        <div className="block lg:hidden">
                            <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Filter className="h-4 w-4" />
                                        <span>تصفية</span>
                                        {(selectedIndustries.length > 0) && (
                                            <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">{selectedIndustries.length}</Badge>
                                        )}
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="p-0 w-[300px]">
                                    <FilterSidebar className="h-full border-none" {...filterProps} />
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* Results Count & Title */}
                        <div className="flex-1">
                            <h1 className="text-xl font-bold text-slate-900">الشركات الناشئة</h1>
                            <p className="text-sm text-muted-foreground">
                                <span className="font-semibold text-primary">{filteredStartups.length}</span> شركة متاحة
                            </p>
                        </div>

                        {/* Sort Options - Visible on Desktop */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>ترتيب حسب:</span>
                            <Button variant="ghost" size="sm" className="h-8 text-xs">
                                الأحدث
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Layout Container - Below Fixed Top Bar */}
            <div className="fixed top-[calc(4rem+57px)] left-0 right-0 bottom-0 flex">
                {/* Fixed Sidebar - Always Visible on Desktop, Hidden on Mobile */}
                <aside className="w-72 border-l bg-white overflow-hidden shrink-0 hidden lg:block">
                    <FilterSidebar className="h-full" {...filterProps} />
                </aside>

                {/* Scrollable Main Content */}
                <main className="flex-1 overflow-y-auto bg-slate-50/30">
                    <div className="p-8">
                        <div className="max-w-[1600px] mx-auto">
                            {filteredStartups.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-dashed min-h-[400px]">
                                    <div className="bg-slate-100 p-6 rounded-full mb-4">
                                        <Target className="h-12 w-12 text-slate-400" />
                                    </div>
                                    <h3 className="font-bold text-xl mb-2 text-slate-900">لا توجد نتائج</h3>
                                    <p className="text-muted-foreground max-w-sm mb-6">
                                        لم نتمكن من العثور على شركات تطابق معايير البحث الخاصة بك.
                                    </p>
                                    <Button variant="outline" onClick={handleReset} className="gap-2">
                                        <RefreshCcw className="h-4 w-4" />
                                        مسح جميع الفلاتر
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid gap-5 grid-cols-3 lg:grid-cols-2 md:grid-cols-1">
                                    {filteredStartups.map((startup, index) => (
                                        <StartupCard
                                            key={startup.id || `startup-${index}`}
                                            startup={startup}
                                            onClick={() => handleCardClick(startup)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Startup Details Sheet */}
            <StartupDetails
                startup={selectedStartup}
                open={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
            />
        </>
    );
}

