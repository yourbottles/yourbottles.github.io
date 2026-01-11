// ============================================
// CORE APPLICATION FUNCTIONALITY
// ============================================
import { EMAILJS_CONFIG, THEMES, currentState, dom } from './config.js';
import {
    formatIndianPhoneNumber,
    validateIndianPhone,
    loadUserData,
    saveUserData,
    saveLocalNotification,
    checkAvailableImages,
    getThemeImageUrl,
    showToast,
    updateNetworkStatus,
    showOfflineIndicator,
    hideOfflineIndicator
} from './utils.js';

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    // Initialize EmailJS with your credentials
    try {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        console.log('✅ EmailJS initialized with your credentials');
    } catch (error) {
        console.warn('⚠️ EmailJS initialization failed:', error);
    }

    // Load user data
    currentState.userData = loadUserData();

    // Setup event listeners
    setupEventListeners();

    // Update network status
    updateNetworkStatus();

    // Check images and render themes
    currentState.availableImages = await checkAvailableImages(THEMES);

    // Render themes
    renderThemes();

    // Setup chat button after a delay to ensure Tidio is loaded
    setTimeout(setupChatButton, 2000);

    // Startup log
    console.log(`
%c===================================================
       YOURBOTTLE - CUSTOM LABELS PRODUCER
===================================================
📍 Location: Dubey Colony Padawa, Khandwa MP India
📧 Email: yourbottleindia@gmail.com
📞 Phone: +91 6261491292
⭐ Rating: 9.3/10 Client Satisfaction
🚀 Version: 2.3.0 (Simplified Image Loading)
===================================================
`,
'color: #3A8DFF; font-weight: bold;'
    );
}

// ============================================
// THEME RENDERING
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

    // Update preview content
    dom.previewTitle.textContent = `${theme.name} Preview`;
    dom.previewThemeName.textContent = theme.name;
    dom.previewDescription.textContent = theme.description;

    // Check if image is available
    const hasImage = currentState.availableImages[theme.id];

    // Set preview image
    dom.previewImage.innerHTML = `
        <div class="preview-image-content" style="
            background: ${hasImage ? `url('assets/${theme.image}')` : theme.previewColor};
            ${hasImage ? 'background-size: cover; background-position: center;' : ''}
            width: 100%;
            padding-top: 133.33%;
            position: relative;
        ">
            ${!hasImage ? `
            <div style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.2rem;
                font-weight: bold;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            ">
                ${theme.name}
            </div>
            ` : ''}
        </div>
    `;

    // Update features
    dom.previewFeatures.innerHTML = '';
    theme.features.forEach(feature => {
        const featureEl = document.createElement('span');
        featureEl.className = 'preview-feature';
        featureEl.textContent = feature;
        dom.previewFeatures.appendChild(featureEl);
    });

    // Show preview modal
    dom.imagePreviewModal.classList.add('active');
    document.body.style.overflow = 'hidden';
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

        currentState.userData = saveUserData(userData);
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
            business_name: "YourBottle Labels Inquiry",
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
// FORM SUBMISSION
// ============================================
async function handleFormSubmit(e) {
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
        id: 'yourbottle_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        name: name,
        phone: phone,
        selectedLabel: currentState.selectedTheme.name,
        labelId: currentState.selectedTheme.id,
        inquiryDate: new Date().toISOString(),
        source: 'YourBottle Website',
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
        currentState.userData = saveUserData(userData);

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
// EVENT HANDLERS SETUP
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
    if (dom.imagePreviewModal) {
        dom.imagePreviewModal.addEventListener('click', function(e) {
            if (e.target === dom.imagePreviewModal) {
                closeImagePreview();
            }
        });
    }

    // Escape key to close preview
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && currentState.isPreviewOpen) {
            closeImagePreview();
        }
        if (e.key === 'Escape' && currentState.isFormVisible) {
            hideForm();
        }
    });

    // Form submission
    if (dom.userForm) {
        dom.userForm.addEventListener('submit', handleFormSubmit);
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

    // Phone formatting
    setupPhoneFormatting();

    // Network status
    window.addEventListener('online', () => {
        hideOfflineIndicator();
        showToast('Back online!', 2000);
    });

    window.addEventListener('offline', () => {
        showOfflineIndicator();
        showToast('Offline mode', 3000);
    });
}
