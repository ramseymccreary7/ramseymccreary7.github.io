(function () {
  var F = FAKE.seed(1212), A = MOCK_API, aes = F.people(7), rows = [], paid = [], est = [], fc = [];
  var lenders = ['Atlas Lending Fund I', 'Regional Bank', 'Family Office'];
  function iso(d) { return F.ymd(d); }
  var ladder = [{ tier: 1, range: '1–3', rate: 0 }, { tier: 2, range: '4–6', rate: 0.0005 }, { tier: 3, range: '7–9', rate: 0.001 }, { tier: 4, range: '10+', rate: 0.0015 }];
  aes.forEach(function (ae, k) {
    var base = F.pick([0.0025, 0.003, 0.0035]);
    for (var m = 0; m < 10; m++) {
      var n = F.i(2, 9);
      for (var j = 0; j < n; j++) {
        var close = new Date(); close.setMonth(close.getMonth() - m); close.setDate(F.i(1, 26));
        var pay = new Date(close.getTime() + 10 * 864e5); pay = pay.getDate() <= 5 ? new Date(pay.getFullYear(), pay.getMonth(), 5) : pay.getDate() <= 20 ? new Date(pay.getFullYear(), pay.getMonth(), 20) : new Date(pay.getFullYear(), pay.getMonth() + 1, 5); var amt = Math.round(F.r(95000, 340000) / 1000) * 1000, comm = Math.round(amt * base * 100) / 100;
        if (pay > new Date()) continue;
        rows.push({ paycheckDate: iso(pay), loanNo: 'AL-' + F.i(10000, 99999), salesperson: ae, property: F.address() + ', ' + F.pick(F.OFFICES).office, loanAmount: amt, loanType: F.pick(lenders),
          rate: base, commission: comm, closeDate: iso(close), payDate: iso(pay), netPay: comm, referral: F.chance(0.3) ? F.pick(F.OFFICES).office : '', notes: '' });
      }
      if (m > 0 && m < 7) { var cnt = F.i(3, 11), vol = cnt * 210000, tier = cnt >= 10 ? 4 : cnt >= 7 ? 3 : cnt >= 4 ? 2 : 1, r = ladder[tier - 1].rate, d = new Date(); d.setMonth(d.getMonth() - m + 1); d.setDate(5);
        if (r) paid.push({ paycheckDate: iso(d), bonusType: 'AE Monthly Bonus', plan: 'AE Plan', description: 'Tier ' + tier + ' volume bonus', salesperson: ae, mentee: '', loanAmount: vol, loanCount: cnt, rate: r, amount: Math.round(vol * r), bonusMonth: F.ym(new Date(d.getFullYear(), d.getMonth() - 1, 1)), payDate: iso(d), netPay: Math.round(vol * r) }); }
    }
    var cnt0 = F.i(3, 9), t0 = cnt0 >= 7 ? 3 : cnt0 >= 4 ? 2 : 1;
    est.push({ month: F.ym(new Date()), bonusType: 'AE Monthly Bonus', plan: 'AE Plan', salesperson: ae, mentee: '', loanCount: cnt0, loanAmount: cnt0 * 205000, tier: t0, rate: ladder[t0 - 1].rate, estimate: Math.round(cnt0 * 205000 * ladder[t0 - 1].rate),
      nextAt: t0 < 4 ? [4, 7, 10][t0 - 1] : null, nextRate: t0 < 4 ? ladder[t0].rate : null, nextTier: t0 < 4 ? t0 + 1 : null, ladder: ladder, unpaidCount: F.i(0, 3), unpaidVolume: F.i(0, 3) * 200000 });
    for (var q = 0; q < F.i(1, 4); q++) { var cd = F.daysAgo(F.i(0, 12)), la = Math.round(F.r(100000, 320000) / 1000) * 1000;
      fc.push({ salesperson: ae, closeDate: iso(cd), fundingDate: iso(cd), property: F.address(), lender: F.pick(lenders), loanAmount: la, rate: base, commission: Math.round(la * base), expectedPaycheck: iso(new Date(cd.getTime() + 15 * 864e5)), status: 'Upcoming' }); }
  });
  A.getAuthState = function () { return { ok: true, email: DEMO_USER.email, name: 'Demo Viewer', level: 'manager' }; };
  A.getDashboardData = function () { return { viewer: { name: 'Demo Viewer', level: 'manager' }, rows: rows, bonuses: paid, estimates: est, forecast: fc, bonusSource: 'commissions', latestPaidBonusMonth: paid.length ? paid[0].bonusMonth : '', generatedAt: new Date().toISOString() }; };
})();
