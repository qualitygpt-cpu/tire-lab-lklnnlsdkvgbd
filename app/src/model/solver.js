window.SolverModel = {
  iterateSolver: function iterateSolver(state) {
    // TODO: Перенести iterate() из legacy-модели: критерии сходимости, шаг итерации, стабилизация.
    state.solver = { iterations: 1, converged: true, residual: 0 };
    return state.solver;
  }
};
