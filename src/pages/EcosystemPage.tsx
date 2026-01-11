import { useState, useMemo } from 'react';
import { useStartups } from '../context/StartupsContext';
import {
    MapPin,
    Users,
    Banknote,
    Briefcase,
    Building2,
    Calendar,
    TrendingUp,
    Target,
    Loader2,
    X,
    ArrowRight,
    SlidersHorizontal,
    Search,
    PanelLeftClose,
    PanelLeftOpen
} from 'lucide-react';

import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '../components/ui/sheet';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Startup } from '../types';
import { formatCurrency } from '../utils/api';
import FilterSidebar from '../components/FilterSidebar';
import { MeetingRequestDialog } from '../components/MeetingRequestDialog';

// --- Components ---
const StartupDetails = ({ startup, open, onOpenChange }: { startup: Startup | null, open: boolean, onOpenChange: (open: boolean) => void }) => {
    if (!startup) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="left" className="w-[100vw] sm:w-[1000px] p-0 overflow-hidden flex flex-col" dir="ltr">
                {/* Header */}
                <div className="bg-gradient-to-br from-athar-blue to-athar-black text-white p-6 relative overflow-hidden shrink-0">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                    <div className="relative z-10">
                        {/* Back Button */}
                        <div className="mb-4">
                            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="rounded-xl hover:bg-slate-100 flex items-center gap-2 font-bold text-slate-500">
                                <ArrowRight className="h-4 w-4" />
                                <span>Back to List</span>
                            </Button>
                        </div>

                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="bg-athar-yellow text-athar-black hover:bg-athar-yellow/90 border-0 font-bold uppercase tracking-wider px-3 py-1">
                                    {startup.industry}
                                </Badge>
                                <Badge variant="outline" className="text-white border-white/30 backdrop-blur-sm">
                                    {startup.legalStatus}
                                </Badge>
                            </div>

                            <MeetingRequestDialog
                                startupName={startup.name}
                                trigger={
                                    <Button size="sm" className="bg-white text-athar-blue hover:bg-slate-100 font-bold rounded-lg transition-colors border border-transparent hover:border-slate-200 shadow-sm h-8 text-xs">
                                        Book Meeting
                                    </Button>
                                }
                            />
                        </div>
                        <SheetTitle className="text-3xl font-bold mb-2 text-white">{startup.name}</SheetTitle>
                        <SheetDescription className="sr-only">
                            Full details and information about {startup.name}
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
                            {startup.foundingYear > 0 && (
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={14} />
                                    Founded in {startup.foundingYear}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto bg-slate-50">
                    <div className="p-6">
                        <Tabs defaultValue="overview" className="w-full" dir="ltr">
                            <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-auto p-0 mb-6 gap-8">
                                <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-athar-yellow data-[state=active]:text-athar-black data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 font-bold text-sm">Overview</TabsTrigger>
                                <TabsTrigger value="financials" className="rounded-none border-b-2 border-transparent data-[state=active]:border-athar-yellow data-[state=active]:text-athar-black data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 font-bold text-sm">Financials</TabsTrigger>
                                <TabsTrigger value="team" className="rounded-none border-b-2 border-transparent data-[state=active]:border-athar-yellow data-[state=active]:text-athar-black data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 font-bold text-sm">Team</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-6 mt-0">
                                <Card className="border-none shadow-sm">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Building2 className="h-5 w-5 text-athar-blue" />
                                            About the Company
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {startup.description || 'No description available'}
                                        </p>
                                    </CardContent>
                                </Card>

                                {startup.story && (
                                    <Card className="border-none shadow-sm">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <Target className="h-5 w-5 text-athar-blue" />
                                                Story
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground leading-relaxed italic">
                                                "{startup.story}"
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}

                                <div className="grid grid-cols-1 gap-4">
                                    {startup.challenges && (
                                        <div className="bg-white p-4 rounded-lg border shadow-sm space-y-1">
                                            <span className="text-xs text-muted-foreground">Challenges</span>
                                            <div className="font-semibold text-sm line-clamp-2">{startup.challenges}</div>
                                        </div>
                                    )}
                                </div>


                            </TabsContent>

                            <TabsContent value="financials" className="space-y-6 mt-0">
                                <div className="grid grid-cols-2 gap-4">
                                    <Card>
                                        <CardHeader className="p-4 pb-2">
                                            <CardTitle className="text-sm font-medium text-muted-foreground">Annual Revenue</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-0">
                                            <div className="text-2xl font-bold">{(startup.revenue || 0).toLocaleString()}</div>
                                            <span className="text-xs text-muted-foreground">EGP</span>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="p-4 pb-2">
                                            <CardTitle className="text-sm font-medium text-muted-foreground">Profit Status</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-0">
                                            <Badge variant="outline" className={`${startup.profitStatus === 'Available' ? 'text-green-600 border-green-200 bg-green-50' : 'text-amber-600 border-amber-200 bg-amber-50'}`}>
                                                {startup.profitStatus === 'Available' ? 'Profitable' : startup.profitStatus}
                                            </Badge>
                                        </CardContent>
                                    </Card>
                                </div>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-base">
                                            <TrendingUp className="h-5 w-5 text-athar-blue" />
                                            Funding & Investment
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between items-center py-2 border-b last:border-0">
                                            <span className="text-sm text-muted-foreground">Funding Amount</span>
                                            <span className="font-semibold">{startup.fundingRaised}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="team" className="space-y-6 mt-0">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Team Structure</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                                                    <Users className="h-5 w-5 text-slate-600" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">Total Employees</div>
                                                    <div className="text-xs text-muted-foreground">Full-time Employees</div>
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
                                                    <div className="font-medium">CEO</div>
                                                    <div className="text-xs text-muted-foreground">Current Leadership</div>
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
        <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer border-slate-200 hover:border-athar-blue/30 overflow-hidden flex flex-col h-full bg-white rounded-2xl shadow-sm" onClick={onClick}>
            <div className="h-2 bg-gradient-to-r from-athar-blue via-athar-blue/80 to-athar-yellow opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <CardHeader className="space-y-4 p-5 pb-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge variant="secondary" className="font-semibold text-[10px] px-2.5 py-1 text-athar-black bg-athar-yellow hover:bg-athar-yellow/90 border-0 rounded-md uppercase tracking-wider">
                        {startup.industry}
                    </Badge>
                    <div className={`text-[11px] font-bold px-2.5 py-1 rounded-md border shadow-sm ${startup.profitStatus?.toLowerCase().includes('pre')
                        ? 'text-red-700 border-red-200 bg-red-50'
                        : startup.profitStatus === 'Available' || startup.profitStatus?.toLowerCase().includes('revenue')
                            ? 'text-emerald-700 border-emerald-200 bg-emerald-50'
                            : 'text-amber-700 border-amber-200 bg-amber-50'
                        }`}>
                        {startup.profitStatus === 'Available' ? 'Profitable' : startup.profitStatus}
                    </div>
                </div>

                <div>
                    <CardTitle className="text-xl font-extrabold group-hover:text-athar-blue transition-colors leading-tight text-athar-black break-words" title={startup.name}>
                        {startup.name}
                    </CardTitle>


                </div>
            </CardHeader>

            <CardContent className="p-5 pt-2 pb-4 space-y-4 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-1">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 text-slate-400 group-hover:bg-athar-blue group-hover:text-white transition-all duration-300">
                            <MapPin size={16} />
                        </div>
                        <span className="font-medium text-xs sm:text-sm">{startup.governorate}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 text-slate-400 group-hover:bg-athar-blue group-hover:text-white transition-all duration-300">
                            <Users size={16} />
                        </div>
                        <span className="font-medium text-xs sm:text-sm">{startup.employees} Employees</span>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-athar-black/5 p-3 rounded-2xl border border-athar-black/5 group-hover:border-athar-blue/20 transition-all duration-300">
                    <div className="h-10 w-10 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0 text-athar-blue">
                        <Banknote size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-athar-black/60 font-bold uppercase tracking-widest">Annual Revenue</span>
                        <span className="text-base font-black text-athar-black">{formatCurrency(startup.revenue)} EGP</span>
                    </div>
                </div>
            </CardContent>

            <Separator className="bg-slate-100" />

            <CardFooter className="p-4 bg-slate-50/50 flex flex-wrap gap-4 justify-between items-center mt-auto">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#1a27c9] flex items-center justify-center text-xs font-bold text-white ring-4 ring-white shadow-md">
                        {(startup.ceoName || '?').charAt(0)}
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-athar-black/50 font-bold uppercase">Founder</span>
                        <span className="text-xs font-bold text-athar-black break-words max-w-[150px]">{startup.ceoName || 'N/A'}</span>
                    </div>
                </div>

                <Button variant="ghost" size="sm" className="h-9 text-xs px-4 hover:bg-athar-blue hover:text-white transition-all rounded-xl font-bold border border-transparent hover:border-athar-blue shadow-none hover:shadow-lg hover:shadow-athar-blue/20 ml-auto">
                    Details
                </Button>
            </CardFooter>
        </Card>
    );
}

export default function EcosystemPage() {
    const { startups, availableIndustries, isLoading, error, refetch } = useStartups();

    const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    // Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
    const [employeeRange, setEmployeeRange] = useState<number[]>([0, 200]);
    const [revenueRange, setRevenueRange] = useState<number[]>([0, 10000000]);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);



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

    const activeFiltersCount =
        (searchQuery ? 1 : 0) +
        selectedIndustries.length +
        (employeeRange[0] > 0 || employeeRange[1] < 200 ? 1 : 0) +
        (revenueRange[0] > 0 || revenueRange[1] < 10000000 ? 1 : 0);

    const handleReset = () => {
        setSearchQuery('');
        setSelectedIndustries([]);
        setEmployeeRange([0, 200]);
        setRevenueRange([0, 10000000]);
    };

    const handleCardClick = (startup: Startup) => {
        setSelectedStartup(startup);
        setIsDetailsOpen(true);
    };

    if (isLoading) {
        return (
            <div className="container px-4 md:px-8 py-12 mx-auto">
                <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
                    <Loader2 className="h-10 w-10 animate-spin text-athar-blue" />
                    <p className="text-muted-foreground">Loading data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container px-4 md:px-8 py-12 mx-auto">
                <div className="h-[60vh] flex flex-col items-center justify-center gap-6 text-center px-4">
                    <div className="h-16 w-16 rounded-3xl bg-red-50 text-red-500 flex items-center justify-center shadow-inner">
                        <X className="h-8 w-8" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-slate-900">Error fetching data</h3>
                        <p className="text-muted-foreground mt-1 max-w-xs mx-auto text-sm">{error}</p>
                    </div>
                    <Button onClick={refetch} className="bg-athar-black text-white px-8 rounded-xl font-bold">
                        Try Again
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
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Mobile Filter Bar - Visible only on mobile/tablet */}
            <div className="lg:hidden sticky top-16 z-20 bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-athar-yellow/20 text-athar-black font-bold border-0">
                        {filteredStartups.length}
                    </Badge>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Startups Found</span>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="gap-2 rounded-xl border-slate-200 font-bold text-xs"
                >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    Filters
                    {activeFiltersCount > 0 && (
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-athar-blue text-[10px] text-white">
                            {activeFiltersCount}
                        </span>
                    )}
                </Button>
            </div>

            {/* Mobile Filter Drawer */}
            <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
                <SheetContent side="left" className="p-0 w-[300px] sm:w-[350px]" dir="ltr">
                    <FilterSidebar className="h-full" {...filterProps} />
                </SheetContent>
            </Sheet>

            {/* Main Layout Container - Below Fixed Top Bar */}
            <div className="flex-1 flex overflow-hidden">
                {/* Fixed Sidebar - Always Visible on Desktop, Hidden on Mobile */}
                <aside className={`${isSidebarOpen ? 'w-72 border-r opacity-100' : 'w-0 border-r-0 opacity-0'} bg-white overflow-hidden shrink-0 hidden lg:block transition-all duration-300 ease-in-out`}>
                    <div className="w-72 h-full">
                        <FilterSidebar className="h-full" {...filterProps} />
                    </div>
                </aside>

                {/* Scrollable Main Content */}
                <main className="flex-1 overflow-y-auto w-full bg-slate-50/50">
                    <div className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur border-b px-8 py-4 hidden lg:flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="gap-2 text-slate-500 hover:text-athar-black hover:bg-white border border-transparent hover:border-slate-200"
                            >
                                {isSidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
                                {isSidebarOpen ? 'Hide Filters' : 'Show Filters'}
                            </Button>

                            <div className="h-6 w-px bg-slate-200"></div>

                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="bg-white border shadow-sm text-athar-black font-bold">
                                    {filteredStartups.length}
                                </Badge>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Startups Found</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 md:p-8">
                        <div className="max-w-[1600px] mx-auto">
                            {filteredStartups.length === 0 ? (
                                <div className="py-24 text-center max-w-sm mx-auto">
                                    <div className="h-20 w-20 rounded-[2.5rem] bg-slate-50 border-2 border-slate-100 flex items-center justify-center mx-auto mb-8 shadow-sm">
                                        <Search className="h-8 w-8 text-slate-200" />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="font-bold text-xl mb-2 text-slate-900">No results found</h3>
                                        <p className="text-slate-400 font-medium">
                                            We couldn't find any companies matching your search criteria.
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={handleReset}
                                        className="mt-10 px-8 rounded-2xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all uppercase tracking-widest text-xs"
                                    >
                                        Clear all filters
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        </div>
    );
}

