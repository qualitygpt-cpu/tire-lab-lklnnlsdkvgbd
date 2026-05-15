(function () {
  function fmt(v, d) { return Number(v).toFixed(d).replace('.', ','); }

  function calcTicks(min, max, count) {
    var ticks = [];
    if (!isFinite(min) || !isFinite(max)) return ticks;
    if (Math.abs(max - min) < 1e-12) { min -= 1; max += 1; }
    for (var i = 0; i <= count; i++) ticks.push(min + (max - min) * i / count);
    return ticks;
  }

  function setupChart(ctx, canvas, opts) {
    var m = { L: 70, R: 20, T: 46, B: 44 };
    var W = canvas.width - m.L - m.R, H = canvas.height - m.T - m.B;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#111827'; ctx.font = 'bold 15px Arial'; ctx.fillText(opts.title, 16, 24);

    var xt = calcTicks(opts.xmin, opts.xmax, 5), yt = calcTicks(opts.ymin, opts.ymax, 4);
    ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 1;
    xt.forEach(function (t) { var x = m.L + W * (t - opts.xmin) / Math.max(opts.xmax - opts.xmin, 1e-9); ctx.beginPath(); ctx.moveTo(x, m.T); ctx.lineTo(x, m.T + H); ctx.stroke(); });
    yt.forEach(function (t) { var y = m.T + H - H * (t - opts.ymin) / Math.max(opts.ymax - opts.ymin, 1e-9); ctx.beginPath(); ctx.moveTo(m.L, y); ctx.lineTo(m.L + W, y); ctx.stroke(); });

    if (opts.contactMin !== undefined && opts.contactMax !== undefined && opts.contactMax > opts.contactMin) {
      var xa = m.L + W * (opts.contactMin - opts.xmin) / Math.max(opts.xmax - opts.xmin, 1e-9);
      var xb = m.L + W * (opts.contactMax - opts.xmin) / Math.max(opts.xmax - opts.xmin, 1e-9);
      ctx.fillStyle = 'rgba(59,130,246,0.08)'; ctx.fillRect(xa, m.T, xb - xa, H);
    }

    if (opts.ymin < 0 && opts.ymax > 0) {
      var y0 = m.T + H - H * (0 - opts.ymin) / (opts.ymax - opts.ymin);
      ctx.setLineDash([5, 4]); ctx.strokeStyle = '#6b7280';
      ctx.beginPath(); ctx.moveTo(m.L, y0); ctx.lineTo(m.L + W, y0); ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.strokeStyle = '#111827'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(m.L, m.T); ctx.lineTo(m.L, m.T + H); ctx.lineTo(m.L + W, m.T + H); ctx.stroke();

    ctx.font = '12px Arial'; ctx.fillStyle = '#4b5563';
    xt.forEach(function (t) { var x = m.L + W * (t - opts.xmin) / Math.max(opts.xmax - opts.xmin, 1e-9); ctx.fillText(fmt(t, 1), x - 12, m.T + H + 16); });
    yt.forEach(function (t) { var y = m.T + H - H * (t - opts.ymin) / Math.max(opts.ymax - opts.ymin, 1e-9); ctx.fillText(fmt(t, 1), 8, y + 4); });
    ctx.fillText(opts.xlabel, m.L + W / 2 - 80, canvas.height - 8);
    ctx.save(); ctx.translate(16, m.T + H / 2 + 50); ctx.rotate(-Math.PI / 2); ctx.fillText(opts.ylabel, 0, 0); ctx.restore();
    ctx.fillText('min ' + fmt(opts.ymin, 2) + ' / max ' + fmt(opts.ymax, 2), m.L, m.T - 10);
    return { m: m, W: W, H: H };
  }

  function drawSeries(ctx, box, opts, pts, color) {
    ctx.strokeStyle = color; ctx.lineWidth = 2.2; ctx.beginPath();
    pts.forEach(function (pt, i) {
      var x = box.m.L + box.W * (pt[0] - opts.xmin) / Math.max(opts.xmax - opts.xmin, 1e-9);
      var y = box.m.T + box.H - box.H * (pt[1] - opts.ymin) / Math.max(opts.ymax - opts.ymin, 1e-9);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }

  function renderStrain(canvas, state) {
    var eps = Array.from(state.last.contact.eps).map(function (v, i) { return [i, 100 * v]; });
    var ys = eps.map(function (p) { return p[1]; }), ymin = Math.min.apply(null, ys), ymax = Math.max.apply(null, ys), pad = 0.15 * Math.max(1, ymax - ymin);
    var ctx = canvas.getContext('2d');
    var opts = { title: 'Окружная деформация шины epsilon', xlabel: 'узел по окружности / угол', ylabel: 'epsilon, %', xmin: 0, xmax: eps.length - 1, ymin: ymin - pad, ymax: ymax + pad };
    var box = setupChart(ctx, canvas, opts);
    drawSeries(ctx, box, opts, eps, '#2563eb');
    ctx.fillStyle = '#374151'; ctx.font = '12px Arial'; ctx.fillText('синий - сжатие, красный - растяжение', box.m.L + 8, box.m.T + 14);
  }

  function getContactData(state, key) {
    var pts = [];
    for (var i = 0; i < state.p.N; i++) if (state.last.geometry.pen[i] > 0) pts.push([1000 * state.last.geometry.x[i], state.last[key][i] / 1000]);
    return pts.sort(function (a, b) { return a[0] - b[0]; });
  }

  function renderPressure(canvas, state) {
    var pts = getContactData(state, 'geometry').map(function () { return null; });
    pts = [];
    for (var i = 0; i < state.p.N; i++) if (state.last.geometry.pen[i] > 0) pts.push([1000 * state.last.geometry.x[i], state.last.geometry.pc[i] / 1000]);
    if (pts.length < 2) return;
    pts.sort(function (a, b) { return a[0] - b[0]; });
    var ys = pts.map(function (p) { return p[1]; }), ymax = Math.max.apply(null, ys);
    var opts = { title: 'Контактное давление p(x)', xlabel: 'x в пятне контакта, мм', ylabel: 'p, кПа', xmin: pts[0][0], xmax: pts[pts.length - 1][0], ymin: 0, ymax: ymax * 1.2 };
    var ctx = canvas.getContext('2d'), box = setupChart(ctx, canvas, opts);
    drawSeries(ctx, box, opts, pts, window.TireLabColors.pressure);
    var imax = ys.indexOf(ymax), px = pts[imax][0];
    var x = box.m.L + box.W * (px - opts.xmin) / Math.max(opts.xmax - opts.xmin, 1e-9);
    var y = box.m.T + box.H - box.H * (ymax - opts.ymin) / Math.max(opts.ymax - opts.ymin, 1e-9);
    ctx.fillStyle = '#065f46'; ctx.fillText('p_max=' + fmt(ymax, 1) + ' кПа', x + 8, y - 8);
  }

  function renderShear(canvas, state) {
    var tx = [], ty = [];
    for (var i = 0; i < state.p.N; i++) if (state.last.geometry.pen[i] > 0) {
      tx.push([1000 * state.last.geometry.x[i], state.last.brush.tx[i] / 1000]);
      ty.push([1000 * state.last.geometry.x[i], state.last.brush.ty[i] / 1000]);
    }
    if (tx.length < 2) return;
    tx.sort(function (a, b) { return a[0] - b[0]; }); ty.sort(function (a, b) { return a[0] - b[0]; });
    var ys = tx.concat(ty).map(function (p) { return p[1]; }), ymin = Math.min.apply(null, ys), ymax = Math.max.apply(null, ys), pad = 0.2 * Math.max(1, ymax - ymin);
    var opts = { title: 'Сдвиговые напряжения tau_x и tau_y', xlabel: 'x в пятне контакта, мм', ylabel: 'tau, кПа', xmin: tx[0][0], xmax: tx[tx.length - 1][0], ymin: ymin - pad, ymax: ymax + pad };
    var ctx = canvas.getContext('2d'), box = setupChart(ctx, canvas, opts);
    drawSeries(ctx, box, opts, tx, window.TireLabColors.tauX); drawSeries(ctx, box, opts, ty, window.TireLabColors.tauY);
    ctx.fillStyle = window.TireLabColors.tauX; ctx.fillText('tau_x', box.m.L + 10, box.m.T + 16);
    ctx.fillStyle = window.TireLabColors.tauY; ctx.fillText('tau_y', box.m.L + 74, box.m.T + 16);
  }

  window.TireLabPlotView = { renderStrain: renderStrain, renderPressure: renderPressure, renderShear: renderShear };
})();
