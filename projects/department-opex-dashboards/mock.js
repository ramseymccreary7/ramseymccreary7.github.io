(function () {
  var F = FAKE.seed(1414), A = MOCK_API;
  var V = ['Brightpath Software', 'Northstar Cloud', 'Cobalt Analytics', 'Ledgerline Inc', 'Summit Office Supply', 'Bluefin Telecom', 'Granite Legal LLP', 'Harborview CPA Group', 'Keystone Insurance', 'Meridian Payroll', 'Pinnacle Travel', 'Redwood Catering', 'Silverline Couriers', 'Tidewater Print Co', 'Vantage Data', 'Apex Staffing', 'Beacon Security', 'Cedar Ridge Consulting', 'Driftwood Media', 'Evergreen Facilities', 'Horizon Airlines', 'Ironwood Hotels', 'Kestrel Rideshare', 'Lumen Learning', 'Nimbus Hosting', 'Sable Recruiting', 'Trellis HR', 'Westgate Leasing', 'Zephyr Shipping', 'Indigo SaaS'];
  var GL = { 'Dues and Subscriptions': [['64200', 'Dues and Subscriptions']], 'Office Expense': [['64520', 'Software'], ['64020', 'Office Supplies'], ['64300', 'Postage & Shipping']], 'Professional Fees': [['62100', 'Accounting'], ['62200', 'Legal'], ['62300', 'Consulting']],
    'Rent': [['63100', 'Office Rent']], 'T&E': [['65110', 'Airfare'], ['65120', 'Lodging'], ['65250', 'Meals and Entertainment']], 'Technology': [['68410', 'Cloud Services'], ['68420', 'Software Licenses']], 'Marketing': [['67700', 'Advertising and Marketing'], ['67710', 'Digital Ads']], 'People': [['66010', 'Recruiting'], ['66020', 'Training']], 'Bank Charges': [['64060', 'Bank Charges']] };
  var LAB = { Salary: [['61020', 'Salaries']], Bonus: [['61040', 'Bonuses']], Benefits: [['61500', 'Health Insurance'], ['61600', 'Employer Taxes']] };
  var deptCats = { Accounting: ['Dues and Subscriptions', 'Office Expense', 'Professional Fees', 'T&E', 'Bank Charges'], Marketing: ['Marketing', 'Office Expense', 'T&E', 'Technology'], Operations: ['Office Expense', 'Rent', 'T&E', 'Professional Fees'],
    Technology: ['Technology', 'Dues and Subscriptions', 'Office Expense', 'Professional Fees'], Legal: ['Professional Fees', 'Dues and Subscriptions', 'T&E'], People: ['People', 'Office Expense', 'T&E'], Corporate: ['Rent', 'Professional Fees', 'Office Expense', 'T&E', 'Bank Charges'] };
  var lastMonth = 10, TX = {}, depts = {};
  function arr(level, actual) { var out = []; for (var i = 0; i < 12; i++) out.push(actual && i >= lastMonth ? 0 : Math.round(level * F.r(0.7, 1.3) * 100) / 100); return out; }
  Object.keys(deptCats).forEach(function (d) {
    var cats = {}, scale = F.r(0.6, 2.2);
    deptCats[d].forEach(function (c) {
      cats[c] = { labor: false, gls: GL[c].map(function (g) {
        var vs = F.shuffle(V).slice(0, F.i(2, 5)).map(function (n, k) { var lvl = F.r(300, 9000) * scale; var b = arr(lvl, false), a = arr(lvl * F.r(0.8, 1.25), true); return { k: n.toLowerCase().replace(/[^a-z]/g, ''), n: n, a: a, b: b }; });
        var a = [], b = []; for (var i = 0; i < 12; i++) { a.push(vs.reduce(function (s, x) { return s + x.a[i]; }, 0)); b.push(vs.reduce(function (s, x) { return s + x.b[i]; }, 0)); }
        vs.forEach(function (v) { var rows = []; v.a.forEach(function (amt, i) { if (amt) rows.push([v.k, String(i + 1).padStart(2, '0') + '/15/26', F.pick(['Bill', 'Credit Card', 'Journal']), 'B-' + F.i(10000, 99999), 'Monthly charge — ' + v.n, amt, i + 1]); }); (TX[d + '|' + g[0]] = TX[d + '|' + g[0]] || []).push.apply(TX[d + '|' + g[0]], rows); });
        return { no: g[0], name: g[1], a: a, b: b, v: vs }; }) };
    });
    Object.keys(LAB).forEach(function (c) { var lvl = { Salary: 90000, Bonus: 14000, Benefits: 12000 }[c] * scale;
      cats[c] = { labor: true, gls: LAB[c].map(function (g) { return { no: g[0], name: g[1], a: arr(lvl / LAB[c].length, true), b: arr(lvl / LAB[c].length, false), v: [] }; }) }; });
    depts[d] = { dept: d, cats: cats, labor: true };
  });
  var meta = { fy: 2026, lastMonth: lastMonth, through: lastMonth, builtAt: new Date().toISOString(), rowsA: 5120, rowsB: 1480, depts: Object.keys(depts), unmapped: [],
    laborCats: ['Salary', 'Bonus', 'Benefits', 'Commission', 'Commissions'], nonLaborOrder: ['Dues and Subscriptions', 'Office Expense', 'Professional Fees', 'Rent', 'T&E', 'Taxes', 'Technology', 'Tech Consulting', 'Marketing', 'Direct Mail', 'People', 'Title Expense', 'Amortization & Depreciation', 'Bank Charges'] };
  A.getData = function () { return { viewer: { email: DEMO_USER.email, level: 'All', labor: true, laborAll: true, laborDepts: Object.keys(depts), depts: Object.keys(depts), consolidated: true, all: true, admin: true }, meta: meta, depts: Object.keys(depts).map(function (d) { return depts[d]; }), url: '' }; };
  A.getTxns = function (t, dept, glno, vkey) { var tx = TX[dept + '|' + glno] || []; return vkey ? tx.filter(function (r) { return r[0] === vkey; }) : tx; };
  A.reportLaborLeak = function () { return { ok: true }; };
})();
