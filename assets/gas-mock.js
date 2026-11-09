/* Demo runtime: stands in for Google Apps Script's google.script.run so the original
   front ends run unchanged against fictional, in-browser data. */
(function () {
  var API = window.MOCK_API = window.MOCK_API || {};
  window.__gasCalls = [];
  function clone(v) { return v === undefined ? null : JSON.parse(JSON.stringify(v)); }
  function runner(ok, fail, uo) {
    return new Proxy({}, {
      get: function (_, fn) {
        if (fn === 'withSuccessHandler') return function (f) { return runner(f, fail, uo); };
        if (fn === 'withFailureHandler') return function (f) { return runner(ok, f, uo); };
        if (fn === 'withUserObject') return function (o) { return runner(ok, fail, o); };
        return function () {
          var args = Array.prototype.slice.call(arguments);
          window.__gasCalls.push(fn);
          setTimeout(function () {
            var h = API[fn];
            if (!h) {
              console.info('[demo] ' + fn + ' is disabled in the demo');
              var e = new Error('This action is disabled in the demo.');
              if (fail) fail(e, uo); return;
            }
            Promise.resolve().then(function () { return h.apply(null, args); })
              .then(function (r) { if (ok) ok(clone(r), uo); },
                    function (e) { if (fail) fail(e instanceof Error ? e : new Error(String(e)), uo); });
          }, 150 + Math.random() * 250);
        };
      }
    });
  }
  window.google = window.google || {};
  window.google.script = {
    run: runner(null, null, undefined),
    host: { close: function () {}, setHeight: function () {}, setWidth: function () {}, editor: { focus: function () {} },
            origin: location.origin },
    url: { getLocation: function (cb) { cb({ parameter: {}, parameters: {}, hash: '' }); } },
    history: { push: function () {}, replace: function () {}, setChangeHandler: function () {} }
  };
  // Demo sessions: any stored "token" key reads back as a signed-in demo token.
  try {
    var gi = Storage.prototype.getItem;
    Storage.prototype.getItem = function (k) { var v = gi.call(this, k); if ((v === null || v === '') && /token|session|auth/i.test(String(k))) return 'demo-token'; return v; };
  } catch (e) {}
  // Generic sign-in handlers: the demo signs everyone in automatically.
  var DEMO_USER = window.DEMO_USER = { email: 'demo.viewer@example.com', name: 'Demo Viewer' };
  API.getAuthState = API.getAuthState || function () { return { ok: true, email: DEMO_USER.email, level: 'master', label: 'Master', name: DEMO_USER.name }; };
  API.requestAccessCode = API.requestAccessCode || function () { return { ok: true }; };
  API.verifyAccessCode = API.verifyAccessCode || function (email) { return { ok: true, token: 'demo-token', email: email || DEMO_USER.email }; };
  API.signOut = API.signOut || function () { return { ok: true }; };

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
