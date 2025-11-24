// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your web app's Firebase configuration
// Fallback to hardcoded values if environment variables are not loaded
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
let messaging = null;
try {
  messaging = getMessaging(app);
  console.log('[Firebase] Messaging initialized successfully');
} catch (error) {
  console.error('[Firebase] Messaging initialization failed:', error);
}

// Test Firebase connection
export const testFirebaseConnection = () => {
  const isLocalhost = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' ||
                      window.location.hostname === '';
  const isNgrok = window.location.hostname.includes('ngrok');
  
  console.log('[Firebase] Configuration:', {
    projectId: firebaseConfig.projectId,
    messagingEnabled: !!messaging,
    isSecureContext: window.isSecureContext,
    protocol: window.location.protocol,
    hostname: window.location.hostname,
    isLocalhost: isLocalhost,
    isNgrok: isNgrok,
    canUseFCM: window.isSecureContext || isLocalhost || isNgrok
  });
};

// Wait for service worker to be fully active
const waitForServiceWorkerActive = async (registration, timeout = 10000) => {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    if (registration.active && registration.active.state === 'activated') {
      console.log('[Firebase] ✅ Service worker is active and ready');
      return registration.active;
    }
    
    // Wait for 100ms before checking again
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  throw new Error('Service worker did not activate in time');
};

// Register service worker
export const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) {
    console.warn('[Firebase] Service Workers not supported');
    throw new Error('Service Workers not supported');
  }

  try {
    // Unregister any existing service workers first
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (let registration of registrations) {
      await registration.unregister();
      console.log('[Firebase] Unregistered old service worker');
    }
    
    // Wait a bit for cleanup
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Register new service worker
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/',
      updateViaCache: 'none'
    });
    
    console.log('[Firebase] Service Worker registered:', registration.scope);
    
    // Wait for service worker to be fully active
    await waitForServiceWorkerActive(registration);
    
    // Also wait for ready state
    await navigator.serviceWorker.ready;
    
    console.log('[Firebase] ✅ Service Worker fully active and ready');
    return registration;
  } catch (error) {
    console.error('[Firebase] ❌ Service Worker registration failed:', error);
    throw error;
  }
};

// Request notification permission and get FCM token
export const requestNotificationPermission = async () => {
  if (!messaging) {
    console.error('[Firebase] ❌ Messaging not initialized - cannot get token');
    return null;
  }

  // Check if running on localhost, ngrok, or secure context
  const isLocalhost = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';
  const isNgrok = window.location.hostname.includes('ngrok');
  
  console.log('[Firebase] 🌐 Current Environment:', {
    hostname: window.location.hostname,
    href: window.location.href,
    isLocalhost,
    isNgrok,
    isSecure: window.isSecureContext,
    protocol: window.location.protocol
  });

  if (!window.isSecureContext && !isLocalhost && !isNgrok) {
    console.error('[Firebase] ❌ FCM requires HTTPS, localhost, or ngrok');
    return null;
  }

  try {
    console.log('[Firebase] 🔔 Requesting notification permission...');
    
    // Request notification permission
    const permission = await Notification.requestPermission();
    console.log('[Firebase] Notification permission result:', permission);
    
    if (permission !== 'granted') {
      console.warn('[Firebase] ⚠️ Notification permission denied by user');
      return null;
    }

    console.log('[Firebase] ✅ Notification permission granted');
    console.log('[Firebase] 📝 Registering service worker...');
    
    // Register service worker and wait for it to be fully active
    const registration = await registerServiceWorker();
    console.log('[Firebase] ✅ Service worker ready');

    // Additional wait to ensure service worker is truly ready
    const waitTime = isNgrok ? 2000 : 1000;
    console.log(`[Firebase] ⏳ Waiting ${waitTime}ms for service worker to stabilize...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));

    console.log('[Firebase] 🔄 Attempting to get FCM token...');
    
    // IMPORTANT: Use the EXACT VAPID key from Firebase Console
    const VAPID_KEY = "BBvIF5YD3NjpBru-w0jZmcD4d_eVms04Q8eIFMGRPFWhH2ZazXzfS_nxRwdmoKc1Ziv-dpewPlYUCSYvLmsV6e4";
    
    console.log('[Firebase] 🔑 Using VAPID Key (first 20 chars):', VAPID_KEY.substring(0, 20) + '...');
    console.log('[Firebase] 🔧 Service Worker State:', registration.active?.state);
    console.log('[Firebase] 📡 Service Worker Scope:', registration.scope);
    
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration
    });
    
    if (token) {
      console.log('[Firebase] ✅✅✅ FCM TOKEN OBTAINED SUCCESSFULLY! ✅✅✅');
      console.log('[Firebase] 🎫 FCM TOKEN:', token);
      console.log('[Firebase] 📋 TOKEN LENGTH:', token.length, 'characters');
      console.log('[Firebase] 🌐 Obtained via:', isNgrok ? 'NGROK' : isLocalhost ? 'LOCALHOST' : 'HTTPS');
      
      // Send token to your backend server
      await sendTokenToServer(token);
      return token;
    } else {
      console.warn('[Firebase] ⚠️ getToken returned null/undefined');
      return null;
    }
  } catch (error) {
    console.error('[Firebase] ❌ Error getting FCM token:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    // Specific troubleshooting based on error
    if (error.name === 'AbortError' && error.message.includes('push service error')) {
      console.error('[Firebase] 🔥 FIREBASE CONFIGURATION ERROR DETECTED! 🔥');
      console.error('');
      console.error('This error means Firebase Cloud Messaging is not properly configured.');
      console.error('');
      console.error('✅ SOLUTION: Follow these steps:');
      console.error('');
      console.error('1. Go to Firebase Console: https://console.firebase.google.com/');
      console.error(`2. Select your project: ${firebaseConfig.projectId}`);
      console.error('3. Go to Project Settings (gear icon) > Cloud Messaging tab');
      console.error('4. Enable "Cloud Messaging API (Legacy)" if disabled');
      console.error('5. Under "Cloud Messaging API (V1)", click "Manage API in Google Cloud Console"');
      console.error('6. Enable the "Firebase Cloud Messaging API"');
      console.error('7. Go back to Firebase Console > Project Settings > General');
      console.error('8. Add your domain to "Authorized domains":');
      console.error(`   - Add: ${window.location.hostname}`);
      console.error('   - Add: localhost');
      console.error('9. Wait 5-10 minutes for changes to propagate');
      console.error('10. Clear browser cache and try again');
      console.error('');
      console.error('📌 Current domain:', window.location.hostname);
      console.error('📌 Current URL:', window.location.href);
      console.error('');
    }
    
    return null;
  }
};

// Send token to backend
const sendTokenToServer = async (token) => {
  try {
    const empCode = localStorage.getItem('code');
    if (!empCode) {
      console.warn('[Firebase] ⚠️ No employee code found, skipping token registration');
      return;
    }

    console.log('[Firebase] 📤 Sending FCM token to server for empCode:', empCode);

    // Use backend auth token (not the FCM token) for Authorization header if available
    const authToken = localStorage.getItem('token') || '';

    // Endpoint requires the FCM token as query param
    const url = `https://api.shl-hr.com/api/v1/firebase/update-fcm-token-web?token=${encodeURIComponent(token)}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken ? `Bearer ${authToken}` : '',
        'ngrok-skip-browser-warning': 'true'
      },
      // include empCode in body so server can associate the token if needed
      body: JSON.stringify({ empCode })
    });

    if (response.ok) {
      console.log('[Firebase] ✅ FCM token registered with server successfully');
    } else {
      const errorText = await response.text().catch(() => '');
      console.warn('[Firebase] ⚠️ Failed to register token with server:', response.status, errorText);
    }
  } catch (error) {
    console.error('[Firebase] ❌ Error sending token to server:', error);
  }
};

// Listen for foreground messages
export const onMessageListener = () => {
  return new Promise((resolve, reject) => {
    if (!messaging) {
      reject(new Error('Messaging not initialized'));
      return;
    }

    onMessage(messaging, (payload) => {
      console.log('[Firebase] 📨 Foreground message received:', payload);
      resolve(payload);
    });
  });
};

// Show browser notification
export const showBrowserNotification = (title, options = {}) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    console.log('[Firebase] 🔔 Showing notification:', title);
    
    const notification = new Notification(title, {
      icon: options.icon || '/logo192.png',
      badge: '/favicon.ico',
      body: options.body || '',
      tag: options.tag || 'notification',
      requireInteraction: options.requireInteraction || false,
      vibrate: [200, 100, 200],
      data: options.data || {},
      ...options
    });

    notification.onclick = function(event) {
      event.preventDefault();
      window.focus();
      notification.close();
    };

    return notification;
  } else {
    console.warn('[Firebase] ⚠️ Cannot show notification - permission:', Notification.permission);
    return null;
  }
};

export { app, messaging };
