import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useStartups } from '../context/StartupsContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { BarChart3, Briefcase, Building2, DollarSign, MapPin, RefreshCcw, TrendingUp, Users, X, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { SimpleBarChart } from "../components/charts/SimpleBarChart";
import { SimplePieChart } from "../components/charts/SimplePieChart";

export default function StatsPage() {
    const { startups, isLoading, error, refetch } = useStartups();
    const { t } = useTranslation();

    const stats = useMemo(() => {
        if (startups.length === 0) return null;

        // إجمالي الإحصائياتee
        const totalStartups = startups.length;
        const totalEmployees = startups.reduce((sum, s) => sum + (s.employees || 0), 0);
        const totalRevenue = startups.reduce((sum, s) => sum + (s.revenue || 0), 0);
        const profitableCount = startups.filter(s => (s.revenue || 0) > 0).length;

        // حسب القطاع
        const byIndustry = startups.reduce((acc, s) => {
            acc[s.industry] = (acc[s.industry] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // حسب المحافظة
        const byGovernorate = startups.reduce((acc, s) => {
            acc[s.governorate] = (acc[s.governorate] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // حسب مرحلة المشروع
        const byStage = startups.reduce((acc, s) => {
            acc[s.stage] = (acc[s.stage] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Founder Gender
        const byGender = startups.reduce((acc, s) => {
            const gender = s.ceoGender?.trim() || 'Not Specified';
            acc[gender] = (acc[gender] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Student Status
        const byStudentStatus = startups.reduce((acc, s) => {
            let status = s.founderStatus?.trim() || 'Not Specified';
            // Normalize common variations
            if (status.toLowerCase().includes('grad')) status = 'Graduate';
            else if (status.toLowerCase().includes('stud')) status = 'Student';

            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Age Groups
        const byAgeGroup = startups.reduce((acc, s) => {
            const age = s.ceoAge || 0;
            let group = 'Unknown';
            if (age > 0) {
                if (age < 18) group = 'Under 18';
                else if (age < 22) group = '18-22';
                else if (age < 25) group = '22-25';
                else if (age < 28) group = '25-28';
                else if (age < 31) group = '28-31';
                else if (age <= 35) group = '31-35';
                else group = 'Above 35';
            } else {
                group = 'Not Specified';
            }
            acc[group] = (acc[group] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // --- New Analytics Reducers ---

        // Operational & Legal

        const byStartupType = startups.reduce((acc, s) => { acc[s.startupType || 'Unknown'] = (acc[s.startupType || 'Unknown'] || 0) + 1; return acc; }, {} as Record<string, number>);
        const byWorkplaceOwnership = startups.reduce((acc, s) => { acc[s.workplaceOwnership || 'Unknown'] = (acc[s.workplaceOwnership || 'Unknown'] || 0) + 1; return acc; }, {} as Record<string, number>);
        const byLegalStatus = startups.reduce((acc, s) => { acc[s.legalStatusDetails || 'Unknown'] = (acc[s.legalStatusDetails || 'Unknown'] || 0) + 1; return acc; }, {} as Record<string, number>);










        // متوسطات
        const avgEmployees = Math.round(totalEmployees / totalStartups);
        const avgRevenue = Math.round(totalRevenue / totalStartups);

        return {
            totalStartups,
            totalEmployees,
            totalRevenue,
            profitableCount,
            profitablePercentage: Math.round((profitableCount / totalStartups) * 100),
            avgEmployees,
            avgRevenue,

            // Existing Arrays
            byIndustry: Object.entries(byIndustry).sort((a, b) => b[1] - a[1]),
            byGovernorate: Object.entries(byGovernorate).sort((a, b) => b[1] - a[1]),
            byStage: Object.entries(byStage).sort((a, b) => b[1] - a[1]),
            byGender: Object.entries(byGender).sort((a, b) => b[1] - a[1]),
            byStudentStatus: Object.entries(byStudentStatus).sort((a, b) => b[1] - a[1]),
            byAgeGroup: Object.entries(byAgeGroup).sort((a, b) => {
                const order = { 'Under 18': 1, '18-22': 2, '22-25': 3, '25-28': 4, '28-31': 5, '31-35': 6, 'Above 35': 7, 'Not Specified': 8, 'Unknown': 9 };
                return (order[a[0] as keyof typeof order] || 99) - (order[b[0] as keyof typeof order] || 99);
            }),

            // New Analytics Arrays



            byStartupType: Object.entries(byStartupType).sort((a, b) => b[1] - a[1]),
            byWorkplaceOwnership: Object.entries(byWorkplaceOwnership).sort((a, b) => b[1] - a[1]),
            byLegalStatus: Object.entries(byLegalStatus).sort((a, b) => b[1] - a[1]),







        };
    }, [startups]);



    if (isLoading) {
        return (
            <div className="container px-4 md:px-8 py-12 mx-auto">
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-muted-foreground">{t('stats.loading')}</p>
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
                    <h3 className="font-semibold text-lg">{t('stats.error')}</h3>
                    <p className="text-red-500 max-w-md">{error}</p>
                    <Button variant="outline" onClick={refetch} className="gap-2">
                        <RefreshCcw className="h-4 w-4" />
                        {t('stats.retry')}
                    </Button>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="container px-4 md:px-8 py-12 mx-auto">
                <div className="text-center">
                    <p className="text-muted-foreground">{t('stats.no_data')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container px-4 md:px-8 py-12 mx-auto">
            {/* Page Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <BarChart3 className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl md:text-4xl font-bold">{t('stats.title')}</h1>
                </div>
                <p className="text-muted-foreground">{t('stats.subtitle')}</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="border-2 hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            {t('stats.total_startups')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-primary">{stats.totalStartups}</div>
                        <p className="text-xs text-muted-foreground mt-1">{t('stats.startup_unit')}</p>
                    </CardContent>
                </Card>

                <Card className="border-2 hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {t('stats.total_employees')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-600">{stats.totalEmployees.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">{t('stats.avg_per_company', { count: stats.avgEmployees })}</p>
                    </CardContent>
                </Card>

                <Card className="border-2 hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            {t('stats.total_revenue')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">
                            {(stats.totalRevenue / 1000000).toFixed(1)}M
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{t('stats.revenue_unit')}</p>
                    </CardContent>
                </Card>

                <Card className="border-2 hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            {t('stats.profitable_companies')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-emerald-600">{stats.profitablePercentage}%</div>
                        <p className="text-xs text-muted-foreground mt-1">{t('stats.profitable_ratio', { count: stats.profitableCount, total: stats.totalStartups })}</p>
                    </CardContent>
                </Card>
            </div>



            {/* Charts Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* By Industry */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-primary" />
                            {t('stats.by_industry')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <SimpleBarChart
                            data={stats.byIndustry.slice(0, 10).map(([name, value]) => ({ name, value }))}
                        />
                    </CardContent>
                </Card>

                {/* By Governorate */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            {t('stats.by_governorate')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <SimpleBarChart
                            data={stats.byGovernorate.slice(0, 10).map(([name, value]) => ({ name, value }))}
                            color="#3b82f6"
                        />
                    </CardContent>
                </Card>

                {/* By Stage */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            {t('stats.by_stage')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <SimpleBarChart
                            data={stats.byStage.map(([name, value]) => ({ name, value }))}
                            height={350}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Founder Demographics */}
            <div className="mt-8">
                <div className="flex items-center gap-3 mb-6">
                    <Users className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-bold">{t('stats.founders_analytics')}</h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Gender Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">{t('stats.gender_dist')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <SimplePieChart
                                data={stats.byGender.map(([name, value]) => ({ name, value }))}
                                colors={['#3b82f6', '#ec4899']} // Blue, Pink
                            />
                        </CardContent>
                    </Card>

                    {/* Student vs Graduate */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">{t('stats.student_grad')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <SimplePieChart
                                data={stats.byStudentStatus.map(([name, value]) => ({ name, value }))}
                                colors={['#f97316', '#10b981']} // Orange, Green
                            />
                        </CardContent>
                    </Card>

                    {/* Age Groups */}
                    <Card className="md:col-span-2 lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="text-base">{t('stats.age_groups')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <SimpleBarChart
                                data={stats.byAgeGroup.map(([name, value]) => ({ name, value }))}
                                color="#10b981"
                            />
                        </CardContent>
                    </Card>


                </div>
            </div>

            {/* 1. Operational & Legal Analytics */}
            <div className="mt-8">
                <div className="flex items-center gap-3 mb-6">
                    <Briefcase className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-bold">{t('stats.ops_legal')}</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Startup Type */}
                    <Card>
                        <CardHeader><CardTitle className="text-base">{t('stats.entity_type')}</CardTitle></CardHeader>
                        <CardContent>
                            <SimpleBarChart data={stats.byStartupType.map(([name, value]) => ({ name, value }))} />
                        </CardContent>
                    </Card>

                    {/* Workplace Ownership */}
                    <Card>
                        <CardHeader><CardTitle className="text-base">{t('stats.workplace_ownership')}</CardTitle></CardHeader>
                        <CardContent>
                            <SimplePieChart data={stats.byWorkplaceOwnership.map(([name, value]) => ({ name, value }))} />
                        </CardContent>
                    </Card>

                    {/* Legal Status */}
                    <Card>
                        <CardHeader><CardTitle className="text-base">{t('stats.legal_status_chart')}</CardTitle></CardHeader>
                        <CardContent>
                            <SimplePieChart data={stats.byLegalStatus.map(([name, value]) => ({ name, value }))} />
                        </CardContent>
                    </Card>



                </div>
            </div>







        </div >
    );
}
