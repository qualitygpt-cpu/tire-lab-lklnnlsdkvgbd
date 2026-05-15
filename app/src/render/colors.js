(function () {
  function clamp(x, a, b) { return Math.min(b, Math.max(a, x)); }
  function hex(s) { var n = parseInt(s.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function mix(a, b, t) {
    var A = hex(a), B = hex(b), C = A.map(function (v, i) { return Math.round(v + (B[i] - v) * t); });
    return 'rgb(' + C[0] + ',' + C[1] + ',' + C[2] + ')';
  }
  function epsColor(e, m) {
    m = Math.max(m, 0.002);
    var t = clamp(e / m, -1, 1);
    if (t < -0.08) return mix('#e5e7eb', '#2563eb', -t);
    if (t > 0.08) return mix('#e5e7eb', '#dc2626', t);
    return '#e5e7eb';
  }

  window.TireLabColors = {
    tire: '#111827', road: '#6b7280', reference: '#9ca3af', neutral: '#e5e7eb',
    stick: '#22c55e', transition: '#facc15', slide: '#f97316',
    tauX: '#1d4ed8', tauY: '#b91c1c', pressure: '#0f766e',
    mix: mix, epsColor: epsColor, clamp: clamp
  };
})();
