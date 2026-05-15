(function () {
  function clamp(x, a, b) { return Math.min(b, Math.max(a, x)); }
  function damp(a, b, keep) { for (var i = 0; i < a.length; i++) a[i] = keep * a[i] + (1 - keep) * b[i]; }
  function zeroMean(a) { var m = 0; for (var i = 0; i < a.length; i++) m += a[i]; m /= a.length; for (var j = 0; j < a.length; j++) a[j] -= m; }

  window.TireLabSolver = {
    initialize: function (rawParams) {
      var normalized = window.TireLabUnits.normalizeParams(rawParams);
      return window.TireLabState.createInitialState(normalized);
    },
    iterate: function (state) {
      var p = state.p, N = p.N, ds = p.ds, w = state.w, u = state.u, y = state.y;
      var g = window.TireLabGeometry.computeGeometry(state), f = window.TireLabContact.computeContact(state, g), b = window.TireLabBrush.computeBrushForces(state, g, f);
      var wn = new Float64Array(N), un = new Float64Array(N), yn = new Float64Array(N), T = Math.max(600, p.Tp + 0.002 * p.EA), Ty = Math.max(300, 0.35 * T);
      var contactExtra = p.kc * p.b * ds, treadExtra = p.kb * p.b * ds, denW = p.kr * ds + 2 * T / ds + 6 * p.EI / Math.pow(ds, 3) + 0.35 * contactExtra, denU = p.kt * ds + 2 * T / ds + 0.35 * treadExtra, denY = p.ky * ds + 2 * Ty / ds + 0.35 * treadExtra;
      var maxU = 0;
      for (var i = 0; i < N; i++) {
        var im2 = (i - 2 + N) % N, im = (i - 1 + N) % N, ip = (i + 1) % N, ip2 = (i + 2) % N, ph = state.phi[i], erx = Math.sin(ph), erz = -Math.cos(ph), etx = Math.cos(ph), etz = Math.sin(ph);
        var lapW = w[ip] - 2 * w[i] + w[im], biW = w[im2] - 4 * w[im] + 6 * w[i] - 4 * w[ip] + w[ip2], lapU = u[ip] - 2 * u[i] + u[im], lapY = y[ip] - 2 * y[i] + y[im];
        var Fw = T * lapW / ds - p.EI * biW / Math.pow(ds, 3) - p.kr * w[i] * ds - p.EA * f.eps[i] * ds / Math.max(p.R0, 1e-6), Fu = T * lapU / ds - p.kt * u[i] * ds - 0.12 * p.EA * f.duf[i] * ds, Fy = Ty * lapY / ds - p.ky * y[i] * ds;
        if (g.pen[i] > 0) { var Fn = g.pc[i] * p.b * ds; Fw += Fn * erz; Fu += Fn * etz; var Fx = b.tx[i] * p.b * ds, Fyn = b.ty[i] * p.b * ds; Fw += Fx * erx; Fu += Fx * etx; Fy += Fyn; }
        var dw = 0.55 * Fw / (denW + (g.pen[i] > 0 ? contactExtra : 0)), du = 0.55 * Fu / (denU + (g.pen[i] > 0 ? treadExtra : 0)), dy = 0.55 * Fy / (denY + (g.pen[i] > 0 ? treadExtra : 0));
        wn[i] = clamp(w[i] + dw, -0.18 * p.R0, 0.08 * p.R0); un[i] = clamp(u[i] + du, -0.10 * p.R0, 0.10 * p.R0); yn[i] = clamp(y[i] + dy, -0.12 * p.R0, 0.12 * p.R0); maxU = Math.max(maxU, Math.abs(dw), Math.abs(du), Math.abs(dy));
      }
      zeroMean(un); zeroMean(yn); damp(w, wn, 0.82); damp(u, un, 0.84); damp(y, yn, 0.86);
      var k = Math.max(g.c * p.kc * p.b * ds, p.kc * p.b * ds), err = p.Ntarget - g.Fn, dz = clamp(-0.42 * err / k, -0.0025, 0.0025);
      state.Cz = clamp(state.Cz + dz, p.R0 * 0.72, p.R0 * 1.03);
      state.iteration += 1; state.residual = Math.abs(err) / Math.max(p.Ntarget, 1) + maxU / Math.max(0.001, p.R0);
      return { geometry: g, contact: f, brush: b, residual: state.residual };
    },
    run: function (rawParams, options) {
      var opts = options || {}, state = this.initialize(rawParams), itMax = opts.maxIterations || state.p.iterations, snapshot = null;
      for (var i = 0; i < itMax; i++) snapshot = this.iterate(state);
      state.last = snapshot;
      return state;
    }
  };
})();
