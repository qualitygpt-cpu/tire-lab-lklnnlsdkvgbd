# Legacy migration plan

Mapping legacy concepts to modular files:

- `params()` -> `app/src/model/params.js` and `app/src/model/units.js`
- `geom()` -> `app/src/model/geometry.js`
- `fields()` -> `app/src/model/contact.js` and `app/src/model/brush.js`
- `iterate()` -> `app/src/model/solver.js`
- `stats()` -> `app/src/model/results.js`
- `drawWheel()` -> `app/src/render/wheelView.js`
- `drawPatch()` -> `app/src/render/contactPatchView.js`
- `drawPressure()`, `drawShear()`, `drawStrain()` -> `app/src/render/plotView.js`
