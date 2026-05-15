(function () {
  function axes(ctx, L, T, W, H) {
    ctx.strokeStyle = '#d1d5db'; ctx.lineWidth = 1;
    for (var i = 0; i <= 4; i++) { var y = T + H * i / 4; ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(L + W, y); ctx.stroke(); }
    ctx.strokeStyle = '#111827'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(L, T + H); ctx.lineTo(L + W, T + H); ctx.stroke();
  }
  function fmt(v, d) { return Number(v).toFixed(d).replace('.', ','); }
  function plotLine(canvas, data, title, color) {
    var ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = 'white'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#111827'; ctx.font = '15px Arial'; ctx.fillText(title, 16, 22);
    var L = 48, R = 18, T = 42, B = 32, W = canvas.width - L - R, H = canvas.height - T - B, min = Math.min.apply(null, data), max = Math.max.apply(null, data);
    if (Math.abs(max - min) < 1e-9) { max++; min--; }
    axes(ctx, L, T, W, H); ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.beginPath();
    data.forEach(function (v, i) { var x = L + W * i / Math.max(data.length - 1, 1), y = T + H - H * (v - min) / (max - min); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); });
    ctx.stroke(); ctx.fillStyle = '#667085'; ctx.font = '12px Arial'; ctx.fillText('min ' + fmt(min, 2) + ' / max ' + fmt(max, 2), L, canvas.height - 10);
  }
  function plotXY(canvas, pts, title, color) {
    var ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = 'white'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#111827'; ctx.font = '15px Arial'; ctx.fillText(title, 16, 22);
    var L = 52, R = 18, T = 42, B = 34, W = canvas.width - L - R, H = canvas.height - T - B; axes(ctx, L, T, W, H); if (pts.length < 2) return;
    pts.sort(function (a, b) { return a[0] - b[0]; }); var xs = pts.map(function (p) { return p[0]; }), ys = pts.map(function (p) { return p[1]; });
    var xmin = Math.min.apply(null, xs), xmax = Math.max.apply(null, xs), ymin = Math.min(0, Math.min.apply(null, ys)), ymax = Math.max(1, Math.max.apply(null, ys) * 1.15);
    ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.beginPath();
    pts.forEach(function (pt, i) { var x = L + W * (pt[0] - xmin) / Math.max(xmax - xmin, 1e-9), y = T + H - H * (pt[1] - ymin) / (ymax - ymin); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); });
    ctx.stroke();
  }
  function series(ctx, pts, L, T, W, H, xmin, xmax, ymin, ymax, color) {
    ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.beginPath();
    pts.forEach(function (pt, i) { var x = L + W * (pt[0] - xmin) / Math.max(xmax - xmin, 1e-9), y = T + H - H * (pt[1] - ymin) / Math.max(ymax - ymin, 1e-9); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); });
    ctx.stroke();
  }
  function renderStrain(canvas, state) { plotLine(canvas, Array.from(state.last.contact.eps).map(function (v) { return 100 * v; }), 'Окружная деформация epsilon', '#1d4ed8'); }
  function renderPressure(canvas, state) { var pts = []; for (var i = 0; i < state.p.N; i++) if (state.last.geometry.pen[i] > 0) pts.push([state.last.geometry.x[i], state.last.geometry.pc[i] / 1000]); plotXY(canvas, pts, 'Контактное давление p(x)', window.TireLabColors.pressure); }
  function renderShear(canvas, state) {
    var ctx = canvas.getContext('2d'), tx = [], ty = [];
    for (var i = 0; i < state.p.N; i++) if (state.last.geometry.pen[i] > 0) { tx.push([state.last.geometry.x[i], state.last.brush.tx[i] / 1000]); ty.push([state.last.geometry.x[i], state.last.brush.ty[i] / 1000]); }
    ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = 'white'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#111827'; ctx.font = '15px Arial'; ctx.fillText('Сдвиговые напряжения tau_x / tau_y', 16, 22);
    var L = 52, R = 18, T = 42, B = 34, W = canvas.width - L - R, H = canvas.height - T - B; axes(ctx, L, T, W, H); if (tx.length < 2) return;
    var all = tx.concat(ty), xs = all.map(function (p) { return p[0]; }), ys = all.map(function (p) { return p[1]; });
    var xmin = Math.min.apply(null, xs), xmax = Math.max.apply(null, xs), ymin = Math.min.apply(null, ys), ymax = Math.max.apply(null, ys), pad = 0.12 * Math.max(1, ymax - ymin);
    ymin -= pad; ymax += pad;
    series(ctx, tx, L, T, W, H, xmin, xmax, ymin, ymax, window.TireLabColors.tauX);
    series(ctx, ty, L, T, W, H, xmin, xmax, ymin, ymax, window.TireLabColors.tauY);
    ctx.fillStyle = window.TireLabColors.tauX; ctx.fillText('tau_x', L + 8, T + 16); ctx.fillStyle = window.TireLabColors.tauY; ctx.fillText('tau_y', L + 70, T + 16);
  }
  window.TireLabPlotView = { renderStrain: renderStrain, renderPressure: renderPressure, renderShear: renderShear };
})();
