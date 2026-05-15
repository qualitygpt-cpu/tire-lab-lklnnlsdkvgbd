(function () {
  function updateStatus(text) {
    document.getElementById('status-panel').textContent = text;
  }

  function renderCanvas(state) {
    var canvas = document.getElementById('tire-canvas');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    window.WheelView.drawWheel(ctx, state);
    window.ContactPatchView.drawPatch(ctx, state);
  }

  function runCalculation(rawInput) {
    var params = window.ParamsModel.normalizeParams(rawInput);
    var state = window.GeometryModel.buildInitialState(params);
    var iterations = Math.max(1, Math.floor(params.iterations || 120));
    for (var i = 0; i < iterations; i++) {
      window.SolverModel.iterateSolver(state);
    }
    window.BrushModel.computeBrushForces(state);
    var results = window.ResultsModel.computeResults(state);
    return { state: state, results: results };
  }

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('params-form');
    var resultsPanel = document.getElementById('results-panel');

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      updateStatus('Расчет выполняется...');
      var rawInput = window.ControlsUI.collectParams(form);
      var output = runCalculation(rawInput);
      window.DevState.lastRun = new Date().toISOString();
      window.DevState.status = 'done';
      window.DevState.data = output.state;
      renderCanvas(output.state);
      resultsPanel.innerHTML = window.ReportUI.formatResults(output.results);
      updateStatus('Расчет завершен: ' + window.DevState.lastRun);
    });
  });
})();
