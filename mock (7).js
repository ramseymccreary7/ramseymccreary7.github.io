(function () {
  var F = FAKE.seed(1313), A = MOCK_API, deals = [], agents = F.people(30), buyers = ['Keystone Rentals LLC', 'Bluebird Homes LLC', 'Partner Fund A', 'Harbor Flip Co', 'Summit Path Holdings'];
  var leads = ['Institutional', 'Institutional', 'Wholesaler (WAM)', 'Direct Mail', 'Website', 'Agent Referral', 'Cold Call', 'PPC'];
  var start = new Date(2026, 0, 1), now = new Date();
  for (var i = 0; i < 1300; i++) {
    var cd = new Date(start.getTime() + F.rnd() * (now - start)), o = F.pick(F.OFFICES), lead = F.pick(leads), mkt = lead === 'Wholesaler (WAM)' ? 'WAM Partner' : F.pick(['Organic', 'Paid', 'Referral']);
    var acq = Math.round(F.r(90000, 320000) / 500) * 500, profit = Math.round(F.r(7000, 26000)), buyer = F.pick(buyers);
    var isAA = lead === 'Institutional' || lead === 'Wholesaler (WAM)' || F.chance(0.05), isDA = buyer === 'Partner Fund A' || F.chance(0.06);
    if (!isAA && !isDA && F.chance(0.55)) continue;
    deals.push({ leadSource: lead, office: o.office, marketingSource: mkt, stage: cd < F.daysAgo(10) ? (F.chance(0.85) ? 'Closed' : 'Sold') : 'Pre Close', acqAgent: F.pick(agents), secondaryAA: F.chance(0.2) ? F.pick(agents) : '', primaryDA: F.pick(agents), secondaryDA: '',
      address: F.address(), buyer: buyer, profit: profit, companyFee: Math.round(profit * F.r(1.02, 1.12)), acqPrice: acq, dispPrice: acq + profit + F.i(500, 3000), arv: Math.round(acq * F.r(1.35, 1.7)),
      closeDate: F.ymd(cd), year: cd.getFullYear(), month: cd.getMonth() + 1, isAA: isAA, isDA: isDA });
  }
  var tiers = [{ t: 1, rev: 250000, pay: 5000 }, { t: 2, rev: 400000, pay: 10000 }, { t: 3, rev: 600000, pay: 15000 }, { t: 4, rev: 800000, pay: 25000 }];
  var targets = {}; ['Q1', 'Q2', 'Q3', 'Q4'].forEach(function (q) { targets[q] = tiers.map(function (x) { return Object.assign({}, x); }); });
  var rules = [], newMarkets = { AA: ['Birmingham', 'Columbus'], DA: ['Indianapolis'] }, goals = { AA: { deals: 10, bonus: 10000 }, DA: { deals: 10, bonus: 10000 } };
  var tabs = ['overview', 'aa', 'da', 'nd', 'payout', 'boost', 'criteria', 'rules', 'editor'];
  A.getAuthState = function () { return { ok: true, email: DEMO_USER.email, role: 'admin', tabs: tabs }; };
  A.getDashboardData = function () { return { generatedAt: new Date().toISOString(), count: deals.length, deals: deals, targets: targets, newMarkets: newMarkets, customRules: rules, newMarketGoals: goals, role: 'admin', tabs: tabs, email: DEMO_USER.email }; };
  A.saveTargets = function (t, obj) { if (obj && typeof obj === 'object') { var src = obj.targets || obj; Object.keys(src).forEach(function (k) { targets[k] = src[k]; }); } return { ok: true, targets: targets }; };
  A.resetTargets = function () { return { ok: true, targets: targets }; };
  A.saveCustomRules = function (t, r) { rules = r || []; return { ok: true, customRules: rules }; };
})();
