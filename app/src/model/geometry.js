window.GeometryModel = {
  buildInitialState: function buildInitialState(params) {
    // TODO: Перенести начальную инициализацию состояния из legacy (до geom/fields/iterate).
    return { params: params, geometry: null, contact: null, brush: null, solver: null, results: null };
  },
  computeGeometry: function computeGeometry(state) {
    // TODO: Перенести geom() из legacy-модели с сохранением исходных вычислений.
    var deflectionM = state.params.loadN / Math.max(state.params.pressurePa * state.params.widthM, 1);
    state.geometry = { deflectionM: deflectionM, effectiveRadiusM: Math.max(state.params.radiusM - deflectionM, 0) };
    return state.geometry;
  }
};
