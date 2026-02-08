/**
 * Google Apps Script Backend for Ecosystem Mapping
 * Handles GET (Fetch) and POST (Create/Bulk Create)
 * Optimized for robustness against header whitespace and special characters.
 */

function normalizeValue(str) {
    if (str === null || str === undefined) return '';
    return str.toString()
        .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width characters and BOM
        .replace(/\s+/g, ' ')                  // Collapse all whitespace into single space
        .trim()
        .toLowerCase();
}

function doGet(e) {
    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const sheet = ss.getSheets()[0];
        const data = sheet.getDataRange().getValues();
        const headers = data[0];
        const rows = data.slice(1);

        const jsonOutput = rows.map(row => {
            const obj = {};
            headers.forEach((header, i) => {
                obj[header] = row[i];
            });
            return obj;
        });

        return ContentService.createTextOutput(JSON.stringify({
            status: 'success',
            data: jsonOutput
        })).setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

function doPost(e) {
    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const sheet = ss.getSheets()[0];
        const content = JSON.parse(e.postData.contents);

        if (content.action === 'create_startup') {
            return handleCreateStartup(sheet, content);
        } else if (content.action === 'bulk_create_startups') {
            return handleBulkCreate(sheet, content.startups);
        } else {
            return handleGenericPost(content);
        }

    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

function handleCreateStartup(sheet, data) {
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const mapping = getFieldMapping();

    // Pre-normalize mapping for efficiency
    const normMap = {};
    for (const [key, aliases] of Object.entries(mapping)) {
        aliases.forEach(a => normMap[normalizeValue(a)] = key);
    }

    const newRow = headers.map(header => {
        const cleanHeader = normalizeValue(header);

        // Core fields
        if (cleanHeader === 'id') return data.id || Utilities.getUuid();
        if (cleanHeader === 'timestamp') return new Date();

        // Check pre-normalized mapping
        const feKey = normMap[cleanHeader];
        if (feKey && data[feKey] !== undefined) {
            let val = data[feKey];
            // Special handling for phone/email to prevent Google Sheets from stripping leading zero or converting to number
            if (feKey === 'phone') return "'" + val;
            return val;
        }

        // Final fallback: check direct property names normalized
        for (let k in data) {
            if (normalizeValue(k) === cleanHeader) return data[k];
        }

        return '';
    });

    sheet.appendRow(newRow);
    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
        .setMimeType(ContentService.MimeType.JSON);
}

function handleBulkCreate(sheet, startups) {
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const mapping = getFieldMapping();

    const normMap = {};
    for (const [key, aliases] of Object.entries(mapping)) {
        aliases.forEach(a => normMap[normalizeValue(a)] = key);
    }

    const rowsToAdd = startups.map(data => {
        return headers.map(header => {
            const cleanHeader = normalizeValue(header);
            if (cleanHeader === 'id') return data.id || Utilities.getUuid();
            if (cleanHeader === 'timestamp') return new Date();

            const feKey = normMap[cleanHeader];
            if (feKey && data[feKey] !== undefined) {
                let val = data[feKey];
                if (feKey === 'phone') return "'" + val;
                return val;
            }

            for (let k in data) {
                if (normalizeValue(k) === cleanHeader) return data[k];
            }
            return '';
        });
    });

    if (rowsToAdd.length > 0) {
        const startRow = sheet.getLastRow() + 1;
        sheet.getRange(startRow, 1, rowsToAdd.length, headers.length).setValues(rowsToAdd);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'success', count: rowsToAdd.length }))
        .setMimeType(ContentService.MimeType.JSON);
}

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
        'fundingEntity': ['What is the Funding entity?', 'جهة التمويل'],
        'fundingRaised': ['Funding raised', 'قيمة تمويل', 'Total Funding', 'Funding Raised', 'تمويل'],
        'monthlyIncome': ['How much is your monthly income from the project?', 'الدخل الشهري', 'Monthly Income'],
        'serviceProvider': ['Service Provider', 'Incubator', 'مقدم الخدمة']
    };
}

function handleGenericPost(data) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Data received' }))
        .setMimeType(ContentService.MimeType.JSON);
}
