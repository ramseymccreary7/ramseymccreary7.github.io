(function () {
  var F = FAKE.seed(101);
  var deals = [], photoCounts = {};
  var types = ['Single Family', 'Single Family', 'Single Family', 'Townhome', 'Duplex'];
  var occ = ['Vacant', 'Owner Occupied', 'Tenant Occupied', 'Vacant'];
  var districts = ['Lakeside ISD', 'North Valley SD', 'Riverside USD', 'Cedar Hills ISD', 'Eastgate County Schools', ''];
  var NOTES = ['Light rehab — paint, flooring and fixtures. Comps on the same street sold quickly.',
    'Roof replaced recently. Needs kitchen and bath updates.', 'Great rental area near schools and shopping.',
    'Foundation inspected, no issues found. Cosmetic rehab.', 'Corner lot with detached garage. Full rehab candidate.'];
  for (var i = 0; i < 140; i++) {
    var o = F.pick(F.OFFICES), sqft = F.i(950, 2900), arv = Math.round(sqft * F.r(120, 240) / 1000) * 1000;
    var created = F.daysAgo(F.i(0, 6)), fund = i % 11 === 5, id = (fund ? 'fx-' : 'd-') + (100000 + i * 37).toString(36);
    var d = {
      id: id, address: F.address(), city: o.office, state: o.state, zip: F.zip(), market: o.market, region: o.region,
      arv: fund ? null : arv, repair: fund ? null : Math.round(arv * F.r(0.08, 0.28) / 500) * 500,
      beds: F.i(2, 5), baths: F.pick([1, 1.5, 2, 2, 2.5, 3]), sqft: fund ? null : sqft, year: fund ? null : F.i(1948, 2012),
      lotSqft: null, lotAcres: F.round(F.r(0.12, 0.6), 2), lotUnverified: false, pool: F.chance(0.12), garage: F.i(0, 2),
      occupancy: F.pick(occ), schoolDistrict: F.pick(districts), unitType: F.pick(types), legal: '', attached: false,
      notes: F.chance(0.6) ? F.pick(NOTES) : '', created: F.ymd(created),
      askingPrice: F.chance(0.7) ? Math.round(arv * F.r(0.62, 0.78) / 500) * 500 : '',
      lat: F.round(o.lat + F.r(-0.18, 0.18), 5), lng: F.round(o.lng + F.r(-0.22, 0.22), 5), rank: i
    };
    if (fund) { d.source = 'fund'; d.roofAge = F.i(2, 20) + ' years'; d.hvacAge = F.i(1, 15) + ' years'; d.leasebackDays = F.pick([0, 15, 30]); d.closeDate = F.ymd(F.daysAgo(-F.i(7, 30))); d.photoLink = '#'; }
    else if (F.chance(0.65)) photoCounts[id] = F.i(4, 12);
    if (F.chance(0.3)) { d.infoFilled = true; d.hvacAge = F.i(1, 15) + ' years'; d.roofAge = F.i(1, 20) + ' years'; d.dealType = F.pick(['On Market', 'Off Platform']); }
    deals.push(d);
  }
  deals.sort(function (a, b) { return a.created < b.created ? 1 : -1; });
  deals.forEach(function (d, i) { d.rank = i; });
  var activity = {}, notes = {}, leadStatus = {};
  activity[deals[3].id] = { status: 'saved', offer: null };
  activity[deals[8].id] = { status: 'offered', offer: Math.round((deals[8].arv || 200000) * 0.6 / 1000) * 1000 };
  leadStatus[deals[8].id] = 'Under Contract';
  activity[deals[15].id] = { status: 'passed', offer: null };
  notes[deals[2].id] = [
    { side: 'me', from: 'You', at: F.ymd(F.daysAgo(1)), text: 'Is the seller open to a 21-day close?' },
    { side: 'co', from: 'Atlas Dispositions', at: F.ymd(F.daysAgo(0)), text: 'Yes — 21 days works. Inspection access any weekday.' }];
  var detailFields = [['photoLink', 'Photos', 'url'], ['askingPrice', 'Ask price', 'money'], ['hvacAge', 'HVAC age', 'text'], ['roofAge', 'Roof age', 'text'],
    ['occupancyConfirmed', 'Occupancy (confirmed)', 'text'], ['dealType', 'Deal type', 'text'], ['leasebackDays', 'Leaseback', 'days'], ['detailNotes', 'Notes', 'text'],
    ['waterHeaterAge', 'Water heater age', 'text'], ['foundationIssues', 'Foundation / plumbing issues', 'text'], ['closeDate', 'Close date', 'text'], ['leasebackNotes', 'Leaseback notes', 'text']]
    .map(function (f) { return { key: f[0], label: f[1], kind: f[2] }; });
  function payload() {
    return { ok: true, email: DEMO_USER.email, partner: 'Demo Investor Group', isAdmin: false, viewAs: '', unfiltered: false, ruleCount: 1, totalDeals: null, partners: [],
      deals: deals, infoRequested: {}, photos: { ready: true, counts: photoCounts, unknown: [] }, detailFields: detailFields,
      activity: activity, leadStatus: leadStatus, mapKey: '', notes: notes, buybox: { arvMin: 50000, arvMax: 600000, yearMin: 1940, lotMaxAcres: 5 },
      generatedAt: new Date().toISOString() };
  }
  var A = MOCK_API;
  A.getAuthState = function () { return { ok: true, email: DEMO_USER.email, partner: 'Demo Investor Group', isAdmin: false }; };
  A.getPortalData = payload;
  A.getLeadStatuses = function () { return { ok: true, notes: notes, leadStatus: leadStatus }; };
  A.getDealPhotos = function (t, ids) {
    var out = {}; ids.forEach(function (id) { var n = photoCounts[id] || 0, ps = []; for (var k = 0; k < n; k++) ps.push({ url: FAKE.photo(id.length + k + id.charCodeAt(3)) }); out[id] = { photos: ps, count: n }; }); return out;
  };
  A.setDealStatus = function (t, id, st) { if (st === 'none') delete activity[id]; else activity[id] = { status: st, offer: null }; return { ok: true, id: id, status: st }; };
  A.submitOffer = function (t, id, amt) { var prev = activity[id]; activity[id] = { status: 'offered', offer: Math.round(+String(amt).replace(/[^0-9.]/g, '')) }; leadStatus[id] = 'Not Started'; return { ok: true, id: id, status: 'offered', offer: activity[id].offer, revised: !!(prev && prev.status === 'offered') }; };
  A.requestInfo = function (t, id) { return { ok: true, saved: true, message: 'Request sent (demo) — the team would email you the details.' }; };
  A.sendDealNote = function (t, id, txt) { (notes[id] = notes[id] || []).push({ side: 'me', from: 'You', at: F.ymd(new Date()), text: txt });
    var thread = notes[id]; setTimeout(function () { thread.push({ side: 'co', from: 'Atlas Dispositions', at: F.ymd(new Date()), text: 'Thanks — (demo auto-reply) we\'ll follow up shortly.' }); }, 4000);
    return { ok: true, notes: thread.slice() }; };
  A.prepareExport = function (t, ids) { return { ok: false }; };
})();
