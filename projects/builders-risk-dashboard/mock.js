(function () {
  var F = FAKE.seed(1111), A = MOCK_API;
  var metros = [['Dallas–Fort Worth', 'TX', 32.8, -97.03], ['Houston', 'TX', 29.76, -95.37], ['San Antonio', 'TX', 29.42, -98.49], ['Austin', 'TX', 30.27, -97.74], ['Atlanta', 'GA', 33.75, -84.39], ['Phoenix', 'AZ', 33.45, -112.07], ['Tampa', 'FL', 27.95, -82.46], ['Charlotte', 'NC', 35.23, -80.84], ['Nashville', 'TN', 36.16, -86.78], ['Denver', 'CO', 39.74, -104.99]];
  var lenders = ['Atlas Lending', 'Atlas Lending', 'Atlas Lending', 'Keystone Capital', 'Ridgeline Funding', 'Harborview Bank', 'Private', 'Cash', 'Unassigned'];
  var statuses = ['Accepted', 'Accepted', 'Accepted', 'Accepted', 'Quoted', 'Quoted', 'Development', 'Rejected', 'Cancelled', 'Draft', 'Referred to Underwriting'];
  var rows = [];
  for (var i = 0; i < 260; i++) {
    var m = F.pick(metros), tiv = Math.round(F.r(120000, 650000) / 1000) * 1000, term = F.chance(0.6) ? '12-Month' : '6-Month';
    var rate = F.r(0.0045, 0.009) * (term === '12-Month' ? 1 : 0.62), created = F.daysAgo(F.i(0, 420));
    var eff = new Date(created.getTime() + F.i(1, 20) * 864e5), lat = m[2] + F.r(-0.35, 0.35), lng = m[3] + F.r(-0.4, 0.4);
    rows.push({ leadSource: F.pick(['Agent Referral', 'Lender Referral', 'Website', 'Partner']), status: F.pick(statuses), insured: F.pick(['Oak', 'River', 'Summit', 'Harbor', 'Granite', 'Prairie', 'Copper', 'Lantern']) + ' ' + F.pick(['Homes', 'Builders', 'Holdings', 'Renovations']) + ' LLC',
      address: F.address(), city: m[0].split('–')[0], state: m[1], zip: F.zip(), product: F.pick(['Renovation', 'Renovation', 'New Construction']), effective: F.ymd(eff), created: F.ymd(created) + ' 10:' + String(F.i(10, 59)),
      term: term, tiv: tiv, premium: Math.round(tiv * rate), deductible: F.pick([1000, 2500, 5000]), catDed: F.chance(0.3) ? 'Wind/Hail' : '', catAmt: F.chance(0.3) ? F.pick([5000, 10000]) : null, otherIns: F.chance(0.15) ? 'General Liability' : '', otherPrem: null,
      lender: F.pick(lenders), lat: F.round(lat, 4), lng: F.round(lng, 4), metro: m[0] });
  }
  A.getDashboardData = function () { return { viewer: { name: 'Demo Viewer' }, rows: rows, geoPending: 0, refreshMinutes: 60, build: '', appUrl: '', generatedAt: new Date().toISOString() }; };
})();
