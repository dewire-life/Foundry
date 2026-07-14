// Native tip-jar bridge. This file ships with the web bundle (it loads from
// index.html and is copied into the iOS app by `npx cap copy ios`), but it does
// nothing on the open web: it only activates when running inside the Capacitor
// iOS shell, where cordova-plugin-purchase is present.
//
// It defines window.FoundryIAP (the Support button in Settings calls this) and
// reports a completed purchase via window.foundryCoffeeThanks(), which app.js
// already implements. On the web, neither runs, so the Buy Me a Coffee link in
// config.js is used instead.
(function(){
  // Guard: only proceed inside a Capacitor native runtime.
  var isNative = typeof window.Capacitor !== 'undefined' &&
                 window.Capacitor.isNativePlatform &&
                 window.Capacitor.isNativePlatform();
  if(!isNative) return;

  function wirePurchases(){
    if(!window.CdvPurchase){
      // Plugin not ready yet; try again shortly.
      return setTimeout(wirePurchases, 300);
    }
    var store = CdvPurchase.store;
    var APPLE = CdvPurchase.Platform.APPLE_APPSTORE;

    store.register([{
      id: 'foundry_coffee',
      type: CdvPurchase.ProductType.CONSUMABLE,
      platform: APPLE
    }]);

    store.when()
      .approved(function(transaction){ transaction.finish(); })
      .finished(function(){
        if(typeof window.foundryCoffeeThanks === 'function') window.foundryCoffeeThanks();
      });

    store.initialize([APPLE]);

    // The Settings Support button calls this.
    window.FoundryIAP = function(){
      var product = store.get('foundry_coffee', APPLE);
      var offer = product && product.getOffer();
      if(offer){ offer.order(); }
      else if(typeof window.showToast === 'function'){ window.showToast('Store not ready yet, try again in a moment'); }
    };
  }

  document.addEventListener('deviceready', wirePurchases);
  // Capacitor may have already fired deviceready before this script parsed.
  if(window.CdvPurchase) wirePurchases();
})();
