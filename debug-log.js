// TEMPORARY debug overlay for diagnosing native notification issues.
// Shows a small floating log panel directly on screen. Remove this file and
// its <script> tag in index.html once the notification bug is resolved.
(function(){
  var panel = document.createElement('div');
  panel.id = 'foundryDebugPanel';
  panel.style.cssText = 'position:fixed; bottom:100px; left:8px; right:8px; max-height:200px; overflow-y:auto; background:rgba(0,0,0,0.85); color:#0f0; font-family:monospace; font-size:10px; padding:8px; border-radius:8px; z-index:99999; white-space:pre-wrap;';
  panel.textContent = 'Debug log ready...\n';
  document.body.appendChild(panel);

  window.debugLog = function(msg){
    var time = new Date().toLocaleTimeString();
    panel.textContent += '[' + time + '] ' + msg + '\n';
    panel.scrollTop = panel.scrollHeight;
    console.log(msg);
  };

  window.addEventListener('error', function(e){
    window.debugLog('WINDOW ERROR: ' + e.message + ' at ' + e.filename + ':' + e.lineno);
  });
})();
