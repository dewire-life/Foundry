// Native tip-jar bridge. This file ships with the web bundle (it loads from
// index.html and is copied into the iOS app by `npx cap copy ios`), but it does
// nothing on the open web: it only activates when running inside the Capacitor
// iOS shell, where cordova-plugin-purchase is present.
//
// It defines window.FoundryIAP (called with a size: 'small' | 'medium' | 'large'),
// and reports a completed purchase via window.foundryCoffeeThanks(), which app.js
// already implements. On the web, neither runs, so the Buy Me a Coffee link in
// config.js is used instead.
(function(){
  var isNative = typeof window.Capacitor !== 'undefined' &&
                 window.Capacitor.isNativePlatform &&
                 window.Capacitor.isNativePlatform();
  if(!isNative) return;

  var PRODUCTS = {
    small: 'foundry_coffee_small',
    medium: 'foundry_coffee_medium',
    large: 'foundry_coffee_large'
  };

  function wirePurchases(){
    if(!window.CdvPurchase){
      return setTimeout(wirePurchases, 300);
    }
    var store = CdvPurchase.store;
    var APPLE = CdvPurchase.Platform.APPLE_APPSTORE;

    store.register([
      { id: PRODUCTS.small, type: CdvPurchase.ProductType.CONSUMABLE, platform: APPLE },
      { id: PRODUCTS.medium, type: CdvPurchase.ProductType.CONSUMABLE, platform: APPLE },
      { id: PRODUCTS.large, type: CdvPurchase.ProductType.CONSUMABLE, platform: APPLE }
    ]);

    store.when()
      .approved(function(transaction){ transaction.finish(); })
      .finished(function(){
        if(typeof window.foundryCoffeeThanks === 'function') window.foundryCoffeeThanks();
      });

    store.initialize([APPLE]);

    // Settings Support buttons call this with 'small', 'medium', or 'large'.
    window.FoundryIAP = function(size){
      var productId = PRODUCTS[size];
      if(!productId){
        if(typeof window.showToast === 'function'){ window.showToast('Unknown option'); }
        return;
      }
      var product = store.get(productId, APPLE);
      var offer = product && product.getOffer();
      if(offer){ offer.order(); }
      else if(typeof window.showToast === 'function'){ window.showToast('Store not ready yet, try again in a moment'); }
    };
  }

  document.addEventListener('deviceready', wirePurchases);
  if(window.CdvPurchase) wirePurchases();
})();
