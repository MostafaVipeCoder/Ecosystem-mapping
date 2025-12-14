import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Startup, FALLBACK_GOVERNORATES, FALLBACK_INDUSTRIES } from '../types';
import { fetchStartups } from '../utils/api';

interface StartupsContextType {
    startups: Startup[];
    availableIndustries: string[];
    availableGovernorates: string[];
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
}

const StartupsContext = createContext<StartupsContextType | undefined>(undefined);

export function StartupsProvider({ children }: { children: ReactNode }) {
    const [startups, setStartups] = useState<Startup[]>([]);
    const [availableIndustries, setAvailableIndustries] = useState<string[]>(FALLBACK_INDUSTRIES);
    const [availableGovernorates, setAvailableGovernorates] = useState<string[]>(FALLBACK_GOVERNORATES);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await fetchStartups();
            setStartups(data.startups.sort((a, b) => {
                const revenueA = a.revenue || 0;
                const revenueB = b.revenue || 0;

                // If both are 0, keep original order (or sort by name if preferred)
                if (revenueA === 0 && revenueB === 0) return 0;

                // If A has 0 revenue, put it last
                if (revenueA === 0) return 1;

                // If B has 0 revenue, put it last
                if (revenueB === 0) return -1;

                // Sort descending (High to Low)
                return revenueB - revenueA;
            }));

            if (data.industries.length > 0) {
                setAvailableIndustries(data.industries);
            }
            if (data.governorates.length > 0) {
                setAvailableGovernorates(data.governorates);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'حدث خطأ في جلب البيانات');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <StartupsContext.Provider
            value={{
                startups,
                availableIndustries,
                availableGovernorates,
                isLoading,
                error,
                refetch: loadData
            }}
        >
            {children}
        </StartupsContext.Provider>
    );
}

export function useStartups() {
    const context = useContext(StartupsContext);
    if (context === undefined) {
        throw new Error('useStartups must be used within a StartupsProvider');
    }
    return context;
}
