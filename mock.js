(function () {
  var F = FAKE.seed(1111), A = MOCK_API;
  var metros = [['Dallas–Fort Worth', 'TX', 32.8, -97.03], ['Houston', 'TX', 29.76, -95.37], ['Atlanta', 'GA', 33.75, -84.39], ['Phoenix', 'AZ', 33.45, -112.07], ['Tampa', 'FL', 27.95, -82.46],
    ['Charlotte', 'NC', 35.23, -80.84], ['Nashville', 'TN', 36.16, -86.78], ['Denver', 'CO', 39.74, -104.99], ['Columbus', 'OH', 39.96, -83.0], ['Indianapolis', 'IN', 39.77, -86.16],
    ['Kansas City', 'MO', 39.1, -94.58], ['Oklahoma City', 'OK', 35.47, -97.52], ['Birmingham', 'AL', 33.52, -86.8], ['Jackson', 'MS', 32.3, -90.18], ['Baton Rouge', 'LA', 30.45, -91.15],
    ['Greenville', 'SC', 34.85, -82.4], ['Louisville', 'KY', 38.25, -85.76], ['Pittsburgh', 'PA', 40.44, -79.99], ['Detroit', 'MI', 42.33, -83.05], ['Milwaukee', 'WI', 43.04, -87.91],
    ['Minneapolis', 'MN', 44.98, -93.27], ['Las Vegas', 'NV', 36.17, -115.14], ['Salt Lake City', 'UT', 40.76, -111.89], ['Albuquerque', 'NM', 35.08, -106.65], ['Boise', 'ID', 43.62, -116.2],
    ['Des Moines', 'IA', 41.59, -93.62], ['Omaha', 'NE', 41.26, -95.93], ['Little Rock', 'AR', 34.75, -92.29], ['Richmond', 'VA', 37.54, -77.44], ['Baltimore', 'MD', 39.29, -76.61],
    ['Spokane', 'WA', 47.66, -117.43], ['Portland', 'OR', 45.52, -122.68], ['Sacramento', 'CA', 38.58, -121.49], ['Wichita', 'KS', 37.69, -97.34], ['Chicago', 'IL', 41.88, -87.63]];
  var lenders = ['Atlas Lending', 'Atlas Lending', 'Atlas Lending', 'Keystone Capital', 'Ridgeline Funding', 'Harborview Bank', 'Private', 'Cash', 'Unassigned'];
  var statuses = ['Accepted', 'Accepted', 'Accepted', 'Accepted', 'Quoted', 'Quoted', 'Development', 'Rejected', 'Cancelled', 'Draft', 'Referred to Underwriting'];
  var rows = [];
  for (var i = 0; i < 420; i++) {
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
