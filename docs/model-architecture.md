# Model Architecture

## Modular calculation core (`app/src/model`)

- `params.js`: parameter definitions and default raw values.
- `units.js`: normalization from raw UI values to solver units/derived parameters.
- `geometry.js`: node positions, penetration, pressure, normal force integration.
- `contact.js`: strain/curvature field preparation used by solver.
- `brush.js`: brush displacement, friction limiting, Fx/Fy/Mz integration.
- `solver.js`: initialize/iterate/run lifecycle for reduced model solving.
- `results.js`: final scalar metrics for UI table/cards.

## Render layer (`app/src/render`)

- `colors.js`: shared visualization palette and helpers (`mix`, `epsColor`) with `window.TireLabColors` namespace.
- `wheelView.js`: wheel cross-section rendering (road, undeformed/deformed contour, rim, contact arrows) via `window.TireLabWheelView`.
- `contactPatchView.js`: top-view contact patch with stick/transition/sliding zones via `window.TireLabContactPatchView`.
- `plotView.js`: strain, pressure, and shear chart rendering with shared plotting primitives via `window.TireLabPlotView`.

## State and orchestration

- `app/src/state.js`: state object creation for arrays and solver bookkeeping.
- `app/src/ui/controls.js`: parameter controls rendering/reading/writing.
- `app/src/ui/presets.js`: default preset provider.
- `app/src/ui/report.js`: report formatting helpers.
- `app/src/app.js`: app wiring, run/reset actions, status updates, results rendering, and render-layer calls after solve.

## UI shell

`app/index.html` loads scripts in plain script-tag dependency order (no modules/bundler), compatible with GitHub Pages and local preview tools.

## Rendering layer and engineering annotations

- `wheelView.js` draws the side view with explicit engineering callouts: road, wheel center, rim, original/deformed contour, contact zone, and load/slope annotations.
- `contactPatchView.js` renders a top-view map with axes, units, ticks, slip-state legend, and compact contact summary (length/area/max lateral displacement).
- `plotView.js` provides reusable scalar-plot framing (title, axes, grid, labels, min/max, zero line) used by strain, pressure, and shear charts.
- Explanatory UI cards in `index.html`/`app.css` document how to interpret each plot without changing model equations.
