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
      if(window.debugLog) window.debugLog('requestPermission called, isNative=' + isNative);
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

    async checkPermission(){
      if(window.debugLog) window.debugLog('checkPermission called');
      if(isNative && window.Capacitor.Plugins && window.Capacitor.Plugins.LocalNotifications){
        try{
          var result = await window.Capacitor.Plugins.LocalNotifications.checkPermissions();
          return result.display; // 'granted' | 'denied' | 'prompt' | 'prompt-with-rationale'
        }catch(e){ return 'prompt'; }
      }
      if('Notification' in window) return Notification.permission === 'granted' ? 'granted' : 'denied';
      return 'prompt';
    },

    async openSettings(){
      if(isNative && window.Capacitor.Plugins && window.Capacitor.Plugins.NativeSettings){
        try{
          await window.Capacitor.Plugins.NativeSettings.open({ optionIOS: 'app', optionAndroid: 'application_details' });
        }catch(e){ console.error('FoundryNotify: openSettings failed', e); }
      }
    },

    async scheduleAt(id, title, body, whenDate){
      if(window.debugLog) window.debugLog('scheduleAt called: id=' + id + ' whenDate=' + whenDate);
      if(isNative && window.Capacitor.Plugins && window.Capacitor.Plugins.LocalNotifications){
        try{
          await window.Capacitor.Plugins.LocalNotifications.schedule({
            notifications: [{ title: title, body: body, id: id, schedule: { at: whenDate } }]
          });
        }catch(e){ console.error('FoundryNotify: scheduleAt failed', e); }
      }
    },

    async cancel(id){
      if(window.debugLog) window.debugLog('cancel called: id=' + id);
      if(isNative && window.Capacitor.Plugins && window.Capacitor.Plugins.LocalNotifications){
        try{
          await window.Capacitor.Plugins.LocalNotifications.cancel({ notifications: [{ id: id }] });
        }catch(e){ /* fine if nothing was scheduled */ }
      }
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
