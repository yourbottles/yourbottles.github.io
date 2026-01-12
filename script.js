// ============================================
// CONFIGURATION
// ============================================

const EMAILJS_CONFIG = {
    SERVICE_ID: "Bluepureapp",
    TEMPLATE_ID: "template_xtkxr3h",
    PUBLIC_KEY: "WwjEVbDtQjkRZqBWq",
    YOUR_EMAIL: "yourbottleIndia@gmail.com"
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
    },
    {
        id: "theme7",
        name: "Glossy Finish Labels",
        tag: "Premium",
        description: "High-gloss labels for vibrant product presentation.",
        features: ["High-gloss finish", "Vibrant colors", "Scratch-resistant"],
        color: "#F56565",
        previewColor: "linear-gradient(135deg, #F56565, #ED8936)",
        image: "theme7.jpg"
    },
    {
        id: "theme8",
        name: "Matte Finish Labels",
        tag: "Premium",
        description: "Elegant matte labels with non-reflective surface.",
        features: ["Matte finish", "Fingerprint resistant", "Elegant look"],
        color: "#4FD1C7",
        previewColor: "linear-gradient(135deg, #4FD1C7, #38B2AC)",
        image: "theme8.jpg"
    },
    {
        id: "theme9",
        name: "Holographic Labels",
        tag: "Premium",
        description: "Holographic labels that change color with light.",
        features: ["Holographic effect", "Light-reactive", "Anti-counterfeit"],
        color: "#9F7AEA",
        previewColor: "linear-gradient(135deg, #9F7AEA, #805AD5)",
        image: "theme9.jpg"
    },
    {
        id: "theme10",
        name: "Thermal Transfer Labels",
        tag: "Premium",
        description: "Durable labels for barcode and variable printing.",
        features: ["Thermal resistant", "Barcode compatible", "Long-lasting"],
        color: "#667EEA",
        previewColor: "linear-gradient(135deg, #667EEA, #764BA2)",
        image: "theme10.jpg"
    },
    {
        id: "theme11",
        name: "Textured Labels",
        tag: "Premium",
        description: "Labels with unique textures for premium feel.",
        features: ["Embossed texture", "Tactile finish", "Premium look"],
        color: "#ED64A6",
        previewColor: "linear-gradient(135deg, #ED64A6, #D53F8C)",
        image: "theme11.jpg"
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
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize EmailJS with your credentials
    try {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        console.log('✅ EmailJS initialized with your credentials');
    } catch (error) {
        console.warn('⚠️ EmailJS initialization failed:', error);
    }

    loadUserData();
    setupEventListeners();
    updateNetworkStatus();

    // Add Chat With Us widget
    addChatWidget();

    // Check images and render themes
    checkAvailableImages();

    // Setup chat button after a delay to ensure Tidio is loaded
    setTimeout(setupChatButton, 2000);
}

// ============================================
// IMAGE OPTIMIZATION - SIMPLIFIED VERSION
// ============================================
function checkAvailableImages() {
    console.log('🔍 Checking for available theme images...');

    // Start with empty available images
    currentState.availableImages = {};

    // Create image elements to test loading
    const imagesToTest = THEMES.map(theme => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = function() {
                console.log(`✅ Image available: ${theme.image}`);
                currentState.availableImages[theme.id] = true;
                resolve(true);
            };
            img.onerror = function() {
                console.log(`❌ Image not found: ${theme.image}, using gradient`);
                currentState.availableImages[theme.id] = false;
                resolve(false);
            };
            img.src = `assets/${theme.image}`;
        });
    });

    // Wait for all image checks to complete
    Promise.allSettled(imagesToTest).then(() => {
        console.log(`📊 Image check complete. Available: ${Object.values(currentState.availableImages).filter(v => v).length}/${THEMES.length}`);
        // Render themes after checking images
        renderThemes();
    });
}

// Get theme image URL (returns gradient if image not available)
function getThemeImageUrl(theme) {
    // If image is available, return image URL
    if (currentState.availableImages[theme.id]) {
        return `url('assets/${theme.image}')`;
    }

    // Fallback to gradient
    return theme.color;
}

// ============================================
// CHAT WIDGET FUNCTIONS
// ============================================
function addChatWidget() {
    const chatWidgetHTML = `
        <section class="chat-widget-section">
            <h2 class="section-title">Need Help?</h2>
            <div class="chat-widget-card">
                <div class="chat-widget-icon">
                    <i class="fas fa-comments"></i>
                </div>
                <div class="chat-widget-content">
                    <h3>Chat With Us Instantly</h3>
                    <p>Have questions about our labels? Our team is ready to help you.</p>
                    <div class="chat-features">
                        <div class="chat-feature">
                            <i class="fas fa-bolt"></i>
                            <span>Instant Response</span>
                        </div>
                        <div class="chat-feature">
                            <i class="fas fa-expert"></i>
                            <span>Expert Advice</span>
                        </div>
                        <div class="chat-feature">
                            <i class="fas fa-quote"></i>
                            <span>Free Quotes</span>
                        </div>
                    </div>
                    
                    <!-- Single Chat Button for all devices -->
                    <button class="chat-widget-button" id="openTidioChat">
                        <i class="fas fa-comment-dots"></i>
                        Start Chat Now
                    </button>
                </div>
            </div>
        </section>
    `;

    // Insert before footer (after business info section)
    const footer = document.querySelector('.footer');
    if (footer) {
        footer.insertAdjacentHTML('beforebegin', chatWidgetHTML);
    }
}

// Main function to open Tidio chat
function openTidioChat() {
    console.log('Opening Tidio chat...');

    // Method 1: Direct Tidio API
    if (window.tidioChatApi) {
        window.tidioChatApi.open();
        return true;
    }

    // Method 2: Look for Tidio button and click it
    const selectors = [
        '#button button',
        '.tidio-chat',
        '[data-testid="widgetButton"]',
        '[id*="tidio"]',
        '[class*="tidio"]'
    ];

    for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
            element.click();
            return true;
        }
    }

    // Method 3: Show instructions
    showChatInstructions();
    return false;
}

// Show chat instructions modal
function showChatInstructions() {
    if (dom.chatInstructionsModal) {
        dom.chatInstructionsModal.classList.add('active');
    }
}

// Setup chat button event listener
function setupChatButton() {
    const chatBtn = document.getElementById('openTidioChat');
    if (chatBtn) {
        chatBtn.addEventListener('click', function(e) {
            e.preventDefault();

            // Try to open chat
            if (!openTidioChat()) {
                // If not opened, show instructions
                setTimeout(showChatInstructions, 300);
            }
        });
    }
}

// ============================================
// THEME RENDERING WITH IMAGE SUPPORT
// ============================================
function renderThemes() {
    if (!dom.themeGrid) return;

    dom.themeGrid.innerHTML = '';

    THEMES.forEach(theme => {
        const themeCard = createThemeCard(theme);
        dom.themeGrid.appendChild(themeCard);
    });
}

function createThemeCard(theme) {
    const card = document.createElement('div');
    card.className = 'theme-card no-select';
    card.setAttribute('data-theme-id', theme.id);

    // Check if image is available
    const hasImage = currentState.availableImages[theme.id];
    const backgroundStyle = hasImage ? 
        `url('assets/${theme.image}')` : 
        theme.color;

    card.innerHTML = `
        <div class="theme-image" style="
            background: ${backgroundStyle};
            ${hasImage ? 'background-size: cover; background-position: center;' : ''}
        ">
            <div class="theme-badge">${theme.tag}</div>
        </div>
        <div class="theme-content">
            <div class="theme-name">
                <span>${theme.name}</span>
            </div>
            <p class="theme-desc">${theme.description}</p>
            <ul class="theme-features">
                ${theme.features.map(feature => `
                    <li><i class="fas fa-check"></i> ${feature}</li>
                `).join('')}
            </ul>
            <div class="theme-buttons">
                <button class="preview-btn-small" data-theme-id="${theme.id}">
                    <i class="fas fa-eye"></i>
                    Preview
                </button>
                <button class="btn-choose" data-theme-id="${theme.id}">
                    <i class="fas fa-tags"></i>
                    Select
                </button>
            </div>
        </div>
    `;

    return card;
}

// ============================================
// PREVIEW MODAL FUNCTIONS
// ============================================
function openImagePreview(theme) {
    if (!theme || !dom.imagePreviewModal) return;

    currentState.selectedTheme = theme;
    currentState.isPreviewOpen = true;

    // Update preview content with normal text size
    dom.previewTitle.textContent = `${theme.name} Preview`;
    dom.previewTitle.style.fontSize = '';
    dom.previewTitle.style.marginBottom = '';
    
    dom.previewThemeName.textContent = theme.name;
    dom.previewThemeName.style.fontSize = '';
    dom.previewThemeName.style.color = '';
    dom.previewThemeName.style.marginBottom = '';
    
    dom.previewDescription.textContent = theme.description;
    dom.previewDescription.style.fontSize = '';
    dom.previewDescription.style.color = '';
    dom.previewDescription.style.marginBottom = '';

    // Check if image is available
    const hasImage = currentState.availableImages[theme.id];

    if (hasImage) {
        const tempImg = new Image();
        tempImg.onload = function() {
            const naturalWidth = this.naturalWidth;
            const naturalHeight = this.naturalHeight;
            
            console.log(`📐 Image dimensions: ${naturalWidth}x${naturalHeight}`);
            
            // Calculate maximum viewport dimensions we can use (90% of viewport)
            const maxViewportHeight = window.innerHeight * 0.90;
            const maxViewportWidth = window.innerWidth * 0.90;
            
            // Start with original 411x1600 target
            const targetWidth = 411;
            const targetHeight = 1600;
            
            // If image is different size, use actual dimensions
            const displayWidth = naturalWidth;
            const displayHeight = naturalHeight;
            
            // Calculate scale to fit viewport
            let scale = 1;
            
            // Scale based on height (tall images)
            if (displayHeight > maxViewportHeight) {
                scale = maxViewportHeight / displayHeight;
            }
            
            // Also check width
            const scaledWidth = displayWidth * scale;
            if (scaledWidth > maxViewportWidth) {
                scale = maxViewportWidth / displayWidth;
            }
            
            // Apply minimum scale to ensure good visibility
            const minScale = 0.7; // Minimum 70% of original
            if (scale < minScale) {
                scale = minScale;
            }
            
            // Apply maximum scale if image is small
            const maxScale = 2.0; // Maximum 200% of original
            if (scale > maxScale) {
                scale = maxScale;
            }
            
            // Calculate final display dimensions
            const finalWidth = displayWidth * scale;
            const finalHeight = displayHeight * scale;
            
            console.log(`📏 Display at: ${finalWidth}x${finalHeight} (scale: ${scale.toFixed(2)})`);
            
            // Add generous padding around the image (40px on all sides)
            const containerWidth = finalWidth + 80; // 40px left + 40px right
            const containerHeight = finalHeight + 80; // 40px top + 40px bottom
            
            // Create preview container with LARGE image and generous padding
            dom.previewImage.innerHTML = `
                <div style="
                    width: ${containerWidth}px;
                    min-width: ${containerWidth}px;
                    height: ${containerHeight}px;
                    min-height: ${containerHeight}px;
                    margin: 10px auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: transparent;
                    border-radius: 20px;
                    overflow: visible;
                    padding: 40px;
                    position: relative;
                ">
                    <div style="
                        width: ${finalWidth}px;
                        height: ${finalHeight}px;
                        position: relative;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 15px;
                        overflow: hidden;
                        box-shadow: 0 15px 50px rgba(0,0,0,0.25);
                        border: 3px solid #ffffff;
                        background: white;
                    ">
                        <img src="assets/${theme.image}" 
                             style="
                                width: 100%;
                                height: 100%;
                                object-fit: contain;
                                display: block;
                             "
                             alt="${theme.name}">
                    </div>
                </div>
            `;
            
            // Reset styles for other elements
            dom.previewFeatures.style.fontSize = '';
            dom.previewFeatures.style.padding = '';
            dom.selectFromPreview.style.fontSize = '';
            dom.selectFromPreview.style.padding = '';
        };
        
        tempImg.onerror = function() {
            console.log(`❌ Failed to load image: ${theme.image}`);
            showFallbackPreview(theme);
        };
        
        tempImg.src = `assets/${theme.image}`;
        
        // Show large loading state
        dom.previewImage.innerHTML = `
            <div style="
                width: 500px;
                height: 800px;
                margin: 10px auto;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: #f5f7fa;
                border-radius: 20px;
                gap: 25px;
                border: 3px dashed #3A8DFF;
                padding: 40px;
            ">
                <div style="
                    color: #3A8DFF;
                    font-size: 4rem;
                    animation: spin 1s linear infinite;
                ">
                    <i class="fas fa-spinner"></i>
                </div>
                <p style="
                    margin: 0;
                    color: #3A8DFF;
                    font-size: 1.3rem;
                    font-weight: 600;
                    text-align: center;
                ">
                    Loading your label design<br>
                    <span style="font-size: 1rem; color: #666; font-weight: normal;">
                        411 × 1600 pixels
                    </span>
                </p>
            </div>
        `;
        
        // Add spin animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
    } else {
        console.log(`📭 Image not available: ${theme.image}`);
        showFallbackPreview(theme);
    }

    // Update features with normal styling
    dom.previewFeatures.innerHTML = '';
    theme.features.forEach(feature => {
        const featureEl = document.createElement('span');
        featureEl.className = 'preview-feature';
        featureEl.style.fontSize = '';
        featureEl.style.padding = '';
        featureEl.style.margin = '';
        featureEl.textContent = feature;
        dom.previewFeatures.appendChild(featureEl);
    });

    // Show preview modal
    dom.imagePreviewModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function showFallbackPreview(theme) {
    // Create a fallback at 411x1600 ratio
    const targetWidth = 411;
    const targetHeight = 1600;
    
    // Scale for viewport (90% max)
    const maxViewportHeight = window.innerHeight * 0.90;
    let scale = maxViewportHeight / targetHeight;
    
    // Ensure good scale range
    if (scale < 0.7) scale = 0.7;
    if (scale > 2.0) scale = 2.0;
    
    const displayWidth = targetWidth * scale;
    const displayHeight = targetHeight * scale;
    
    // Add padding
    const containerWidth = displayWidth + 80;
    const containerHeight = displayHeight + 80;
    
    dom.previewImage.innerHTML = `
        <div style="
            width: ${containerWidth}px;
            min-width: ${containerWidth}px;
            height: ${containerHeight}px;
            min-height: ${containerHeight}px;
            margin: 10px auto;
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            border-radius: 20px;
            padding: 40px;
        ">
            <div style="
                width: ${displayWidth}px;
                height: ${displayHeight}px;
                background: ${theme.previewColor};
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.6rem;
                font-weight: bold;
                text-shadow: 2px 2px 10px rgba(0,0,0,0.6);
                border-radius: 15px;
                box-shadow: 0 15px 50px rgba(0,0,0,0.25);
                border: 3px solid rgba(255,255,255,0.3);
                text-align: center;
                padding: 20px;
            ">
                <div>
                    ${theme.name}<br>
                    <span style="font-size: 1rem; opacity: 0.9;">
                        411 × 1600 Label Preview
                    </span>
                </div>
            </div>
        </div>
    `;
}

function closeImagePreview() {
    currentState.isPreviewOpen = false;
    dom.imagePreviewModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ============================================
// FORM MANAGEMENT
// ============================================
function showForm(theme) {
    currentState.selectedTheme = theme;
    currentState.isFormVisible = true;

    if (dom.selectedThemePreview) {
        dom.selectedThemePreview.innerHTML = `
            <h4>Selected: ${theme.name}</h4>
            <p>You've selected "${theme.name}" labels. Share your details for a custom quote.</p>
        `;
    }

    if (dom.formModal) {
        dom.formModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    if (!currentState.userData && dom.userForm) {
        dom.userForm.reset();
    }

    if (dom.userPhone) {
        dom.userPhone.value = '+91 ';
        dom.userPhone.setSelectionRange(4, 4);
    }

    setTimeout(() => {
        if (dom.userName) dom.userName.focus();
    }, 300);
}

function hideForm() {
    currentState.isFormVisible = false;
    if (dom.formModal) {
        dom.formModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}
// ============================================
// EVENT HANDLERS
// ============================================
function setupEventListeners() {
    // Theme selection (Select button)
    document.addEventListener('click', function(e) {
        const chooseBtn = e.target.closest('.btn-choose');
        if (chooseBtn) {
            e.preventDefault();
            e.stopPropagation();

            const themeId = chooseBtn.getAttribute('data-theme-id');
            const theme = THEMES.find(t => t.id === themeId);

            if (theme) {
                handleThemeSelection(theme, false);
            }
        }
    });

    // Preview button click
    document.addEventListener('click', function(e) {
        const previewBtn = e.target.closest('.preview-btn-small');
        if (previewBtn) {
            e.preventDefault();
            e.stopPropagation();

            const themeId = previewBtn.getAttribute('data-theme-id');
            const theme = THEMES.find(t => t.id === themeId);
            if (theme) {
                openImagePreview(theme);
            }
        }
    });

    // Select from preview button
    if (dom.selectFromPreview) {
        dom.selectFromPreview.addEventListener('click', function(e) {
            e.preventDefault();
            if (currentState.selectedTheme) {
                closeImagePreview();
                handleThemeSelection(currentState.selectedTheme, true);
            }
        });
    }

    // Close preview modal
    if (dom.previewClose) {
        dom.previewClose.addEventListener('click', closeImagePreview);
    }

    // Close preview on outside click
    dom.imagePreviewModal.addEventListener('click', function(e) {
        if (e.target === dom.imagePreviewModal) {
            closeImagePreview();
        }
    });

    // Escape key to close preview
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && currentState.isPreviewOpen) {
            closeImagePreview();
        }
        if (e.key === 'Escape' && currentState.isFormVisible) {
            hideForm();
        }
    });

    // Existing form and phone event listeners
    setupFormEventListeners();
    setupPhoneFormatting();
}

// ============================================
// THEME SELECTION HANDLER
// ============================================
function handleThemeSelection(theme, fromPreview) {
    if (currentState.userData) {
        // Returning user - send email notification
        const userData = {
            ...currentState.userData,
            selectedLabel: theme.name,
            labelId: theme.id,
            lastSelection: new Date().toISOString(),
            isReturning: true,
            previousTheme: currentState.userData.selectedLabel || 'None',
            selectedFromPreview: fromPreview
        };

        saveUserData(userData);
        sendNotification(userData, theme);

        if (fromPreview) {
            showToast(`Selected ${theme.name} from preview!`);
        } else {
            showToast(`Updated to ${theme.name}!`);
        }

    } else {
        // New user
        showForm(theme);
    }
}

// ============================================
// PHONE FORMATTING FUNCTIONS
// ============================================
function formatIndianPhoneNumber(input) {
    let numbers = input.replace(/\D/g, '');

    if (numbers.startsWith('91')) {
        numbers = numbers.substring(2);
    }

    numbers = numbers.substring(0, 10);

    let formatted = '+91';
    if (numbers.length > 0) {
        formatted += ' ' + numbers.substring(0, 5);
    }
    if (numbers.length > 5) {
        formatted += ' ' + numbers.substring(5, 10);
    }

    return formatted;
}

function validateIndianPhone(phone) {
    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.length !== 12) return false;
    if (!cleanPhone.startsWith('91')) return false;

    const subscriberNumber = cleanPhone.substring(2);
    const validStart = ['6', '7', '8', '9'];
    return validStart.includes(subscriberNumber.charAt(0));
}

// ============================================
// EMAIL NOTIFICATION SYSTEM
// ============================================
async function sendNotification(userData, theme) {
    console.log('📨 Sending label quote request...');

    try {
        const templateParams = {
            to_email: EMAILJS_CONFIG.YOUR_EMAIL,
            user_name: userData.name,
            user_phone: userData.phone,
            label_type: theme.name,
            label_id: theme.id,
            timestamp: new Date().toLocaleString('en-IN', { 
                timeZone: 'Asia/Kolkata',
                dateStyle: 'full',
                timeStyle: 'short' 
            }),
            user_id: userData.id || 'N/A',
            business_name: "BluePure Labels Inquiry",
            user_type: userData.isReturning ? 'Returning Customer' : 'New Customer',
            previous_theme: userData.previousTheme || 'First Selection',
            selected_from_preview: userData.selectedFromPreview ? 'Yes' : 'No'
        };

        const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            templateParams
        );

        console.log('✅ Email sent successfully');
        return true;

    } catch (error) {
        console.error('❌ EmailJS error:', error);
        saveLocalNotification(userData, theme);
        return false;
    }
}

function saveLocalNotification(userData, theme) {
    const notification = {
        id: Date.now(),
        userData,
        theme,
        timestamp: new Date().toISOString(),
        synced: false
    };

    const savedNotifications = JSON.parse(localStorage.getItem('bluepure_notifications') || '[]');
    savedNotifications.push(notification);
    localStorage.setItem('bluepure_notifications', JSON.stringify(savedNotifications));

    console.log('📝 Notification saved locally:', notification);
}

// ============================================
// LOCALSTORAGE MANAGEMENT
// ============================================
function loadUserData() {
    const savedData = localStorage.getItem('bluepure_user');
    if (savedData) {
        try {
            currentState.userData = JSON.parse(savedData);
            console.log('👤 Returning user loaded');
        } catch (e) {
            console.error('Error parsing saved data:', e);
            localStorage.removeItem('bluepure_user');
        }
    }
}

function saveUserData(userData) {
    const dataToSave = {
        ...userData,
        lastUpdated: new Date().toISOString(),
        location: "India"
    };

    localStorage.setItem('bluepure_user', JSON.stringify(dataToSave));
    currentState.userData = dataToSave;
    console.log('💾 User data saved');
}

// ============================================
// FORM EVENT LISTENERS
// ============================================
function setupFormEventListeners() {
    if (dom.userForm) {
        dom.userForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const name = dom.userName?.value.trim() || '';
            const phone = dom.userPhone?.value.trim() || '';

            // Validation
            if (name.length < 2) {
                alert('Please enter your full name (minimum 2 characters)');
                return;
            }

            if (!validateIndianPhone(phone)) {
                alert('Please enter a valid Indian phone number (10 digits after +91)\nExample: +91 12345 67890');
                return;
            }

            // Create user data
            const userData = {
                id: 'bluepure_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
                name: name,
                phone: phone,
                selectedLabel: currentState.selectedTheme.name,
                labelId: currentState.selectedTheme.id,
                inquiryDate: new Date().toISOString(),
                source: 'BluePure Website',
                selectedFromPreview: false
            };

            // Button loading state
            const originalText = dom.submitBtn?.innerHTML || '';
            if (dom.submitBtn) {
                dom.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
                dom.submitBtn.disabled = true;
            }

            try {
                // Save user data
                saveUserData(userData);

                // Send notification
                const notificationSent = await sendNotification(userData, currentState.selectedTheme);

                // Hide form
                hideForm();

                // Show success message
                if (notificationSent) {
                    showToast(`Thank you ${name}! We'll contact you soon.`);
                } else {
                    showToast(`Request saved! We'll contact you at ${phone}.`);
                }

                // Mobile vibration feedback
                if (navigator.vibrate) {
                    navigator.vibrate(100);
                }

            } catch (error) {
                console.error('Submission error:', error);
                showToast('Something went wrong. Please try again.', 5000);

                // Fallback: Save locally
                saveLocalNotification(userData, currentState.selectedTheme);
                showToast('Saved offline. We\'ll contact you when back online.', 4000);
                hideForm();

            } finally {
                // Restore button
                if (dom.submitBtn) {
                    dom.submitBtn.innerHTML = originalText;
                    dom.submitBtn.disabled = false;
                }
            }
        });
    }

    // Cancel button
    if (dom.cancelBtn) {
        dom.cancelBtn.addEventListener('click', function(e) {
            e.preventDefault();
            hideForm();
        });
    }

    // Close modal on outside click
    if (dom.formModal) {
        dom.formModal.addEventListener('click', function(e) {
            if (e.target === dom.formModal) {
                hideForm();
            }
        });
    }
}

// ============================================
// PHONE FORMATTING EVENT LISTENERS
// ============================================
function setupPhoneFormatting() {
    if (!dom.userPhone) return;

    // Format on input
    dom.userPhone.addEventListener('input', function(e) {
        const cursorPosition = e.target.selectionStart;
        const oldValue = e.target.value;
        const newValue = formatIndianPhoneNumber(oldValue);

        e.target.value = newValue;

        // Maintain cursor position
        const diff = newValue.length - oldValue.length;
        e.target.setSelectionRange(cursorPosition + diff, cursorPosition + diff);
    });

    // Prevent deleting +91
    dom.userPhone.addEventListener('keydown', function(e) {
        const cursorPosition = e.target.selectionStart;

        // If trying to delete +91 or characters before it
        if ((e.key === 'Backspace' || e.key === 'Delete') && cursorPosition <= 4) {
            e.preventDefault();
            return false;
        }

        // Prevent typing non-digits after +91
        if (cursorPosition > 3 && !/\d/.test(e.key) && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            return false;
        }
    });

    // Ensure +91 stays when field loses focus
    dom.userPhone.addEventListener('blur', function(e) {
        if (e.target.value && !e.target.value.startsWith('+91')) {
            e.target.value = formatIndianPhoneNumber(e.target.value);
        }
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function showToast(message, duration = 4000) {
    if (!dom.successToast) return;

    const toastContent = dom.successToast.querySelector('.toast-content h4');
    if (toastContent) {
        toastContent.textContent = message;
    }

    dom.successToast.style.display = 'flex';
    dom.successToast.style.animation = 'slideInRight 0.5s ease';

    // Auto hide
    setTimeout(() => {
        dom.successToast.style.animation = 'slideOutRight 0.5s ease forwards';
        setTimeout(() => {
            dom.successToast.style.display = 'none';
            dom.successToast.style.animation = '';
        }, 500);
    }, duration);
}

// ============================================
// NETWORK STATUS
// ============================================
function updateNetworkStatus() {
    if (!navigator.onLine) {
        showOfflineIndicator();
    }
}

function showOfflineIndicator() {
    if (dom.offlineIndicator) {
        dom.offlineIndicator.style.display = 'flex';
    }
}

function hideOfflineIndicator() {
    if (dom.offlineIndicator) {
        dom.offlineIndicator.style.display = 'none';
    }
}

window.addEventListener('online', () => {
    hideOfflineIndicator();
    showToast('Back online!', 2000);
});

window.addEventListener('offline', () => {
    showOfflineIndicator();