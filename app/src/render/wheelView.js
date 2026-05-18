(function () {
  function mapFactory(canvas) {
    var left = 60, right = 80, top = 40, bottom = 52;
    var sx = (canvas.width - left - right) / 1.5;
    var sy = (canvas.height - top - bottom) / 1.15;
    var scale = Math.min(sx, sy);
    var cx = canvas.width / 2, cz = canvas.height * 0.55;
    return function (x, z) { return { x: cx + x * scale, y: cz - z * scale }; };
  }
  function label(ctx, text, x, y, c) { ctx.fillStyle = c || '#1f2937'; ctx.font = '12px Arial'; ctx.fillText(text, x, y); }
  function path(ctx, pts, col, lw, dash) { if (!pts.length) return; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = lw; if (dash) ctx.setLineDash([7, 5]); ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y); for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y); ctx.closePath(); ctx.stroke(); ctx.restore(); }

  function drawWheel(canvas, state) {
    var ctx = canvas.getContext('2d'), p = state.p, g = state.last.geometry, f = state.last.contact;
    var map = mapFactory(canvas); ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = 'white'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#111827'; ctx.font = 'bold 15px Arial'; ctx.fillText('Деформация шины: вид сбоку', 16, 24);

    var A = map(-0.75, 0), B = map(0.75, 0);
    ctx.strokeStyle = window.TireLabColors.road; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke(); label(ctx, 'дорога', A.x + 12, A.y - 8);

    var out = [], ref = [], rim = [], contactX = [];
    for (var i = 0; i < p.N; i++) {
      var ph = state.phi[i], erx = Math.sin(ph), erz = -Math.cos(ph), etx = Math.cos(ph), etz = Math.sin(ph);
      ref.push(map(p.R0 * erx, state.Cz + p.R0 * erz));
      var wv = state.w[i], uv = state.u[i];
      if (p.M > 1) { var sw = 0, su = 0; for (var jj = 0; jj < p.M; jj++) { var kk = i * p.M + jj; sw += state.w2[kk]; su += state.u2[kk]; } wv = sw / p.M; uv = su / p.M; }
      out.push(map((p.R0 + wv) * erx + uv * etx, state.Cz + (p.R0 + wv) * erz + uv * etz));
      rim.push(map(p.Rrim * erx, state.Cz + p.Rrim * erz));
      if (g.pen[i] > 0) contactX.push(g.x[i]);
    }

    path(ctx, ref, window.TireLabColors.reference, 1.6, true);
    for (var j = 0; j < p.N; j++) {
      var k = (j + 1) % p.N;
      ctx.strokeStyle = window.TireLabColors.epsColor(f.eps[j], f.maxE); ctx.lineWidth = 2.1; ctx.beginPath(); ctx.moveTo(out[j].x, out[j].y); ctx.lineTo(out[k].x, out[k].y); ctx.stroke();
    }
    path(ctx, rim, window.TireLabColors.tire, 2);
    var center = map(0, state.Cz); ctx.fillStyle = '#111827'; ctx.beginPath(); ctx.arc(center.x, center.y, 3.2, 0, Math.PI * 2); ctx.fill();

    label(ctx, 'центр колеса', center.x + 10, center.y - 6);
    label(ctx, 'диск', rim[8].x + 12, rim[8].y);
    label(ctx, 'исходный контур', ref[10].x + 14, ref[10].y - 12, '#6b7280');
    label(ctx, 'деформированный контур', out[20].x + 16, out[20].y + 18, '#1d4ed8');

    if (contactX.length) {
      var xmin = Math.min.apply(null, contactX), xmax = Math.max.apply(null, contactX);
      var c1 = map(xmin, 0), c2 = map(xmax, 0); ctx.fillStyle = 'rgba(250,204,21,0.35)'; ctx.fillRect(c1.x, c1.y - 10, c2.x - c1.x, 10);
      label(ctx, 'контактная зона', (c1.x + c2.x) / 2 - 45, c1.y - 14, '#92400e');
    }

    var loadTop = map(0, state.Cz + p.R0 + 0.12), loadBottom = map(0, state.Cz + p.R0 + 0.02);
    ctx.strokeStyle = '#0f766e'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(loadTop.x, loadTop.y); ctx.lineTo(loadBottom.x, loadBottom.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(loadBottom.x, loadBottom.y); ctx.lineTo(loadBottom.x - 5, loadBottom.y - 8); ctx.lineTo(loadBottom.x + 5, loadBottom.y - 8); ctx.closePath(); ctx.fillStyle = '#0f766e'; ctx.fill();
    label(ctx, 'нагрузка Fz', loadTop.x + 8, loadTop.y + 8, '#0f766e');

    if (Math.abs(p.slopeDeg || 0) > 0.01) label(ctx, 'угол уклона: ' + (p.slopeDeg || 0).toFixed(1) + '°', B.x - 180, A.y - 18);
    if (Math.abs(p.bankDeg || 0) > 0.01) label(ctx, 'banking: ' + (p.bankDeg || 0).toFixed(1) + '°', B.x - 180, A.y - 34);
  }
  window.TireLabWheelView = { render: drawWheel };
})();
