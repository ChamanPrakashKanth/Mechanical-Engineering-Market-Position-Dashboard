from manim import *

BG = "#0b0f19"
PRIMARY = "#6366f1"
ACCENT = "#06b6d4"
SUCCESS = "#10b981"
WARNING = "#f59e0b"
TEXT = "#f8fafc"
MUTED = "#94a3b8"


def title_block(title, subtitle):
    heading = Text(title, font_size=38, color=TEXT, weight=BOLD)
    sub = Text(subtitle, font_size=21, color=MUTED)
    group = VGroup(heading, sub).arrange(DOWN, buff=0.25)
    group.to_edge(UP, buff=0.45)
    return group


def formula_card(lines, color=PRIMARY):
    rendered = VGroup(*[Text(line, font_size=30 if i == 0 else 23, color=TEXT) for i, line in enumerate(lines)])
    rendered.arrange(DOWN, aligned_edge=LEFT, buff=0.18)
    box = RoundedRectangle(width=10.8, height=rendered.height + 0.7, corner_radius=0.12)
    box.set_fill(color, opacity=0.13).set_stroke(color, opacity=0.65)
    rendered.move_to(box.get_center())
    return VGroup(box, rendered)


def labeled_arrow(label, start, end, color=ACCENT):
    arrow = Arrow(start=start, end=end, buff=0.1, color=color, stroke_width=5)
    text = Text(label, font_size=20, color=TEXT).next_to(arrow, UP, buff=0.12)
    return VGroup(arrow, text)


class CourseScene(Scene):
    def setup(self):
        self.camera.background_color = BG

    def show_takeaway(self, text):
        takeaway = Text(text, font_size=26, color=SUCCESS)
        takeaway.to_edge(DOWN, buff=0.55)
        self.play(FadeIn(takeaway, shift=UP), run_time=0.8)
        self.wait(1.4)


class CadLewisGearBending(CourseScene):
    def construct(self):
        header = title_block("CAD Design", "Lewis gear tooth bending in one picture")
        formula = formula_card(["sigma = Wt / (F x m x Y)", "stress falls when face width, module, or form factor improves"], PRIMARY)
        formula.next_to(header, DOWN, buff=0.55)

        gear = Circle(radius=1.25, color=ACCENT, stroke_width=6).shift(LEFT * 3 + DOWN * 0.55)
        teeth = VGroup(*[Line(gear.point_at_angle(a), gear.point_at_angle(a) * 1.18, color=ACCENT, stroke_width=5) for a in [i * TAU / 18 for i in range(18)]])
        tooth = Rectangle(width=0.42, height=1.4, color=WARNING).shift(RIGHT * 1.8 + DOWN * 0.55)
        load = labeled_arrow("Wt", RIGHT * 3.2 + UP * 0.35, RIGHT * 2.25 + UP * 0.35, WARNING)
        labels = VGroup(
            Text("F = face width", font_size=22, color=MUTED),
            Text("m = tooth size", font_size=22, color=MUTED),
            Text("Y = shape factor", font_size=22, color=MUTED),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.2).shift(RIGHT * 2.1 + DOWN * 1.55)

        self.play(FadeIn(header), run_time=0.8)
        self.play(Write(formula), run_time=1.2)
        self.play(Create(gear), Create(teeth), FadeIn(tooth), run_time=1.2)
        self.play(GrowArrow(load[0]), FadeIn(load[1]), FadeIn(labels), run_time=1.2)
        self.play(tooth.animate.set_fill(WARNING, opacity=0.35), Indicate(formula[1][0], color=WARNING), run_time=1.0)
        self.show_takeaway("Design action: reduce bending stress before the model reaches manufacturing.")


class CaeStiffnessMatrix(CourseScene):
    def construct(self):
        header = title_block("CAE / Simulation", "The finite element balance: K u = f")
        formula = formula_card(["K u = f", "stiffness x displacement = applied force"], PRIMARY).next_to(header, DOWN, buff=0.55)

        wall = Rectangle(width=0.25, height=2.4, color=MUTED).shift(LEFT * 4 + DOWN * 0.45)
        spring = VMobject(color=ACCENT, stroke_width=5)
        points = []
        for i in range(18):
            x = -3.75 + i * 0.18
            y = -0.45 + (0.35 if i % 2 else -0.35)
            points.append([x, y, 0])
        spring.set_points_as_corners(points)
        mass = Square(side_length=1.2, color=SUCCESS).shift(RIGHT * 0.2 + DOWN * 0.45)
        force = labeled_arrow("f", RIGHT * 2.2 + DOWN * 0.45, RIGHT * 1.0 + DOWN * 0.45, WARNING)
        disp = labeled_arrow("u", RIGHT * 0.2 + UP * 1.0, RIGHT * 1.0 + UP * 1.0, ACCENT)

        self.play(FadeIn(header), Write(formula), run_time=1.2)
        self.play(FadeIn(wall), Create(spring), FadeIn(mass), run_time=1.2)
        self.play(GrowArrow(force[0]), FadeIn(force[1]), GrowArrow(disp[0]), FadeIn(disp[1]), run_time=1.0)
        self.play(mass.animate.shift(RIGHT * 0.45), spring.animate.stretch(1.18, 0, about_edge=LEFT), run_time=1.0)
        self.show_takeaway("Simulation action: check loads, constraints, and mesh before trusting colors.")


class RoboticsPidControl(CourseScene):
    def construct(self):
        header = title_block("Robotics / Mechatronics", "PID turns error into control effort")
        formula = formula_card(["u = Kp e + Ki integral(e) + Kd de/dt", "present error + past error + predicted trend"], PRIMARY).next_to(header, DOWN, buff=0.45)

        axes = Axes(x_range=[0, 6, 1], y_range=[0, 1.4, 0.5], x_length=7.5, y_length=2.5, tips=False).shift(DOWN * 1.0)
        target = DashedLine(axes.c2p(0, 1), axes.c2p(6, 1), color=SUCCESS)
        response = axes.plot(lambda x: 1 - 0.75 * np.exp(-0.75 * x) * np.cos(3.2 * x), color=ACCENT)
        labels = VGroup(
            Text("Kp: reacts now", font_size=22, color=TEXT),
            Text("Ki: removes offset", font_size=22, color=TEXT),
            Text("Kd: damps overshoot", font_size=22, color=TEXT),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.25).to_edge(RIGHT, buff=0.8).shift(DOWN * 0.55)

        self.play(FadeIn(header), Write(formula), run_time=1.2)
        self.play(Create(axes), Create(target), run_time=1.0)
        self.play(Create(response), FadeIn(labels), run_time=1.6)
        self.play(Indicate(labels[1], color=SUCCESS), Indicate(labels[2], color=WARNING), run_time=1.2)
        self.show_takeaway("Control action: tune response speed without letting oscillation dominate.")


class ManufacturingCpkCapability(CourseScene):
    def construct(self):
        header = title_block("Manufacturing / Operations", "Cp and Cpk measure process capability")
        formula = formula_card(["Cp = (USL - LSL) / (6 sigma)", "Cpk also checks whether the mean is centered"], PRIMARY).next_to(header, DOWN, buff=0.45)

        line = NumberLine(x_range=[0, 10, 1], length=8, color=MUTED).shift(DOWN * 0.9)
        lsl = Line(line.n2p(2), line.n2p(2) + UP * 1.3, color=WARNING)
        usl = Line(line.n2p(8), line.n2p(8) + UP * 1.3, color=WARNING)
        axes = Axes(x_range=[0, 10, 1], y_range=[0, 1, 0.5], x_length=8, y_length=2.1, tips=False).shift(DOWN * 0.3)
        curve = axes.plot(lambda x: np.exp(-0.5 * ((x - 5.8) / 1.0) ** 2), color=ACCENT)
        tags = VGroup(
            Text("LSL", font_size=21, color=WARNING).next_to(lsl, UP),
            Text("USL", font_size=21, color=WARNING).next_to(usl, UP),
            Text("mean shifted right", font_size=21, color=TEXT).next_to(curve, DOWN),
        )

        self.play(FadeIn(header), Write(formula), run_time=1.2)
        self.play(Create(line), Create(lsl), Create(usl), FadeIn(tags[0]), FadeIn(tags[1]), run_time=1.0)
        self.play(Create(curve), FadeIn(tags[2]), run_time=1.3)
        self.play(Indicate(formula[1][1], color=WARNING), run_time=1.0)
        self.show_takeaway("Quality action: reduce spread and recenter before defects reach customers.")


class HvacSensibleLatentLoads(CourseScene):
    def construct(self):
        header = title_block("HVAC / Thermal", "Sensible and latent loads are different jobs")
        formula = formula_card(["qs = m_dot Cp DeltaT", "ql = m_dot hfg Deltaw"], PRIMARY).next_to(header, DOWN, buff=0.5)

        air = RoundedRectangle(width=3.5, height=2.0, corner_radius=0.15, color=ACCENT).shift(LEFT * 2.6 + DOWN * 0.55)
        coil = VGroup(*[Line(LEFT * 0.2 + DOWN * 1.45 + RIGHT * i * 0.22, LEFT * 0.2 + UP * 0.4 + RIGHT * i * 0.22, color=SUCCESS) for i in range(8)])
        temp = labeled_arrow("temperature change", LEFT * 4.0 + UP * 0.75, LEFT * 2.1 + UP * 0.75, WARNING)
        moisture = VGroup(*[Dot(point=RIGHT * 2.6 + DOWN * 0.85 + RIGHT * (i % 3) * 0.35 + UP * (i // 3) * 0.35, color=ACCENT) for i in range(9)])
        moisture_label = Text("moisture removal", font_size=22, color=TEXT).next_to(moisture, UP)

        self.play(FadeIn(header), Write(formula), run_time=1.2)
        self.play(FadeIn(air), FadeIn(coil), GrowArrow(temp[0]), FadeIn(temp[1]), run_time=1.1)
        self.play(FadeIn(moisture), FadeIn(moisture_label), run_time=1.1)
        self.play(Indicate(formula[1][0], color=WARNING), Indicate(formula[1][1], color=ACCENT), run_time=1.1)
        self.show_takeaway("HVAC action: size for heat and humidity, not temperature alone.")


class FluidBernoulliConservation(CourseScene):
    def construct(self):
        header = title_block("Fluid Mechanics", "Bernoulli Conservation: P + 1/2 rho v^2 = const")
        formula = formula_card(["P1 + 1/2 rho v1^2 = P2 + 1/2 rho v2^2", "narrow pipe -> velocity rises -> pressure drops"], PRIMARY).next_to(header, DOWN, buff=0.45)

        pipe_top = Line(LEFT * 4 + UP * 0.2, LEFT * 1 + UP * 0.2, color=ACCENT, stroke_width=4)
        pipe_constrict_top = Line(LEFT * 1 + UP * 0.2, LEFT * 0.2 + DOWN * 0.3, color=ACCENT, stroke_width=4)
        pipe_narrow_top = Line(LEFT * 0.2 + DOWN * 0.3, RIGHT * 3.8 + DOWN * 0.3, color=ACCENT, stroke_width=4)

        pipe_bot = Line(LEFT * 4 + DOWN * 1.6, LEFT * 1 + DOWN * 1.6, color=ACCENT, stroke_width=4)
        pipe_constrict_bot = Line(LEFT * 1 + DOWN * 1.6, LEFT * 0.2 + DOWN * 1.1, color=ACCENT, stroke_width=4)
        pipe_narrow_bot = Line(LEFT * 0.2 + DOWN * 1.1, RIGHT * 3.8 + DOWN * 1.1, color=ACCENT, stroke_width=4)

        pipe = VGroup(pipe_top, pipe_constrict_top, pipe_narrow_top, pipe_bot, pipe_constrict_bot, pipe_narrow_bot)

        v1_arrow = labeled_arrow("v1 (Low)", LEFT * 3.5 + DOWN * 0.7, LEFT * 1.8 + DOWN * 0.7, SUCCESS)
        v2_arrow = labeled_arrow("v2 (High)", RIGHT * 0.3 + DOWN * 0.7, RIGHT * 2.8 + DOWN * 0.7, WARNING)

        p1_label = Text("P1: High Pressure", font_size=21, color=TEXT).shift(LEFT * 2.6 + UP * 0.6)
        p2_label = Text("P2: Low Pressure", font_size=21, color=WARNING).shift(RIGHT * 1.8 + UP * 0.1)

        self.play(FadeIn(header), Write(formula), run_time=1.2)
        self.play(Create(pipe), run_time=1.1)
        self.play(GrowArrow(v1_arrow[0]), FadeIn(v1_arrow[1]), FadeIn(p1_label), run_time=1.1)
        self.play(GrowArrow(v2_arrow[0]), FadeIn(v2_arrow[1]), FadeIn(p2_label), run_time=1.1)
        self.play(Indicate(formula[1][1], color=WARNING), run_time=1.0)
        self.show_takeaway("Fluid action: high velocity creates low static pressure region.")


class ThermoCarnotCycle(CourseScene):
    def construct(self):
        header = title_block("Thermodynamics", "Carnot Engine: Maximum Thermal Efficiency")
        formula = formula_card(["eta_max = 1 - (TL / TH)", "efficiency depends only on reservoir temperatures"], PRIMARY).next_to(header, DOWN, buff=0.45)

        axes = Axes(x_range=[0, 5, 1], y_range=[0, 4, 1], x_length=5.5, y_length=2.5, tips=False).shift(LEFT * 1.2 + DOWN * 0.7)
        pv_label = Text("P vs V Cycle", font_size=22, color=MUTED).next_to(axes, UP, buff=0.1)

        p1 = axes.c2p(1.2, 3.2)
        p2 = axes.c2p(3.2, 2.0)
        p3 = axes.c2p(4.2, 0.8)
        p4 = axes.c2p(2.0, 1.2)

        curve12 = CubicBezier(p1, p1 + RIGHT * 0.8 + DOWN * 0.2, p2 + LEFT * 0.5 + UP * 0.2, p2, color=SUCCESS)
        curve23 = CubicBezier(p2, p2 + RIGHT * 0.4 + DOWN * 0.5, p3 + LEFT * 0.3 + UP * 0.3, p3, color=ACCENT)
        curve34 = CubicBezier(p3, p3 + LEFT * 0.8 + UP * 0.2, p4 + RIGHT * 0.5 + DOWN * 0.2, p4, color=WARNING)
        curve41 = CubicBezier(p4, p4 + LEFT * 0.3 + UP * 0.6, p1 + DOWN * 0.5, p1, color=PRIMARY)

        cycle = VGroup(curve12, curve23, curve34, curve41)

        info = VGroup(
            Text("TH: Hot Reservoir", font_size=22, color=SUCCESS),
            Text("TL: Cold Sink", font_size=22, color=WARNING),
            Text("W_net: Enclosed Area", font_size=22, color=TEXT),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.2).shift(RIGHT * 3.2 + DOWN * 0.7)

        self.play(FadeIn(header), Write(formula), run_time=1.2)
        self.play(Create(axes), FadeIn(pv_label), run_time=1.0)
        self.play(Create(cycle), FadeIn(info), run_time=1.6)
        self.play(Indicate(formula[1][0], color=SUCCESS), run_time=1.0)
        self.show_takeaway("Thermal action: reduce rejection temperature TL to maximize engine output.")


class SomMohrsCircle(CourseScene):
    def construct(self):
        header = title_block("Strength of Materials", "Mohr's Circle: Principal & Shear Stresses")
        formula = formula_card(["sigma_1,2 = avg(sigma) +/- sqrt(((sigma_x - sigma_y)/2)^2 + tau_xy^2)", "tau_max equals the circle radius R"], PRIMARY).next_to(header, DOWN, buff=0.45)

        axes = Axes(x_range=[-1, 5, 1], y_range=[-3, 3, 1], x_length=6.0, y_length=2.4, tips=False).shift(LEFT * 1.0 + DOWN * 0.7)
        circle = Circle(radius=1.1, color=ACCENT, stroke_width=4).move_to(axes.c2p(2.2, 0))

        center_dot = Dot(axes.c2p(2.2, 0), color=WARNING)
        s1_dot = Dot(axes.c2p(3.3, 0), color=SUCCESS)
        s2_dot = Dot(axes.c2p(1.1, 0), color=SUCCESS)
        tau_dot = Dot(axes.c2p(2.2, 1.1), color=WARNING)

        radius_line = Line(axes.c2p(2.2, 0), axes.c2p(2.2, 1.1), color=WARNING, stroke_width=4)

        labels = VGroup(
            Text("sigma_1: Max Normal", font_size=20, color=SUCCESS),
            Text("sigma_2: Min Normal", font_size=20, color=SUCCESS),
            Text("tau_max: Max Shear", font_size=20, color=WARNING),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.2).shift(RIGHT * 3.4 + DOWN * 0.7)

        self.play(FadeIn(header), Write(formula), run_time=1.2)
        self.play(Create(axes), Create(circle), FadeIn(center_dot), run_time=1.2)
        self.play(Create(radius_line), FadeIn(s1_dot), FadeIn(s2_dot), FadeIn(tau_dot), FadeIn(labels), run_time=1.4)
        self.play(Indicate(labels[2], color=WARNING), run_time=1.0)
        self.show_takeaway("Stress action: evaluate principal angles before yielding occurs.")


class TomFourBarLinkage(CourseScene):
    def construct(self):
        header = title_block("Theory of Machines", "Four-Bar Linkage & Grashof Criterion")
        formula = formula_card(["s + l <= p + q", "shortest link rotates continuously if Grashof holds"], PRIMARY).next_to(header, DOWN, buff=0.45)

        ground = Line(LEFT * 2.5 + DOWN * 1.2, RIGHT * 1.5 + DOWN * 1.2, color=MUTED, stroke_width=5)
        pin_a = Dot(LEFT * 2.0 + DOWN * 1.2, color=TEXT)
        pin_d = Dot(RIGHT * 1.0 + DOWN * 1.2, color=TEXT)

        crank = Line(LEFT * 2.0 + DOWN * 1.2, LEFT * 1.2 + UP * 0.1, color=WARNING, stroke_width=6)
        coupler = Line(LEFT * 1.2 + UP * 0.1, RIGHT * 0.5 + UP * 0.5, color=ACCENT, stroke_width=6)
        rocker = Line(RIGHT * 0.5 + UP * 0.5, RIGHT * 1.0 + DOWN * 1.2, color=SUCCESS, stroke_width=6)

        mechanism = VGroup(ground, pin_a, pin_d, crank, coupler, rocker)

        info = VGroup(
            Text("s = shortest link", font_size=21, color=WARNING),
            Text("l = longest link", font_size=21, color=ACCENT),
            Text("Crank-Rocker Motion", font_size=21, color=SUCCESS),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.2).shift(RIGHT * 2.8 + DOWN * 0.5)

        self.play(FadeIn(header), Write(formula), run_time=1.2)
        self.play(Create(mechanism), FadeIn(info), run_time=1.3)
        self.play(crank.animate.rotate(0.5, about_point=pin_a.get_center()), run_time=1.0)
        self.play(Indicate(info[2], color=SUCCESS), run_time=1.0)
        self.show_takeaway("Kinematic action: select link ratios for continuous motor drive input.")


class CncGcodeToolpath(CourseScene):
    def construct(self):
        header = title_block("CNC Programming", "G00 Rapid Positioning vs G01 Feed Cutting")
        formula = formula_card(["G00 X.. Y.. (Rapid non-cutting move)", "G01 X.. Y.. F.. (Linear cutting feed move)"], PRIMARY).next_to(header, DOWN, buff=0.45)

        stock = Rectangle(width=5.5, height=2.4, color=MUTED).shift(LEFT * 1.2 + DOWN * 0.7)
        stock.set_fill(MUTED, opacity=0.15)

        p0 = LEFT * 3.5 + UP * 1.0
        p1 = LEFT * 3.2 + DOWN * 0.3
        p2 = RIGHT * 0.8 + DOWN * 0.3
        p3 = RIGHT * 0.8 + DOWN * 1.3

        path_g00 = DashedLine(p0, p1, color=WARNING, stroke_width=4)
        path_g01_a = Line(p1, p2, color=SUCCESS, stroke_width=5)
        path_g01_b = Line(p2, p3, color=SUCCESS, stroke_width=5)

        tool = Circle(radius=0.18, color=ACCENT).set_fill(ACCENT, opacity=0.8).move_to(p0)

        labels = VGroup(
            Text("G00: Rapid Traverse", font_size=21, color=WARNING),
            Text("G01: Controlled Feed", font_size=21, color=SUCCESS),
            Text("F = Feed Rate (mm/min)", font_size=21, color=TEXT),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.2).shift(RIGHT * 2.8 + DOWN * 0.6)

        self.play(FadeIn(header), Write(formula), run_time=1.2)
        self.play(FadeIn(stock), FadeIn(tool), FadeIn(labels), run_time=1.0)
        self.play(Create(path_g00), tool.animate.move_to(p1), run_time=0.8)
        self.play(Create(path_g01_a), Create(path_g01_b), tool.animate.move_to(p3), run_time=1.4)
        self.play(Indicate(labels[1], color=SUCCESS), run_time=1.0)
        self.show_takeaway("CNC action: clear workpiece boundaries with G00 before engaging G01.")

