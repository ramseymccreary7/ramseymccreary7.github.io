/* Demo badge only (pages that need no Apps Script stand-in). */
(function () {
  // Demo badge (bottom-left) linking back to the portfolio.
  function badge() {
    if (document.getElementById('demo-badge')) return;
    var a = document.createElement('a');
    a.id = 'demo-badge'; a.href = window.DEMO_HOME || '../../index.html';
    a.innerHTML = '<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#34d399;margin-right:7px"></span>Demo &middot; fictional data &nbsp;<b>&larr; Portfolio</b>';
    a.setAttribute('style', 'position:fixed;left:14px;bottom:14px;z-index:2147483647;font:600 12px/1 system-ui,-apple-system,Segoe UI,sans-serif;' +
      'color:#f8fafc;background:rgba(15,23,42,.92);padding:9px 13px;border-radius:999px;text-decoration:none;box-shadow:0 6px 20px rgba(0,0,0,.25);letter-spacing:.01em');
    document.body.appendChild(a);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', badge); else badge();
})();
