# Legacy migration plan

## Status

- ✅ Started: calculation core migration from `legacy/tire_reduced_fem_model_original.html` to `app/src/model/*`.

## Legacy mapping

- `defs` + `params()` -> `app/src/model/params.js`, `app/src/model/units.js`.
- `init()` -> `app/src/state.js`, `app/src/model/solver.js` (`initialize`).
- `geom()` -> `app/src/model/geometry.js`.
- `fields()` -> split between `app/src/model/contact.js` (strain fields) and `app/src/model/brush.js` (shear/slip/forces).
- `iterate()` -> `app/src/model/solver.js` (`iterate`, `run`).
- `derive()` + `stats()` -> `app/src/model/results.js` and app UI assembly.

## Intentionally not migrated in this PR

- Full rendering parity for `drawWheel()`, `drawPatch()`, `drawPressure()`, `drawShear()`, `drawStrain()`.
- Advanced diagnostics panels and detailed plotting from legacy canvas views.

These items are intentionally deferred to follow-up rendering-focused PRs.
