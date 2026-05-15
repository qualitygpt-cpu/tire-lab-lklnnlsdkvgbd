# Legacy migration plan

## Status

- ✅ Started: calculation core migration from `legacy/tire_reduced_fem_model_original.html` to `app/src/model/*`.
- ✅ Completed in this PR: rendering migration for wheel deformation, contact patch, and core plots in `app/src/render/*` and app UI wiring.

## Legacy mapping

- `defs` + `params()` -> `app/src/model/params.js`, `app/src/model/units.js`.
- `init()` -> `app/src/state.js`, `app/src/model/solver.js` (`initialize`).
- `geom()` -> `app/src/model/geometry.js`.
- `fields()` -> split between `app/src/model/contact.js` (strain fields) and `app/src/model/brush.js` (shear/slip/forces).
- `iterate()` -> `app/src/model/solver.js` (`iterate`, `run`).
- `derive()` + `stats()` -> `app/src/model/results.js` and app UI assembly.
- `drawWheel()` -> `app/src/render/wheelView.js`.
- `drawPatch()` -> `app/src/render/contactPatchView.js`.
- `drawStrain()` + `drawPressure()` + `drawShear()` + `plotLine()` + `plotXY()` + `axes()` -> `app/src/render/plotView.js`.
- `epsColor()` + `mix()` -> `app/src/render/colors.js`.

## Notes

- Visual parity with legacy is approximate and must be manually checked against `legacy/tire_reduced_fem_model_original.html`.
- This PR does not change the mathematical model; it migrates rendering/UI visualization only.
