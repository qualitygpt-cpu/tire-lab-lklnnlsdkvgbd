(function () {
  function clamp(x, a, b) { return Math.min(b, Math.max(a, x)); }
  function damp(a, b, keep) { for (var i = 0; i < a.length; i++) a[i] = keep * a[i] + (1 - keep) * b[i]; }
  function zeroMean(a) { var m = 0; for (var i = 0; i < a.length; i++) m += a[i]; m /= a.length; for (var j = 0; j < a.length; j++) a[j] -= m; }
  function idx(i, j, M) { return i * M + j; }

  window.TireLabSolver = {
    initialize: function (rawParams) { return window.TireLabState.createInitialState(window.TireLabUnits.normalizeParams(rawParams)); },
    iterate: function (state) { if (state.p.M > 1) return this.iterate2D(state);
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
    iterate2D: function (state) {
      var p = state.p, N = p.N, M = p.M, ds = p.ds, dy = p.dy;
      var g = window.TireLabGeometry.computeGeometry2D(state), f = window.TireLabContact.computeContact2D(state, g), b = window.TireLabBrush.computeBrushForces2D(state, g, f);
      var wn = new Float64Array(N * M), un = new Float64Array(N * M), vn = new Float64Array(N * M), maxU = 0;
      var T = Math.max(600, p.Tp + 0.002 * p.EA), Ty = Math.max(300, 0.35 * T), kw = 0.08 * p.kr, kv = 0.1 * p.ky;
      for (var i = 0; i < N; i++) for (var j = 0; j < M; j++) {
        var k = idx(i, j, M), im = idx((i - 1 + N) % N, j, M), ip = idx((i + 1) % N, j, M), jm = idx(i, Math.max(0, j - 1), M), jp = idx(i, Math.min(M - 1, j + 1), M);
        var lapW = state.w2[ip] - 2 * state.w2[k] + state.w2[im], lapU = state.u2[ip] - 2 * state.u2[k] + state.u2[im], lapV = state.v2[ip] - 2 * state.v2[k] + state.v2[im];
        var lapWWidth = state.w2[jp] - 2 * state.w2[k] + state.w2[jm], lapVWidth = state.v2[jp] - 2 * state.v2[k] + state.v2[jm];
        // 2.5D approximation: weak width coupling stabilizes strips without full shell mechanics.
        var Fw = T * lapW / ds - p.kr * state.w2[k] * ds - p.EA * f.eps[k] * ds / Math.max(p.R0, 1e-6) + kw * lapWWidth / Math.max(dy, 1e-6);
        var Fu = T * lapU / ds - p.kt * state.u2[k] * ds;
        var Fy = Ty * lapV / ds - p.ky * state.v2[k] * ds + kv * lapVWidth / Math.max(dy, 1e-6);
        if (g.pen[k] > 0) { var ph = state.phi[i], erx = Math.sin(ph), erz = -Math.cos(ph), etx = Math.cos(ph), etz = Math.sin(ph), Fnn = g.pc[k] * g.dA; Fw += Fnn * erz + b.tx[k] * g.dA * erx; Fu += Fnn * etz + b.tx[k] * g.dA * etx; Fy += b.ty[k] * g.dA; }
        var dw = 0.45 * Fw / (p.kr * ds + 2 * T / ds + p.kc * g.dA), du = 0.45 * Fu / (p.kt * ds + 2 * T / ds + p.kb * g.dA), dv = 0.45 * Fy / (p.ky * ds + 2 * Ty / ds + p.kb * g.dA);
        wn[k] = clamp(state.w2[k] + dw, -0.22 * p.R0, 0.10 * p.R0); un[k] = clamp(state.u2[k] + du, -0.14 * p.R0, 0.14 * p.R0); vn[k] = clamp(state.v2[k] + dv, -0.20 * p.R0, 0.20 * p.R0);
        maxU = Math.max(maxU, Math.abs(dw), Math.abs(du), Math.abs(dv));
      }
      damp(state.w2, wn, 0.86); damp(state.u2, un, 0.88); damp(state.v2, vn, 0.88);
      var ksum = Math.max(g.c * p.kc * g.dA, p.kc * g.dA), err = p.Ntarget - g.Fn, dz = clamp(-0.36 * err / ksum, -0.002, 0.002);
      state.Cz = clamp(state.Cz + dz, p.R0 * 0.70, p.R0 * 1.04);
      state.iteration += 1; state.residual = Math.abs(err) / Math.max(p.Ntarget, 1) + maxU / Math.max(0.001, p.R0);
      return { geometry: g, contact: f, brush: b, residual: state.residual };
    },
    run: function (rawParams, options) { return this.run2D(rawParams, options); },
    run2D: function (rawParams, options) {
      var opts = options || {}, state = this.initialize(rawParams), itMax = opts.maxIterations || state.p.iterations, snapshot = null;
      for (var i = 0; i < itMax; i++) snapshot = this.iterate(state);
      state.last = snapshot; return state;
    }
  };
})();
