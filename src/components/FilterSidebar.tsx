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
    employeeRange: number[];
    setEmployeeRange: (range: number[]) => void;
    revenueRange: number[];
    setRevenueRange: (range: number[]) => void;
    onReset: () => void;
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
                    <h4 className="text-sm font-semibold text-slate-800 group-hover:text-primary transition-colors">{title}</h4>
                    {count > 0 && <Badge variant="secondary" className="h-5 px-1.5 text-[10px] min-w-5 flex justify-center bg-blue-50 text-blue-600">{count}</Badge>}
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
    employeeRange,
    setEmployeeRange,
    revenueRange,
    setRevenueRange,
    onReset
}: FilterSidebarProps) {

    const [industrySearch, setIndustrySearch] = useState('');

    const toggleIndustry = (industry: string) => {
        if (selectedIndustries.includes(industry)) {
            setSelectedIndustries(selectedIndustries.filter(i => i !== industry));
        } else {
            setSelectedIndustries([...selectedIndustries, industry]);
        }
    };

    const filteredIndustries = availableIndustries.filter(ind =>
        ind.toLowerCase().includes(industrySearch.toLowerCase())
    );

    const activeFiltersCount =
        (searchQuery ? 1 : 0) +
        selectedIndustries.length +
        (employeeRange[0] > 0 || employeeRange[1] < 200 ? 1 : 0) +
        (revenueRange[0] > 0 || revenueRange[1] < 5000000 ? 1 : 0);

    return (
        <div className={`flex flex-col h-full bg-white ${className}`}>
            <div className="p-5 border-b sticky top-0 bg-white/95 backdrop-blur z-10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-800">
                    <Filter className="h-4 w-4 text-primary" />
                    <h3 className="font-bold">تصفية النتائج</h3>
                </div>
                {activeFiltersCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onReset}
                        className="h-8 px-2 text-xs text-muted-foreground hover:text-red-600 hover:bg-red-50 gap-1.5"
                    >
                        <RotateCcw className="h-3 w-3" />
                        إعادة تعيين
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
                                placeholder="ابحث باسم الشركة..."
                                className="pr-9 h-10 bg-slate-50 border-slate-200 focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-xl"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <Separator className="bg-slate-100" />

                    {/* Industries Section */}
                    <FilterSection title="القطاع" count={selectedIndustries.length}>
                        {availableIndustries.length > 5 && (
                            <Input
                                placeholder="بحث في القطاعات..."
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
                                                className="h-4 w-4 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                            />
                                            <label
                                                htmlFor={industry}
                                                className="text-sm text-slate-600 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer pt-0.5 select-none group-hover:text-slate-900"
                                            >
                                                {industry}
                                            </label>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-muted-foreground text-center py-2">لا يوجد قطاعات مطابقة</p>
                            )}
                        </div>
                    </FilterSection>

                    <Separator className="bg-slate-100" />

                    {/* Employees Section */}
                    <FilterSection title="حجم الفريق">
                        <div className="pt-2 px-1">
                            <div className="flex items-center justify-between mb-4">
                                <div className="border rounded-md px-2 py-1 bg-slate-50 min-w-[60px] text-center">
                                    <span className="text-xs font-semibold text-slate-700">{employeeRange[0]}</span>
                                </div>
                                <span className="text-muted-foreground text-xs">إلى</span>
                                <div className="border rounded-md px-2 py-1 bg-slate-50 min-w-[60px] text-center">
                                    <span className="text-xs font-semibold text-slate-700">{employeeRange[1] === 200 ? '200+' : employeeRange[1]}</span>
                                </div>
                            </div>
                            <Slider
                                defaultValue={[0, 200]}
                                value={employeeRange}
                                max={200}
                                step={10}
                                onValueChange={setEmployeeRange}
                                className="my-4"
                            />
                            <div className="flex justify-between text-[10px] text-muted-foreground px-1">
                                <span>صغير</span>
                                <span>متوسط</span>
                                <span>كبير</span>
                            </div>
                        </div>
                    </FilterSection>

                    <Separator className="bg-slate-100" />

                    {/* Revenue Section */}
                    <FilterSection title="العوائد السنوية">
                        <div className="pt-2 px-1">
                            <div className="flex items-center justify-between mb-4">
                                <Badge variant="outline" className="bg-slate-50 font-normal text-slate-600 border-slate-200">
                                    {formatCurrency(revenueRange[0])}
                                </Badge>
                                <Badge variant="outline" className="bg-slate-50 font-normal text-slate-600 border-slate-200">
                                    {revenueRange[1] === 5000000 ? '+5M' : formatCurrency(revenueRange[1])}
                                </Badge>
                            </div>
                            <Slider
                                defaultValue={[0, 5000000]}
                                value={revenueRange}
                                max={5000000}
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
