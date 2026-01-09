/**
 * ============================================
 * Google Apps Script - Company Data API
 * ============================================
 * 
 * هذا السكريبت يجلب بيانات الشركات من Google Sheet
 * ويرجعها بصيغة JSON للتطبيق
 * 
 * خطوات النشر:
 * 1. افتح Google Sheet
 * 2. Extensions > Apps Script
 * 3. الصق هذا الكود
 * 4. Deploy > New Deployment
 * 5. Type: Web App
 * 6. Execute as: Me
 * 7. Who has access: Anyone
 * 8. Deploy
 * 9. انسخ الرابط واستخدمه في التطبيق
 */

/**
 * دالة doGet - تُنفذ عند استدعاء Web App
 */
function doGet(e) {
    try {
        Logger.log('🚀 بدء جلب البيانات من Google Sheet...');

        // احصل على الـ Spreadsheet النشط
        const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

        // غيّر اسم الـ Sheet حسب sheet الخاص بك
        // إذا كان اسم الـ sheet مختلف، غيّر 'Sheet1' للاسم الصحيح
        const sheetName = 'Startups'; // 👈 تم التحديث بناءً على طلبك
        const sheet = spreadsheet.getSheetByName(sheetName);

        // تحقق من وجود الـ Sheet
        if (!sheet) {
            Logger.log('❌ لم يتم العثور على Sheet: ' + sheetName);
            return createJsonResponse({
                error: 'Sheet not found: ' + sheetName,
                message: 'تأكد من اسم الـ Sheet في السكريبت',
                availableSheets: spreadsheet.getSheets().map(s => s.getName())
            });
        }

        Logger.log('✅ تم العثور على Sheet: ' + sheetName);

        // احصل على جميع البيانات
        const dataRange = sheet.getDataRange();
        const values = dataRange.getValues();

        // تحقق من وجود بيانات
        if (values.length === 0) {
            Logger.log('⚠️ الـ Sheet فارغ');
            return createJsonResponse({
                startups: [],
                message: 'الـ Sheet فارغ - لا توجد بيانات'
            });
        }

        // السطر الأول يحتوي على أسماء الأعمدة (Headers)
        const headers = values[0];
        Logger.log('📋 الأعمدة الموجودة: ' + headers.join(', '));

        // تحويل البيانات إلى Array of Objects
        const startups = [];

        // ابدأ من السطر الثاني (index 1) لأن الأول headers
        for (let i = 1; i < values.length; i++) {
            const row = values[i];

            // تخطى الصفوف الفارغة
            if (isRowEmpty(row)) {
                continue;
            }

            const startup = {};

            // لكل عمود، أضف القيمة للـ object
            headers.forEach((header, index) => {
                const value = row[index];

                // تنظيف القيم الفارغة
                if (value === null || value === undefined || value === '') {
                    startup[header] = '';
                } else {
                    startup[header] = value;
                }
            });

            startups.push(startup);
        }

        Logger.log('✅ تم جلب ' + startups.length + ' شركة');

        // إرجاع البيانات بصيغة JSON
        return createJsonResponse({
            success: true,
            count: startups.length,
            startups: startups,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        Logger.log('❌ خطأ: ' + error.toString());

        return createJsonResponse({
            error: error.toString(),
            message: 'حدث خطأ في جلب البيانات',
            stack: error.stack
        });
    }
}


/**
 * دالة doPost - تُنفذ عند استلام طلب POST (مثل الحجز)
 */
function doPost(e) {
    try {
        Logger.log('🚀 بدء معالجة طلب POST...');

        // 1. تحليل البيانات المرسلة
        const params = JSON.parse(e.postData.contents);
        Logger.log('📦 البيانات المستلمة: ' + JSON.stringify(params));

        // 2. الوصول لملف الشيت
        const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

        // 3. تحديد ورقة "Requests" أو إنشائها لو مش موجودة
        let requestSheet = spreadsheet.getSheetByName('Requests');
        if (!requestSheet) {
            Logger.log('⚠️ ورقة Requests غير موجودة، جاري إنشاؤها...');
            requestSheet = spreadsheet.insertSheet('Requests');
            // إضافة العناوين (Headers)
            requestSheet.appendRow(['Timestamp', 'Startup Name', 'Name', 'Role', 'Email', 'Phone', 'Note']);
        }

        // 4. تجهيز الصف الجديد
        const newRow = [
            new Date(), // Timestamp
            params.startupName || '',
            params.name || '',
            params.role || '',
            params.email || '',
            params.phone || '',
            params.note || ''
        ];

        // 5. إضافة الصف للشيت
        requestSheet.appendRow(newRow);
        Logger.log('✅ تم حفظ الطلب بنجاح!');

        // 6. إرجاع رد ناجح
        return createJsonResponse({
            success: true,
            message: 'تم استلام الطلب وحفظه بنجاح',
            savedData: params
        });

    } catch (error) {
        Logger.log('❌ خطأ في doPost: ' + error.toString());
        return createJsonResponse({
            success: false,
            error: error.toString(),
            message: 'حدث خطأ أثناء حفظ الطلب'
        });
    }
}

/**
 * دالة مساعدة لإنشاء JSON Response
 */
function createJsonResponse(data) {
    return ContentService
        .createTextOutput(JSON.stringify(data))
        .setMimeType(ContentService.MimeType.JSON);
}

/**
 * دالة للتحقق من أن الصف فارغ
 */
function isRowEmpty(row) {
    return row.every(cell => {
        return cell === null || cell === undefined || cell === '';
    });
}

/**
 * دالة اختبار - يمكنك تشغيلها من Apps Script Editor
 * لاختبار السكريبت قبل النشر
 */
function testGetData() {
    const result = doGet();
    const data = JSON.parse(result.getContent());
    Logger.log('📊 نتيجة الاختبار:');
    Logger.log(JSON.stringify(data, null, 2));

    if (data.startups) {
        Logger.log('✅ عدد الشركات: ' + data.startups.length);
        if (data.startups.length > 0) {
            Logger.log('🔍 أول شركة:');
            Logger.log(JSON.stringify(data.startups[0], null, 2));
        }
    }
}

/**
 * دالة للحصول على معلومات الـ Sheets المتاحة
 * مفيدة للتأكد من اسم الـ Sheet الصحيح
 */
function listAllSheets() {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = spreadsheet.getSheets();

    Logger.log('📋 الـ Sheets المتاحة:');
    sheets.forEach((sheet, index) => {
        Logger.log((index + 1) + '. ' + sheet.getName());
    });
}

/**
 * دالة للحصول على أسماء الأعمدة
 * مفيدة للتأكد من أسماء الأعمدة الصحيحة
 */
function getColumnHeaders() {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName('Startups'); // غيّر الاسم إذا لزم

    if (!sheet) {
        Logger.log('❌ Sheet not found');
        return;
    }

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    Logger.log('📋 أسماء الأعمدة:');
    headers.forEach((header, index) => {
        Logger.log((index + 1) + '. "' + header + '"');
    });
}
