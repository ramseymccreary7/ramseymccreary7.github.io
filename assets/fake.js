/* Seeded fake-data helpers shared by every demo. All people, companies and numbers are fictional. */
(function () {
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  var F = {};
  F.seed = function (s) { F.rnd = mulberry32(s); return F; };
  F.seed(20261109);
  F.r = function (a, b) { return a + (b - a) * F.rnd(); };
  F.i = function (a, b) { return Math.floor(F.r(a, b + 1)); };
  F.pick = function (arr) { return arr[Math.floor(F.rnd() * arr.length)]; };
  F.chance = function (p) { return F.rnd() < p; };
  F.norm = function (m, sd) { var u = 1 - F.rnd(), v = F.rnd(); return m + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  F.round = function (x, n) { var p = Math.pow(10, n || 0); return Math.round(x * p) / p; };
  F.shuffle = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(F.rnd() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  F.FIRST = ['Avery','Jordan','Taylor','Morgan','Riley','Casey','Quinn','Harper','Rowan','Emerson','Logan','Parker','Reese','Sawyer','Blake','Cameron','Drew','Elliot','Finley','Hayden','Jamie','Kendall','Lane','Marlow','Noel','Peyton','Remy','Sage','Tatum','Wren','Alex','Brooke','Carter','Dana','Ellis','Frankie','Gray','Hollis','Indy','Jules','Kai','Lennox','Micah','Nico','Oakley','Presley','Rory','Shea','Teagan','Val'];
  F.LAST = ['Whitaker','Delgado','Brennan','Okafor','Lindqvist','Castillo','Pryor','Hollister','Nakamura','Ferreira','Gallagher','Abernathy','Sorensen','Valdez','McAllister','Thornton','Iverson','Kowalski','Bancroft','Ellery','Fairchild','Hendricks','Langley','Merritt','Northcott','Ostrander','Pemberton','Quintero','Radcliffe','Sterling','Tremaine','Underhill','Vance','Wexler','Yardley','Ashby','Calloway','Dunmore','Easton','Faulkner'];
  F.person = function () { return F.pick(F.FIRST) + ' ' + F.pick(F.LAST); };
  F.people = function (n) { var seen = {}, out = []; while (out.length < n) { var p = F.person(); if (!seen[p]) { seen[p] = 1; out.push(p); } } return out; };
  F.email = function (name) { return String(name).toLowerCase().replace(/[^a-z ]/g, '').trim().replace(/\s+/g, '.') + '@example.com'; };
  F.OFFICES = [
    { office: 'Dallas', market: 'Dallas', state: 'TX', region: 'Central', lat: 32.78, lng: -96.80 },
    { office: 'Fort Worth', market: 'Dallas', state: 'TX', region: 'Central', lat: 32.75, lng: -97.33 },
    { office: 'Houston', market: 'Houston', state: 'TX', region: 'Central', lat: 29.76, lng: -95.37 },
    { office: 'Austin', market: 'Austin', state: 'TX', region: 'Central', lat: 30.27, lng: -97.74 },
    { office: 'San Antonio', market: 'San Antonio', state: 'TX', region: 'Central', lat: 29.42, lng: -98.49 },
    { office: 'Phoenix', market: 'Phoenix', state: 'AZ', region: 'West', lat: 33.45, lng: -112.07 },
    { office: 'Las Vegas', market: 'Las Vegas', state: 'NV', region: 'West', lat: 36.17, lng: -115.14 },
    { office: 'Denver', market: 'Denver', state: 'CO', region: 'West', lat: 39.74, lng: -104.99 },
    { office: 'Atlanta', market: 'Atlanta', state: 'GA', region: 'East', lat: 33.75, lng: -84.39 },
    { office: 'Charlotte', market: 'Charlotte', state: 'NC', region: 'East', lat: 35.23, lng: -80.84 },
    { office: 'Tampa', market: 'Tampa', state: 'FL', region: 'East', lat: 27.95, lng: -82.46 },
    { office: 'Orlando', market: 'Orlando', state: 'FL', region: 'East', lat: 28.54, lng: -81.38 },
    { office: 'Jacksonville', market: 'Jacksonville', state: 'FL', region: 'East', lat: 30.33, lng: -81.66 },
    { office: 'Nashville', market: 'Nashville', state: 'TN', region: 'East', lat: 36.16, lng: -86.78 },
    { office: 'Memphis', market: 'Memphis', state: 'TN', region: 'Central', lat: 35.15, lng: -90.05 },
    { office: 'Kansas City', market: 'Kansas City', state: 'MO', region: 'Central', lat: 39.10, lng: -94.58 },
    { office: 'St. Louis', market: 'St. Louis', state: 'MO', region: 'Central', lat: 38.63, lng: -90.20 },
    { office: 'Indianapolis', market: 'Indianapolis', state: 'IN', region: 'Central', lat: 39.77, lng: -86.16 },
    { office: 'Columbus', market: 'Columbus', state: 'OH', region: 'East', lat: 39.96, lng: -83.00 },
    { office: 'Birmingham', market: 'Birmingham', state: 'AL', region: 'East', lat: 33.52, lng: -86.80 }
  ];
  F.STREETS = ['Maple','Oak','Cedar','Pine','Elm','Willow','Birch','Juniper','Magnolia','Hickory','Sycamore','Aspen','Laurel','Chestnut','Poplar','Cypress','Redbud','Mesquite','Dogwood','Sweetgum'];
  F.SUFFIX = ['St','Ave','Dr','Ln','Ct','Way','Blvd','Pl','Trl','Cir'];
  F.address = function () { return F.i(100, 9899) + ' ' + F.pick(F.STREETS) + ' ' + F.pick(F.SUFFIX); };
  F.zip = function () { return String(F.i(10000, 99999)); };
  F.ym = function (d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); };
  F.months = function (n, end) { end = end || new Date(); var out = []; for (var k = n - 1; k >= 0; k--) out.push(F.ym(new Date(end.getFullYear(), end.getMonth() - k, 1))); return out; };
  F.iso = function (d) { return d.toISOString(); };
  F.daysAgo = function (n) { var d = new Date(); d.setDate(d.getDate() - n); return d; };
  F.mdy = function (d) { return String(d.getMonth() + 1).padStart(2, '0') + '/' + String(d.getDate()).padStart(2, '0') + '/' + d.getFullYear(); };
  F.ymd = function (d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  // tiny inline house photo placeholder (SVG data URI) — no external images
  F.photo = function (seed) {
    var hues = [200, 28, 150, 260, 12, 190, 45], h = hues[(seed || 0) % hues.length];
    var svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 200'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='hsl(" + h + ",55%,80%)'/><stop offset='1' stop-color='hsl(" + h + ",40%,92%)'/></linearGradient></defs><rect width='320' height='200' fill='url(#g)'/><rect y='150' width='320' height='50' fill='hsl(110,30%,62%)'/><polygon points='90,95 160,45 230,95' fill='hsl(" + ((h + 180) % 360) + ",25%,38%)'/><rect x='102' y='95' width='116' height='65' fill='hsl(" + h + ",20%,97%)'/><rect x='148' y='120' width='24' height='40' fill='hsl(" + ((h + 180) % 360) + ",30%,40%)'/><rect x='114' y='108' width='22' height='18' fill='hsl(205,60%,75%)'/><rect x='184' y='108' width='22' height='18' fill='hsl(205,60%,75%)'/></svg>";
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  };
  // Company logo for the fictional brand
  F.LOGO = 'data:image/svg+xml;utf8,' + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 40'><path d='M6 32 20 8l14 24z' fill='#c9a227'/><path d='M14 32l6-10 6 10z' fill='#0f2742'/><text x='42' y='27' font-family='Georgia,serif' font-size='19' font-weight='700' fill='#0f2742'>Atlas</text></svg>");
  window.FAKE = F;
})();
