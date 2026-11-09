(function () {
  var F = FAKE.seed(303), A = MOCK_API;
  var now = new Date(), months = F.months(14).map(function (m) { return m + '-01'; }); // last 14 months
  var curM = months[months.length - 1];
  function addM(ym1, k) { var p = ym1.split('-'); var d = new Date(+p[0], +p[1] - 1 + k, 1); return F.ym(d) + '-01'; }
  function lastDay(ym1) { var p = ym1.split('-'); return F.ymd(new Date(+p[0], +p[1], 0)); }
  var offs = F.shuffle(F.OFFICES).slice(0, 9), consultants = F.people(9);
  var assignments = [], agents = [], history = [], insights = [], lessons = [], responses = [];
  // company series
  months.forEach(function (m) { history.push({ aid: 'ALL', series: 'Company', month: m, units: F.round(F.r(520, 640), 1), volume: Math.round(F.r(6.8e6, 8.4e6)), offers: F.i(5200, 6400), available: F.i(900, 1200), agents: F.i(260, 300), daagents: F.i(90, 110), partial: m === curM ? 'Y' : '' }); });
  offs.forEach(function (o, i) {
    var aid = 'A' + String(i + 1).padStart(2, '0'), type = i % 3 === 0 ? 'Travel' : 'Home';
    var startIdx = 3 + (i % 6), start = months[startIdx], end = lastDay(addM(start, 2));
    var ended = end < F.ymd(now), cohortN = F.i(3, 6), cname = consultants[i];
    var cohort = F.people(cohortN + 1).slice(1).map(function (n) { var u6 = F.round(F.r(6, 30), 1), v6 = Math.round(u6 * F.r(9000, 15000)); var lift = F.r(1.05, 1.6); return { n: n, u6: u6, v6: v6, wu: F.round(u6 * lift, 1), wv: Math.round(v6 * lift * F.r(0.95, 1.08)) }; });
    var bu = cohort.reduce(function (s, c) { return s + c.u6; }, 0) / 2, bv = cohort.reduce(function (s, c) { return s + c.v6; }, 0) / 2;
    var cu = cohort.reduce(function (s, c) { return s + c.wu; }, 0) / 2, cv = cohort.reduce(function (s, c) { return s + c.wv; }, 0) / 2;
    var incU = Math.max(0, cu - bu), incV = Math.max(0, cv - bv), uP = F.pick([0.01, 0.015, 0.02, 0.025]), vP = F.pick([0.02, 0.03, 0.035, 0.04]);
    var perf = ended ? Math.round((uP + vP) * F.r(180000, 380000) * 100) / 100 : '', tf = type === 'Travel' ? 1500 * 3 : 0;
    assignments.push({ aid: aid, consultant: cname, type: type, homeoffice: type === 'Travel' ? F.pick(F.OFFICES).office : o.office, consultingoffice: o.office, displayoffice: o.office,
      snowflakeoffices: o.office, surveyaliases: cname.toLowerCase(), gm: F.person(), ui: 'R-' + (i + 1), travelfeepermonth: type === 'Travel' ? 1500 : '', agreementsigned: F.ymd(new Date(new Date(start).getTime() - 3 * 864e5)),
      start: start, end: end, notes: '', travelfee: tf, performancecomp: perf, officeperformancecomp: 0, totalcomp: ended ? perf + tf : '', paiddate: ended ? F.ymd(new Date(new Date(end).getTime() + 18 * 864e5)) : '',
      netsuiteje: ended ? 'JE-DEMO-' + (100 + i) : '', paidto: ended ? cname.split(' ')[1] + ' Properties LLC' : '', chargetogm: '', compsheet: type === 'Travel' ? 'Travel' : 'Home Office', cohortsize: cohortN,
      baselineunits: F.round(bu, 2), baselinevolume: Math.round(bv), cohortunits: F.round(cu, 2), cohortvolume: Math.round(cv), consultantunits: F.round(F.r(8, 24), 1), consultantvolume: Math.round(F.r(90000, 300000)),
      increaseunits: F.round(incU, 2), increasevolume: Math.round(incV), unittierpct: uP, volumetierpct: vP });
    cohort.forEach(function (c) { agents.push({ aid: aid, agent: c.n, filet6munits: c.u6, filet6mvolume: c.v6, windowunits: c.wu, windowvolume: c.wv, termdate: '' }); });
    // monthly series
    var offBase = F.r(22, 48), cohBase = bu / 3, conBase = F.r(3, 8);
    months.forEach(function (m, k) {
      var during = m >= start && m <= end, after = m > end, boost = during ? F.r(1.15, 1.45) : after ? F.r(1.05, 1.25) : 1, partial = m === curM ? 'Y' : '';
      var pf = partial ? 0.35 : 1;
      var ou = F.round(offBase * boost * F.r(0.85, 1.15) * pf, 1);
      history.push({ aid: aid, series: 'Office', month: m, units: ou, volume: Math.round(ou * F.r(9500, 12500)), offers: F.i(260, 480), available: F.i(45, 80), agents: F.i(6, 12), daagents: F.i(8, 12), partial: partial });
      var cu1 = F.round(cohBase * boost * F.r(0.8, 1.2) * pf, 1);
      history.push({ aid: aid, series: 'Cohort', month: m, units: cu1, volume: Math.round(cu1 * F.r(9000, 13000)), offers: F.i(60, 140), available: F.i(10, 25), agents: cohortN, daagents: '', partial: partial });
      var su = F.round(conBase * F.r(0.7, 1.3) * pf, 1);
      history.push({ aid: aid, series: 'Consultant', month: m, units: su, volume: Math.round(su * F.r(9000, 13000)), offers: F.i(30, 70), available: F.i(4, 10), agents: 1, daagents: '', partial: partial });
    });
    // surveys
    if (ended || F.chance(0.4)) {
      var gmN = 1, agN = F.i(2, 4);
      for (var g = 0; g < gmN; g++) responses.push({ party: 'GM', ts: end + 'T15:00:00.000Z', who: assignments[i].gm, office: o.office, consultantRaw: cname, aid: aid,
        scores: { lift: F.i(3, 5), comm: F.i(3, 5), expertise: F.i(4, 5) }, scoreLabels: { lift: 'Impact on units and volume', comm: 'Communication', expertise: 'Expertise' },
        mode: F.pick(['Genuinely improved the team', 'Temporary bump']), recommend: F.pick(['Yes', 'Yes', 'Mixed']),
        qa: [{ q: 'What did the consultant do well?', a: F.pick(['Ran daily call blocks and coached negotiation on live deals.', 'Brought a repeatable offer process the team kept using.', 'Strong on pricing and follow-up discipline.']) },
             { q: 'What could be improved?', a: F.pick(['More time with the newest agents.', 'Clearer weekly goals at the start.', 'Earlier kickoff with the GM.']) }] });
      for (var a2 = 0; a2 < agN; a2++) responses.push({ party: 'Agents', ts: end + 'T16:00:00.000Z', who: '', office: o.office, consultantRaw: cname, aid: aid,
        scores: { effective: F.i(3, 5) }, scoreLabels: { effective: 'How effective was the consultant?' }, mode: F.pick(['Genuinely improved the team', 'Temporary bump', 'Genuinely improved the team']), recommend: '',
        qa: [{ q: 'Most useful thing you learned', a: F.pick(['Scripts for seller objections.', 'How to structure my day around offers.', 'Pricing off comps faster.', 'Follow-up cadence.']) }] });
      responses.push({ party: 'Consultant', ts: end + 'T17:00:00.000Z', who: '', office: o.office, consultantRaw: cname, aid: aid, scores: { experience: F.i(4, 5) }, scoreLabels: { experience: 'Rate your experience' },
        mode: '', recommend: '', again: F.pick(['Yes', 'Yes', 'Maybe']), againText: 'Would do another round.', qa: [{ q: 'What would make the next round better?', a: 'A cohort picked with the GM before day one.' }] });
      insights.push({ aid: aid, party: 'GM', type: 'High', text: 'Team kept the daily offer cadence after the round ended.' });
      insights.push({ aid: aid, party: 'Agents', type: 'Low', text: 'Newer agents wanted more one-on-one time.' });
    }
  });
  lessons = [
    { section: 'What worked', lesson: 'Picking the cohort with the GM before the start date' }, { section: 'What worked', lesson: 'Daily call blocks run by the consultant' },
    { section: "What didn't", lesson: 'Rounds without a tracked cohort are hard to evaluate' }, { section: "What didn't", lesson: 'Starting mid-month muddies the baseline' },
    { section: 'Next round', lesson: 'Set weekly targets in the kickoff meeting' }, { section: 'Next round', lesson: 'Survey agents at the midpoint as well as the end' }];
  var agentPay = {};
  assignments.forEach(function (a) { agentPay[a.aid] = { month: String(a.end).slice(0, 7), grid: F.round(F.r(0.2, 0.3), 3), pay: Math.round(F.r(3000, 9000)), from: '', to: '', avgUnits: 3, avgVolume: 40000, state: 'TX' }; });
  var viewer = { email: DEMO_USER.email, name: 'Demo Viewer', admin: true, approver: true };
  A.whoAmI = function () { return { mode: 'staff' }; };
  A.getDashboard = function () { return { viewer: viewer, planBadges: { build: 0, pending: 0 }, asOf: F.ymd(now), assignments: assignments, agents: agents, history: history, insights: insights, lessons: lessons,
    gmSplitRate: 0.05, agentPay: agentPay, responses: responses, surveyMeta: [{ party: 'GM', n: 3, ok: true }, { party: 'Agents', n: 9, ok: true }, { party: 'Consultant', n: 3, ok: true }], unmatched: [], surveyLinks: [] }; };
  A.saveLessons = function (t, rows) { lessons = rows.map(function (r) { return { section: r[0] || r.section, lesson: r[1] || r.lesson }; }); return lessons; };
  A.refreshSurveys = function () { return { responses: responses, surveyMeta: [], unmatched: [] }; };
  var settings = { maxVolumePct: 0.4, hardCapVolumePct: 0.42, defaultGmRate: 0.1, maxGmRate: 0.1, defaultTravelFee: 1500, maxTravelFee: 2000, defaultDealTiers: '3, 5, 7, 9, 11, 13, 15', baselineMonths: 6, assignmentMonths: 3, legalRecipients: '', dashboardUrl: '', buffers: [] };
  for (var b = 0; b < 94; b++) { var up = 100000 + b * 25000; settings.buffers.push({ lower: b ? up - 24999 : 0, upper: up, buffer: up + (up <= 400000 ? 125000 : up <= 575000 ? 200000 : 250000) }); }
  var allAgents = F.people(60).map(function (n) { var o = F.pick(F.OFFICES); return { n: n, o: o.office, p: F.chance(0.7) ? 'Acquisition Agent' : 'Disposition Agent', s: 'Active' }; });
  A.getPlanBootstrap = function () { var ym = F.ym(now), lc = F.ym(new Date(now.getFullYear(), now.getMonth() - 1, 1));
    return { settings: settings, agents: allAgents, offices: Array.from(new Set(allAgents.map(function (a) { return a.o; }))).sort(), latest: ym, latestComplete: lc, thisMonth: ym, problems: [], mine: [], approver: true, pending: [], recent: [],
      data: { tab: 'Agent KPI Data', from: F.months(18)[0], to: ym, sourceRows: 4200, agents: allAgents.length } }; };
  A.listPlans = function () { return { mine: [], pending: [], recent: [] }; };
  A.getActivePlans = function () { return { today: F.ymd(now), dataThrough: F.ymd(now), latest: F.ym(now), tab: 'Agent KPI Data', problems: [], settings: settings, dataMonths: F.months(18), active: [], upcoming: [], finished: [] }; };
})();
