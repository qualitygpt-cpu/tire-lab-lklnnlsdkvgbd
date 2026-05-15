window.ParamsModel = {
  normalizeParams: function normalizeParams(rawInput) {
    var p = {};
    var defaults = {
      mass: 350,
      slopeDeg: 10,
      bankDeg: 3,
      pressureKPa: 220,
      radius: 0.34,
      rimRadius: 0.19,
      widthMM: 225,
      mu: 0.85,
      slipDeg: 4,
      slipRatio: 0.03,
      EAkN: 1100,
      EI: 55,
      krkN: 340,
      kykN: 260,
      treadMPa: 8,
      contactMPa: 55,
      iterations: 900,
      N: 96
    };

    p.mass = Number(rawInput.mass || defaults.mass);
    p.slopeDeg = Number(rawInput.slopeDeg || defaults.slopeDeg);
    p.bankDeg = Number(rawInput.bankDeg || defaults.bankDeg);
    p.pressureKPa = Number(rawInput.pressureKPa || rawInput.pressureKpa || defaults.pressureKPa);
    p.radius = Number(rawInput.radius || rawInput.radiusM || defaults.radius);
    p.rimRadius = Number(rawInput.rimRadius || defaults.rimRadius);
    p.widthMM = Number(rawInput.widthMM || (rawInput.widthM ? Number(rawInput.widthM) * 1000 : defaults.widthMM));
    p.mu = Number(rawInput.mu || defaults.mu);
    p.slipDeg = Number(rawInput.slipDeg || defaults.slipDeg);
    p.slipRatio = Number(rawInput.slipRatio || defaults.slipRatio);
    p.EAkN = Number(rawInput.EAkN || defaults.EAkN);
    p.EI = Number(rawInput.EI || defaults.EI);
    p.krkN = Number(rawInput.krkN || defaults.krkN);
    p.kykN = Number(rawInput.kykN || defaults.kykN);
    p.treadMPa = Number(rawInput.treadMPa || defaults.treadMPa);
    p.contactMPa = Number(rawInput.contactMPa || defaults.contactMPa);
    p.iterations = Number(rawInput.iterations || defaults.iterations);
    p.N = Number(rawInput.nodes || rawInput.N || defaults.N);

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
