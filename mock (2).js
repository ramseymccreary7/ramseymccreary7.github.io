(function () {
  var F = FAKE.seed(909), A = MOCK_API, MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var months = [], y = 2023, m = 1; // Jan-23 .. Oct-26
  while (y < 2026 || (y === 2026 && m <= 10)) { months.push({ y: y, m: m, label: MON[m - 1] + '-' + String(y).slice(-2) }); m++; if (m > 12) { m = 1; y++; } }
  var M = months.length, ttmS = M - 12, season = [0.07, 0.075, 0.09, 0.09, 0.088, 0.085, 0.083, 0.087, 0.082, 0.085, 0.078, 0.077];
  var EXTRA = [['Chicago','IL'],['Detroit','MI'],['Cleveland','OH'],['Cincinnati','OH'],['Pittsburgh','PA'],['Philadelphia','PA'],['Baltimore','MD'],['Richmond','VA'],['Raleigh','NC'],['Greenville','SC'],
    ['Columbia','SC'],['Louisville','KY'],['Milwaukee','WI'],['Minneapolis','MN'],['Omaha','NE'],['Des Moines','IA'],['Oklahoma City','OK'],['Tulsa','OK'],['Little Rock','AR'],['Baton Rouge','LA'],
    ['New Orleans','LA'],['Jackson','MS'],['Huntsville','AL'],['Albuquerque','NM'],['Tucson','AZ'],['Salt Lake City','UT'],['Boise','ID'],['Sacramento','CA'],['Riverside','CA'],['Spokane','WA'],['Portland','OR'],['El Paso','TX']];
  var ALL = F.OFFICES.map(function (o) { return { office: o.office, state: o.state }; }).concat(EXTRA.map(function (x) { return { office: x[0], state: x[1] }; }));
  var seenO = {}; ALL = ALL.filter(function (o) { if (seenO[o.office]) return false; seenO[o.office] = 1; return true; });
  ALL.sort(function (a, b) { return a.office.localeCompare(b.office); });
  var offices = ALL.map(function (o, k) {
    var lvl = F.r(60, 240), dpd = F.r(11000, 17500), trend = F.r(-0.01, 0.02), d = [], v = [];
    months.forEach(function (mo, i) { var x = Math.max(0, Math.round(lvl * (1 + trend * i / 2) * season[mo.m - 1] * 12 * F.r(0.8, 1.2) * 2) / 2); d.push(x); v.push(Math.round(x * dpd * F.r(0.9, 1.1))); });
    return { n: o.office, s: o.state, d: d, v: v, r: 'Active' };
  });
  var inactive = [{ n: 'Fresno', s: 'CA', d: months.map(function (_, i) { return i < M - 8 ? F.i(0, 3) : 0; }), v: months.map(function (_, i) { return i < M - 8 ? F.i(0, 3) * 12000 : 0; }), r: 'No deals Aug-26 – Oct-26' }];
  var ref = { months: months.map(function (x) { return x.label; }), years: months.map(function (x) { return x.y; }), mons: months.map(function (x) { return x.m; }),
    ttmStart: ttmS, latest: months[M - 1].label, ttmLabel: months[ttmS].label + ' – ' + months[M - 1].label, recentLabel: months[M - 3].label + ' – ' + months[M - 1].label,
    offices: offices, inactive: inactive, season: { d: season, v: season }, companyDpd: 14200 };
  var dirs = F.people(4).map(function (n) { return { email: F.email(n), name: n }; });
  var mineInputs = {};
  offices.slice(0, 6).forEach(function (o) { var ttm = o.d.slice(ttmS).reduce(function (a, b) { return a + b; }, 0); mineInputs[o.n] = { d: Math.round(ttm * F.r(1.0, 1.2)), p: null, n: F.chance(0.4) ? 'New GM starting Q1; expect ramp.' : '', at: new Date().toISOString(), dm: 'n', dp: null }; });
  var status = { status: 'In progress', submitted: false, note: '', submittedAt: '', lastEditAt: new Date().toISOString(), reopenedBy: '', reopenedAt: '' };
  var due = new Date(); due.setDate(due.getDate() + 10);
  A.getAuthState = function () { return { ok: true, email: DEMO_USER.email }; };
  A.getBootstrap = function () { return { viewer: { email: DEMO_USER.email, name: 'Demo Viewer', director: true, master: true, admin: true },
    meta: { fy: 2027, py: 2025, noteThreshold: 0.10, requireNotes: false, seasonYears: [2024, 2025], inactiveMonths: 3, due: { at: due.getTime(), label: due.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }), endOfDay: true } },
    ref: ref, epoch: '1', url: '', mine: { inputs: mineInputs, status: status } }; };
  A.getMine = function () { return { ref: ref, mine: { inputs: mineInputs, status: status }, epoch: '1' }; };
  A.saveInputs = function (t, rows) { (rows || []).forEach(function (r) { var k = r.office || r.Office || r.o; if (k) mineInputs[k] = Object.assign(mineInputs[k] || {}, { d: r.d, p: r.p, n: r.n || '', dm: r.dm || 'n', dp: r.dp == null ? null : r.dp, at: new Date().toISOString() }); }); status.lastEditAt = new Date().toISOString(); return { ok: true, mine: { inputs: mineInputs, status: status }, at: status.lastEditAt }; };
  A.saveOverallNote = function (t, note) { status.note = note; return { ok: true, status: status }; };
  A.submitInputs = function () { status.status = 'Submitted'; status.submitted = true; status.submittedAt = new Date().toISOString(); return { ok: true, status: status }; };
  A.getMaster = function () {
    var directors = dirs.map(function (d, i) { var inp = {}; offices.forEach(function (o, j) { if (j % 4 === i || F.chance(0.5)) { var ttm = o.d.slice(ttmS).reduce(function (a, b) { return a + b; }, 0); inp[o.n] = { d: Math.round(ttm * F.r(0.92, 1.25)), p: null, n: '', at: new Date().toISOString(), dm: 'n', dp: null }; } });
      var st = ['Submitted', 'In progress', 'Submitted', 'Not started'][i]; return { email: d.email, name: d.name, removed: false, status: { status: st, submitted: st === 'Submitted', note: '', submittedAt: st === 'Submitted' ? new Date().toISOString() : '', lastEditAt: st !== 'Not started' ? new Date().toISOString() : '', reopenedBy: '', reopenedAt: '' }, inputs: st === 'Not started' ? {} : inp, offices: null }; });
    return { directors: directors, noEmail: [], mapping: false, unassigned: [], mapProblems: [], ref: ref, at: new Date().toISOString() }; };
  A.reopenDirector = function () { return { ok: true }; };
  A.sendReminder = function () { return { ok: true, message: 'Reminder sent (demo — no email sent).' }; };
})();
