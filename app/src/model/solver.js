window.SolverModel = {
  iterateSolver: function iterateSolver(state) {
    var p = state.params;
    var N = p.N;
    var ds = p.ds;
    var w = state.w;
    var u = state.u;
    var y = state.y;
    var g = state.geometry;
    var c = state.contact;
    var b = state.brush;
    var wn = new Float64Array(N);
    var un = new Float64Array(N);
    var yn = new Float64Array(N);
    var T = Math.max(600, p.Tp + 0.002 * p.EA);
    var Ty = Math.max(300, 0.35 * T);
    var contactExtra = p.kc * p.b * ds;
    var treadExtra = p.kb * p.b * ds;
    var denW = p.kr * ds + 2 * T / ds + 6 * p.EI / Math.pow(ds, 3) + 0.35 * contactExtra;
    var denU = p.kt * ds + 2 * T / ds + 0.35 * treadExtra;
    var denY = p.ky * ds + 2 * Ty / ds + 0.35 * treadExtra;
    var maxU = 0;
    var i;

    for (i = 0; i < N; i++) {
      var im2 = (i - 2 + N) % N;
      var im = (i - 1 + N) % N;
      var ip = (i + 1) % N;
      var ip2 = (i + 2) % N;
      var ph = state.phi[i];
      var erx = Math.sin(ph);
      var erz = -Math.cos(ph);
      var etx = Math.cos(ph);
      var etz = Math.sin(ph);
      var lapW = w[ip] - 2 * w[i] + w[im];
      var biW = w[im2] - 4 * w[im] + 6 * w[i] - 4 * w[ip] + w[ip2];
      var lapU = u[ip] - 2 * u[i] + u[im];
      var lapY = y[ip] - 2 * y[i] + y[im];

      var Fw = T * lapW / ds - p.EI * biW / Math.pow(ds, 3) - p.kr * w[i] * ds - p.EA * c.eps[i] * ds / Math.max(p.R0, 1e-6);
      var Fu = T * lapU / ds - p.kt * u[i] * ds - 0.12 * p.EA * c.duf[i] * ds;
      var Fy = Ty * lapY / ds - p.ky * y[i] * ds;

      if (g.pen[i] > 0) {
        var Fn = g.pc[i] * p.b * ds;
        Fw += Fn * erz;
        Fu += Fn * etz;
        var Fx = b.tx[i] * p.b * ds;
        var Fyn = b.ty[i] * p.b * ds;
        Fw += Fx * erx;
        Fu += Fx * etx;
        Fy += Fyn;
      }

      var dw = 0.55 * Fw / (denW + (g.pen[i] > 0 ? contactExtra : 0));
      var du = 0.55 * Fu / (denU + (g.pen[i] > 0 ? treadExtra : 0));
      var dy = 0.55 * Fy / (denY + (g.pen[i] > 0 ? treadExtra : 0));

      wn[i] = clamp(w[i] + dw, -0.18 * p.R0, 0.08 * p.R0);
      un[i] = clamp(u[i] + du, -0.10 * p.R0, 0.10 * p.R0);
      yn[i] = clamp(y[i] + dy, -0.12 * p.R0, 0.12 * p.R0);
      maxU = Math.max(maxU, Math.abs(dw), Math.abs(du), Math.abs(dy));
    }

    zeroMean(un);
    zeroMean(yn);
    damp(w, wn, 0.82);
    damp(u, un, 0.84);
    damp(y, yn, 0.86);
    var k = Math.max(g.c * p.kc * p.b * ds, p.kc * p.b * ds);
    var err = p.Ntarget - g.Fn;
    var dz = clamp(-0.42 * err / k, -0.0025, 0.0025);
    state.Cz = clamp(state.Cz + dz, p.R0 * 0.72, p.R0 * 1.03);

    var residual = Math.abs(err) / Math.max(p.Ntarget, 1) + maxU / Math.max(0.001, p.R0);
    state.solver = { iterations: 1, converged: residual < 1e-3, residual: residual };
    return state.solver;
  }
};

function clamp(x, a, b) {
  return Math.min(b, Math.max(a, x));
}

function damp(a, b, keep) {
  var i;
  for (i = 0; i < a.length; i++) {
    a[i] = keep * a[i] + (1 - keep) * b[i];
  }
}

function zeroMean(a) {
  var m = 0;
  var i;
  for (i = 0; i < a.length; i++) {
    m += a[i];
  }
  m /= a.length;
  for (i = 0; i < a.length; i++) {
    a[i] -= m;
  }
}
