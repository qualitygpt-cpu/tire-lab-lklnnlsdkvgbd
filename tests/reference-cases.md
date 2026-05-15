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

> Note: exact parity is not yet guaranteed until rendering paths and all diagnostics from legacy are fully migrated.
