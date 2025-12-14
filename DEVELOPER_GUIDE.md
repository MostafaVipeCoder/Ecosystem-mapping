# 🔧 دليل المطور - Developer Guide

## 📂 هيكل الملفات التفصيلي

### `src/App.tsx` - المكون الرئيسي
يحتوي على:
- **واجهة Startup**: تعريف نوع البيانات للشركات
- **API Configuration**: إعدادات الاتصال بـ Google Apps Script
- **State Management**: إدارة الحالة باستخدام React Hooks
- **Filter Logic**: منطق التصفية والبحث
- **UI Components**: مكونات العرض الرئيسية

### `src/main.tsx` - نقطة الدخول
```typescript
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
```

### `src/index.css` - الأنماط الرئيسية
- Tailwind CSS directives
- Custom CSS variables
- Global styles
- RTL support

### `src/components/ui/` - مكونات UI
مكونات Radix UI المخصصة:
- `button.tsx` - أزرار
- `card.tsx` - بطاقات
- `input.tsx` - حقول الإدخال
- `sheet.tsx` - لوحات جانبية
- `checkbox.tsx` - مربعات الاختيار
- `slider.tsx` - منزلقات
- `tabs.tsx` - تبويبات
- ... والمزيد (48 مكون)

---

## 🎯 المكونات الرئيسية في App.tsx

### 1. StartupDetails Component
```typescript
const StartupDetails = ({ 
  startup, 
  open, 
  onOpenChange 
}: { 
  startup: Startup | null, 
  open: boolean, 
  onOpenChange: (open: boolean) => void 
}) => { ... }
```
**الوظيفة**: عرض تفاصيل الشركة في لوحة جانبية
**الميزات**:
- 3 تبويبات: نظرة عامة، البيانات المالية، الفريق
- تصميم متجاوب مع RTL
- معلومات التواصل

### 2. StartupCard Component
```typescript
function StartupCard({ 
  startup, 
  onClick 
}: { 
  startup: Startup, 
  onClick: () => void 
}) { ... }
```
**الوظيفة**: بطاقة عرض الشركة في الشبكة
**الميزات**:
- تأثيرات hover
- عرض المعلومات الأساسية
- زر التفاصيل

### 3. FilterSection Component
```typescript
const FilterSection = ({ 
  title, 
  children, 
  isOpen = true 
}: { 
  title: string, 
  children: React.ReactNode, 
  isOpen?: boolean 
}) => { ... }
```
**الوظيفة**: قسم قابل للطي للفلاتر
**الميزات**:
- قابل للتوسيع/الطي
- تصميم مدمج

---

## 🔄 إدارة الحالة (State Management)

### States الرئيسية:

```typescript
// بيانات الشركات
const [startups, setStartups] = useState<Startup[]>([]);

// الفلاتر المتاحة
const [availableIndustries, setAvailableIndustries] = useState<string[]>([]);
const [availableGovernorates, setAvailableGovernorates] = useState<string[]>([]);

// حالة التحميل والأخطاء
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

// فلاتر المستخدم
const [searchQuery, setSearchQuery] = useState('');
const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
const [employeeRange, setEmployeeRange] = useState<number[]>([0, 200]);
const [revenueRange, setRevenueRange] = useState<number[]>([0, 5000000]);

// الشركة المختارة
const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
const [isDetailsOpen, setIsDetailsOpen] = useState(false);
```

---

## 🔍 منطق التصفية (Filter Logic)

### useMemo للأداء الأمثل:
```typescript
const filteredStartups = useMemo(() => {
  return startups.filter(startup => {
    const matchesSearch = name.includes(searchQuery) || ceoName.includes(searchQuery);
    const matchesIndustry = selectedIndustries.length === 0 || selectedIndustries.includes(startup.industry);
    const matchesEmployees = (startup.employees || 0) >= employeeRange[0] && (startup.employees || 0) <= employeeRange[1];
    const matchesRevenue = (startup.revenue || 0) >= revenueRange[0] && (startup.revenue || 0) <= revenueRange[1];
    
    return matchesSearch && matchesIndustry && matchesEmployees && matchesRevenue;
  });
}, [startups, searchQuery, selectedIndustries, employeeRange, revenueRange]);
```

---

## 🌐 API Integration

### Fetch Data Function:
```typescript
const fetchData = async () => {
  setIsLoading(true);
  setError(null);
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('فشل في جلب البيانات');
    
    const data = await response.json();
    const fetchedStartups = data.startups.map(mapStartupData);
    setStartups(fetchedStartups);
    
    // استخراج الفلاتر الديناميكية
    const industries = Array.from(new Set(fetchedStartups.map(s => s.industry)));
    const governorates = Array.from(new Set(fetchedStartups.map(s => s.governorate)));
    
    setAvailableIndustries(industries.sort());
    setAvailableGovernorates(governorates.sort());
  } catch (err) {
    setError('تعذر تحميل البيانات');
  } finally {
    setIsLoading(false);
  }
};
```

### Data Mapping:
```typescript
const mapStartupData = (raw: any): Startup => {
  const parseNumber = (val: any) => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    const clean = val.toString().replace(/[^0-9.]/g, '');
    return parseFloat(clean) || 0;
  };

  return {
    id: raw['ID'] ? String(raw['ID']) : String(Math.random()),
    name: raw['Startup Name'] || 'اسم غير متوفر',
    ceoName: raw['CEO Name'] || 'غير متوفر',
    industry: raw['Industry'] || 'غير مصنف',
    // ... المزيد من الحقول
  };
};
```

---

## 🎨 التصميم والأنماط

### Tailwind CSS Classes الشائعة:

```css
/* Cards */
.card-hover: hover:shadow-xl hover:-translate-y-1 transition-all duration-300

/* Buttons */
.btn-primary: bg-primary text-white hover:bg-primary/90

/* RTL Support */
dir="rtl" /* على العنصر الرئيسي */

/* Responsive Grid */
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
```

### Custom CSS Variables:
```css
:root {
  --primary: ...;
  --secondary: ...;
  --background: ...;
  --foreground: ...;
}
```

---

## 🔨 أدوات التطوير

### TypeScript Configuration:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "jsx": "react-jsx",
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Vite Configuration:
```typescript
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
```

---

## 🧪 Testing & Debugging

### Console Logging:
```typescript
console.log("Fetched startups:", fetchedStartups);
console.error("Error fetching data:", err);
```

### React DevTools:
- تثبيت React Developer Tools extension
- فحص الـ Components tree
- مراقبة الـ State changes

---

## 📊 Performance Optimization

### 1. useMemo للتصفية:
```typescript
const filteredStartups = useMemo(() => { ... }, [dependencies]);
```

### 2. React.memo للمكونات:
```typescript
const StartupCard = React.memo(({ startup, onClick }) => { ... });
```

### 3. Lazy Loading:
```typescript
const LazyComponent = React.lazy(() => import('./Component'));
```

---

## 🚀 Deployment

### Build للإنتاج:
```bash
npm run build
```

### Preview البناء:
```bash
npm run preview
```

### Deploy على Vercel:
```bash
vercel --prod
```

### Deploy على Netlify:
```bash
netlify deploy --prod
```

---

## 🔐 Best Practices

### 1. Type Safety:
```typescript
// ✅ استخدم الأنواع دائماً
interface Startup { ... }

// ❌ تجنب any
const data: any = ...;
```

### 2. Error Handling:
```typescript
try {
  // code
} catch (err) {
  console.error(err);
  setError('رسالة خطأ واضحة');
}
```

### 3. Code Organization:
```typescript
// ✅ فصل المنطق عن العرض
const useStartupFilters = () => { ... };

// ✅ مكونات صغيرة ومركزة
const FilterSection = ({ ... }) => { ... };
```

---

## 📝 Coding Standards

### Naming Conventions:
- **Components**: PascalCase (e.g., `StartupCard`)
- **Functions**: camelCase (e.g., `fetchData`)
- **Constants**: UPPER_CASE (e.g., `API_URL`)
- **Interfaces**: PascalCase with 'I' prefix optional (e.g., `Startup`)

### File Structure:
```typescript
// 1. Imports
import React from 'react';

// 2. Types/Interfaces
interface Props { ... }

// 3. Constants
const API_URL = '...';

// 4. Component
export default function Component() { ... }

// 5. Helper Functions
function helperFunction() { ... }
```

---

## 🐛 Common Issues & Solutions

### Issue: "Module not found"
**Solution**: 
```bash
npm install
```

### Issue: "Type error in TypeScript"
**Solution**: تحقق من `tsconfig.json` والأنواع

### Issue: "Vite build fails"
**Solution**: 
```bash
rm -rf node_modules
npm install
npm run build
```

---

## 📚 Resources للمطورين

- [React Hooks Guide](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

**Happy Coding! 🎉**
