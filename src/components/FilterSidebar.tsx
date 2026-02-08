import React, { useState } from 'react';
import { Search, Filter, ChevronDown, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import { Separator } from './ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { formatCurrency } from '../utils/api';

interface FilterSidebarProps {
    className?: string;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    availableIndustries: string[];
    selectedIndustries: string[];
    setSelectedIndustries: (industries: string[]) => void;
    availableGovernorates: string[];
    selectedGovernorates: string[];
    setSelectedGovernorates: (governorates: string[]) => void;
    employeeRange: number[];
    setEmployeeRange: (range: number[]) => void;
    revenueRange: number[];
    setRevenueRange: (range: number[]) => void;
    onReset: () => void;
    maxEmployees: number;
    maxRevenue: number;
}

const FilterSection = ({
    title,
    children,
    isOpen = true,
    count = 0
}: {
    title: string,
    children: React.ReactNode,
    isOpen?: boolean,
    count?: number
}) => {
    const [open, setOpen] = useState(isOpen);
    return (
        <Collapsible open={open} onOpenChange={setOpen} className="space-y-3">
            <div className="flex items-center justify-between group cursor-pointer" onClick={() => setOpen(!open)}>
                <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-athar-black group-hover:text-athar-blue transition-colors">{title}</h4>
                    {count > 0 && <Badge variant="secondary" className="h-5 px-1.5 text-[10px] min-w-5 flex justify-center bg-athar-yellow text-athar-black font-bold uppercase tracking-widest">{count}</Badge>}
                </div>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-slate-100 ring-offset-transparent">
                        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                    </Button>
                </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-4">
                {children}
            </CollapsibleContent>
        </Collapsible>
    );
};

export function FilterSidebar({
    className,
    searchQuery,
    setSearchQuery,
    availableIndustries,
    selectedIndustries,
    setSelectedIndustries,
    availableGovernorates,
    selectedGovernorates,
    setSelectedGovernorates,
    employeeRange,
    setEmployeeRange,
    revenueRange,
    setRevenueRange,
    onReset,
    maxEmployees = 200, // Default fallback
    maxRevenue = 10000000 // Default fallback
}: FilterSidebarProps) {

    const [industrySearch, setIndustrySearch] = useState('');
    const [governorateSearch, setGovernorateSearch] = useState('');

    const toggleIndustry = (industry: string) => {
        if (selectedIndustries.includes(industry)) {
            setSelectedIndustries(selectedIndustries.filter(i => i !== industry));
        } else {
            setSelectedIndustries([...selectedIndustries, industry]);
        }
    };

    const toggleGovernorate = (gov: string) => {
        if (selectedGovernorates.includes(gov)) {
            setSelectedGovernorates(selectedGovernorates.filter(g => g !== gov));
        } else {
            setSelectedGovernorates([...selectedGovernorates, gov]);
        }
    };

    const filteredIndustries = availableIndustries.filter(ind =>
        ind.toLowerCase().includes(industrySearch.toLowerCase())
    );

    const filteredGovernorates = availableGovernorates.filter(gov =>
        gov.toLowerCase().includes(governorateSearch.toLowerCase())
    );

    const activeFiltersCount =
        (searchQuery ? 1 : 0) +
        selectedIndustries.length +
        selectedGovernorates.length +
        (employeeRange[0] > 0 || employeeRange[1] < maxEmployees ? 1 : 0) +
        (revenueRange[0] > 0 || revenueRange[1] < maxRevenue ? 1 : 0);

    return (
        <div className={`flex flex-col h-full bg-white ${className}`}>
            <div className="p-5 border-b sticky top-0 bg-white/95 backdrop-blur z-10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-athar-black">
                    <Filter className="h-4 w-4 text-athar-blue" />
                    <h3 className="font-black text-lg tracking-tight uppercase">Filter Results</h3>
                </div>
                {activeFiltersCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onReset}
                        className="h-8 px-2 text-xs text-muted-foreground hover:text-red-600 hover:bg-red-50 gap-1.5"
                    >
                        <RotateCcw className="h-3 w-3" />
                        Reset
                    </Button>
                )}
            </div>

            <ScrollArea className="flex-1 px-5 py-6">
                <div className="space-y-7 pb-10">
                    {/* Search Section */}
                    <div className="space-y-3">
                        <div className="relative">
                            <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                            <Input
                                placeholder="Search by company name..."
                                className="pr-9 h-11 bg-slate-50 border-slate-200 focus-visible:ring-athar-blue/20 focus-visible:border-athar-blue transition-all rounded-xl font-bold"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <Separator className="bg-slate-100" />

                    {/* Industries Section */}
                    <FilterSection title="Industry" count={selectedIndustries.length}>
                        {availableIndustries.length > 5 && (
                            <Input
                                placeholder="Search industries..."
                                className="h-8 text-xs bg-slate-50 mb-3"
                                value={industrySearch}
                                onChange={(e) => setIndustrySearch(e.target.value)}
                            />
                        )}
                        <div className="space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                            {filteredIndustries.length > 0 ? (
                                filteredIndustries.map((industry) => (
                                    <div key={industry} className="flex items-center justify-between group">
                                        <div className="flex items-center space-x-2 space-x-reverse">
                                            <Checkbox
                                                id={industry}
                                                checked={selectedIndustries.includes(industry)}
                                                onCheckedChange={() => toggleIndustry(industry)}
                                                className="h-4 w-4 data-[state=checked]:bg-athar-blue data-[state=checked]:border-athar-blue"
                                            />
                                            <label
                                                htmlFor={industry}
                                                className="text-sm text-athar-black/70 font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer pt-0.5 select-none group-hover:text-athar-black"
                                            >
                                                {industry}
                                            </label>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-muted-foreground text-center py-2">No matching industries</p>
                            )}
                        </div>
                    </FilterSection>


                    <Separator className="bg-slate-100" />

                    {/* Governorates Section */}
                    <FilterSection title="Governorate" count={selectedGovernorates.length}>
                        {availableGovernorates.length > 5 && (
                            <Input
                                placeholder="Search governorates..."
                                className="h-8 text-xs bg-slate-50 mb-3"
                                value={governorateSearch}
                                onChange={(e) => setGovernorateSearch(e.target.value)}
                            />
                        )}
                        <div className="space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                            {filteredGovernorates.length > 0 ? (
                                filteredGovernorates.map((gov) => (
                                    <div key={gov} className="flex items-center justify-between group">
                                        <div className="flex items-center space-x-2 space-x-reverse">
                                            <Checkbox
                                                id={`gov-${gov}`}
                                                checked={selectedGovernorates.includes(gov)}
                                                onCheckedChange={() => toggleGovernorate(gov)}
                                                className="h-4 w-4 data-[state=checked]:bg-athar-blue data-[state=checked]:border-athar-blue"
                                            />
                                            <label
                                                htmlFor={`gov-${gov}`}
                                                className="text-sm text-athar-black/70 font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer pt-0.5 select-none group-hover:text-athar-black"
                                            >
                                                {gov}
                                            </label>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-muted-foreground text-center py-2">No matching governorates</p>
                            )}
                        </div>
                    </FilterSection>

                    <Separator className="bg-slate-100" />

                    {/* Employees Section */}
                    <FilterSection title="Team Size">
                        <div className="pt-2 px-1">
                            <div className="flex items-center justify-between mb-4">
                                <div className="border border-athar-black/10 rounded-xl px-3 py-1.5 bg-white shadow-sm min-w-[70px] text-center">
                                    <span className="text-xs font-black text-athar-black">{employeeRange[0]}</span>
                                </div>
                                <span className="text-athar-black/30 text-xs font-bold">to</span>
                                <div className="border border-athar-black/10 rounded-xl px-3 py-1.5 bg-white shadow-sm min-w-[70px] text-center">
                                    <span className="text-xs font-black text-athar-black">{employeeRange[1] >= maxEmployees ? `+${maxEmployees}` : employeeRange[1]}</span>
                                </div>
                            </div>
                            <Slider
                                defaultValue={[0, maxEmployees]}
                                value={employeeRange}
                                max={maxEmployees}
                                step={1}
                                onValueChange={setEmployeeRange}
                                className="my-4"
                            />
                            <div className="flex justify-between text-[10px] text-muted-foreground px-1">
                                <span>Small</span>
                                <span>Medium</span>
                                <span>Large</span>
                            </div>
                        </div>
                    </FilterSection>

                    <Separator className="bg-slate-100" />

                    {/* Revenue Section */}
                    <FilterSection title="Annual Revenue">
                        <div className="pt-2 px-1">
                            <div className="flex items-center justify-between mb-4">
                                <Badge variant="outline" className="bg-white font-bold text-athar-black border-athar-black/10 shadow-sm py-1.5 px-3 rounded-xl">
                                    {formatCurrency(revenueRange[0])}
                                </Badge>
                                <Badge variant="outline" className="bg-white font-bold text-athar-black border-athar-black/10 shadow-sm py-1.5 px-3 rounded-xl">
                                    {revenueRange[1] >= maxRevenue ? `+${formatCurrency(maxRevenue)}` : formatCurrency(revenueRange[1])}
                                </Badge>
                            </div>
                            <Slider
                                defaultValue={[0, maxRevenue]}
                                value={revenueRange}
                                max={maxRevenue}
                                step={100000}
                                onValueChange={setRevenueRange}
                                className="my-4"
                            />
                        </div>
                    </FilterSection>
                </div>
            </ScrollArea>
        </div>
    );
}

export default FilterSidebar;
