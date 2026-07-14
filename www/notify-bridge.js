// Native local notifications bridge. Loads from index.html and is copied into
// the iOS app by `npx cap copy ios`. Inert on the open web: falls back to the
// existing browser Notification API there. On native, uses @capacitor/local-notifications
// so alerts fire reliably even when the app is backgrounded or the phone is locked.
(function(){
  var isNative = typeof window.Capacitor !== 'undefined' &&
                 window.Capacitor.isNativePlatform &&
                 window.Capacitor.isNativePlatform();

  window.FoundryNotify = {
    isNative: isNative,

    async requestPermission(){
      if(isNative){
        if(!window.Capacitor.Plugins || !window.Capacitor.Plugins.LocalNotifications){
          console.error('FoundryNotify: LocalNotifications plugin not found on window.Capacitor.Plugins');
          if(typeof window.showToast === 'function') window.showToast('Notifications plugin not available');
          return false;
        }
        try{
          var result = await window.Capacitor.Plugins.LocalNotifications.requestPermissions();
          return result.display === 'granted';
        }catch(err){
          console.error('FoundryNotify: requestPermissions failed', err);
          if(typeof window.showToast === 'function') window.showToast('Could not request notification permission');
          return false;
        }
      }
      if('Notification' in window){
        var perm = await Notification.requestPermission();
        return perm === 'granted';
      }
      return false;
    },

    async fireNow(title, body){
      if(isNative && window.Capacitor.Plugins && window.Capacitor.Plugins.LocalNotifications){
        try{
          await window.Capacitor.Plugins.LocalNotifications.schedule({
            notifications: [{
              title: title,
              body: body,
              id: Math.floor(Math.random() * 100000),
              schedule: { at: new Date(Date.now() + 100) }
            }]
          });
        }catch(e){ console.error('FoundryNotify: schedule failed', e); }
        return;
      }
      if('Notification' in window && Notification.permission === 'granted'){
        try{ new Notification(title, { body: body }); }catch(e){}
      }
    }
  };
})();
