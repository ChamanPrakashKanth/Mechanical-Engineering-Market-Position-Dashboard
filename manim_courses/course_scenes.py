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
