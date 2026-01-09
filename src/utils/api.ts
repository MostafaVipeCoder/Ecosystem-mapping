import { Startup, API_URL } from '../types';

/**
 * Fetch startups data from Google Apps Script API
 */
export async function fetchStartups(): Promise<{
    startups: Startup[];
    industries: string[];
    governorates: string[];
}> {
    console.log('🚀 Starting data fetch from API...');
    console.log('📍 API URL:', API_URL);

    try {
        // Basic validation
        if (!API_URL || API_URL.includes('YOUR_GOOGLE_SCRIPT')) {
            console.warn('⚠️ API_URL might not be configured correctly:', API_URL);
        }

        console.log('⏳ Connecting to API...');
        const response = await fetch(API_URL);
        console.log('📥 Response received from API');
        console.log('📊 Response Status:', response.status);
        console.log('✅ Response OK:', response.ok);

        if (!response.ok) {
            throw new Error(`Failed to fetch data - Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('📦 Data received from API:', data);
        console.log('🔍 Data type:', typeof data);
        console.log('📋 Data keys:', Object.keys(data));

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
                name: raw['Startup Name'] || raw['أسم الشركة'] || 'Name not available',
                ceoName: raw['CEO Name'] || raw['اسم المؤسس'] || 'Not specified',
                industry: raw['Industry'] || raw['Industry '] || raw['قطاع المشروع الصناعة'] || 'Uncategorized',
                description: raw['Description'] || raw['الوصف'] || raw['وصف مختصر للشركة'] || '',
                employees: parseNumber(raw['Nu. of employees'] || raw['عدد الموظفين كلهم بدون المؤسسين']),
                revenue: parseNumber(raw['Revenue (Total) (Yearly)'] || raw['الايرادات سنوي']),
                governorate: raw['Governerate'] || raw['المحافظة'] || 'Not specified',
                stage: raw['Startup type'] || raw['نوع الشركة'] || 'Not specified',
                website: raw['Website/ app links/ social media'] || raw['التطبيق /رابط الموقع'] || '#',
                phone: raw['Phone'] || raw['الهاتف'] ? String(raw['Phone'] || raw['الهاتف']) : '',
                email: raw['Email'] || raw['البريد الالكتروني'] || '',
                foundingYear: parseYear(raw['Year'] || raw['Date of company stabilished'] || raw['متي بدا مشروعك']),
                legalStatus: raw['Legal Status'] || raw['هل المشروع مسجل'] || 'Not specified',
                fundingRaised: raw['Funding raised'] || raw['قيمة تمويل'] ? String(raw['Funding raised'] || raw['قيمة تمويل']) : 'Self-funded',
                profitStatus: raw['profitability'] || raw['مرحلة المشروع'] || 'Not specified',
                ceoGender: raw[' CEO Gender'] || raw['CEO Gender'] || raw['النوع'] || 'Not specified',
                founderStatus: raw['Student/Graduate'] || raw['طالب/خريج'] || 'Not specified',
                ceoAge: parseNumber(raw['CEO Age'] || raw['عمر المؤسس']),
                hasDedicatedPlace: raw['Have a dedicated place'] || raw['مكان مخصص'] || 'Not specified',


                startupType: raw['Startup Type'] || raw['Startup type'] || 'Not specified',
                workplaceOwnership: raw['own or rent a workplace'] || 'Not specified',
                legalStatusDetails: raw['Legal Status'] || 'Not specified',








                challenges: raw['Challenges'] || raw['التحديات'] || '',
                score: Math.floor(Math.random() * 30) + 70,
                story: raw['Tell us your story'] || raw['احك لنا قصتك'] || ''
            };
        };

        let fetchedStartups: Startup[] = [];

        if (data.startups) {
            console.log('✅ Found data.startups');
            console.log('📊 Companies count:', data.startups.length);
            if (data.startups.length > 0) {
                console.log('🔍 First company (sample):', data.startups[0]);
            }
            fetchedStartups = data.startups.map(mapStartupData);
        } else if (Array.isArray(data)) {
            console.log('✅ Data is a direct Array');
            console.log('📊 Items count:', data.length);
            if (data.length > 0) {
                console.log('🔍 First item (sample):', data[0]);
            }
            fetchedStartups = data.map(mapStartupData);
        } else {
            console.warn('⚠️ Unexpected data structure!');
            console.log('📦 Complete data:', JSON.stringify(data, null, 2));
        }

        console.log('✅ Data processed successfully');
        console.log('📊 Final companies count:', fetchedStartups.length);

        const industries = Array.from(new Set(fetchedStartups.map(s => s.industry).filter(Boolean))).sort();
        const governorates = Array.from(new Set(fetchedStartups.map(s => s.governorate).filter(Boolean))).sort();

        console.log('🏭 Extracted industries:', industries);
        console.log('🗺️ Extracted governorates:', governorates);
        console.log('🎉 Data fetched successfully!');

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
        console.log('🏁 Data fetch finished');
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
