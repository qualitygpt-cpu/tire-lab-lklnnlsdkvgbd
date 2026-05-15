# Reference cases and manual regression checklist

## Manual regression (legacy vs modular app)

1. Open `legacy/tire_reduced_fem_model_original.html`.
2. Open `app/index.html`.
3. Use same default parameters and node count.
4. Run both calculations.
5. Compare qualitatively:
   - normal force,
   - contact patch length,
   - maximum contact pressure,
   - Fx,
   - Fy.
6. Record any discrepancies.

## Visual regression checklist (app)

- [ ] Default case shows tire touching road.
- [ ] Contact patch appears at bottom of tire.
- [ ] Strain plot is not empty.
- [ ] Pressure plot appears only in contact zone.
- [ ] Shear plot changes when slip angle or slip ratio changes.
- [ ] Increasing load increases deformation/contact patch qualitatively.
- [ ] Increasing pressure reduces deformation/contact patch qualitatively.

> Note: visual parity is approximate and should be manually checked.
