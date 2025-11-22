/* stylelint-disable */
/* eslint-env serviceworker */
/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
/* cspell:disable */

console.log('[SW] 🚀 Service Worker script starting...');
console.log('[SW] 📍 Location:', self.location.href);
console.log('[SW] 🔒 Is Secure Context:', self.isSecureContext);

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

console.log('[SW] ✅ Firebase scripts imported');

// Use your Firebase configuration
firebase.initializeApp({
  apiKey: "AIzaSyC-DenE_w3Ic2z8W0E73z5wkVpHv3oK0bY",
  authDomain: "shl-hr.firebaseapp.com",
  projectId: "shl-hr",
  storageBucket: "shl-hr.firebasestorage.app",
  messagingSenderId: "713300932661",
  appId: "1:713300932661:web:154b17f22fef0b4f6a997c",
  measurementId: "G-EHM6TZGWGR"
});

console.log('[SW] ✅ Firebase initialized');

const messaging = firebase.messaging();

console.log('[SW] ✅ Firebase Messaging Service Worker loaded and ready');

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('[SW] 📨 Background message received:', payload);
  
  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: payload.notification?.icon || '/logo192.png',
    badge: '/favicon.ico',
    tag: payload.data?.id || 'notification-' + Date.now(),
    data: payload.data,
    requireInteraction: false,
    vibrate: [200, 100, 200]
  };

  console.log('[SW] 🔔 Showing notification:', notificationTitle);
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
  console.log('[SW] 👆 Notification clicked:', event.notification.tag);
  
  event.notification.close();
  
  // Open the app or focus existing window
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function(clientList) {
        // If app is already open, focus it
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            console.log('[SW] Focusing existing window');
            return client.focus();
          }
        }
        // Otherwise open new window
        if (clients.openWindow) {
          console.log('[SW] Opening new window');
          return clients.openWindow('/');
        }
      })
  );
});

// Log activation
self.addEventListener('activate', event => {
  console.log('[SW] 🎯 Service Worker activated');
  event.waitUntil(self.clients.claim());
});

// Log installation
self.addEventListener('install', () => {
  console.log('[SW] 📥 Service Worker installing');
  self.skipWaiting();
});

console.log('[SW] 📝 Service Worker event listeners registered');
