# Manual test cases (placeholders)

1. Static vertical load
2. Longitudinal slope
3. Lateral banking
4. Slip angle
5. Low pressure vs high pressure

## 2.5D migration checks
- widthNodes = 1: behavior remains close to baseline 1D mode (forces and residual trend comparable).
- camber/bank angle != 0: pressure center shifts across tire width (pressureCenterY != 0).
- increasing mass/load increases contact patch area.
- decreasing mu expands slide zones in contact patch view.
- after convergence, Fn is close to Ntarget.
