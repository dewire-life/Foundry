// One-time self-heal: on native builds, older versions of this app registered
// a service worker meant for the web PWA. That registration can persist in the
// WebView's local storage across app updates (independent of the IPA itself),
// permanently serving stale cached JS even after a fix ships. Since this file
// is new, it bypasses that stale cache and always loads fresh, so it reliably
// unregisters any leftover worker and clears its caches, once, going forward
// the native build never registers one at all (see app.js).
(function(){
  var isNative = typeof window.Capacitor !== 'undefined' &&
                 window.Capacitor.isNativePlatform &&
                 window.Capacitor.isNativePlatform();
  if(!isNative) return;
  if('serviceWorker' in navigator){
    navigator.serviceWorker.getRegistrations().then(function(regs){
      regs.forEach(function(reg){ reg.unregister(); });
    }).catch(function(){});
  }
  if(window.caches && caches.keys){
    caches.keys().then(function(keys){
      keys.forEach(function(k){ caches.delete(k); });
    }).catch(function(){});
  }
})();
