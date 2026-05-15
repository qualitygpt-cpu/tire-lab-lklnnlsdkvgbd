(function () {
  function mapFactory(canvas) {
    var left = 40, right = 40, top = 40, bottom = 40;
    var sx = (canvas.width - left - right) / 1.5;
    var sy = (canvas.height - top - bottom) / 1.1;
    var scale = Math.min(sx, sy);
    var cx = canvas.width / 2, cz = canvas.height * 0.55;
    return function (x, z) { return { x: cx + x * scale, y: cz - z * scale }; };
  }
  function path(ctx, pts, col, lw, dash) {
    if (!pts.length) return;
    ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    if (dash) ctx.setLineDash([8, 8]);
    ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
    for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.closePath(); ctx.stroke(); ctx.restore();
  }
  function arrow(ctx, x1, y1, x2, y2) {
    var a = Math.atan2(y2 - y1, x2 - x1);
    ctx.strokeStyle = '#0f766e'; ctx.fillStyle = '#0f766e'; ctx.lineWidth = 1.7;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - 7 * Math.cos(a - 0.45), y2 - 7 * Math.sin(a - 0.45));
    ctx.lineTo(x2 - 7 * Math.cos(a + 0.45), y2 - 7 * Math.sin(a + 0.45));
    ctx.closePath(); ctx.fill();
  }

  function drawWheel(canvas, state) {
    var ctx = canvas.getContext('2d'); var p = state.p; var g = state.last.geometry; var f = state.last.contact;
    var map = mapFactory(canvas); ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = 'white'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#111827'; ctx.font = '15px Arial'; ctx.fillText('Деформация шины', 16, 22);
    var A = map(-0.75, 0), B = map(0.75, 0); ctx.strokeStyle = window.TireLabColors.road; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
    var out = [], ref = [], rim = [];
    for (var i = 0; i < p.N; i++) {
      var ph = state.phi[i], erx = Math.sin(ph), erz = -Math.cos(ph), etx = Math.cos(ph), etz = Math.sin(ph);
      ref.push(map(p.R0 * erx, state.Cz + p.R0 * erz));
      out.push(map((p.R0 + state.w[i]) * erx + state.u[i] * etx, state.Cz + (p.R0 + state.w[i]) * erz + state.u[i] * etz));
      rim.push(map(p.Rrim * erx, state.Cz + p.Rrim * erz));
    }
    path(ctx, ref, window.TireLabColors.reference, 1.6, true);
    for (var j = 0; j < p.N; j++) {
      var k = (j + 1) % p.N;
      ctx.strokeStyle = window.TireLabColors.epsColor(f.eps[j], f.maxE); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(out[j].x, out[j].y); ctx.lineTo(out[k].x, out[k].y); ctx.stroke();
    }
    path(ctx, rim, window.TireLabColors.tire, 2, false);
    for (var m = 0; m < p.N; m++) if (g.pen[m] > 0) {
      var p0 = map(g.x[m], 0), p1 = map(g.x[m], -g.pen[m]); arrow(ctx, p1.x, p1.y, p0.x, p0.y);
    }
  }

  window.TireLabWheelView = { render: drawWheel };
})();
