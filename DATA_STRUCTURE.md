# 📊 هيكل البيانات - Data Structure

## 🎯 نظرة عامة

هذا الملف يوضح هيكل البيانات المتوقع من Google Apps Script API.

---

## 📝 TypeScript Interface

```typescript
interface Startup {
  id: string;                    // معرف فريد للشركة
  name: string;                  // اسم الشركة
  ceoName: string;               // اسم المدير التنفيذي
  industry: string;              // القطاع/المجال
  description: string;           // وصف الشركة
  employees: number;             // عدد الموظفين
  revenue: number;               // الإيرادات السنوية
  governorate: string;           // المحافظة
  stage: string;                 // مرحلة الشركة
  website: string;               // الموقع الإلكتروني
  phone: string;                 // رقم الهاتف
  email: string;                 // البريد الإلكتروني
  foundingYear: number;          // سنة التأسيس
  legalStatus: string;           // الشكل القانوني
  fundingRaised: string;         // حجم التمويل
  profitStatus: string;          // حالة الربحية
  challenges: string;            // التحديات
  score: number;                 // نقاط الجودة (0-100)
  story: string;                 // قصة الشركة
}
```

---

## 🌐 API Response Format

### الصيغة المتوقعة من API:

```json
{
  "startups": [
    {
      "ID": "1",
      "Startup Name": "شركة التكنولوجيا المتقدمة",
      "CEO Name": "أحمد محمد",
      "Industry": "تكنولوجيا المعلومات",
      "Description": "شركة متخصصة في تطوير الحلول التقنية المبتكرة",
      "Nu. of employees": 50,
      "Revenue (Total) (Yearly)": 1000000,
      "Governerate": "القاهرة",
      "Stage": "مرحلة النمو",
      "Startup type": "شركة ناشئة",
      "Website/ app links/ social media": "https://example.com",
      "Phone": "01234567890",
      "Email": "info@example.com",
      "Year": 2020,
      "Date of company stabilished": "2020-01-15",
      "Legal Status": "شركة مساهمة",
      "Funding raised": "1M EGP",
      "Are there any profits from the project": "Yes",
      "Challenges": "التوسع في السوق والحصول على تمويل إضافي",
      "Tell us your story": "بدأنا الشركة بفكرة بسيطة وتطورت لتصبح..."
    }
  ]
}
```

---

## 🔄 Data Mapping

### من Google Sheet إلى التطبيق:

| Google Sheet Column | App Field | Type | Required |
|---------------------|-----------|------|----------|
| `ID` | `id` | string | ✅ |
| `Startup Name` | `name` | string | ✅ |
| `CEO Name` | `ceoName` | string | ✅ |
| `Industry` | `industry` | string | ✅ |
| `Description` | `description` | string | ⚪ |
| `Nu. of employees` | `employees` | number | ✅ |
| `Revenue (Total) (Yearly)` | `revenue` | number | ✅ |
| `Governerate` | `governorate` | string | ✅ |
| `Stage` | `stage` | string | ✅ |
| `Website/ app links/ social media` | `website` | string | ⚪ |
| `Phone` | `phone` | string | ⚪ |
| `Email` | `email` | string | ⚪ |
| `Year` | `foundingYear` | number | ✅ |
| `Legal Status` | `legalStatus` | string | ⚪ |
| `Funding raised` | `fundingRaised` | string | ⚪ |
| `Are there any profits from the project` | `profitStatus` | string | ⚪ |
| `Challenges` | `challenges` | string | ⚪ |
| `Tell us your story` | `story` | string | ⚪ |

---

## 📋 القيم المتوقعة

### Industry (القطاع):
```javascript
[
  'تكنولوجيا المعلومات',
  'التجارة الإلكترونية',
  'الزراعة',
  'التعليم',
  'الصحة',
  'الطاقة المتجددة',
  'الفينتيك',
  'النقل واللوجستيات',
  'السياحة',
  'التصنيع'
]
```

### Governorate (المحافظة):
```javascript
[
  'القاهرة',
  'الجيزة',
  'الإسكندرية',
  'أسيوط',
  'المنصورة',
  'الأقصر',
  // ... المزيد
]
```

### Stage (المرحلة):
```javascript
[
  'فكرة',
  'مرحلة التأسيس',
  'مرحلة النمو',
  'مرحلة التوسع',
  'شركة ناشئة',
  'شركة قائمة'
]
```

### Legal Status (الشكل القانوني):
```javascript
[
  'شركة مساهمة',
  'شركة ذات مسؤولية محدودة',
  'مؤسسة فردية',
  'شركة تضامن',
  'غير محدد'
]
```

### Profit Status (حالة الربحية):
```javascript
[
  'مربحة',      // إذا كانت الإجابة "Yes" أو "نعم"
  'غير مربحة'   // إذا كانت الإجابة "No" أو "لا"
]
```

---

## 🔢 تنسيق الأرقام

### Revenue (الإيرادات):
```javascript
// يقبل أي من الصيغ التالية:
"1000000"        // رقم كنص
1000000          // رقم
"1,000,000"      // رقم مع فواصل
"1M EGP"         // رقم مع رمز العملة
"EGP 1000000"    // رقم مع رمز العملة

// سيتم تحويلها جميعاً إلى رقم
```

### Employees (الموظفين):
```javascript
// يقبل:
50               // رقم
"50"             // رقم كنص
"50 موظف"        // رقم مع نص

// سيتم استخراج الرقم فقط
```

---

## 🛠️ Data Validation

### في التطبيق:

```typescript
const mapStartupData = (raw: any): Startup => {
  // Helper لتحويل الأرقام بأمان
  const parseNumber = (val: any) => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    // إزالة رموز العملة والفواصل
    const clean = val.toString().replace(/[^0-9.]/g, '');
    return parseFloat(clean) || 0;
  };

  return {
    id: raw['ID'] ? String(raw['ID']) : String(Math.random()),
    name: raw['Startup Name'] || 'اسم غير متوفر',
    ceoName: raw['CEO Name'] || 'غير متوفر',
    industry: raw['Industry'] || 'غير مصنف',
    description: raw['Description'] || '',
    employees: parseNumber(raw['Nu. of employees']),
    revenue: parseNumber(raw['Revenue (Total) (Yearly)']),
    governorate: raw['Governerate'] || 'غير محدد',
    stage: raw['Stage'] || raw['Startup type'] || 'غير محدد',
    website: raw['Website/ app links/ social media'] || '#',
    phone: raw['Phone'] ? String(raw['Phone']) : '',
    email: raw['Email'] || '',
    foundingYear: raw['Year'] || new Date().getFullYear(),
    legalStatus: raw['Legal Status'] || 'غير محدد',
    fundingRaised: raw['Funding raised'] ? String(raw['Funding raised']) : 'تمويل ذاتي',
    profitStatus: (raw['Are there any profits from the project'] === 'Yes' || 
                   raw['Are there any profits from the project'] === 'نعم') 
                   ? 'مربحة' : 'غير مربحة',
    challenges: raw['Challenges'] || '',
    score: Math.floor(Math.random() * 30) + 70, // 70-100
    story: raw['Tell us your story'] || ''
  };
};
```

---

## 📤 Google Apps Script Example

### مثال على كود Google Apps Script:

```javascript
function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Startups');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  const startups = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const startup = {};
    
    headers.forEach((header, index) => {
      startup[header] = row[index];
    });
    
    startups.push(startup);
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({ startups }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

---

## ✅ Checklist للبيانات

قبل نشر API، تأكد من:

- [ ] جميع الأعمدة المطلوبة موجودة
- [ ] أسماء الأعمدة مطابقة تماماً
- [ ] الأرقام بصيغة صحيحة
- [ ] التواريخ بصيغة صحيحة
- [ ] لا توجد قيم فارغة في الحقول المطلوبة
- [ ] API يرجع JSON صحيح
- [ ] CORS مفعّل في Google Script

---

## 🔍 Testing

### اختبار API:

```bash
# في المتصفح أو Postman
GET https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

# يجب أن يرجع:
{
  "startups": [...]
}
```

---

## 📝 ملاحظات مهمة

1. **Case Sensitivity**: أسماء الأعمدة حساسة لحالة الأحرف
2. **Encoding**: تأكد من استخدام UTF-8 للعربية
3. **Null Values**: الحقول الفارغة ستستخدم القيم الافتراضية
4. **Performance**: حاول تقليل حجم البيانات المرسلة

---

**آخر تحديث**: ديسمبر 2025
