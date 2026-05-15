window.ResultsModel = {
  computeResults: function computeResults(state) {
    var p = state.params;
    var g = state.geometry;
    var c = state.contact;
    var b = state.brush;

    state.results = {
      Fn: g.Fn,
      err: g.Fn - p.Ntarget,
      Fx: b.Fx,
      Fy: b.Fy,
      Mz: b.Mz,
      L: g.c ? g.xmax - g.xmin : 0,
      A: (g.c ? g.xmax - g.xmin : 0) * p.b,
      wmin: minValue(state.w),
      wmax: maxValue(state.w),
      ymax: maxAbs(state.y),
      emax: maxAbs(c.eps),
      pmax: maxAbs(g.pc),
      ratio: b.maxR,
      Cz: state.Cz,
      deflectionMm: ((p.R0 - state.Cz) * 1000).toFixed(2),
      patchLengthMm: ((g.c ? g.xmax - g.xmin : 0) * 1000).toFixed(1),
      maxFxN: b.Fx.toFixed(1),
      converged: state.solver.converged
    };

    return state.results;
  }
};

function maxAbs(a) {
  var m = 0;
  var i;
  for (i = 0; i < a.length; i++) {
    m = Math.max(m, Math.abs(a[i]));
  }
  return m;
}

function minValue(a) {
  var m = Infinity;
  var i;
  for (i = 0; i < a.length; i++) {
    m = Math.min(m, a[i]);
  }
  return m;
}

function maxValue(a) {
  var m = -Infinity;
  var i;
  for (i = 0; i < a.length; i++) {
    m = Math.max(m, a[i]);
  }
  return m;
}
