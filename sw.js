// Minimal service worker: lets Android treat the app as installable (needed for 'share to I want this').
// It caches nothing, so you always get the latest version.
self.addEventListener('install',function(){self.skipWaiting();});
self.addEventListener('activate',function(e){e.waitUntil(self.clients.claim());});
self.addEventListener('fetch',function(){});
