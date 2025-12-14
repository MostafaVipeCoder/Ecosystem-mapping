// --- Types ---
export interface Startup {
    id: string;
    name: string;
    ceoName: string;
    industry: string;
    description: string;
    employees: number;
    revenue: number; // Yearly revenue
    governorate: string;
    stage: string;
    website: string;
    phone: string;
    email: string;
    foundingYear: number;
    legalStatus: string;
    fundingRaised: string;
    profitStatus: string;
    ceoGender?: string;
    founderStatus?: string;
    ceoAge?: number;
    hasDedicatedPlace?: string; // workplace type (Yes/No/Online)

    // Operational & Legal

    startupType?: string; // SME, Startup, Livelihood
    workplaceOwnership?: string; // Owner/Rent
    legalStatusDetails?: string; // Registered/Not








    challenges: string;
    score: number;
    story: string;
}

// --- API Configuration ---
export const API_URL = 'https://script.google.com/macros/s/AKfycbwdIWp9nElHYzvPqbpRLgtxLQ2yRP-KisAgCyGHbvW3XXsWYb_lCOMzJxfh5a-UnXg4RA/exec';

// --- Mock Data Fallback ---
export const FALLBACK_GOVERNORATES = ['القاهرة', 'الجيزة', 'الإسكندرية', 'أسيوط', 'المنصورة', 'الأقصر'];
export const FALLBACK_INDUSTRIES = ['تكنولوجيا المعلومات', 'التجارة الإلكترونية', 'الزراعة', 'التعليم', 'الصحة', 'الطاقة المتجددة', 'الفينتيك', 'النقل واللوجستيات', 'السياحة', 'التصنيع'];
