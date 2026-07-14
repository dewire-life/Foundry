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
      if(isNative && window.Capacitor.Plugins && window.Capacitor.Plugins.LocalNotifications){
        var result = await window.Capacitor.Plugins.LocalNotifications.requestPermissions();
        return result.display === 'granted';
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
        }catch(e){ /* silent fail, non-critical */ }
        return;
      }
      if('Notification' in window && Notification.permission === 'granted'){
        try{ new Notification(title, { body: body }); }catch(e){}
      }
    }
  };
})();
