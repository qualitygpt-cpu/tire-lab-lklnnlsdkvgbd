window.ResultsModel = {
  computeResults: function computeResults(state) {
    // TODO: Перенести stats() из legacy-модели и добавить прозрачную отчетность по метрикам.
    state.results = {
      deflectionMm: (state.geometry.deflectionM * 1000).toFixed(2),
      patchLengthMm: (state.contact.patchLengthM * 1000).toFixed(1),
      maxFxN: state.brush.maxLongitudinalForceN.toFixed(1),
      converged: state.solver.converged
    };
    return state.results;
  }
};
