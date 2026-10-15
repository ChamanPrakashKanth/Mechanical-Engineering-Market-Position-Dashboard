# GATE Mechanical Manufacturing & Industrial Engineering — Free Revision Book

Original MechIntel first edition · 15 October 2026 · CC BY 4.0.
AI-assisted educational material. Original questions, not official previous-year questions.
Official syllabus: https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/ME_GATE2027_Syllabus.pdf

## Coverage and further study
Casting, tool life, fits and inventory. Materials and phase diagrams, forming, welding, additive manufacturing, metrology instruments, CNC/PLC, scheduling, quality, linear programming, queues and project networks need additional study.

## 1. Casting: solidification time and modulus

A casting freezes as heat leaves through the mould interface. A common comparative model relates solidification time to the volume-to-cooling-area ratio, called the casting modulus. Volume determines how much material must cool, while the exposed area helps transfer heat. For geometrically similar shapes, volume scales with the cube of length and area with the square, so the modulus scales directly with length. Compare times only when the model constant and exponent are applicable to both castings: the alloy, mould and thermal conditions matter. A riser must feed shrinkage during solidification, so its freezing behavior and connection to the casting matter as well as its size. A modulus calculation alone cannot establish a complete gating or feeding design. Identify which surfaces actually cool before computing the relevant area.

### Key relations
Chvorinov model: ts=C(V/A)^n. For equal C and n: ts2/ts1=[(V2/A2)/(V1/A1)]^n. Often n≈2 is assumed in an exercise.

### Worked example
For geometrically similar castings in the same mould conditions, linear size doubles. Find the solidification-time ratio when n=2.

Solution: Volume increases eightfold and cooling area fourfold, so V/A doubles. With unchanged C and n=2, time increases by 2²=4. The result is a ratio and does not require knowing C.

### Common mistakes
Do not assume the model constant is dimensionless. Similar-shape scaling does not apply to arbitrary changes in geometry.

### Practice
1. The casting modulus increases by 50%, with equal C and n=2. Find the time ratio.
Answer: 2.25, because 1.5²=2.25.

2. A solid cube has side 60 mm and all six faces cool. Find V/A.
Answer: 10 mm. V/A=a³/(6a²)=a/6.

## 2. Machining: cutting speed and tool life

Cutting speed is the relative surface speed at the cutting zone, not the spindle rotational speed. In turning, connect the two through workpiece diameter and circumference. The basic Taylor tool-life relation is an empirical model for a specified tool-work combination and cutting conditions. Increasing cutting speed typically reduces tool life for a positive Taylor exponent. Compare two conditions using the ratio form so the constant cancels. Do not mix seconds and minutes or change the speed unit while keeping the same fitted constant. Feed and depth of cut influence machining performance and may require an extended model. Tool-life optimization also includes production time, tool-change time, cost and constraints; a maximum life by itself is not necessarily the economic operating point.

### Key relations
Turning: V=πDN/1000 for D in mm, N in rpm, V in m/min. Taylor: VT^n=C. Ratio: T2/T1=(V1/V2)^(1/n).

### Worked example
A tool lasts 80 min at 100 m/min. Find life at 200 m/min when Taylor exponent n=0.25 and the same model applies.

Solution: T2=80×(100/200)^(1/0.25)=80×(0.5)^4=5 min. Doubling speed produces a large life reduction in this model. Verify by checking that VT^0.25 is the same at both conditions.

### Common mistakes
The exponent for the life ratio is 1/n. Spindle rpm and cutting speed are not interchangeable.

### Practice
1. Find cutting speed for D=100 mm and N=500 rpm.
Answer: 157.08 m/min, from π×100×500/1000.

2. If speed is halved and n=0.5, how does modeled tool life change?
Answer: It becomes four times as long: (2)^(1/0.5)=4.

## 3. Metrology: limits, fits and tolerance stacks

A size tolerance is the difference between the permitted maximum and minimum size. A fit describes the possible relation between mating sizes. Calculate extreme clearance by pairing the largest hole with the smallest shaft and the smallest hole with the largest shaft. If every possible difference is positive, the pair has a clearance fit; if all are negative it has an interference fit; a range that crosses zero is a transition fit. A worst-case stack sums tolerance magnitudes when independently permitted extremes can align. Statistical combinations need assumptions about distributions, independence and process centering; a root-sum-square expression is not a universal replacement for the worst case. Use explicit limits before making a fit claim. A nominal size or CAD dimension alone does not establish tolerance or interchangeability.

### Key relations
Cmax=Hmax−Smin; Cmin=Hmin−Smax. Size tolerance = upper limit − lower limit. Worst-case bilateral stack magnitude = Σti.

### Worked example
Hole limits are 20.000–20.020 mm and shaft limits are 19.980–19.990 mm. Find the clearance range and fit type.

Solution: Minimum clearance is 20.000−19.990=0.010 mm. Maximum is 20.020−19.980=0.040 mm. Both are positive, so the stated limits give a clearance fit. Hole tolerance is 0.020 mm; shaft tolerance is 0.010 mm.

### Common mistakes
Use the opposing extremes for clearance. A zero clearance at one extreme needs precise classification rather than assuming a positive running clearance.

### Practice
1. Hole: 10.000–10.010 mm; shaft: 10.020–10.030 mm. Find interference range.
Answer: 0.010–0.030 mm. Minimum is Smin−Hmax; maximum is Smax−Hmin.

2. Two independent dimensions have bilateral limits ±0.1 and ±0.2 mm. Find worst-case stack tolerance magnitude.
Answer: ±0.3 mm; add the magnitudes for the worst case.

## 4. Industrial engineering: economic order quantity

The basic economic order quantity model balances ordering cost against inventory holding cost. Larger lots reduce order frequency but raise average cycle inventory. The classic expression assumes constant known demand, instantaneous replenishment, no shortages, fixed order cost and no quantity discounts. Holding cost and demand must use the same time basis. Under these assumptions, average cycle stock is Q/2 and the number of orders per period is D/Q. At the economic optimum the ordering and cycle-stock holding costs are equal. Reorder point is a separate question about when to order: with deterministic demand and lead time it equals demand rate multiplied by lead time. Safety stock is unnecessary in this ideal deterministic model, but uncertain demand or lead time requires an additional service-level model.

### Key relations
EOQ Q*=√(2DS/H). Relevant annual cost = DS/Q + HQ/2. Deterministic reorder point = demand rate × lead time.

### Worked example
Annual demand D=10000 units, order cost S=200 rupees/order and annual holding cost H=4 rupees/unit. Find EOQ and the two relevant costs.

Solution: Q*=√(2×10000×200/4)=1000 units. There are 10 orders/year. Annual ordering cost is 10000×200/1000=2000 rupees; holding cost is 4×1000/2=2000 rupees. Relevant total is 4000 rupees/year, excluding purchase cost.

### Common mistakes
Do not combine monthly demand with annual holding cost. EOQ does not itself specify a reorder point or include safety stock.

### Practice
1. If demand quadruples with S and H fixed, how does EOQ change?
Answer: It doubles because EOQ is proportional to √D.

2. Daily demand is 50 units and deterministic lead time is 6 days. Find the reorder point.
Answer: 300 units, assuming the model has no safety stock.
