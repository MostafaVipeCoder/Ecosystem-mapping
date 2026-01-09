import { useMemo } from 'react';
import { useStartups } from '../context/StartupsContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { BarChart3, Briefcase, Building2, DollarSign, MapPin, RefreshCcw, TrendingUp, Users, X, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { SimpleBarChart } from "../components/charts/SimpleBarChart";
import { SimplePieChart } from "../components/charts/SimplePieChart";

export default function StatsPage() {
    const { startups, isLoading, error, refetch } = useStartups();

    const stats = useMemo(() => {
        // Overall Statistics
        const totalStartups = startups.length;
        const totalEmployees = startups.reduce((sum, s) => sum + (s.employees || 0), 0);
        const totalRevenue = startups.reduce((sum, s) => sum + (s.revenue || 0), 0);
        const profitableCount = startups.filter(s => (s.revenue || 0) > 0).length;

        // By Industry
        const byIndustry = startups.reduce((acc, s) => {
            acc[s.industry] = (acc[s.industry] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // By Governorate
        const byGovernorate = startups.reduce((acc, s) => {
            acc[s.governorate] = (acc[s.governorate] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // By Project Stage
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










        // Averages
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
                    <Loader2 className="h-10 w-10 animate-spin text-athar-blue" />
                    <p className="text-athar-black font-bold">Loading statistics...</p>
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
                    <h3 className="font-semibold text-lg">Error occurred</h3>
                    <p className="text-red-500 max-w-md">{error}</p>
                    <Button variant="outline" onClick={refetch} className="gap-2">
                        <RefreshCcw className="h-4 w-4" />
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="container px-4 md:px-8 py-12 mx-auto">
                <div className="text-center">
                    <p className="text-muted-foreground">No data available to display statistics</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container px-4 md:px-8 py-12 mx-auto">
            <div className="mb-10">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
                    <div className="h-12 w-12 rounded-2xl bg-athar-black flex items-center justify-center text-athar-yellow shadow-lg shrink-0">
                        <BarChart3 className="h-7 w-7" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-athar-black tracking-tight leading-tight mb-1">Statistics & Analytics</h1>
                        <p className="text-athar-black/60 font-bold text-sm md:text-base">Comprehensive overview of startup ecosystem data</p>
                    </div>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                <Card className="border-0 shadow-sm hover:shadow-xl transition-all duration-500 rounded-2xl group hover:-translate-y-1">
                    <CardHeader className="p-4 md:p-6 pb-2">
                        <CardTitle className="text-[10px] md:text-xs font-black text-athar-black/40 flex items-center gap-2 uppercase tracking-widest">
                            <Building2 className="h-3.5 md:h-4 w-3.5 md:w-4 text-athar-blue" />
                            Total Startups
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0">
                        <div className="text-2xl md:text-4xl font-black text-athar-black group-hover:text-athar-blue transition-colors leading-none">{stats.totalStartups}</div>
                        <p className="text-[9px] md:text-[11px] font-bold text-athar-black/30 mt-1 md:mt-2 uppercase tracking-wider">Registered</p>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm hover:shadow-xl transition-all duration-500 rounded-2xl group hover:-translate-y-1">
                    <CardHeader className="p-4 md:p-6 pb-2">
                        <CardTitle className="text-[10px] md:text-xs font-black text-athar-black/40 flex items-center gap-2 uppercase tracking-widest">
                            <Users className="h-3.5 md:h-4 w-3.5 md:w-4 text-athar-blue" />
                            Employees
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0">
                        <div className="text-2xl md:text-4xl font-black text-athar-black group-hover:text-athar-blue transition-colors leading-none">{stats.totalEmployees >= 1000 ? (stats.totalEmployees / 1000).toFixed(1) + 'K' : stats.totalEmployees}</div>
                        <p className="text-[9px] md:text-[11px] font-bold text-athar-black/30 mt-1 md:mt-2 uppercase tracking-wider">Total Count</p>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm hover:shadow-xl transition-all duration-500 rounded-2xl group hover:-translate-y-1">
                    <CardHeader className="p-4 md:p-6 pb-2">
                        <CardTitle className="text-[10px] md:text-xs font-black text-athar-black/40 flex items-center gap-2 uppercase tracking-widest">
                            <DollarSign className="h-3.5 md:h-4 w-3.5 md:w-4 text-athar-blue" />
                            Revenue
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0">
                        <div className="text-2xl md:text-4xl font-black text-athar-black group-hover:text-athar-blue transition-colors leading-none">
                            {(stats.totalRevenue / 1000000).toFixed(1)}M
                        </div>
                        <p className="text-[9px] md:text-[11px] font-bold text-athar-black/30 mt-1 md:mt-2 uppercase tracking-wider">EGP Annually</p>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm hover:shadow-xl transition-all duration-500 rounded-2xl group hover:-translate-y-1">
                    <CardHeader className="p-4 md:p-6 pb-2">
                        <CardTitle className="text-[10px] md:text-xs font-black text-athar-black/40 flex items-center gap-2 uppercase tracking-widest">
                            <TrendingUp className="h-3.5 md:h-4 w-3.5 md:w-4 text-athar-blue" />
                            Profitable
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0">
                        <div className="text-2xl md:text-4xl font-black text-athar-black group-hover:text-athar-blue transition-colors leading-none">{stats.profitablePercentage}%</div>
                        <p className="text-[9px] md:text-[11px] font-bold text-athar-black/30 mt-1 md:mt-2 uppercase tracking-wider">Success Rate</p>
                    </CardContent>
                </Card>
            </div>



            {/* Charts Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* By Industry */}
                <Card className="border-0 shadow-sm rounded-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg font-black text-athar-black">
                            <TrendingUp className="h-5 w-5 text-athar-blue" />
                            Revenue Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <SimpleBarChart
                            data={stats.byIndustry.slice(0, 10).map(([name, value]) => ({ name, value }))}
                        />
                    </CardContent>
                </Card>

                {/* By Governorate */}
                <Card className="border-0 shadow-sm rounded-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg font-black text-athar-black">
                            <MapPin className="h-5 w-5 text-athar-blue" />
                            Distribution by Location
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <SimpleBarChart
                            data={stats.byGovernorate.slice(0, 10).map(([name, value]) => ({ name, value }))}
                        />
                    </CardContent>
                </Card>

                {/* By Stage */}
                <Card className="md:col-span-2 border-0 shadow-sm rounded-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg font-black text-athar-black">
                            <TrendingUp className="h-5 w-5 text-athar-blue" />
                            Distribution by Stage
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
            <div className="mt-16">
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-10 w-10 rounded-xl bg-athar-yellow flex items-center justify-center text-athar-black shadow-md">
                        <Users className="h-6 w-6" />
                    </div>
                    <h2 className="text-3xl font-black text-athar-black tracking-tight">Founder Analytics <span className="text-athar-black/30 text-xl">(Demographics)</span></h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Gender Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Distribution by Gender</CardTitle>
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
                            <CardTitle className="text-base">Student vs Graduate</CardTitle>
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
                            <CardTitle className="text-base">Age Groups</CardTitle>
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
                    <h2 className="text-2xl font-bold">Operational & Legal</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Startup Type */}
                    <Card>
                        <CardHeader><CardTitle className="text-base">Startup Type</CardTitle></CardHeader>
                        <CardContent>
                            <SimpleBarChart data={stats.byStartupType.map(([name, value]) => ({ name, value }))} />
                        </CardContent>
                    </Card>

                    {/* Workplace Ownership */}
                    <Card>
                        <CardHeader><CardTitle className="text-base">Workplace Ownership</CardTitle></CardHeader>
                        <CardContent>
                            <SimplePieChart data={stats.byWorkplaceOwnership.map(([name, value]) => ({ name, value }))} />
                        </CardContent>
                    </Card>

                    {/* Legal Status */}
                    <Card>
                        <CardHeader><CardTitle className="text-base">Legal Status</CardTitle></CardHeader>
                        <CardContent>
                            <SimplePieChart data={stats.byLegalStatus.map(([name, value]) => ({ name, value }))} />
                        </CardContent>
                    </Card>



                </div>
            </div>







        </div >
    );
}
