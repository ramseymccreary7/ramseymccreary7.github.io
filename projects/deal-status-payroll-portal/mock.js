(function () {
try { localStorage.setItem('nw_dealwire_token', JSON.stringify({ t: 'demo-token', exp: Date.now() + 864e5 })); } catch (e) {}
  var F = FAKE.seed(404), A = MOCK_API, now = new Date();
  var offices = ['Atlanta', 'Atlanta North', 'Denver', 'Denver South'];
  var buyers = ['Keystone Rentals LLC', 'Bluebird Homes LLC', 'Harbor Flip Co', 'Pinecrest Investments', 'Summit Path Holdings', 'Redwood Equity LLC'];
  var agentsByOffice = {}; offices.forEach(function (o) { agentsByOffice[o] = F.people(6); });
  var deals = [], items = [], payRows = [], seq = 1000;
  function mdy(d) { return F.mdy(d); }
  function dt(d) { return F.mdy(d) + ' ' + ((d.getHours() % 12) || 12) + ':' + String(d.getMinutes()).padStart(2, '0') + (d.getHours() < 12 ? ' AM' : ' PM'); }
  for (var i = 0; i < 34; i++) {
    var off = F.pick(offices), team = agentsByOffice[off], stage = i < 12 ? 'Pre Close' : 'Sold', closeout = F.chance(0.6) ? 'Double Close' : 'Assignment';
    var acq = Math.round(F.r(95000, 310000) / 500) * 500, spread = Math.round(F.r(9000, 26000) / 50) * 50, disp = acq + spread, hold = F.pick([0, 0, 500, 1000]);
    var pah = spread - hold - F.i(0, 1200), dispClose = F.daysAgo(stage === 'Sold' ? F.i(1, 28) : -F.i(1, 14)), acqClose = new Date(dispClose.getTime() - F.i(0, 3) * 864e5);
    var dp = Math.round(disp * F.pick([0.05, 0.1]) / 100) * 100, em = F.pick([1000, 2000, 2500]), admin = F.pick([995, 1495, 1995]);
    var id = 'DL-' + (24000 + i * 13), city = off.replace(/ (North|South)$/, ''), st = city === 'Atlanta' ? 'GA' : 'CO';
    var addr = F.address() + ', ' + city + ', ' + st + ' ' + F.zip();
    var wires = [], cover = { DP: 0, ADMIN: 0, EMD: 0, ASSIGN: 0 };
    if (F.chance(0.85)) { wires.push({ type: 'Down Payment', date: mdy(F.daysAgo(F.i(3, 20))), amount: dp, seq: '1 of 1', total: dp, expected: dp, variance: 0, status: stage === 'Sold' ? 'Posted' : 'Approved', flag: '', note: '' }); cover.DP = 1; }
    if (F.chance(0.75)) { var v = F.chance(0.15) ? -F.i(50, 400) : 0; wires.push({ type: 'Admin Fee', date: mdy(F.daysAgo(F.i(3, 20))), amount: admin + v, seq: '1 of 1', total: admin + v, expected: admin, variance: v, status: v ? 'Flagged' : 'Posted', flag: v ? 'Short vs Salesforce' : '', note: '' }); cover.ADMIN = 1; }
    if (closeout === 'Assignment' && F.chance(0.7)) { wires.push({ type: 'Assignment Fee', date: mdy(F.daysAgo(F.i(1, 10))), amount: spread, seq: '1 of 1', total: spread, expected: spread, variance: 0, status: 'In review', flag: '', note: '' }); cover.ASSIGN = 1; }
    if (F.chance(0.6)) { wires.push({ type: 'EMD', date: mdy(F.daysAgo(F.i(10, 30))), amount: em, seq: '1 of 1', total: em, expected: em, variance: 0, status: 'Posted', flag: '', note: '' }); cover.EMD = 1; }
    var coverage = [['DP', 'Down Payment'], ['ADMIN', 'Admin Fee'], ['EMD', 'EMD'], ['ASSIGN', 'Assignment Fee']].map(function (c) {
      var why = c[0] === 'ASSIGN' && closeout !== 'Assignment' ? 'Double close — no assignment fee' : '';
      return { label: c[1], state: cover[c[0]] ? 'Yes' : (why ? 'N/A' : 'No'), count: cover[c[0]], why: why }; });
    var aa = F.pick(team), da = F.pick(team), aa2 = F.chance(0.25) ? F.pick(team) : '';
    var fields = [['Stage', stage], ['Closeout Type', closeout], ['Buyer Entity', F.pick(buyers)], ['Down Payment', dp, 1], ['Earnest Money', em, 1], ['Admin Fee', admin, 1], ['Marketing Holdback', hold, 1], ['Acquisition Close Date', mdy(acqClose)], ['Disposition Close Date', mdy(dispClose)]]
      .map(function (f) { return f[2] ? { label: f[0], value: '$' + f[1].toLocaleString(), amount: f[1] } : { label: f[0], value: f[1] }; });
    var d = { id: id, name: addr, office: off, stage: stage, closeout: closeout, buyer: fields[2].value, acqClose: mdy(acqClose), dispClose: mdy(dispClose), dispTs: dispClose.getTime(),
      expected: { dp: dp, em: em, admin: admin },
      team: [{ label: 'Primary AA', value: aa }, { label: 'Secondary AA', value: aa2 }, { label: 'Additional AA', value: '' }, { label: 'Primary DA', value: da }, { label: 'Secondary DA', value: '' }, { label: 'Additional DA', value: '' }],
      prices: [{ label: 'Acquisition Price', amount: acq }, { label: 'Disposition Price', amount: disp }, { label: 'Profit after Holdback', amount: pah }],
      coverage: coverage, missing: coverage.filter(function (c) { return c.state === 'No'; }).length, wires: wires, requests: [], questions: [], itemIds: [], fields: fields,
      values: { 'Down Payment': String(dp), 'Admin Fee': String(admin), 'Earnest Money': String(em) }, link: '#' };
    deals.push(d);
    if (stage === 'Sold') {
      var created = F.daysAgo(F.i(0, 5)), cut = new Date(Date.now() + (F.chance(0.85) ? F.r(2, 140) : -F.r(5, 48)) * 3600e3);
      var split = !!aa2, aaPct = 20, daPct = 18, ags = [];
      function ag(role, type, name, pct) { var pay = Math.round(pah * pct) / 100, best = F.chance(0.6), bp = best ? F.pick([2, 3, 5]) : 0;
        return { role: role, type: type, name: name, pay: pay, pct: pct, bonus: { pct: bp, pay: Math.round(pah * bp) / 100, est: true, why: 'T3M ' + F.i(3, 7) + ' units', win: '' },
          total: { pct: pct + bp, pay: Math.round((pay + pah * bp / 100) * 100) / 100, est: true } }; }
      ags.push(ag('Primary AA', 'AA', aa, split ? aaPct / 2 : aaPct)); if (split) ags.push(ag('Secondary AA', 'AA', aa2, aaPct / 2)); ags.push(ag('Primary DA', 'DA', da, daPct));
      var vs = F.pick(['valid', 'valid', 'valid', 'issues', 'changed', 'none']);
      var val = vs === 'none' ? { state: 'none', label: 'Not validated', checks: [], notes: 'Not run through the Payroll Validation tool yet.' }
        : { state: vs, label: { valid: 'Validated', issues: 'Validation issues', changed: 'Changed since validation' }[vs], at: dt(F.daysAgo(1)), by: 'Payroll Validation tool',
            checks: [{ label: 'Profit After Holdback', text: vs === 'issues' ? '✘ docs $' + (pah + 350).toLocaleString() + ' vs SF $' + pah.toLocaleString() : '✔ $' + pah.toLocaleString() }, { label: 'Primary AA Base', text: '✔' }, { label: 'Primary DA Base', text: '✔' }],
            notes: vs === 'issues' ? 'Settlement statement shows a $350 misc credit not on the deal.' : '' };
      payRows.push({ payrollId: 'PR-' + (5000 + i), payroll: 'PAY-' + (88000 + i), created: mdy(created), submitted: dt(created), cutoffTs: cut.getTime(),
        cutoffLabel: cut.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' }) + ' at 12:00 PM CT', recordType: 'Base', stage: 'Submitted',
        id: id, name: addr, office: off, market: city, closeout: closeout, dispClose: mdy(dispClose), dispTs: dispClose.getTime(), pah: pah, agents: ags, validation: val, values: {},
        dealFields: fields, payrollFields: [{ label: 'Record Type', value: 'Base' }, { label: 'Stage', value: 'Submitted' }], link: '#', payrollLink: '#', itemIds: [],
        askTopics: [{ label: 'Payroll · Profit After Holdback', sf: '' }, { label: 'Payroll · Primary AA Pay', sf: '' }, { label: 'Payroll · Deal payroll in general', sf: '' }] });
    }
  }
  // a few existing threads
  function addItem(kind, d, extra, thread) {
    var id = (kind === 'request' ? 'CR-' : 'Q-') + (++seq);
    var it = Object.assign({ kind: kind, id: id, dealId: d.id, deal: d.name, office: d.office, mine: true, payroll: false, submitted: mdy(F.daysAgo(3)), by: DEMO_USER.email, waitingOn: 'Accounting', thread: thread || [] }, extra);
    items.unshift(it); d.itemIds.push(id); return it;
  }
  addItem('question', deals[14], { topic: 'Admin Fee', type: 'Amount lower than expected', question: 'Admin fee wire came in $250 short — was a credit given at closing?', status: 'Answered', answer: 'Yes, a $250 seller credit was applied. Salesforce updated.', answeredBy: 'Accounting', answeredAt: mdy(F.daysAgo(1)), closed: true, waitingOn: '' },
    [{ at: dt(F.daysAgo(1)), from: 'Accounting', side: 'Accounting', via: 'Email reply', text: 'Yes, a $250 seller credit was applied at closing. Salesforce is updated.' }]);
  addItem('request', deals[16], { lines: [{ field: 'Buyer Entity', current: deals[16].buyer, requested: 'Harbor Flip Co', status: 'New' }], reason: 'Buyer assigned to their LLC', notes: '', status: 'New', closed: false });
  A.dashGetData = function () { return { user: { name: 'Demo Viewer', email: DEMO_USER.email, role: 'Admin', offices: ['All offices'], payroll: true }, offices: offices.slice().sort(), deals: deals, items: items,
    changeFields: [{ label: 'Buyer Entity', sf: 'Buyer', input: 'Text', paySf: '' }, { label: 'Down Payment', sf: 'DP', input: 'Amount', paySf: '' }, { label: 'Admin Fee', sf: 'Admin', input: 'Amount', paySf: '' }, { label: 'Disposition Close Date', sf: 'Close', input: 'Date', paySf: '' }],
    askTopics: [{ label: 'Acquisition Price', sf: '' }, { label: 'Disposition Price', sf: '' }, { label: 'Wires / money received', sf: '' }, { label: 'Deal in general', sf: '' }, { label: 'Other', sf: '' }],
    sfLogo: '', questionTypes: ['General question', 'Amount lower than expected', 'Amount higher than expected', 'Missing / blank field', 'Value looks wrong', 'Date / timing', 'Other'], refreshed: dt(now) }; };
  A.dashGetPayroll = function () { return { rows: payRows, now: Date.now(), cutoffExempt: false, offices: offices.slice().sort(),
    changeFields: [{ label: 'Payroll · Profit After Holdback', sf: 'PAH', input: 'Amount', paySf: '' }, { label: 'Payroll · Primary AA', sf: 'AA1', input: 'Agent', paySf: 'AA1$' }, { label: 'Payroll · Primary DA', sf: 'DA1', input: 'Agent', paySf: 'DA1$' }],
    askTopics: [], refreshed: dt(now) }; };
  function find(id) { return deals.filter(function (d) { return d.id === id; })[0]; }
  function sub(p, kind, pay) { var d = find(p.dealId); if (!d) return { ok: false, message: 'Deal not found' };
    var it = kind === 'request' ? addItem('request', d, { payroll: pay, lines: (p.items || []).map(function (x) { return { field: x.field, current: x.current || '', requested: x.value || x.pay || '', status: 'New' }; }), reason: p.reason, notes: p.notes, status: 'New', closed: false })
      : addItem('question', d, { payroll: pay, topic: p.topic, type: p.type, question: p.question, status: 'New', answer: '', closed: false });
    if (pay) payRows.forEach(function (r) { if (r.id === d.id) r.itemIds.push(it.id); });
    setTimeout(function () { it.thread.push({ at: dt(new Date()), from: 'Accounting', side: 'Accounting', via: 'Email reply', text: 'Got it — looking into this now. (demo auto-reply)' }); it.waitingOn = 'Requester'; }, 5000);
    return { ok: true, id: it.id, message: 'Accounting was emailed (demo — no email actually sent).' }; }
  A.dashSubmitChange = function (t, p) { return sub(p, 'request', false); };
  A.dashSubmitPayrollChange = function (t, p) { return sub(p, 'request', true); };
  A.dashAskAccounting = function (t, p) { return sub(p, 'question', false); };
  A.dashAskPayroll = function (t, p) { return sub(p, 'question', true); };
  A.dashFollowUp = function (t, p) { var it = items.filter(function (x) { return x.id === p.id; })[0]; if (it) { it.thread.push({ at: dt(new Date()), from: 'You', side: 'Requester', via: 'Dashboard', text: p.text }); it.waitingOn = 'Accounting'; } return { ok: true, message: 'Accounting will see it in their inbox.' }; };
  A.dashArchiveItem = function (t, p) { return { ok: true, message: p.archive ? 'Thread archived.' : 'Thread restored.' }; };
  A.dashRequestCode = function () { return { ok: true }; };
  A.dashVerifyCode = function (e) { return { ok: true, token: 'demo-token' }; };
})();
