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
} catch (error) {
  // Messaging initialization failed
}

// Test Firebase connection
export const testFirebaseConnection = () => {
  const isLocalhost = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' ||
                      window.location.hostname === '';
  const isNgrok = window.location.hostname.includes('ngrok');
  
  // Firebase configuration check (silent in production)
};

// Wait for service worker to be fully active
const waitForServiceWorkerActive = async (registration, timeout = 10000) => {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    if (registration.active && registration.active.state === 'activated') {
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
    throw new Error('Service Workers not supported');
  }

  try {
    // Unregister any existing service workers first
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (let registration of registrations) {
      await registration.unregister();
    }
    
    // Wait a bit for cleanup
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Register new service worker
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/',
      updateViaCache: 'none'
    });
    
    // Wait for service worker to be fully active
    await waitForServiceWorkerActive(registration);
    
    // Also wait for ready state
    await navigator.serviceWorker.ready;
    
    return registration;
  } catch (error) {
    throw error;
  }
};

// Request notification permission and get FCM token
export const requestNotificationPermission = async () => {
  if (!messaging) {
    return null;
  }

  // Check if running on localhost, ngrok, or secure context
  const isLocalhost = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';
  const isNgrok = window.location.hostname.includes('ngrok');

  if (!window.isSecureContext && !isLocalhost && !isNgrok) {
    return null;
  }

  try {
    // Request notification permission
    const permission = await Notification.requestPermission();
    
    if (permission !== 'granted') {
      return null;
    }
    
    // Register service worker and wait for it to be fully active
    const registration = await registerServiceWorker();

    // Additional wait to ensure service worker is truly ready
    const waitTime = isNgrok ? 2000 : 1000;
    await new Promise(resolve => setTimeout(resolve, waitTime));
    
    // IMPORTANT: Use the EXACT VAPID key from Firebase Console
    const VAPID_KEY = "BBvIF5YD3NjpBru-w0jZmcD4d_eVms04Q8eIFMGRPFWhH2ZazXzfS_nxRwdmoKc1Ziv-dpewPlYUCSYvLmsV6e4";
    
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration
    });
    
    if (token) {
      // Send token to your backend server
      await sendTokenToServer(token);
      return token;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

// Send token to backend
const sendTokenToServer = async (token) => {
  try {
    const empCode = localStorage.getItem('code');
    if (!empCode) {
      return;
    }

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
  } catch (error) {
    // Error sending token to server
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
      resolve(payload);
    });
  });
};

// Show browser notification
export const showBrowserNotification = (title, options = {}) => {
  if ('Notification' in window && Notification.permission === 'granted') {
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
    return null;
  }
};

export { app, messaging };
