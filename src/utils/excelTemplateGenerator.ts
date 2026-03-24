import ExcelJS from 'exceljs';
import { FALLBACK_GOVERNORATES, FALLBACK_INDUSTRIES } from '../types';

/**
 * Generates an enhanced Excel template with NATIVE dropdown lists using ExcelJS
 * This will create actual data validation that works in Excel and Google Sheets
 * 
 * @param availableIndustries - List of industries to include in dropdown
 * @param serviceProviders - List of service providers for reference
 * @param fundingEntities - List of funding entities for reference
 */
export async function generateExcelTemplate(
    availableIndustries: string[] = FALLBACK_INDUSTRIES,
    serviceProviders: string[] = [],
    fundingEntities: string[] = []
): Promise<ExcelJS.Workbook> {
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Athar Ecosystem Mapping';
    workbook.created = new Date();

    // Define dropdown options
    const dropdownOptions = {
        ceoGender: ['Male', 'Female'],
        startupType: ['Startup', 'MSME', 'Livelihood'],
        industry: availableIndustries.length > 0 ? availableIndustries : FALLBACK_INDUSTRIES,
        governorate: FALLBACK_GOVERNORATES,
        legalStatus: ['Sole Proprietorship', 'Partnership', 'LLC', 'Not Registered'],
        profitability: ['Profitable', 'Breaking Even', 'Loss-making', 'Pre-revenue'],
        dedicatedPlace: ['Yes', 'No'],
        workplaceType: ['Own', 'Rent', 'online'],
        openClosed: ['Open', 'Closed'],
        serviceProvider: serviceProviders.length > 0 ? [...serviceProviders, 'Other'] : ['Athar Accelerator', 'Other'],
    };

    // ============================================
    // SHEET 1: Startup Data (Main Sheet)
    // ============================================
    const mainSheet = workbook.addWorksheet('Startup Data', {
        views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }] // Freeze header row
    });

    // Define columns with headers
    const columns = [
        { header: 'Startup Name', key: 'startupName', width: 25 },
        { header: 'CEO Name', key: 'ceoName', width: 20 },
        { header: 'Phone / Whatsapp', key: 'phone', width: 20 },
        { header: 'Telegram', key: 'telegram', width: 20 },
        { header: 'Email', key: 'email', width: 25 },
        { header: 'Industry', key: 'industry', width: 20 },
        { header: 'Governerate', key: 'governorate', width: 18 },
        { header: 'Revenue (Total) (Yearly)', key: 'revenue', width: 22 },
        { header: 'profitability', key: 'profitability', width: 18 },
        { header: 'CEO Gender', key: 'ceoGender', width: 15 },
        { header: 'Description', key: 'description', width: 40 },
        { header: 'Startup type', key: 'startupType', width: 18 },
        { header: 'Website', key: 'website', width: 30 },
        { header: 'App Link', key: 'appLink', width: 30 },
        { header: 'Facebook', key: 'facebook', width: 30 },
        { header: 'Instagram', key: 'instagram', width: 30 },
        { header: 'TikTok', key: 'tiktok', width: 30 },
        { header: 'Open/Closed', key: 'openClosed', width: 15 },
        { header: 'Date of company stabilished', key: 'foundingDate', width: 20 },
        { header: 'Legal Status', key: 'legalStatus', width: 20 },
        { header: 'Founding team size', key: 'teamSize', width: 18 },
        { header: 'Female founders', key: 'femaleFounders', width: 18 },
        { header: 'male founders', key: 'maleFounders', width: 18 },
        { header: 'Freelancers', key: 'freelancers', width: 15 },
        { header: 'Employees', key: 'employees', width: 15 },
        { header: 'Do you have a dedicated place', key: 'dedicatedPlace', width: 28 },
        { header: 'own or rent a workplace', key: 'workplaceType', width: 22 },
        { header: 'Last Fundind Date', key: 'lastFundingDate', width: 20 },
        { header: 'What is the Funding entity name?', key: 'fundingEntity', width: 30 },
        { header: 'Funding raised', key: 'fundingRaised', width: 20 },
        { header: 'How much is your monthly income from the project?', key: 'monthlyIncome', width: 35 },
        { header: 'Service Provider', key: 'serviceProvider', width: 25 },
        { header: 'Company logo', key: 'logo', width: 30 }
    ];

    mainSheet.columns = columns;

    // Style header row
    mainSheet.getRow(1).font = { bold: true, size: 11 };
    mainSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' }
    };
    mainSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    mainSheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
    mainSheet.getRow(1).height = 25;

    // Add example row
    mainSheet.addRow({
        startupName: 'Example Startup',
        ceoName: 'Founder Name',
        phone: '01000000000',
        telegram: '01000000000',
        email: 'info@example.com',
        industry: 'IT',
        governorate: 'Cairo',
        revenue: 500000,
        profitability: 'Profitable',
        ceoGender: 'Male',
        description: 'High-tech software solutions for businesses.',
        startupType: 'Startup',
        website: 'https://example.com',
        appLink: 'https://app.example.com',
        facebook: 'https://facebook.com/example',
        instagram: 'https://instagram.com/example',
        tiktok: 'https://tiktok.com/@example',
        openClosed: 'Open',
        foundingDate: '2021-05-15',
        legalStatus: 'Registered',
        teamSize: 3,
        femaleFounders: 1,
        maleFounders: 2,
        freelancers: 2,
        employees: 5,
        dedicatedPlace: 'Yes',
        workplaceType: 'Office',
        lastFundingDate: '2023-10-10',
        fundingEntity: 'VC Name',
        fundingRaised: '250000',
        monthlyIncome: '45000',
        serviceProvider: 'Athar Accelerator',
        logo: 'https://example.com/logo.png'
    });

    // ============================================
    // ADD DATA VALIDATION (DROPDOWNS) - THIS IS THE MAGIC! ✨
    // ============================================

    // Apply dropdowns for rows 2-1000 (allowing plenty of room for data)
    const maxRows = 1000;

    // CEO Gender (Column J - index 10)
    for (let row = 2; row <= maxRows; row++) {
        mainSheet.getCell(`J${row}`).dataValidation = {
            type: 'list',
            allowBlank: true,
            formulae: [`"${dropdownOptions.ceoGender.join(',')}"`]
        };
    }

    // Startup Type (Column L - index 12)
    for (let row = 2; row <= maxRows; row++) {
        mainSheet.getCell(`L${row}`).dataValidation = {
            type: 'list',
            allowBlank: true,
            formulae: [`"${dropdownOptions.startupType.join(',')}"`]
        };
    }

    // Industry (Column F - index 6) - Using Options sheet reference for long lists
    for (let row = 2; row <= maxRows; row++) {
        mainSheet.getCell(`F${row}`).dataValidation = {
            type: 'list',
            allowBlank: true,
            formulae: [`Options!$A$2:$A$${dropdownOptions.industry.length + 1}`]
        };
    }

    // Governorate (Column G - index 7) - Using Options sheet reference
    for (let row = 2; row <= maxRows; row++) {
        mainSheet.getCell(`G${row}`).dataValidation = {
            type: 'list',
            allowBlank: true,
            formulae: [`Options!$B$2:$B$${dropdownOptions.governorate.length + 1}`]
        };
    }

    // Profitability (Column I - index 9)
    for (let row = 2; row <= maxRows; row++) {
        mainSheet.getCell(`I${row}`).dataValidation = {
            type: 'list',
            allowBlank: true,
            formulae: [`"${dropdownOptions.profitability.join(',')}"`]
        };
    }

    // Legal Status (Column T - index 20)
    for (let row = 2; row <= maxRows; row++) {
        mainSheet.getCell(`T${row}`).dataValidation = {
            type: 'list',
            allowBlank: true,
            formulae: [`"${dropdownOptions.legalStatus.join(',')}"`]
        };
    }

    // Dedicated Place (Column Z - index 26)
    for (let row = 2; row <= maxRows; row++) {
        mainSheet.getCell(`Z${row}`).dataValidation = {
            type: 'list',
            allowBlank: true,
            formulae: [`"${dropdownOptions.dedicatedPlace.join(',')}"`]
        };
    }

    // Workplace Type (Column AA - index 27)
    for (let row = 2; row <= maxRows; row++) {
        mainSheet.getCell(`AA${row}`).dataValidation = {
            type: 'list',
            allowBlank: true,
            formulae: [`"${dropdownOptions.workplaceType.join(',')}"`]
        };
    }

    // Open/Closed (Column R - index 18)
    for (let row = 2; row <= maxRows; row++) {
        mainSheet.getCell(`R${row}`).dataValidation = {
            type: 'list',
            allowBlank: true,
            formulae: [`"${dropdownOptions.openClosed.join(',')}"`]
        };
    }

    // Service Provider (Column AF - index 32) - Using Options sheet reference
    for (let row = 2; row <= maxRows; row++) {
        mainSheet.getCell(`AF${row}`).dataValidation = {
            type: 'list',
            allowBlank: true,
            formulae: [`Options!$C$2:$C$${dropdownOptions.serviceProvider.length + 1}`]
        };
    }

    // ============================================
    // SHEET 2: Options (Reference Data for Dropdowns)
    // ============================================
    const optionsSheet = workbook.addWorksheet('Options');

    optionsSheet.columns = [
        { header: 'Industry', key: 'industry', width: 25 },
        { header: 'Governorate', key: 'governorate', width: 20 },
        { header: 'Service Provider', key: 'serviceProvider', width: 25 },
        { header: 'Funding Entity', key: 'fundingEntity', width: 25 }
    ];

    // Style header
    optionsSheet.getRow(1).font = { bold: true };
    optionsSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE7E6E6' }
    };

    // Add data
    const maxLength = Math.max(
        dropdownOptions.industry.length,
        dropdownOptions.governorate.length,
        dropdownOptions.serviceProvider.length,
        fundingEntities.length
    );

    for (let i = 0; i < maxLength; i++) {
        optionsSheet.addRow({
            industry: dropdownOptions.industry[i] || '',
            governorate: dropdownOptions.governorate[i] || '',
            serviceProvider: dropdownOptions.serviceProvider[i] || '',
            fundingEntity: fundingEntities[i] || ''
        });
    }

    // ============================================
    // SHEET 3: Instructions
    // ============================================
    const instructionsSheet = workbook.addWorksheet('Instructions');
    instructionsSheet.columns = [{ header: 'Instructions', key: 'text', width: 80 }];

    instructionsSheet.getRow(1).font = { bold: true, size: 14 };
    instructionsSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF70AD47' }
    };
    instructionsSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    const instructions = [
        '📋 Welcome to the Enhanced Startup Data Template!',
        '',
        '✅ How to use this template:',
        '1. Fill in your startup data in the "Startup Data" sheet',
        '2. Click on cells with dropdown arrows to select from predefined options',
        '3. The example row will be automatically skipped during upload',
        '4. Required fields are marked with * in the portal',
        '',
        '🎯 Columns with NATIVE dropdown lists (just click and select):',
        '   • CEO Gender: Male or Female',
        '   • Startup Type: Startup, MSME, or Livelihood',
        '   • Industry: Select from available industries',
        '   • Governorate: Select Egyptian governorate',
        '   • Legal Status: Registration type',
        '   • Profitability: Current financial stage',
        '   • Dedicated Place: Yes or No',
        '   • Workplace Type: Own, Rent, online, or Co-working',
        '   • Open/Closed: Current operational status',
        '   • Service Provider: Select from available providers',
        '',
        '💡 Tips:',
        '   • Dates should be in YYYY-MM-DD format (e.g., 2021-05-15)',
        '   • Phone numbers should start with 01',
        '   • Email must be valid format',
        '   • Website must be a valid URL or social media link',
        '   • If no funding, write "None" in Funding raised field',
        '',
        '📊 The "Options" sheet contains all reference data for dropdowns',
        '',
        '✉️ For support, contact your service provider.',
        '',
        '🎉 This template works in both Microsoft Excel and Google Sheets!'
    ];

    instructions.forEach(text => {
        instructionsSheet.addRow({ text });
    });

    return workbook;
}

/**
 * Downloads the generated Excel template with native dropdowns
 */
export async function downloadExcelTemplate(
    availableIndustries: string[] = FALLBACK_INDUSTRIES,
    serviceProviders: string[] = [],
    fundingEntities: string[] = []
) {
    const workbook = await generateExcelTemplate(availableIndustries, serviceProviders, fundingEntities);

    // Generate buffer and trigger download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Startup_Template_Enhanced.xlsx';
    link.click();

    // Cleanup
    window.URL.revokeObjectURL(url);
}
