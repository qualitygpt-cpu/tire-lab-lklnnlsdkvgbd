(function () {
  function maxAbs(a) { var m = 0; for (var i = 0; i < a.length; i++) m = Math.max(m, Math.abs(a[i])); return m; }
  function minVal(a) { var m = Infinity; for (var i = 0; i < a.length; i++) m = Math.min(m, a[i]); return m; }
  window.TireLabResults = {
    computeResults: function (state) {
      var g = state.last.geometry, f = state.last.contact, b = state.last.brush, p = state.p;
      return {
        targetNormalForce: p.Ntarget, calculatedNormalForce: g.Fn, normalForceError: g.Fn - p.Ntarget,
        Fx: b.Fx, Fy: b.Fy, Mz: b.Mz,
        minimumW: minVal(state.w), maximumYAbs: maxAbs(state.y),
        contactPatchLength: g.c ? g.xmax - g.xmin : 0, contactPatchArea: (g.c ? g.xmax - g.xmin : 0) * p.b,
        maxEpsilonAbs: maxAbs(f.eps), maxContactPressure: maxAbs(g.pc), tauMuPRatio: b.maxR,
        solverIterations: state.iteration, residual: state.residual
      };
    }
  };
})();
