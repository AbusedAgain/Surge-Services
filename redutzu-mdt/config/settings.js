var CONFIG = {
    CONSTANTS: { // Don't change these unless you know what you're doing
        FLAGS_API: 'https://www.countryflagicons.com/FLAT/32',
        MAP_API: 'https://www.gtamap.xyz/mapStyles/styleAtlas/{z}/{x}/{y}.jpg',
        CODE_FORMAT: {
            LABEL: 'd-ddd', // This is the format that will be displayed in the UI
            MASK: '#-###', // This should be the same as the LABEL but with # instead of d
            REGEX: /^\d-\d\d\d$/i // This is the regex that will be used to validate the input
        }
    },
    SETTINGS: {
        MAX_RESULTS: 30, // I suggest you don't go over 100
        MAX_SELECTED: 5, // Doesn't really matter if you set this to a higher number
        MAX_FORM_RESULTS: 5, // This will limit the amount of results in a input field
        FEATURES: {
            ALERTS: {
                ENABLED: true, // Enable alerts notifications
                WHILE_CLOSED: true // Show alerts while the UI is closed
            },
            TRANSPARENCY: { // This features allows you to make the UI transparent
                ENABLED: true, // Enable transparency
                KEY: 'F4', // Key to toggle transparency
                VALUE: 0.5 // How transparent the UI should be
            }
        }
    },
    DEFAULT_LOCALE: 'lt-LT', // en-US, fr-FR, de-DE, es-ES, it-IT, pt-PT, ru-RU, tr-TR, pl-PL, sr-RS, da-DK, af-ZA, ro-RO, lt-LT, el-GR, lb-LU, et-EE, fi-FI, sv-SE, zh-CN, bg-BG, hu-HU
    CURRENCY: 'EUR', // USD, GBP, EUR
    PAGES: [
        { id: '/', icon: 'fa-solid fa-table-cells-large', label: 'dashboard', disabled: false },
        { id: '/incidents', icon: 'fa-solid fa-shield-halved', label: 'incidents', disabled: false },
        { id: '/evidences', icon: 'fa-solid fa-folder-open', label: 'evidences', disabled: false },
        { id: '/warrants', icon: 'fa-solid fa-folder-minus', label: 'warrants', disabled: false },
        { id: '/officers', icon: 'fa-solid fa-users', label: 'officers', disabled: false },
        { id: '/bolos', icon: 'fa-solid fa-flag', label: 'bolos', disabled: false },
        { id: '/alerts', icon: 'fa-solid fa-mobile-screen', label: 'alerts', disabled: false },
        { id: '/citizens', icon: 'fa-solid fa-address-card', label: 'citizens', disabled: false },
        { id: '/vehicles', icon: 'fa-solid fa-car', label: 'vehicles', disabled: false },
        { id: '/houses', icon: 'fa-solid fa-house-chimney', label: 'houses', disabled: false },
        { id: '/fines', icon: 'fa-solid fa-money-bills', label: 'fines', disabled: false },
        { id: '/codes', icon: 'fa-solid fa-clipboard-list', label: 'codes', disabled: false },
        { id: '/charges', icon: 'fa-solid fa-user-ninja', label: 'charges', disabled: false },
        { id: '/announcements', icon: 'fa-solid fa-bullhorn', label: 'announcements', disabled: false },
        { id: '/config', icon: 'fa-solid fa-cogs', label: 'config', disabled: false }
    ],
    LANGUAGES: [
        { value: 'en-US', label: 'English' },
        { value: 'lt-LT', label: 'Lithuanian' },
        { value: 'de-DE', label: 'German' },
        { value: 'es-ES', label: 'Spanish' },
        { value: 'it-IT', label: 'Italian' },
        { value: 'pt-PT', label: 'Portuguese' },
        { value: 'ru-RU', label: 'Russian' },
        { value: 'tr-TR', label: 'Turkish' },
        { value: 'pl-PL', label: 'Polish' },
        { value: 'sr-RS', label: 'Serbian' },
        { value: 'da-DK', label: 'Danish' },
        { value: 'af-ZA', label: 'Afrikaans' },
        { value: 'ro-RO', label: 'Romanian' },
        { value: 'el-GR', label: 'Greek' },
        { value: 'lb-LU', label: 'Luxembourgish' },
        { value: 'et-EE', label: 'Estonian' },
        { value: 'fi-FI', label: 'Finnish' },
        { value: 'sv-SE', label: 'Swedish' },
        { value: 'zh-CN', label: 'Chinese' },
        { value: 'bg-BG', label: 'Bulgarian' },
        { value: 'hu-HU', label: 'Hungarian' }
    ],
    COLORS: {
        main: '20, 21, 33',
        secondary: '24, 25, 43',
        third: '29, 30, 52',
        highlight: '40, 42, 67',
        contrast: '27, 129, 255',
        text: '110, 114, 142'
    }
};
