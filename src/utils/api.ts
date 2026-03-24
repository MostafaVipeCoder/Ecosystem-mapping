import { Startup, API_URL } from '../types';
import { logger } from './logger';

/**
 * Fetch startups data from Google Apps Script API
 */
export async function fetchStartups(): Promise<{
    startups: Startup[];
    industries: string[];
    governorates: string[];
}> {
    logger.log('🚀 Starting data fetch from API...');
    logger.sensitive('API URL configured', import.meta.env.DEV ? API_URL : undefined);

    try {
        // Basic validation
        if (!API_URL || API_URL.includes('YOUR_GOOGLE_SCRIPT')) {
            console.warn('⚠️ API_URL might not be configured correctly:', API_URL);
        }

        logger.log('⏳ Connecting to API...');
        const response = await fetch(API_URL);
        logger.log('📥 Response received from API');
        logger.log('📊 Response Status:', response.status);
        logger.log('✅ Response OK:', response.ok);

        if (!response.ok) {
            throw new Error(`Failed to fetch data - Status: ${response.status}`);
        }

        const data = await response.json();
        logger.log('📦 Data received from API:', data);
        logger.log('🔍 Data type:', typeof data);
        logger.log('📋 Data keys:', Object.keys(data));

        const mapStartupData = (item: any): Startup => {
            // Normalize keys to handle leading/trailing spaces
            const raw: any = {};
            if (item && typeof item === 'object') {
                Object.keys(item).forEach(key => {
                    raw[key.trim()] = item[key];
                });
            }

            const parseNumber = (val: any) => {
                if (typeof val === 'number') return Math.floor(val);
                if (!val) return 0;
                const clean = val.toString().replace(/[^0-9.]/g, '');
                return parseFloat(clean) || 0;
            };


            const translate = (val: string | undefined | null) => {
                if (!val) return val;
                const mapping: Record<string, string> = {
                    // Industries
                    'التكنولوجيا': 'Technology',
                    'البيئة واعادة التدوير': 'Environment & Recycling',
                    'الحرف اليدوية': 'Handicrafts',
                    'الصناعات الغذائية': 'Food Industry',
                    'الخدمات اللوجستية': 'Logistics',
                    'التعليم': 'Education',
                    'الصحة': 'Health',
                    'الزراعة': 'Agriculture',
                    'السياحة': 'Tourism',
                    'التجارة الالكترونية': 'E-commerce',
                    'أخرى': 'Other',

                    // Governorates
                    'القاهرة': 'Cairo',
                    'الجيزة': 'Giza',
                    'الأسكندرية': 'Alexandria',
                    'المنيا': 'Minya',
                    'أسيوط': 'Assiut',
                    'بني سويف': 'Beni Suef',
                    'الفيوم': 'Fayoum',
                    'سوهاج': 'Sohag',
                    'قنا': 'Qena',
                    'الأقصر': 'Luxor',
                    'أسوان': 'Aswan',
                    'البحر الأحمر': 'Red Sea',
                    'الوادى الجديد': 'New Valley',
                    'مطروح': 'Matrouh',
                    'شمال سيناء': 'North Sinai',
                    'جنوب سيناء': 'South Sinai',
                    'بورسعيد': 'Port Said',
                    'الإسماعيلية': 'Ismailia',
                    'السويس': 'Suez',
                    'الشرقية': 'Sharqia',
                    'الدقهلية': 'Dakahlia',
                    'دمياط': 'Damietta',
                    'كفر الشيخ': 'Kafr el-Sheikh',
                    'الغربية': 'Gharbia',
                    'المنوفية': 'Monufia',
                    'القليوبية': 'Qalyubia',
                    'البحيرة': 'Beheira',

                    // Gender
                    'ذكر': 'Male',
                    'أنثى': 'Female',

                    // Founder Status
                    'طالب': 'Student',
                    'خريج': 'Graduate',

                    // Stages
                    'فكرة': 'Idea',
                    'نموذج أولي': 'MVP',
                    'مرحلة النمو': 'Growth',
                    'شركة قائمة': 'Scale-up',

                    // Funding
                    'تمويل ذاتي': 'Self-funded',
                    'تمويل خارجي': 'External Funding',

                    // Legal
                    'صناعة المنسوجات والملابس': 'Textiles & Clothing',
                    'صناعة الأثاث': 'Furniture',
                    'صناعة الجلود': 'Leather',
                    'الصناعات الكيماوية': 'Chemical Industries',
                    'صناعة الورق': 'Paper Industry',
                    'الصناعات الهندسية': 'Engineering Industries',
                    'مواد البناء': 'Construction Materials',
                    'الطاقة المتجددة': 'Renewable Energy',
                    'إدارة المخلفات': 'Waste Management',
                    'خدمات مالية': 'Financial Services',
                    'خدمات طبية': 'Medical Services',
                    'خدمات تعليمية': 'Educational Services',
                    'خدمات استشارية': 'Consulting Services',
                    'تسويق ودعاية': 'Marketing & Advertising',
                    'نقل وشحن': 'transportation & Shipping',
                    'سياحة وفنادق': 'Tourism & Hospitality',
                    'مطاعم وكافيهات': 'Restaurants & Cafes',
                    'بيع بالتجزئة': 'Retail',
                    'تجارة جملة': 'Wholesale',
                    'فنون وثقافة': 'Arts & Culture',
                    'إعلام ونشر': 'Media & Publishing',
                    'رياضة وترفيه': 'Sports & Entertainment',
                    'تجميل وعناية شخصية': 'Beauty & Personal Care',
                    'عقارات': 'Real Estate',
                    'أمن وحراسة': 'Security Services',
                    'صيانة وإصلاح': 'Maintenance & Repair',
                    'خدمات منزلية': 'Home Services',
                    'تكنولوجيا المعلومات': 'Information Technology',
                    'برمجة وتطوير': 'Software Development',
                    'تصميم جرافيك': 'Graphic Design',
                    'تسويق رقمي': 'Digital Marketing',
                    'صناعة المحتوى': 'Content Creation',
                    'تعليم إلكتروني': 'E-learning',
                    'صحة رقمية': 'Digital Health',
                    'تكنولوجيا زراعية': 'AgriTech',
                    'تكنولوجيا مالية': 'FinTech',
                    'ذكاء اصطناعي': 'Artificial Intelligence',
                    'إنترنت الأشياء': 'IoT',
                    'روبوتات': 'Robotics',
                    'طباعة ثلاثية الأبعاد': '3D Printing',
                    'بلوكتشين': 'Blockchain',

                    // Old Entries (Kept for compatibility)
                    'مسجل': 'Registered',
                    'غير مسجل': 'Not Registered',
                };

                const trimmed = val.trim();
                return mapping[trimmed] || trimmed;
            };



            // Helper to get value ignoring case and spaces
            const getValue = (keys: string[]) => {
                for (const k of keys) {
                    if (raw[k] !== undefined && raw[k] !== null && String(raw[k]).trim() !== '') return raw[k];
                    // Also try case-insensitive and space-trimmed
                    const match = Object.keys(raw).find(rk => rk.toLowerCase().trim() === k.toLowerCase().trim());
                    if (match && raw[match] !== undefined && raw[match] !== null && String(raw[match]).trim() !== '') return raw[match];
                }
                return undefined;
            };

            return {
                id: getValue(['ID', 'id']) ? String(getValue(['ID', 'id'])) : String(Math.random()),
                name: getValue(['Startup Name', 'أسم الشركة', 'Name']) || 'Name not available',
                ceoName: getValue(['CEO Name', 'اسم المؤسس', 'Founder']) || 'Not specified',
                ceoGender: translate(getValue(['CEO Gender', 'النوع', 'Gender'])) || 'Not specified',
                industry: translate(getValue(['Industry', 'قطاع المشروع الصناعة', 'Sector'])) || 'Uncategorized',
                governorate: translate(getValue(['Governorate', 'المحافظة', 'Governerate', 'Governerate '])) || 'Not specified',
                phone: getValue(['Phone / Whatsapp', 'Phone', 'الهاتف', 'Mobile']) ? String(getValue(['Phone / Whatsapp', 'Phone', 'الهاتف', 'Mobile'])) : '',
                telegram: getValue(['Telegram', 'تليجرام']) ? String(getValue(['Telegram', 'تليجرام'])) : '',
                email: getValue(['Email', 'البريد الالكتروني']) || '',
                employees: parseNumber(getValue(['Employees', 'عدد الموظفين كلهم بدون المؤسسين', 'Nu. of employees', 'Staff'])),
                revenue: parseNumber(getValue(['Revenue', 'الايرادات سنوي', 'Revenue (Total) (Yearly)', 'Total Revenue'])),
                profitability: translate(getValue(['Profitability', 'مرحلة المشروع', 'Stage', 'Current Stage'])) || 'Not specified',
                description: getValue(['Description', 'الوصف', 'وصف مختصر للشركة', 'Brief']) || '',
                startupType: translate(getValue(['Startup Type', 'نوع الشركة'])) || 'Not specified',
                website: getValue(['Website', 'الموقع الالكتروني']) || '',
                appLink: getValue(['App Link', 'رابط التطبيق', 'التطبيق /رابط الموقع']) || '',
                facebook: getValue(['Facebook', 'فيسبوك']) || '',
                instagram: getValue(['Instagram', 'إنستجرام']) || '',
                tiktok: getValue(['TikTok', 'تيك توك']) || '',
                openClosed: translate(getValue(['Open/Closed', 'Operational status', 'Status'])) || 'Not specified',
                foundingDate: getValue(['Founding Date', 'تاريخ التأسيس', 'Date of establishment', 'Date of company stabilished', 'تاريخ تأسيس الشركة']) || '',
                legalStatus: translate(getValue(['Legal Status', 'هل المشروع مسجل', 'الوضع القانوني'])) || 'Not specified',
                teamSize: parseNumber(getValue(['Team Size', 'عدد المؤسسين', 'Founding team size', 'حجم فريق التأسيس'])),
                femaleFounders: parseNumber(getValue(['Female Founders', 'عدد المؤسسات الإناث', 'Female founders count', 'عدد المؤسسات الاناث'])),
                maleFounders: parseNumber(getValue(['Male Founders', 'عدد المؤسسين الذكور', 'Male founders count', 'عدد المؤسسين ذكور'])),
                freelancersCount: parseNumber(getValue(['Freelancers/Trainees', 'عدد المتدرّبين/الفريلانسرز', 'Freelancers'])),
                hasDedicatedPlace: translate(getValue(['Has Dedicated Place', 'مكان مخصص', 'هل يوجد مكان مخصص؟'])) || 'Not specified',
                workplaceType: translate(getValue(['Workplace Type', 'نوع مكان العمل'])) || 'Not specified',
                fundingEntity: getValue(['Funding Entity', 'What is the Funding entity?', 'جهة التمويل', 'What is the Funding entity name?', 'ما هي جهة التمويل؟']) ? String(getValue(['Funding Entity', 'What is the Funding entity?', 'جهة التمويل', 'What is the Funding entity name?', 'ما هي جهة التمويل؟'])) : '',
                fundingRaised: getValue(['Funding Raised', 'قيمة تمويل', 'Total Funding', 'التمويل الذي تم الحصول عليه']) ? String(getValue(['Funding Raised', 'قيمة تمويل', 'Total Funding', 'التمويل الذي تم الحصول عليه'])) : 'Self-funded',
                monthlyIncome: getValue(['Monthly Income', 'الدخل الشهري', 'How much is your monthly income from the project?', 'ما هو دخلك الشهري من المشروع؟']) ? String(getValue(['Monthly Income', 'الدخل الشهري', 'How much is your monthly income from the project?', 'ما هو دخلك الشهري من المشروع؟'])) : '0',
                serviceProvider: translate(getValue(['Service Provider', 'Incubator', 'مقدم الخدمة'])) || undefined,
                lastFundingDate: getValue(['Last Funding Date', 'تاريخ آخر تمويل', 'lastFundingDate']) ? String(getValue(['Last Funding Date', 'تاريخ آخر تمويل', 'lastFundingDate'])) : undefined,
                logo: getValue(['Company Logo', 'شعار الشركة', 'logo', 'Logo']) ? String(getValue(['Company Logo', 'شعار الشركة', 'logo', 'Logo'])) : undefined,
                lastUpdate: getValue(['Timestamp', 'Last Update', 'Last updating Date for Data']) ? String(getValue(['Timestamp', 'Last Update', 'Last updating Date for Data'])) : undefined,
                score: Math.floor(Math.random() * 30) + 70,
                review: (() => {
                    const reviewValue = getValue(['review', 'Review', 'REVIEW', 'مراجعة']);
                    // Convert checkbox value to boolean: TRUE/true/"TRUE" -> true, everything else -> false
                    if (reviewValue === true || reviewValue === 'TRUE' || reviewValue === 'true') return true;
                    return false;
                })(),
            };
        };

        let fetchedStartups: Startup[] = [];

        if (data.startups) {
            logger.log('✅ Found data.startups');
            logger.log('📊 Companies count:', data.startups.length);
            if (data.startups.length > 0) {
                logger.log('🔍 First company (sample):', data.startups[0]);
            }
            fetchedStartups = data.startups.map(mapStartupData);
        } else if (data.data && Array.isArray(data.data)) {
            logger.log('✅ Found data.data');
            logger.log('📊 Companies count:', data.data.length);
            if (data.data.length > 0) {
                logger.log('🔍 First company (sample):', data.data[0]);
            }
            fetchedStartups = data.data.map(mapStartupData);
        } else if (Array.isArray(data)) {
            logger.log('✅ Data is a direct Array');
            logger.log('📊 Items count:', data.length);
            if (data.length > 0) {
                logger.log('🔍 First item (sample):', data[0]);
            }
            fetchedStartups = data.map(mapStartupData);
        } else {
            logger.warn('⚠️ Unexpected data structure!');
            logger.log('📦 Complete data:', JSON.stringify(data, null, 2));
        }

        logger.log('✅ Data processed successfully');
        logger.log('📊 Final companies count:', fetchedStartups.length);

        const industries = Array.from(new Set(fetchedStartups.map(s => s.industry).filter(Boolean))).sort();
        const governorates = Array.from(new Set(fetchedStartups.map(s => s.governorate).filter(Boolean))).sort();

        logger.log('🏭 Extracted industries:', industries);
        logger.log('🗺️ Extracted governorates:', governorates);
        logger.log('🎉 Data fetched successfully!');

        return {
            startups: fetchedStartups,
            industries,
            governorates
        };

    } catch (err) {
        console.error("❌ Error fetching data:", err);
        console.error("📋 Error details:", err instanceof Error ? err.message : String(err));
        throw err;
    } finally {
        logger.log('🏁 Data fetch finished');
    }
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
    if (amount === null || amount === undefined) return '0';

    const num = Number(amount);
    if (isNaN(num)) return '0';

    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
        return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toString();
}

/**
 * Format date for display
 */
export function formatDate(dateStr: string | undefined | null): string {
    if (!dateStr) return 'Not specified';

    // Check if it's already a ISO string from Excel (often comes as "YYYY-MM-DD" or ISO)
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr; // Return as is if invalid

        // Return in DD/MM/YYYY format or similar
        return date.toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch {
        return dateStr;
    }
}

export interface SubmissionResult {
    success: boolean;
    message?: string;
}

/**
 * Submits a new startup entry to the Google Sheet
 */
export async function createStartup(startupData: any): Promise<SubmissionResult> {
    try {
        const payload = {
            action: 'create_startup',
            ...startupData
        };
        logger.sensitive('Sending single startup payload to Google Sheet', payload);

        const response = await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors', // Google Apps Script requires no-cors for POST
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        // Since we used no-cors, we can't read the response. 
        // We assume success if no network error occurred.
        return { success: true, message: 'Startup submitted successfully' };
    } catch (error) {
        console.error("Error submitting startup:", error);
        return { success: false, message: 'Failed to submit startup' };
    }
}

/**
 * Submits multiple startups to the Google Sheet
 */
export async function bulkCreateStartups(startupsData: any[]): Promise<SubmissionResult> {
    try {
        const payload = {
            action: 'bulk_create_startups',
            startups: startupsData
        };
        logger.sensitive('Sending bulk startups payload to Google Sheet', payload);

        const response = await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        return { success: true, message: 'Startups submitted successfully' };
    } catch (error) {
        console.error("Error submitting bulk startups:", error);
        return { success: false, message: 'Failed to submit startups' };
    }
}

/**
 * Extract unique Service Providers from the startups list
 */
export function getServiceProviders(startups: Startup[]): string[] {
    const providers = new Set<string>();
    startups.forEach(s => {
        if (s.serviceProvider && s.serviceProvider !== 'Not specified') {
            providers.add(s.serviceProvider);
        }
    });
    return Array.from(providers).sort();
}

/**
 * Extract unique Funding Entities from the startups list
 */
export function getFundingEntities(startups: Startup[]): string[] {
    const entities = new Set<string>();
    startups.forEach(s => {
        if (s.fundingEntity && s.fundingEntity.trim() !== '' && s.fundingEntity !== 'Not specified') {
            entities.add(s.fundingEntity);
        }
    });
    return Array.from(entities).sort();
}

/**
 * Submit a meeting request
 */
export async function submitMeetingRequest(data: {
    startupName: string;
    name: string;
    role: string;
    email: string;
    phone: string;
    note: string;
}): Promise<any> {
    logger.sensitive('Sending meeting request', data);

    try {
        await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors', // Important for Google Apps Script Web App default behavior
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        // Since 'no-cors' mode returns an opaque response, we can't read the JSON.
        // We assume success if no network error occurred.
        // For 'cors' mode to work, the GAS script needs specific headers which are hard to guarantee.
        // 'no-cors' is safer for simple submissions.

        logger.log('✅ Request submitted (no-cors mode)');
        return { success: true };

    } catch (err) {
        console.error("❌ Error submitting request:", err);
        throw err;
    }
}
