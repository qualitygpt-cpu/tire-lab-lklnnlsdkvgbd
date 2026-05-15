window.ResultsModel = {
  computeResults: function computeResults(state) {
    var g = state.g || window.GeometryModel.computeGeometry(state);
    var f = state.f || window.ContactModel.computeContact(state);
    var p = state.p;
    state.s = {
      Fn: g.Fn,
      err: g.Fn - p.Ntarget,
      Fx: f.Fx,
      Fy: f.Fy,
      Mz: f.Mz,
      L: g.c ? g.xmax - g.xmin : 0,
      A: (g.c ? g.xmax - g.xmin : 0) * p.b,
      wmin: minArr(state.w),
      ymax: maxAbs(state.y),
      emax: maxAbs(f.eps),
      pmax: maxAbs(g.pc),
      ratio: f.maxR
    };
    state.results = {
      deflectionMm: (1000 * Math.abs(state.s.wmin)).toFixed(2),
      patchLengthMm: (1000 * state.s.L).toFixed(1),
      maxFxN: state.s.Fx.toFixed(1),
      converged: state.solver ? state.solver.converged : false
    };
    return state.results;
  }
};
function maxAbs(a) { var m = 0; for (var i = 0; i < a.length; i++) m = Math.max(m, Math.abs(a[i])); return m; }
function minArr(a) { var m = Infinity; for (var i = 0; i < a.length; i++) m = Math.min(m, a[i]); return m; }
