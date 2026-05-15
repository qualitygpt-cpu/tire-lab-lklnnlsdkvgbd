# Model Architecture

## Modular calculation core (`app/src/model`)

- `params.js`: parameter definitions and default raw values.
- `units.js`: normalization from raw UI values to solver units/derived parameters.
- `geometry.js`: node positions, penetration, pressure, normal force integration.
- `contact.js`: strain/curvature field preparation used by solver.
- `brush.js`: brush displacement, friction limiting, Fx/Fy/Mz integration.
- `solver.js`: initialize/iterate/run lifecycle for reduced model solving.
- `results.js`: final scalar metrics for UI table/cards.

## State and orchestration

- `app/src/state.js`: state object creation for arrays and solver bookkeeping.
- `app/src/ui/controls.js`: parameter controls rendering/reading/writing.
- `app/src/ui/presets.js`: default preset provider.
- `app/src/app.js`: app wiring, run/reset actions, status updates, results rendering.

## UI shell

`app/index.html` loads scripts in plain script-tag dependency order (no modules/bundler), compatible with GitHub Pages and local preview tools.
