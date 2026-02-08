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
    phone: z.string().optional().or(z.literal('')),
    email: z.string().email("Invalid email").optional().or(z.literal('')),
    industry: z.string().min(1, "Industry is required"),
    governorate: z.string().min(1, "Governorate is required"),
    employees: z.number().min(0).default(0),
    revenue: z.number().min(0).default(0),
    profitability: z.string().optional().or(z.literal('')),
    ceoGender: z.string().optional().or(z.literal('')),
    description: z.string().optional().or(z.literal('')),
    startupType: z.string().optional().or(z.literal('')),
    website: z.string().optional().or(z.literal('')),
    openClosed: z.string().optional().or(z.literal('')),
    foundingDate: z.string().optional().or(z.literal('')),
    legalStatus: z.string().optional().or(z.literal('')),
    teamSize: z.number().min(0).default(0),
    femaleFounders: z.number().min(0).default(0),
    maleFounders: z.number().min(0).default(0),
    freelancersCount: z.number().min(0).default(0),
    hasDedicatedPlace: z.string().optional().or(z.literal('')),
    workplaceType: z.string().optional().or(z.literal('')),
    fundingEntity: z.string().optional().or(z.literal('')),
    fundingRaised: z.string().optional().or(z.literal('')),
    monthlyIncome: z.string().optional().or(z.literal('')),

    // Operations
    serviceProvider: z.string().min(2, "Service Provider is required"),
    id: z.string().optional(),
    lastUpdate: z.string().optional(),
});

export type StartupFormData = z.infer<typeof startupSchema>;
