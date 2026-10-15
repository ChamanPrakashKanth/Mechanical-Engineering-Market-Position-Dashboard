# GATE Mechanical Engineering Mathematics — Free Revision Book

Original MechIntel first edition · 15 October 2026 · CC BY 4.0.
AI-assisted educational material. Original questions, not official previous-year questions.
Official syllabus: https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/ME_GATE2027_Syllabus.pdf

## Coverage and further study
Matrices, calculus, differential equations and probability. Vector calculus, complex variables, Fourier series, partial differential equations, numerical methods and advanced statistics need additional study.

## 1. Linear algebra: equations and eigenvalues

A system Ax = b connects unknown quantities through linear constraints. Row operations preserve its solutions. For a square coefficient matrix, a nonzero determinant guarantees a unique solution; a zero determinant requires checking consistency rather than automatically declaring that there is no solution. Compare the rank of A with the rank of the augmented matrix [A|b]. Equal ranks give a consistent system; if this rank is below the number of unknowns, free variables remain. An eigenvector keeps its direction when multiplied by A, although its magnitude or sign can change. This makes eigenvalues useful in vibration and stability analysis. Find eigenvalues from the characteristic polynomial before solving for eigenvectors. For a two-by-two matrix, the sum of eigenvalues equals its trace and their product equals its determinant; use both as arithmetic checks.

### Key relations
For A = [[a,b],[c,d]]: det(A) = ad − bc; det(A − λI) = 0. Consistency: rank(A) = rank([A|b]).

### Worked example
Solve 2x + y = 7 and x − y = 2. Then find the eigenvalues of A = [[2,1],[1,2]].

Solution: Add the two equations: 3x = 9, so x = 3 and y = 1. For the second matrix, (2 − λ)² − 1 = 0, giving λ = 1 and 3. Trace = 4 and determinant = 3 agree with the sum and product.

### Common mistakes
Do not confuse the coefficient matrix with the eigenvalue example matrix. A singular matrix can describe either inconsistent equations or infinitely many solutions.

### Practice
1. Find the determinant of [[4,2],[1,3]].
Answer: 10. Compute 4×3 − 2×1.

2. Are x+y=2 and 2x+2y=5 consistent?
Answer: No. Doubling the first equation gives 2x+2y=4, contradicting the second.

## 2. Calculus: stationary points and definite integrals

A derivative measures local change. A stationary point is a candidate optimum, not a guarantee: test the second derivative or compare nearby values. For a constrained interval, also evaluate the endpoints. A definite integral accumulates a signed quantity; negative values of the integrand subtract from the result. In engineering, identify the physical quantity before integrating: integrating a velocity gives displacement, whereas integrating speed gives travelled distance. For a function of several variables, a partial derivative holds the other independent variables fixed. When variables are linked, use the total derivative and chain rule. Always carry units through the calculation. An integral of a force with respect to distance has energy units, while an integral of a force with respect to time has momentum units.

### Key relations
Stationary point: f′(x)=0. If f″(x)>0: local minimum; if f″(x)<0: local maximum. ∫aᵇ f(x) dx = F(b) − F(a).

### Worked example
Find the minimum of f(x)=x²−6x+13 on the real line and evaluate ∫₀² (3x²+1) dx.

Solution: f′=2x−6=0 gives x=3. Since f″=2>0 and the parabola opens upward, the global minimum is f(3)=4. The antiderivative of 3x²+1 is x³+x. Its change from 0 to 2 is 8+2=10.

### Common mistakes
When the second derivative is zero the test is inconclusive. Do not omit the lower integration limit or confuse signed displacement with distance.

### Practice
1. Find the minimum of x²−4x+8.
Answer: 4 at x=2; complete the square to obtain (x−2)²+4.

2. Evaluate ∫₀¹ 2x dx.
Answer: 1; evaluate x² between 0 and 1.

## 3. Differential equations: first-order response

A first-order differential equation describes how a quantity changes in response to its present state and a forcing input. Separate variables only when the expression can genuinely be written as one function of y times one function of x. For a linear equation y′+P(x)y=Q(x), an integrating factor turns the left side into a product derivative. Apply the initial condition after obtaining the general solution. In a stable constant-coefficient response, the transient decays and the solution approaches its steady value. The time constant tells you the time scale of that decay: after one time constant, a zero-input exponential has fallen to 1/e of its initial value. Check the solution by substitution into the original equation and initial condition, not only by comparing a remembered formula.

### Key relations
Integrating factor = exp(∫P dx). For dy/dt + ay = b with a>0: y(t)=b/a + [y(0)−b/a]exp(−at); time constant τ=1/a.

### Worked example
Solve dy/dt + 2y = 6 for y(0)=1, with time in seconds.

Solution: The steady value is 6/2=3. The transient coefficient is 1−3=−2, so y(t)=3−2exp(−2t). At t=0 this gives 1. Its derivative is 4exp(−2t); adding 2y gives 6. The time constant is 0.5 s.

### Common mistakes
The exponent must be dimensionless. A positive growth exponent is not a stable decay. Keep the homogeneous and particular solutions distinct.

### Practice
1. For dy/dt+4y=0 and y(0)=8, find y at t=ln(2)/4 s.
Answer: 4. The exponential factor is exp(−ln 2)=1/2.

2. What is the steady value for dy/dt+5y=20?
Answer: 4, obtained by setting the time derivative to zero.

## 4. Probability: conditional events and expectation

Conditional probability changes the sample space to outcomes for which the conditioning event occurred. Independence is stronger than simply observing that two events differ; it requires their joint probability to equal the product of their probabilities. Mutually exclusive events with nonzero probabilities cannot be independent. Expected value is a probability-weighted average, not necessarily a value the random variable can actually take. For independent repeated trials with two outcomes and a fixed success probability, use the binomial model. Check that the probability stays constant and that one trial does not affect another. Sampling without replacement from a small finite population usually violates that independence assumption. Before calculating, decide whether the problem concerns exactly k successes, at least k, or no successes.

### Key relations
P(A|B)=P(A∩B)/P(B), P(B)>0. E[X]=Σx p(x). Binomial: P(X=k)=C(n,k)pᵏ(1−p)ⁿ⁻ᵏ; E[X]=np.

### Worked example
Three independent components each have a defect probability of 0.1. Find the probability of exactly one defect.

Solution: There are C(3,1)=3 possible defective positions. Each arrangement has probability 0.1×0.9². Thus P(X=1)=3×0.1×0.81=0.243. The expected number of defects is 3×0.1=0.3, which is not the probability of one defect.

### Common mistakes
Do not use the defect count as a probability. For “at least one”, use 1 minus the probability of zero defects.

### Practice
1. Two independent components each fail with probability 0.2. Find the probability that at least one fails.
Answer: 0.36. Use 1−0.8².

2. If P(A∩B)=0.12 and P(B)=0.4, find P(A|B).
Answer: 0.3, from 0.12/0.4.
