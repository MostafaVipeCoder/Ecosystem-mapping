/**
 * ============================================================
 * Google Apps Script - Ecosystem Mapping (Final Version)
 * ============================================================
 * 
 * الميزات:
 * 1. جلب البيانات (GET): جلب كل الشركات والمؤشر.
 * 2. إضافة بيانات (POST):
 *    - رفع الشعارات مباشرة إلى Google Drive والحصول على رابط (بدلاً من Base64).
 *    - دعم الإضافة الفردية والجماعية (Bulk).
 *    - دعم طلبات الحجز (Meeting Requests).
 *    - ذكاء اصطناعي لمطابقة أسماء الأعمدة (Mapping) لتجنب الأخطاء.
 * 
 * خطوات التحديث:
 * 1. افتح Google Sheet الخاص بك.
 * 2. Extensions > Apps Script.
 * 3. امسح الكود القديم والصق هذا الكود كاملاً.
 * 4. قم بتغيير Folder ID لمجلد الصور (سطر 18).
 * 5. Deploy > New Deployment > Web App (تأكد من اختيار Anyone للوصول).
 * 6. انسخ الرابط الجديد وضعه في ملف .env في التطبيق.
 */

// --- الإعدادات ---
const LOGO_DRIVE_FOLDER_ID = '1w0ngm8mJrC8X_41n8e3yjnfn-t07C0KI'; // 👈 استبدل هذا بـ ID مجلد الصور الخاص بك
const STARTUPS_SHEET_NAME = 'Startups';
const REQUESTS_SHEET_NAME = 'Requests';

/**
 * دالة GET لجلب البيانات
 */
function doGet(e) {
    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const sheet = ss.getSheetByName(STARTUPS_SHEET_NAME) || ss.getSheets()[0];
        const data = sheet.getDataRange().getValues();

        if (data.length <= 1) {
            return createJsonResponse({ status: 'success', startups: [] });
        }

        const headers = data[0];
        const rows = data.slice(1);

        const startups = rows.filter(row => !isRowEmpty(row)).map(row => {
            const obj = {};
            headers.forEach((header, i) => {
                obj[header] = row[i];
            });
            return obj;
        });

        return createJsonResponse({
            status: 'success',
            success: true,
            startups: startups,
            count: startups.length
        });

    } catch (error) {
        return createJsonResponse({ status: 'error', message: error.toString() });
    }
}

/**
 * دالة POST لمعالجة الإضافة
 */
function doPost(e) {
    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const sheet = ss.getSheetByName(STARTUPS_SHEET_NAME) || ss.getSheets()[0];
        const content = JSON.parse(e.postData.contents);

        if (content.action === 'create_startup') {
            return handleCreateStartup(sheet, content);
        } else if (content.action === 'bulk_create_startups') {
            return handleBulkCreate(sheet, content.startups);
        } else {
            // معالجة طلبات الحجز الافتراضية
            return handleMeetingRequest(ss, content);
        }

    } catch (error) {
        return createJsonResponse({ status: 'error', message: error.toString() });
    }
}

/**
 * معالجة إضافة شركة واحدة مع رفع اللوجو
 */
function handleCreateStartup(sheet, data) {
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const mapping = getFieldMapping();

    // رفع اللوجو إلى درايف
    data.logo = processLogoToDrive(data.logo, data.name || 'startup');

    const newRow = createRowFromData(headers, data, mapping);
    sheet.appendRow(newRow);

    return createJsonResponse({ status: 'success', success: true, logoUrl: data.logo });
}

/**
 * معالجة الإضافة الجماعية
 */
function handleBulkCreate(sheet, startups) {
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const mapping = getFieldMapping();

    const rowsToAdd = startups.map(data => {
        data.logo = processLogoToDrive(data.logo, data.name || 'startup');
        return createRowFromData(headers, data, mapping);
    });

    if (rowsToAdd.length > 0) {
        const startRow = sheet.getLastRow() + 1;
        sheet.getRange(startRow, 1, rowsToAdd.length, headers.length).setValues(rowsToAdd);
    }

    return createJsonResponse({ status: 'success', success: true, count: rowsToAdd.length });
}

/**
 * معالجة طلبات الحجز (Meeting Requests)
 */
function handleMeetingRequest(ss, params) {
    let requestSheet = ss.getSheetByName(REQUESTS_SHEET_NAME);
    if (!requestSheet) {
        requestSheet = ss.insertSheet(REQUESTS_SHEET_NAME);
        requestSheet.appendRow(['Timestamp', 'Startup Name', 'Name', 'Role', 'Email', 'Phone', 'Note']);
    }

    const newRow = [
        new Date(),
        params.startupName || '',
        params.name || '',
        params.role || '',
        params.email || '',
        params.phone || '',
        params.note || ''
    ];

    requestSheet.appendRow(newRow);
    return createJsonResponse({ status: 'success', success: true, message: 'Request saved' });
}

/**
 * وظيفة رفع الصورة إلى Google Drive
 */
function processLogoToDrive(base64Data, startupName) {
    if (!base64Data || !base64Data.startsWith('data:image')) return base64Data;

    try {
        const folder = DriveApp.getFolderById(LOGO_DRIVE_FOLDER_ID);
        const contentType = base64Data.substring(5, base64Data.indexOf(';'));
        const bytes = Utilities.base64Decode(base64Data.split(',')[1]);
        const blob = Utilities.newBlob(bytes, contentType, startupName.replace(/\s+/g, '_') + '_logo');

        const file = folder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

        // نرجع الرابط المباشر للمعاينة
        return file.getUrl();
    } catch (e) {
        console.error("Mirror upload failed: " + e.toString());
        return base64Data; // نرجع الـ base64 كاحتياطي في حال الفشل
    }
}

/**
 * دالة مساعدة لبناء الصف بناءً على الـ Headers والـ Mapping
 */
function createRowFromData(headers, data, mapping) {
    const normMap = {};
    for (const [key, aliases] of Object.entries(mapping)) {
        aliases.forEach(a => normMap[normalizeValue(a)] = key);
    }

    return headers.map(header => {
        const cleanHeader = normalizeValue(header);

        if (cleanHeader === 'id') return data.id || Utilities.getUuid();
        if (cleanHeader === 'timestamp' || cleanHeader === normalizeValue('Last updating Date for Data')) {
            return new Date();
        }

        const feKey = normMap[cleanHeader];
        if (feKey && data[feKey] !== undefined) {
            let val = data[feKey];
            if (feKey === 'phone') return "'" + val; // لمنع تحويل الرقم إلى صيغة علمية
            return val;
        }

        // بحث مباشر في الخصائص
        for (let k in data) {
            if (normalizeValue(k) === cleanHeader) return data[k];
        }

        return '';
    });
}

/**
 * تنظيف القيم للمقارنة
 */
function normalizeValue(str) {
    if (str === null || str === undefined) return '';
    return str.toString()
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
}

/**
 * التحقق من الصف الفارغ
 */
function isRowEmpty(row) {
    return row.every(cell => cell === null || cell === undefined || cell === '');
}

/**
 * رد JSON
 */
function createJsonResponse(data) {
    return ContentService.createTextOutput(JSON.stringify(data))
        .setMimeType(ContentService.MimeType.JSON);
}

/**
 * خريطة مطابقة الحقول (Field Mapping)
 */
function getFieldMapping() {
    return {
        'name': ['Startup Name', 'اسم الشركة', 'أسم الشركة', 'Name', 'Company Name', 'Business Name', 'الشركة', 'startupName'],
        'ceoName': ['CEO Name', 'اسم المؤسس', 'Founder'],
        'ceoGender': ['CEO Gender', 'النوع', 'Gender'],
        'industry': ['Industry', 'قطاع المشروع الصناعة', 'Sector', 'قطاع المشروع', 'الصناعة'],
        'governorate': ['Governerate', 'المحافظة', 'Governorate'],
        'phone': ['Phone', 'الهاتف', 'Mobile'],
        'email': ['Email', 'البريد الالكتروني'],
        'employees': ['Nu. of employees', 'عدد الموظفين كلهم بدون المؤسسين', 'Employees', 'Staff', 'عدد الموظفين', 'employees'],
        'revenue': ['Revenue (Total) (Yearly)', 'الايرادات سنوي', 'Revenue', 'Total Revenue', 'الايرادات', 'revenue'],
        'profitability': ['profitability', 'مرحلة المشروع', 'Stage', 'Current Stage', 'الربحية'],
        'description': ['Description', 'الوصف', 'وصف مختصر للشركة', 'Brief'],
        'startupType': ['Startup type', 'نوع الشركة', 'Startup Type'],
        'website': ['Website/ app links/ social media', 'التطبيق /رابط الموقع', 'Website'],
        'openClosed': ['Open/Closed', 'Operational status', 'Status', 'حالة العمل'],
        'foundingDate': ['Date of company stabilished', 'تاريخ التأسيس', 'Date of establishment', 'Founding Date'],
        'legalStatus': ['Legal Status', 'هل المشروع مسجل', 'الوضع القانوني'],
        'teamSize': ['Founding team size', 'عدد المؤسسين', 'Team Size', 'عدد فريق التأسيس'],
        'femaleFounders': ['Female founders', 'عدد المؤسسات الإناث', 'Female Founders', 'عدد الإناث المؤسسات'],
        'maleFounders': ['male founders', 'عدد المؤسسين الذكور', 'Male Founders', 'عدد الذكور المؤسسين'],
        'freelancersCount': ['Number of freelancers', 'عدد المتدرّبين/الفريلانسرز', 'Freelancers', 'عدد الفريلانسرز'],
        'hasDedicatedPlace': ['Do you have a dedicated place', 'مكان مخصص', 'Has Dedicated Place'],
        'workplaceType': ['own or rent a workplace', 'نوع مكان العمل', 'Workplace Type'],
        'fundingEntity': ['What is the Funding entity?', 'جهة التمويل', 'What is the Funding entity name?'],
        'fundingRaised': ['Funding raised', 'قيمة تمويل', 'Total Funding', 'Funding Raised', 'تمويل', 'التمويل الذي تم الحصول عليه'],
        'monthlyIncome': ['How much is your monthly income from the project?', 'الدخل الشهري', 'Monthly Income'],
        'lastFundingDate': ['Last Funding Date', 'تاريخ آخر تمويل', 'lastFundingDate'],
        'logo': ['Company Logo', 'شعار الشركة', 'logo'],
        'serviceProvider': ['Service Provider', 'Incubator', 'مقدم الخدمة']
    };
}

/**
 * نظام الإشعارات اليومي - يُرسل ملخصاً لمقدمي الخدمة الذين لديهم بيانات غير مراجعة
 * يمكن ربطه بـ Time-driven Trigger ليعمل يومياً الساعة 6 صباحاً
 */
function sendDailyReviewNotifications() {
    const NOTIFICATION_EMAILS = [
        'Abdullah.Shaban@Athareg.com',
        'Abdullah.Shaban1@Athareg.com',
        'Abdullah.Shaban2@Athareg.com'
    ];

    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const sheet = ss.getSheetByName(STARTUPS_SHEET_NAME) || ss.getSheets()[0];
        
        // جلب جميع البيانات
        const data = sheet.getDataRange().getValues();
        if (data.length <= 1) return; // لا يوجد بيانات غير العناوين

        const headers = data[0];
        
        // البحث عن أرقام الأعمدة ("Review" و "Service Provider") متجاهلًا حالة الأحرف
        const reviewColIdx = headers.findIndex(h => normalizeValue(h) === normalizeValue('Review'));
        const providerColIdx = headers.findIndex(h => normalizeValue(h) === normalizeValue('Service Provider'));

        // في حال لم يتم العثور على الأعمدة، نتوقف لتجنب الأخطاء
        if (reviewColIdx === -1) {
            console.error('لم يتم العثور على عمود "Review"');
            return;
        }
        if (providerColIdx === -1) {
            console.error('لم يتم العثور على عمود "Service Provider"');
            return;
        }

        const rows = data.slice(1);
        const providersSummary = {};
        
        // تجميع البيانات المضافة حديثا والتي تحتاج مراجعة
        let hasNewData = false;
        
        rows.forEach(row => {
            if (isRowEmpty(row)) return;
            
            const reviewValue = row[reviewColIdx];
            // تحقق إذا كانت قيمة المراجعة false أو نص 'false' أو فارغة (في حال المربع غير معلم بعد)
            const isNeedsReview = (reviewValue === false || String(reviewValue).trim().toUpperCase() === 'FALSE' || reviewValue === '');
            
            if (isNeedsReview) {
                // استخدام قيمة عمود مقدم الخدمة أو نص بديل في حال كان الحقل فارغاً
                const providerName = row[providerColIdx] || 'مقدم خدمة (غير محدد)';
                
                if (!providersSummary[providerName]) {
                    providersSummary[providerName] = 0;
                }
                providersSummary[providerName]++;
                hasNewData = true; // تم العثور على بيانات جديدة
            }
        });

        // إذا لم يكن هناك بيانات جديدة تحتاج مراجعة، نتوقف ولا نرسل إيميل نهائياً
        if (!hasNewData) {
            console.log('لا يوجد بيانات جديدة تحتاج إلى مراجعة اليوم. لن يتم إرسال إشعار.');
            return;
        }

        // بناء محتوى الإيميل (HTML)
        let htmlBody = `
            <div dir="rtl" style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">تقرير المراجعة اليومي</h2>
                <p>مرحباً،</p>
                <p>يوجد بيانات جديدة في النظام تم إدخالها وتحتاج إلى مراجعتكم. وفيما يلي ملخص بعدد الصفوف لكل مقدم خدمة:</p>
                <ul style="background-color: #f9f9f9; padding: 15px 35px; border-radius: 5px; border: 1px solid #eee;">
        `;

        for (const [provider, count] of Object.entries(providersSummary)) {
            htmlBody += `<li style="margin-bottom: 10px; font-size: 16px;">
                مقدم الخدمة <strong>${provider}</strong>: لديه عدد <strong>${count}</strong> صفوف بيانات تم إدخالها وتحتاج إلى مراجعة.
            </li>`;
        }

        htmlBody += `
                </ul>
                <p style="margin-top: 20px;">يرجى الدخول إلى ملف البيانات (Sheet) لمراجعتها، والرجاء تذكر تغيير حالة المراجعة إلى TRUE في عمود Review بعد المراجعة حتى لا يظهر التنبيه مجدداً غداً.</p>
                <br>
                <p style="color: #7f8c8d; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">هذا إشعار تلقائي من النظام. لا تقم بالرد على هذه الرسالة.</p>
            </div>
        `;

        // إرسال الإيميل
        MailApp.sendEmail({
            to: NOTIFICATION_EMAILS.join(','),
            subject: 'تنبيه تنفيذي: بيانات جديدة بانتظار المراجعة 🔰',
            htmlBody: htmlBody
        });
        
        console.log('تم إرسال الإشعار بنجاح للموردين الجدد.');

    } catch (error) {
        console.error('حدث خطأ أثناء إرسال الإشعارات: ' + error.toString());
    }
}
