(function () {
  function fmt(v, d) { return Number(v).toFixed(d).replace('.', ','); }

  function render(canvas, state) {
    var ctx = canvas.getContext('2d'), p = state.p, g = state.last.geometry, b = state.last.brush;
    var ids = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = 'white'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#111827'; ctx.font = '15px Arial'; ctx.fillText('Пятно контакта', 16, 22);
    for (var i = 0; i < p.N; i++) if (g.pen[i] > 0) ids.push(i);
    if (ids.length < 2) { ctx.fillStyle = '#667085'; ctx.fillText('Контакт не найден', 16, 60); return; }
    ids.sort(function (a, c) { return g.x[a] - g.x[c]; });
    var left = 45, right = 20, top = 45, bottom = 34;
    var ymin = -p.b / 2 - Math.max.apply(null, Array.from(state.y).map(Math.abs));
    var ymax = p.b / 2 + Math.max.apply(null, Array.from(state.y).map(Math.abs));
    var scale = Math.min((canvas.width - left - right) / Math.max(g.xmax - g.xmin, 1e-6), (canvas.height - top - bottom) / Math.max(ymax - ymin, 1e-6));
    var X = function (x) { return left + (x - g.xmin) * scale; };
    var Y = function (y) { return canvas.height - bottom - (y - ymin) * scale; };
    ctx.strokeStyle = '#e5e7eb'; ctx.strokeRect(left, top, canvas.width - left - right, canvas.height - top - bottom);
    for (var j = 0; j < ids.length; j++) {
      var id = ids[j], x0 = X(g.x[id]) - 2, y1 = Y(state.y[id] - p.b / 2), y2 = Y(state.y[id] + p.b / 2);
      ctx.strokeStyle = b.slip[id] === 2 ? window.TireLabColors.slide : (b.slip[id] === 1 ? window.TireLabColors.transition : window.TireLabColors.stick);
      ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x0, y2); ctx.stroke();
    }
    ctx.fillStyle = '#374151'; ctx.font = '13px Arial';
    ctx.fillText('L = ' + fmt(1000 * (g.xmax - g.xmin), 1) + ' мм', left, canvas.height - 12);
    ctx.fillText('B = ' + fmt(1000 * p.b, 0) + ' мм', canvas.width - 120, canvas.height - 12);
  }
  window.TireLabContactPatchView = { render: render };
})();
