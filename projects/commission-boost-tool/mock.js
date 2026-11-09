(function () {
  var F = FAKE.seed(202);
  var months = F.months(13).slice(0, 12).concat([F.months(1)[0]]);
  months = Array.from(new Set(months)).sort();
  var states = {};
  F.OFFICES.forEach(function (o) { states[o.state] = 1; });
  var grids = { base: {}, aa: {}, da: {} };
  Object.keys(states).forEach(function (st) {
    var ab = F.round(F.r(0.17, 0.21), 3), db = F.round(F.r(0.14, 0.18), 3);
    grids.base[st] = { aa: ab, da: db };
    var vols = [0, 30000, 50000, 75000, 100000];
    var rows = [2, 4, 6, 8].map(function (u, i) { return { u: u, r: vols.map(function (_, j) { return F.round(ab + 0.01 * (i + j) + (i && j ? 0.005 : 0), 3); }) }; });
    grids.aa[st] = { vols: vols, rows: rows };
    grids.da[st] = [{ u: 3, r: F.round(db + 0.02, 3) }, { u: 5, r: F.round(db + 0.04, 3) }, { u: 8, r: F.round(db + 0.06, 3) }];
  });
  var boosts = [
    { id: 'b1', order: 1, name: 'Mentorship Program', status: 'live', unit: 'Boost %', rate: 0.01, min: 0, max: 10, step: 1, minPay: null, maxPay: null, cap: 'none', desc: 'Commission boost on your volume while you mentor newer agents' },
    { id: 'b2', order: 2, name: 'Deal Support Assist', status: 'live', unit: 'Assists', rate: 0.015, min: 0, max: 10, step: 1, minPay: 400, maxPay: 1200, cap: 'step', desc: '1.5% of your volume per assist' },
    { id: 'b3', order: 3, name: 'Agent Referral', status: 'live', unit: 'Referred agent deals', rate: 0.015, min: 0, max: 10, step: 1, minPay: 400, maxPay: 4000, cap: 'month', desc: '1.5% per closed deal by an agent you referred' }
  ];
  var agents = [], kpi = {};
  F.people(46).forEach(function (n, i) {
    var o = F.pick(F.OFFICES), isDA = F.chance(0.35), lvl = F.r(0.6, 1.6), k = 'e:' + F.email(n);
    var pos = isDA ? 'Disposition Agent' : 'Acquisition Agent';
    var by = {};
    months.forEach(function (ym) {
      var u = Math.max(0, Math.round(F.norm(3.2 * lvl, 1.4))), v = Math.round(u * F.r(11000, 17500));
      var s = {}; s[o.state] = isDA ? [0, v] : [v, 0];
      by[ym] = isDA ? { p: pos, o: o.office, au: 0, av: 0, du: u, dv: v, s: s } : { p: pos, o: o.office, au: u, av: v, du: 0, dv: 0, s: s };
    });
    agents.push({ k: k, n: n, o: o.office, m: o.market, p: pos }); kpi[k] = by;
  });
  agents.sort(function (a, b) { return a.n.localeCompare(b.n); });
  agents.unshift({ k: 'x:example-agent', n: 'Example Agent', o: '', m: '', p: '', example: true }); kpi['x:example-agent'] = {};
  MOCK_API.getStacksData = function () {
    return { viewer: { email: DEMO_USER.email, level: 'master', label: 'Master', offices: [], self: [agents[1].k] },
      months: months, currentMonth: months[months.length - 1], grids: grids, boosts: boosts, agents: agents, kpi: kpi,
      asOf: new Date().toISOString(), problems: [] };
  };
  MOCK_API.getBoostGuide = function () { return null; };
})();
