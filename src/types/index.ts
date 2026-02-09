// --- Types ---
export interface Startup {
    id: string;
    name: string;
    ceoName: string;
    phone: string;
    email: string;
    industry: string;
    governorate: string;
    employees: number;
    revenue: number;
    profitability: string;
    ceoGender: string;
    description: string;
    startupType: string;
    website: string;
    openClosed: string;
    foundingDate: string;
    legalStatus: string;
    teamSize: number;
    femaleFounders: number;
    maleFounders: number;
    freelancersCount: number;
    hasDedicatedPlace: string;
    workplaceType: string;
    fundingEntity: string;
    fundingRaised: string;
    monthlyIncome: string;

    // Metadata & Internal
    serviceProvider?: string;
    lastFundingDate?: string;
    logo?: string;
    lastUpdate?: string;
    score?: number;
}

// --- API Configuration ---
export const API_URL = 'https://script.google.com/macros/s/AKfycbwdIWp9nElHYzvPqbpRLgtxLQ2yRP-KisAgCyGHbvW3XXsWYb_lCOMzJxfh5a-UnXg4RA/exec';

// --- Mock Data Fallback ---
export const FALLBACK_GOVERNORATES = [
    'Cairo', 'Giza', 'Alexandria', 'Dakahlia', 'Red Sea', 'Beheira', 'Fayoum', 'Gharbia', 'Ismailia',
    'Monufia', 'Minya', 'Qalyubia', 'New Valley', 'Sharqia', 'Suez', 'Aswan', 'Assiut', 'Beni Suef',
    'Port Said', 'Damietta', 'South Sinai', 'Kafr el-Sheikh', 'Matrouh', 'Qena', 'North Sinai', 'Sohag', 'Luxor'
];
export const FALLBACK_INDUSTRIES = ['IT', 'E-commerce', 'Agriculture', 'Education', 'Health', 'Renewable Energy', 'Fintech', 'Logistics', 'Tourism', 'Manufacturing', 'Industry', 'Services', 'Handicrafts'];

// --- Validation Schemas ---
import { z } from 'zod';

export const startupSchema = z.object({
    name: z.string().min(2, "Startup Name is required"),
    ceoName: z.string().min(2, "CEO Name is required"),
    phone: z.string().min(8, "Phone number is required"),
    email: z.string().email("Invalid email").min(1, "Email is required"),
    industry: z.string().min(1, "Industry is required"),
    governorate: z.string().min(1, "Governorate is required"),
    employees: z.number().min(0, "Number of employees is required"),
    revenue: z.number().min(0, "Revenue is required"),
    profitability: z.string().min(1, "Profitability stage is required"),
    ceoGender: z.string().min(1, "CEO Gender is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    startupType: z.string().min(1, "Startup Type is required"),
    website: z.string().url("Invalid URL").or(z.string().min(1, "Website/Social link is required")),
    openClosed: z.string().min(1, "Operational status is required"),
    foundingDate: z.string().min(1, "Founding date is required"),
    legalStatus: z.string().min(1, "Legal status is required"),
    teamSize: z.number().min(0, "Team size is required"),
    femaleFounders: z.number().min(0, "Female founders count is required"),
    maleFounders: z.number().min(0),
    freelancersCount: z.number().min(0, "Freelancers count is required"),
    hasDedicatedPlace: z.string().min(1, "Please specify if you have a dedicated place"),
    workplaceType: z.string().min(1, "Workplace type is required"),
    fundingEntity: z.string().optional().or(z.literal('')),
    fundingRaised: z.string().min(1, "Funding info is required (write 'None' if none)"),
    monthlyIncome: z.string().min(1, "Monthly income is required"),

    // Operations
    serviceProvider: z.string().min(2, "Service Provider is required"),
    lastFundingDate: z.string().min(1, "Last funding date is required"),
    logo: z.string().optional().or(z.literal('')),
    id: z.string().optional(),
    lastUpdate: z.string().optional(),
}).superRefine((data, ctx) => {
    const hasFunding = data.fundingRaised &&
        data.fundingRaised.toLowerCase() !== 'none' &&
        data.fundingRaised.toLowerCase() !== '0' &&
        data.fundingRaised.toLowerCase() !== 'no';

    if (hasFunding && (!data.fundingEntity || data.fundingEntity.trim() === '')) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Funding Entity is required if funding was raised",
            path: ["fundingEntity"],
        });
    }
});

export type StartupFormData = z.infer<typeof startupSchema>;
