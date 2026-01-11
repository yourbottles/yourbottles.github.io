// ============================================
// CONFIGURATION
// ============================================

const EMAILJS_CONFIG = {
    SERVICE_ID: "YourBottleapp",
    TEMPLATE_ID: "template_xtkxr3h",
    PUBLIC_KEY: "WwjEVbDtQjkRZqBWq",
    YOUR_EMAIL: "yourbottleindia@gmail.com"
};

const THEMES = [
    {
        id: "theme1",
        name: "Premium Gold Labels",
        tag: "Premium",
        description: "Gold foil labels with elegant design.",
        features: ["Gold foil finishing", "Water-resistant", "Premium adhesive"],
        color: "#D4AF37",
        previewColor: "linear-gradient(135deg, #D4AF37, #B8860B)",
        image: "theme1.jpg"
    },
    {
        id: "theme2",
        name: "Eco-Friendly Labels",
        tag: "Premium",
        description: "Biodegradable labels from recycled materials.",
        features: ["Recycled materials", "Biodegradable", "Eco-friendly ink"],
        color: "#48BB78",
        previewColor: "linear-gradient(135deg, #48BB78, #38A169)",
        image: "theme2.jpg"
    },
    {
        id: "theme3",
        name: "Transparent Clear Labels",
        tag: "Premium",
        description: "Crystal clear labels for any packaging.",
        features: ["100% transparent", "UV resistant", "Scratch-proof"],
        color: "#4299E1",
        previewColor: "linear-gradient(135deg, #4299E1, #3182CE)",
        image: "theme3.jpg"
    },
    {
        id: "theme4",
        name: "Metallic Silver Labels",
        tag: "Premium",
        description: "Silver metallic for tech products.",
        features: ["Metallic finish", "Industrial grade", "Weather resistant"],
        color: "#A0AEC0",
        previewColor: "linear-gradient(135deg, #A0AEC0, #718096)",
        image: "theme4.jpg"
    },
    {
        id: "theme5",
        name: "Colorful Print Labels",
        tag: "Premium",
        description: "Full-color printed vibrant graphics.",
        features: ["Full-color printing", "High-resolution", "Food-safe"],
        color: "#ED8936",
        previewColor: "linear-gradient(135deg, #ED8936, #9F7AEA, #4299E1)",
        image: "theme5.jpg"
    },
    {
        id: "theme6",
        name: "Waterproof Industrial Labels",
        tag: "Premium",
        description: "Heavy-duty waterproof for outdoor use.",
        features: ["100% waterproof", "Chemical resistant", "High temperature"],
        color: "#2D3748",
        previewColor: "linear-gradient(135deg, #2D3748, #1A202C)",
        image: "theme6.jpg"
    }
];

// ============================================
// APPLICATION STATE
// ============================================
let currentState = {
    selectedTheme: null,
    userData: null,
    isFormVisible: false,
    isPreviewOpen: false,
    availableImages: {}
};

// ============================================
// DOM ELEMENTS
// ============================================
const dom = {
    themeGrid: document.getElementById('themeGrid'),
    formModal: document.getElementById('formModal'),
    userForm: document.getElementById('userForm'),
    userName: document.getElementById('userName'),
    userPhone: document.getElementById('userPhone'),
    cancelBtn: document.getElementById('cancelBtn'),
    submitBtn: document.getElementById('submitBtn'),
    successToast: document.getElementById('successToast'),
    selectedThemePreview: document.getElementById('selectedThemePreview'),
    installButton: document.getElementById('installButton'),
    pwaToast: document.getElementById('pwaToast'),
    pwaClose: document.getElementById('pwaClose'),
    offlineIndicator: document.querySelector('.offline-indicator'),
    // Preview modal elements
    imagePreviewModal: document.getElementById('imagePreviewModal'),
    previewClose: document.getElementById('previewClose'),
    previewImage: document.getElementById('previewImage'),
    previewTitle: document.getElementById('previewTitle'),
    previewThemeName: document.getElementById('previewThemeName'),
    previewDescription: document.getElementById('previewDescription'),
    previewFeatures: document.getElementById('previewFeatures'),
    selectFromPreview: document.getElementById('selectFromPreview'),
    // Chat instructions
    chatInstructionsModal: document.getElementById('chatInstructionsModal')
};

// ============================================
// EXPORT CONFIGURATION
// ============================================
export { EMAILJS_CONFIG, THEMES, currentState, dom };
