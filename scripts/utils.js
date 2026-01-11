// ============================================
// UTILITY FUNCTIONS
// ============================================
import { dom } from './config.js';

// PHONE FORMATTING FUNCTIONS
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

// LOCALSTORAGE MANAGEMENT
function loadUserData() {
    const savedData = localStorage.getItem('yourbottle_user');
    if (savedData) {
        try {
            return JSON.parse(savedData);
        } catch (e) {
            console.error('Error parsing saved data:', e);
            localStorage.removeItem('yourbottle_user');
            return null;
        }
    }
    return null;
}

function saveUserData(userData) {
    const dataToSave = {
        ...userData,
        lastUpdated: new Date().toISOString(),
        location: "India"
    };

    localStorage.setItem('yourbottle_user', JSON.stringify(dataToSave));
    console.log('💾 User data saved');
    return dataToSave;
}

// NOTIFICATION MANAGEMENT
function saveLocalNotification(userData, theme) {
    const notification = {
        id: Date.now(),
        userData,
        theme,
        timestamp: new Date().toISOString(),
        synced: false
    };

    const savedNotifications = JSON.parse(localStorage.getItem('yourbottle_notifications') || '[]');
    savedNotifications.push(notification);
    localStorage.setItem('yourbottle_notifications', JSON.stringify(savedNotifications));

    console.log('📝 Notification saved locally:', notification);
    return notification;
}

// IMAGE OPTIMIZATION
function checkAvailableImages(themes) {
    console.log('🔍 Checking for available theme images...');

    const availableImages = {};
    const imagesToTest = themes.map(theme => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = function() {
                console.log(`✅ Image available: ${theme.image}`);
                availableImages[theme.id] = true;
                resolve(true);
            };
            img.onerror = function() {
                console.log(`❌ Image not found: ${theme.image}, using gradient`);
                availableImages[theme.id] = false;
                resolve(false);
            };
            img.src = `assets/${theme.image}`;
        });
    });

    return Promise.allSettled(imagesToTest).then(() => {
        console.log(`📊 Image check complete. Available: ${Object.values(availableImages).filter(v => v).length}/${themes.length}`);
        return availableImages;
    });
}

function getThemeImageUrl(theme, availableImages) {
    // If image is available, return image URL
    if (availableImages[theme.id]) {
        return `url('assets/${theme.image}')`;
    }

    // Fallback to gradient
    return theme.color;
}

// TOAST FUNCTIONS
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

// NETWORK STATUS
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

// EXPORT UTILITIES
export {
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
};
