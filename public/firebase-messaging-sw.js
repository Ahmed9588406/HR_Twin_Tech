/* stylelint-disable */
/* eslint-env serviceworker */
/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
/* cspell:disable */

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

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

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
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

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  // Open the app or focus existing window
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function(clientList) {
        // If app is already open, focus it
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise open new window
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});

// Log activation
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// Log installation
self.addEventListener('install', () => {
  self.skipWaiting();
});
