window.GeometryModel = {
  buildInitialState: function buildInitialState(params) {
    var N = params.N;
    var phi = new Float64Array(N);
    var w = new Float64Array(N);
    var u = new Float64Array(N);
    var y = new Float64Array(N);
    for (var i = 0; i < N; i++) phi[i] = i * params.dphi;
    var dz = Math.min(0.06, Math.max(0.004, params.Ntarget / 230000));
    return { p: params, phi: phi, w: w, u: u, y: y, Cz: params.R0 - dz, g: null, f: null, s: null };
  },
  computeGeometry: function computeGeometry(state) {
    var p = state.p, N = p.N;
    var x = new Float64Array(N), z = new Float64Array(N), pen = new Float64Array(N), pc = new Float64Array(N);
    var Fn = 0, c = 0, xmin = 1e9, xmax = -1e9, maxPen = 0;
    for (var i = 0; i < N; i++) {
      var ph = state.phi[i], erx = Math.sin(ph), erz = -Math.cos(ph), etx = Math.cos(ph), etz = Math.sin(ph);
      x[i] = (p.R0 + state.w[i]) * erx + state.u[i] * etx;
      z[i] = state.Cz + (p.R0 + state.w[i]) * erz + state.u[i] * etz;
      pen[i] = Math.max(0, -z[i]);
      pc[i] = p.kc * pen[i];
      if (pen[i] > 1e-8) { c++; Fn += pc[i] * p.b * p.ds; xmin = Math.min(xmin, x[i]); xmax = Math.max(xmax, x[i]); maxPen = Math.max(maxPen, pen[i]); }
    }
    if (!c) { xmin = 0; xmax = 0; }
    state.g = { x: x, z: z, pen: pen, pc: pc, Fn: Fn, c: c, xmin: xmin, xmax: xmax, maxPen: maxPen };
    return state.g;
  }
};
