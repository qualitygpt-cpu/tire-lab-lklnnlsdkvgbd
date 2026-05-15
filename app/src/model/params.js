window.ParamsModel = {
  normalizeParams: function normalizeParams(rawInput) {
    var p = {
      mass: Number(rawInput.mass || 350),
      slopeDeg: Number(rawInput.slopeDeg || 10),
      bankDeg: Number(rawInput.bankDeg || 3),
      pressureKPa: Number(rawInput.pressureKPa || rawInput.pressureKpa || 220),
      radius: Number(rawInput.radius || rawInput.radiusM || 0.34),
      rimRadius: Number(rawInput.rimRadius || 0.19),
      widthMM: Number(rawInput.widthMM || (Number(rawInput.widthM || 0.225) * 1000)),
      mu: Number(rawInput.mu || 0.85),
      slipDeg: Number(rawInput.slipDeg || 4),
      slipRatio: Number(rawInput.slipRatio || 0.03),
      EAkN: Number(rawInput.EAkN || 1100),
      EI: Number(rawInput.EI || 55),
      krkN: Number(rawInput.krkN || 340),
      kykN: Number(rawInput.kykN || 260),
      treadMPa: Number(rawInput.treadMPa || 8),
      contactMPa: Number(rawInput.contactMPa || 55),
      iterations: Number(rawInput.iterations || 120),
      N: Number(rawInput.N || 96)
    };
    p.g = 9.81;
    p.W = p.mass * p.g;
    p.slope = p.slopeDeg * Math.PI / 180;
    p.bank = p.bankDeg * Math.PI / 180;
    p.alpha = p.slipDeg * Math.PI / 180;
    p.R0 = p.radius;
    p.Rrim = Math.min(p.rimRadius, p.radius * 0.78);
    p.b = p.widthMM / 1000;
    p.pressure = p.pressureKPa * 1000;
    p.EA = p.EAkN * 1000;
    p.kr = p.krkN * 1000;
    p.ky = p.kykN * 1000;
    p.kt = p.kr * 0.5;
    p.kb = p.treadMPa * 1e6;
    p.kc = p.contactMPa * 1e6;
    p.Ntarget = p.W * Math.cos(p.slope) * Math.cos(p.bank);
    p.FxGrade = p.W * Math.sin(p.slope);
    p.FyReq = p.W * Math.sin(p.bank);
    p.dphi = 2 * Math.PI / p.N;
    p.ds = p.R0 * p.dphi;
    p.Tp = p.pressure * p.b * p.R0;
    return p;
  }
};
