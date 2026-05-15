(function () {
  function decimals(step) { var s = String(step); return s.indexOf('.') === -1 ? 0 : s.split('.')[1].length; }
  function fmt(v, d) { return Number(v).toFixed(d).replace('.', ','); }
  window.TireLabControls = {
    render: function (host, defs, raw) {
      host.innerHTML = '';
      defs.forEach(function (d) {
        var row = document.createElement('div'); row.className = 'row';
        row.innerHTML = '<label><span>' + d.label + '</span><span id="' + d.key + 'Val"></span></label><input id="' + d.key + '" type="range" min="' + d.min + '" max="' + d.max + '" step="' + d.step + '" value="' + raw[d.key] + '">';
        host.appendChild(row);
      });
    },
    read: function (defs) { var raw = { nodes: Number(document.getElementById('nodes').value) }; defs.forEach(function (d) { raw[d.key] = Number(document.getElementById(d.key).value); }); return raw; },
    write: function (defs, raw) { defs.forEach(function (d) { document.getElementById(d.key).value = raw[d.key]; }); document.getElementById('nodes').value = String(raw.nodes); },
    updateLabels: function (defs) { defs.forEach(function (d) { document.getElementById(d.key + 'Val').textContent = fmt(document.getElementById(d.key).value, decimals(d.step)) + (d.unit ? ' ' + d.unit : ''); }); document.getElementById('nodesVal').textContent = document.getElementById('nodes').value; }
  };
})();
