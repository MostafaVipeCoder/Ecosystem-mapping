import { Startup, API_URL } from '../types';

/**
 * Fetch startups data from Google Apps Script API
 */
export async function fetchStartups(): Promise<{
    startups: Startup[];
    industries: string[];
    governorates: string[];
}> {
    console.log('🚀 بدء جلب البيانات من API...');
    console.log('📍 API URL:', API_URL);

    try {
        // Basic validation
        if (!API_URL || API_URL.includes('YOUR_GOOGLE_SCRIPT')) {
            console.warn('⚠️ API_URL might not be configured correctly:', API_URL);
        }

        console.log('⏳ جاري الاتصال بـ API...');
        const response = await fetch(API_URL);
        console.log('📥 تم استلام الرد من API');
        console.log('📊 حالة الرد (Status):', response.status);
        console.log('✅ الرد صحيح (OK):', response.ok);

        if (!response.ok) {
            throw new Error(`فشل في جلب البيانات - Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('📦 البيانات المستلمة من API:', data);
        console.log('🔍 نوع البيانات:', typeof data);
        console.log('📋 مفاتيح البيانات:', Object.keys(data));

        const mapStartupData = (raw: any): Startup => {
            const parseNumber = (val: any) => {
                if (typeof val === 'number') return val;
                if (!val) return 0;
                const clean = val.toString().replace(/[^0-9.]/g, '');
                return parseFloat(clean) || 0;
            };

            const parseYear = (val: any) => {
                if (!val) return new Date().getFullYear();
                if (typeof val === 'number') return val;

                const yearMatch = val.toString().match(/\d{4}/);
                if (yearMatch) return parseInt(yearMatch[0]);

                try {
                    const date = new Date(val);
                    if (!isNaN(date.getTime())) {
                        return date.getFullYear();
                    }
                } catch (e) {
                    // Ignore
                }

                return new Date().getFullYear();
            };

            return {
                id: raw['ID'] ? String(raw['ID']) : String(Math.random()),
                name: raw['Startup Name'] || raw['أسم الشركة'] || 'اسم غير متوفر',
                ceoName: raw['CEO Name'] || raw['اسم المؤسس'] || 'غير متوفر',
                industry: raw['Industry'] || raw['Industry '] || raw['قطاع المشروع الصناعة'] || 'غير مصنف',
                description: raw['Description'] || raw['الوصف'] || raw['وصف مختصر للشركة'] || '',
                employees: parseNumber(raw['Nu. of employees'] || raw['عدد الموظفين كلهم بدون المؤسسين']),
                revenue: parseNumber(raw['Revenue (Total) (Yearly)'] || raw['الايرادات سنوي']),
                governorate: raw['Governerate'] || raw['المحافظة'] || 'غير محدد',
                stage: raw['Startup type'] || raw['نوع الشركة'] || 'غير محدد',
                website: raw['Website/ app links/ social media'] || raw['التطبيق /رابط الموقع'] || '#',
                phone: raw['Phone'] || raw['الهاتف'] ? String(raw['Phone'] || raw['الهاتف']) : '',
                email: raw['Email'] || raw['البريد الالكتروني'] || '',
                foundingYear: parseYear(raw['Year'] || raw['Date of company stabilished'] || raw['متي بدا مشروعك']),
                legalStatus: raw['Legal Status'] || raw['هل المشروع مسجل'] || 'غير محدد',
                fundingRaised: raw['Funding raised'] || raw['قيمة تمويل'] ? String(raw['Funding raised'] || raw['قيمة تمويل']) : 'تمويل ذاتي',
                profitStatus: raw['profitability'] || raw['مرحلة المشروع'] || 'غير محدد',
                ceoGender: raw[' CEO Gender'] || raw['CEO Gender'] || raw['النوع'] || 'غير محدد',
                founderStatus: raw['Student/Graduate'] || raw['طالب/خريج'] || 'غير محدد',
                ceoAge: parseNumber(raw['CEO Age'] || raw['عمر المؤسس']),
                hasDedicatedPlace: raw['Have a dedicated place'] || raw['مكان مخصص'] || 'غير محدد',


                startupType: raw['Startup Type'] || raw['Startup type'] || 'غير محدد',
                workplaceOwnership: raw['own or rent a workplace'] || 'غير محدد',
                legalStatusDetails: raw['Legal Status'] || 'غير محدد',








                challenges: raw['Challenges'] || raw['التحديات'] || '',
                score: Math.floor(Math.random() * 30) + 70,
                story: raw['Tell us your story'] || raw['احك لنا قصتك'] || ''
            };
        };

        let fetchedStartups: Startup[] = [];

        if (data.startups) {
            console.log('✅ وجدنا data.startups');
            console.log('📊 عدد الشركات:', data.startups.length);
            if (data.startups.length > 0) {
                console.log('🔍 أول شركة (عينة):', data.startups[0]);
            }
            fetchedStartups = data.startups.map(mapStartupData);
        } else if (Array.isArray(data)) {
            console.log('✅ البيانات عبارة عن Array مباشر');
            console.log('📊 عدد العناصر:', data.length);
            if (data.length > 0) {
                console.log('🔍 أول عنصر (عينة):', data[0]);
            }
            fetchedStartups = data.map(mapStartupData);
        } else {
            console.warn('⚠️ هيكل البيانات غير متوقع!');
            console.log('📦 البيانات الكاملة:', JSON.stringify(data, null, 2));
        }

        console.log('✅ تم معالجة البيانات بنجاح');
        console.log('📊 عدد الشركات النهائي:', fetchedStartups.length);

        const industries = Array.from(new Set(fetchedStartups.map(s => s.industry).filter(Boolean))).sort();
        const governorates = Array.from(new Set(fetchedStartups.map(s => s.governorate).filter(Boolean))).sort();

        console.log('🏭 القطاعات المستخرجة:', industries);
        console.log('🗺️ المحافظات المستخرجة:', governorates);
        console.log('🎉 تم جلب البيانات بنجاح!');

        return {
            startups: fetchedStartups,
            industries,
            governorates
        };

    } catch (err) {
        console.error("❌ خطأ في جلب البيانات:", err);
        console.error("📋 تفاصيل الخطأ:", err instanceof Error ? err.message : String(err));
        throw err;
    } finally {
        console.log('🏁 انتهى جلب البيانات');
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
