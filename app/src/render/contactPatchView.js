(function () {
  function fmt(v, d) { return Number(v).toFixed(d).replace('.', ','); }
  function render(canvas, state) {
    var ctx = canvas.getContext('2d'), p = state.p, g = state.last.geometry, b = state.last.brush;
    var ids = []; for (var i = 0; i < p.N; i++) if (g.pen[i] > 0) ids.push(i);
    ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = 'white'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#111827'; ctx.font = 'bold 15px Arial'; ctx.fillText('Пятно контакта: вид сверху', 16, 22);
    if (ids.length < 2) { ctx.fillStyle = '#667085'; ctx.fillText('Контакт не найден', 16, 60); return; }

    ids.sort(function (a, c) { return g.x[a] - g.x[c]; });
    var left = 65, right = 20, top = 44, bottom = 48;
    var maxY = 1000 * (p.b / 2 + Math.max.apply(null, Array.from(state.y).map(Math.abs)));
    var xmin = 1000 * g.xmin, xmax = 1000 * g.xmax, ymin = -maxY, ymax = maxY;
    var W = canvas.width - left - right, H = canvas.height - top - bottom;
    var X = function (x) { return left + W * (x - xmin) / Math.max(xmax - xmin, 1e-9); };
    var Y = function (y) { return top + H - H * (y - ymin) / Math.max(ymax - ymin, 1e-9); };

    ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 1;
    for (var gx = 0; gx <= 5; gx++) { var xx = xmin + (xmax - xmin) * gx / 5; var px = X(xx); ctx.beginPath(); ctx.moveTo(px, top); ctx.lineTo(px, top + H); ctx.stroke(); ctx.fillStyle = '#4b5563'; ctx.font = '12px Arial'; ctx.fillText(fmt(xx, 1), px - 12, top + H + 16); }
    for (var gy = 0; gy <= 4; gy++) { var yy = ymin + (ymax - ymin) * gy / 4; var py = Y(yy); ctx.beginPath(); ctx.moveTo(left, py); ctx.lineTo(left + W, py); ctx.stroke(); ctx.fillText(fmt(yy, 0), 12, py + 4); }
    ctx.strokeStyle = '#111827'; ctx.lineWidth = 1.5; ctx.strokeRect(left, top, W, H);

    var yy1 = Y(-1000 * p.b / 2), yy2 = Y(1000 * p.b / 2); ctx.fillStyle = 'rgba(156,163,175,0.15)'; ctx.fillRect(left, yy2, W, yy1 - yy2);
    ctx.strokeStyle = '#9ca3af'; ctx.strokeRect(left, yy2, W, yy1 - yy2);

    for (var j = 0; j < ids.length; j++) {
      var id = ids[j], x0 = X(1000 * g.x[id]), y1 = Y(1000 * (state.y[id] - p.b / 2)), y2 = Y(1000 * (state.y[id] + p.b / 2));
      ctx.strokeStyle = b.slip[id] === 2 ? window.TireLabColors.slide : (b.slip[id] === 1 ? window.TireLabColors.transition : window.TireLabColors.stick);
      ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x0, y2); ctx.stroke();
    }

    ctx.fillStyle = '#374151'; ctx.fillText('продольная координата x, мм', left + W / 2 - 86, canvas.height - 8);
    ctx.save(); ctx.translate(20, top + H / 2 + 62); ctx.rotate(-Math.PI / 2); ctx.fillText('поперечная координата y, мм', 0, 0); ctx.restore();

    var length = 1000 * (g.xmax - g.xmin), area = (g.xmax - g.xmin) * p.b * 1e4, maxDisp = 1000 * Math.max.apply(null, Array.from(state.y).map(Math.abs));
    ctx.fillStyle = '#111827'; ctx.fillText('L=' + fmt(length, 1) + ' мм  A=' + fmt(area, 1) + ' см²  max |y|=' + fmt(maxDisp, 1) + ' мм', left, top - 8);

    var lx = canvas.width - 210, ly = top + 10; ctx.font = '12px Arial';
    [['сцепление', window.TireLabColors.stick], ['близко к пределу трения', window.TireLabColors.transition], ['скольжение', window.TireLabColors.slide]].forEach(function (it, k) {
      ctx.fillStyle = it[1]; ctx.fillRect(lx, ly + 18 * k, 12, 12); ctx.fillStyle = '#111827'; ctx.fillText(it[0], lx + 18, ly + 10 + 18 * k);
    });
  }
  window.TireLabContactPatchView = { render: render };
})();
