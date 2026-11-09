(function () {
  var F = FAKE.seed(1717), A = MOCK_API;
  var offs = F.OFFICES.slice(0, 14), markets = offs.map(function (o) { return o.market; }).filter(function (m, i, a) { return a.indexOf(m) === i; }).sort();
  var states = markets.map(function (m) { return offs.filter(function (o) { return o.market === m; })[0].state; });
  var tiers = markets.map(function () { return F.pick(['Tier 1', 'Tier 1', 'Tier 2', 'Tier 3']); });
  var months = F.months(15).slice(0, 14), ads = [], hc = [], vol = [], leads = [];
  var channels = ['Google Search', 'Meta', 'YouTube', 'Display', 'Organic'], stages = ['New', 'Contacted', 'Nurture', 'Disclosed Investor', 'Buyer', 'Dead'];
  markets.forEach(function (m, mi) {
    var size = F.r(0.5, 2.2), cpl = F.r(28, 70), heads = F.i(4, 16);
    months.forEach(function (mo, oi) {
      var spend = Math.round(F.r(6000, 14000) * size), lds = Math.round(spend / cpl), clicks = Math.round(lds * F.r(9, 16)), impr = Math.round(clicks * F.r(55, 110));
      var di = Math.round(lds * F.r(0.08, 0.16)), buyers = Math.round(di * F.r(0.18, 0.35));
      ads.push([mi, oi, spend, impr, clicks, lds, di, Math.round(di * F.r(0.4, 0.7)), buyers]);
      heads = Math.max(2, heads + F.pick([-1, 0, 0, 0, 1])); hc.push([mi, oi, heads]); vol.push([mi, oi, Math.round(heads * F.r(1.5, 3.2) * 14500)]);
      channels.forEach(function (c, ci) { var base = c === 'Organic' ? lds * 0.6 : lds / 4 * F.r(0.5, 1.5); stages.forEach(function (s, si) { var share = [0.3, 0.25, 0.2, 0.1, 0.04, 0.11][si]; var n = Math.round(base * share * F.r(0.7, 1.3)); if (n) leads.push([mi, ci, si, oi, n]); }); });
    });
  });
  var payload = { generatedAt: new Date().toISOString(), asOf: F.ymd(new Date()), tabs: { ads: 'Paid Ads', office: 'Field Office Data', leads: 'Lead Scores' }, markets: markets, states: states, tiers: tiers, months: months,
    adsKeys: ['spend', 'impr', 'clicks', 'leads', 'di', 'd10', 'buyers'], ads: ads, hc: hc, vol: vol, channels: channels, stages: stages, leads: leads, leadRowCount: 48210, winStages: ['Disclosed Investor', 'Buyer'], warnings: [] };
  A.getAuthState = function () { return { ok: true, email: DEMO_USER.email }; };
  A.getDashboardData = function () { var p = JSON.parse(JSON.stringify(payload)); p.viewer = { email: DEMO_USER.email, name: 'Demo Viewer' }; p.fromCache = false; return p; };
})();
