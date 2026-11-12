import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_deck(output_path="lumi-idea-presentation.pptx"):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    BG_COLOR = RGBColor(11, 15, 25)       # #0B0F19
    SURFACE_COLOR = RGBColor(19, 28, 49)  # #131C31
    BORDER_COLOR = RGBColor(35, 51, 84)   # #233354
    TEXT_LIGHT = RGBColor(241, 245, 249)  # #F1F5F9
    TEXT_MUTED = RGBColor(148, 163, 184) # #94A3B8
    CYAN_ACCENT = RGBColor(56, 189, 248)  # #38BDF8
    INDIGO_ACCENT = RGBColor(99, 102, 241)# #6366F1
    GREEN_ACCENT = RGBColor(16, 185, 129) # #10B981

    slides_data = [
        {
            "num": "01 / 10",
            "timing": "0:00 – 0:50 (50s)",
            "speaker": "Speaker 1",
            "title": "Lumi: Inclusive, Local-First Prompt Engineering",
            "subtitle": "Closing the HCI Gulfs in Everyday Human-AI Interaction",
            "boxes": [
                {
                    "title": "Project Identity",
                    "items": [
                        "Domain: Human-AI Interaction & Inclusive Educational Scaffolding",
                        "Architecture: 100% Offline / Local-First (zero API keys, private)",
                        "Presentation Date: November 13–14, 2026"
                    ]
                },
                {
                    "title": "Team & Academic Mandate",
                    "items": [
                        "Team Members: Karthik & Peer Collaborators",
                        "Course: Human-Computer Interaction (HCI)",
                        "Target: 8-minute timed presentation + 4-minute defense"
                    ]
                }
            ],
            "footer": "Speaker 1 · Hook the audience with the problem and local-first premise.",
            "notes": "Good morning faculty and peers. We present Lumi, an inclusive, local-first interactive system designed to bridge human intent and generative AI capabilities without prompt jargon or cloud dependencies."
        },
        {
            "num": "02 / 10",
            "timing": "0:50 – 1:40 (50s)",
            "speaker": "Speaker 2",
            "title": "The Problem: The 'Blank Canvas' AI Barrier",
            "subtitle": "Norman's Gulf of Execution in Current Conversational AI Interfaces",
            "boxes": [
                {
                    "title": "Observed User Failures",
                    "items": [
                        "Jargon Fatigue: Terms like 'temperature' and 'system role' alienate novices.",
                        "Vague Prompting: Users enter 3 words (e.g. 'write an essay') and get low-utility results.",
                        "Privacy Anxiety: Fear of pasting proprietary or academic data into commercial LLMs."
                    ]
                },
                {
                    "title": "Target Users & Measurable Goals",
                    "items": [
                        "Target Users: Undergraduates, educators, non-technical writers.",
                        "Goal 1: Reduce prompt construction time by >40%.",
                        "Goal 2: Eliminate cognitive prompt anxiety with zero cloud tracking."
                    ]
                }
            ],
            "footer": "Speaker 2 · Clarify target audience and measurable HCI usability objectives.",
            "notes": "Every major AI tool greets users with a blank text box. This creates an enormous Gulf of Execution. Users know their goals but don't know the exact phrasing AI needs."
        },
        {
            "num": "03 / 10",
            "timing": "1:40 – 2:30 (50s)",
            "speaker": "Speaker 1",
            "title": "Empirical User Research Evidence",
            "subtitle": "Formative Study: N = 5 Participants Across Academic Disciplines",
            "boxes": [
                {
                    "title": "Research Methodology",
                    "items": [
                        "P1: Freshman engineering student struggling with assignment outlines.",
                        "P2: Humanities major intimidated by technical AI terminology.",
                        "P3: Graduate teaching assistant grading generic student prompts.",
                        "P4 & P5: Admin & research assistants worried about academic privacy."
                    ]
                },
                {
                    "title": "Key Discoveries & Requirements",
                    "items": [
                        "Requirement 1: Step-by-step scaffolding instead of open-ended input.",
                        "Requirement 2: Immediate, understandable feedback on prompt quality.",
                        "Requirement 3: Zero configuration; must run without accounts or API keys."
                    ]
                }
            ],
            "footer": "Speaker 1 · Grounding in verified user interviews and observations.",
            "notes": "To satisfy our empirical evidence rubric, we conducted structured interviews with five distinct users. 100% of participants expressed that open prompt boxes caused hesitation and inconsistent outputs."
        },
        {
            "num": "04 / 10",
            "timing": "2:30 – 3:20 (50s)",
            "speaker": "Speaker 2",
            "title": "Design Concept: The 6-Step Guided Studio",
            "subtitle": "Scaffolded Decomposition Replacing Monolithic Input",
            "boxes": [
                {
                    "title": "The 6 Structural Dimensions",
                    "items": [
                        "1. Core Idea: What do you want to accomplish?",
                        "2. Exact Goal: Measurable desired outcome.",
                        "3. Audience: Who is reading or consuming the result?",
                        "4. Context: Constraints, source background, and tone.",
                        "5. Output Format: Tables, bullet points, executive brief.",
                        "6. Safety & Boundaries: Guardrails against hallucinations."
                    ]
                },
                {
                    "title": "Visual Scaffolding Paradigm",
                    "items": [
                        "No blank canvas: Progressive disclosure guides each phase.",
                        "Live Prompt Canvas: Dynamic assembly visible in real-time.",
                        "Pre-tested Templates: 20 domain-specific starter guides."
                    ]
                }
            ],
            "footer": "Speaker 2 · Walk through the structural breakdown and how it aids cognitive load.",
            "notes": "Instead of asking users to write a prompt all at once, Lumi decomposes prompt engineering into six intuitive, bite-sized steps that assemble live on screen."
        },
        {
            "num": "05 / 10",
            "timing": "3:20 – 4:10 (50s)",
            "speaker": "Speaker 1",
            "title": "Interactive Functional Prototype",
            "subtitle": "Production-Ready React 19 Frontend + Local Python Engine",
            "boxes": [
                {
                    "title": "Core Workspaces",
                    "items": [
                        "Guided Studio: Live canvas with reactive heuristic scoring.",
                        "Prompt Analyzer: Instant 0–100 rubric analysis for any raw prompt.",
                        "Prompt Workbench: Single-view quick builder on home screen.",
                        "Template Library: 20 curated academic and professional prompts."
                    ]
                },
                {
                    "title": "Local-First Persistence",
                    "items": [
                        "My Work Library: Real-time filtering, category sorting, search.",
                        "Export Suite: Single-click Markdown (.md) and JSON backup.",
                        "A/B Evaluation Matrix: Blind side-by-side prompt scoring."
                    ]
                }
            ],
            "footer": "Speaker 1 · Showcase prototype completeness and offline execution.",
            "notes": "Here is our working prototype. Everything runs offline in your browser and local Python process. Notice the instant feedback and the zero-friction export."
        },
        {
            "num": "06 / 10",
            "timing": "4:10 – 5:00 (50s)",
            "speaker": "Speaker 2",
            "title": "HCI Grounding 1: Gulfs & Golden Rules",
            "subtitle": "Direct Application of Norman & Shneiderman Principles",
            "boxes": [
                {
                    "title": "Norman's Gulf of Execution & Evaluation",
                    "items": [
                        "Execution: 6-step guided inputs map user intent directly to AI syntax.",
                        "Evaluation: Live 0–100 heuristic score reveals prompt efficacy before sending."
                    ]
                },
                {
                    "title": "Shneiderman's 8 Golden Rules",
                    "items": [
                        "Strive for Consistency: Uniform color cues, cards, and button variants.",
                        "Informative Feedback: Score badges update on every single keystroke.",
                        "Error Prevention: Form validations prevent blank or broken prompts.",
                        "Internal Locus of Control: User retains complete manual editing rights."
                    ]
                }
            ],
            "footer": "Speaker 2 · Explicit mapping to theoretical HCI literature.",
            "notes": "Lumi is grounded in fundamental HCI theory. We directly close Norman's Gulf of Execution through structured inputs and Norman's Gulf of Evaluation through real-time heuristic scoring."
        },
        {
            "num": "07 / 10",
            "timing": "5:00 – 5:50 (50s)",
            "speaker": "Speaker 1",
            "title": "HCI Grounding 2: Gould-Lewis & Usability",
            "subtitle": "Iterative Design, Heuristic Compliance & Accessibility",
            "boxes": [
                {
                    "title": "Gould & Lewis (1985) Principles",
                    "items": [
                        "Early Focus on Users: 5 initial interviews directly shaped the 6 steps.",
                        "Empirical Measurement: Benchmarked against standard baseline prompts.",
                        "Iterative Design: 4 prototyping iterations from raw form to guided studio."
                    ]
                },
                {
                    "title": "Nielsen's Usability & Accessibility",
                    "items": [
                        "Recognition over Recall: Suggestions and templates eliminate blank memory load.",
                        "Flexibility & Efficiency: Quick copy, markdown export, and keyboard navigation.",
                        "Accessibility (a11y): High-contrast WCAG 2.1 AA palettes, scalable typography."
                    ]
                }
            ],
            "footer": "Speaker 1 · Validate user-centered design lifecycle and inclusive accessibility.",
            "notes": "Gould and Lewis emphasized early user focus and empirical measurement. We followed this rigorously with 4 design iterations and strict WCAG AA accessibility standards."
        },
        {
            "num": "08 / 10",
            "timing": "5:50 – 6:40 (50s)",
            "speaker": "Speaker 2",
            "title": "Evaluation Plan: Measuring Usability",
            "subtitle": "Empirical Protocol for Quantitative & Qualitative Validation",
            "boxes": [
                {
                    "title": "Evaluation Protocol",
                    "items": [
                        "Participants: N = 15 undergraduate and graduate students.",
                        "Design: Within-subjects comparison (Standard ChatGPT vs. Lumi Studio).",
                        "Tasks: Drafting a research synopsis and writing an instructional rubric."
                    ]
                },
                {
                    "title": "Target Metrics & Milestones",
                    "items": [
                        "Task Completion Time: Expected 35% reduction in drafting duration.",
                        "Prompt Quality Score: Evaluated blind on clarity, specificity, and constraints.",
                        "System Usability Scale (SUS): Target benchmark SUS score > 82 / 100."
                    ]
                }
            ],
            "footer": "Speaker 2 · Detail rigorous experimental protocol and verifiable metrics.",
            "notes": "Our formal evaluation plan employs a within-subjects study comparing standard blank-canvas AI interfaces against Lumi. We will measure task time, prompt quality, and SUS score."
        },
        {
            "num": "09 / 10",
            "timing": "6:40 – 7:30 (50s)",
            "speaker": "Speaker 1",
            "title": "Expected Impact, Limitations & Ethics",
            "subtitle": "Empowering Agency While Acknowledging Technical Boundaries",
            "boxes": [
                {
                    "title": "Expected Impact",
                    "items": [
                        "Pedagogical: Teaches users *how* to think systematically about AI prompting.",
                        "Privacy Preserving: Zero data egress; safe for proprietary, medical, or academic data.",
                        "Digital Equity: Operates entirely on lightweight client hardware."
                    ]
                },
                {
                    "title": "Realistic Limitations",
                    "items": [
                        "Heuristic Scoring: Rule-based heuristics cannot model every multi-modal nuance.",
                        "Offline Boundary: Users still manually copy final prompts into their chosen AI tool."
                    ]
                }
            ],
            "footer": "Speaker 1 · Demonstrate academic maturity, clear boundaries, and honest limits.",
            "notes": "Lumi's biggest impact is educational: it teaches prompt engineering principles rather than hiding them behind a black box. Our rule-based scoring is transparent and predictable."
        },
        {
            "num": "10 / 10",
            "timing": "7:30 – 8:00 (30s)",
            "speaker": "Speaker 1 & 2",
            "title": "References, Teamwork & GenAI Declaration",
            "subtitle": "Course Rule Compliance, Team Equality & Open Defense",
            "boxes": [
                {
                    "title": "Key Academic References",
                    "items": [
                        "Norman, D. (2013). The Design of Everyday Things. Basic Books.",
                        "Nielsen, J. (1994). 10 Usability Heuristics for User Interface Design.",
                        "Shneiderman, B., et al. (2016). Designing the User Interface. Pearson.",
                        "Gould, J. D., & Lewis, C. (1985). Designing for usability. CACM."
                    ]
                },
                {
                    "title": "Team & GenAI Tool Declaration",
                    "items": [
                        "Team Contribution: Equal 50/50 division across research, code, and delivery.",
                        "GenAI Declaration (Course Rule 8): Google Antigravity (Gemini) was utilized as an AI pair programmer for test scaffolding and layout styling; all logic and findings verified.",
                        "Status: Project tested, built, verified, and running smoothly."
                    ]
                }
            ],
            "footer": "Both Speakers · Conclude on time (8:00 sharp) and open floor for faculty questions.",
            "notes": "Thank you faculty. All references are cited according to APA guidelines, and our GenAI tool declaration complies with Course Rule 8. We welcome your questions."
        }
    ]

    for slide_data in slides_data:
        slide = prs.slides.add_slide(blank_layout)

        # Background fill
        bg_shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg_shape.fill.solid()
        bg_shape.fill.fore_color.rgb = BG_COLOR
        bg_shape.line.fill.background()

        # Header bar
        header_shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(0.4), Inches(11.733), Inches(0.45))
        header_shape.fill.solid()
        header_shape.fill.fore_color.rgb = SURFACE_COLOR
        header_shape.line.color.rgb = BORDER_COLOR
        header_shape.line.width = Pt(1)
        tf_h = header_shape.text_frame
        tf_h.word_wrap = True
        p_h = tf_h.paragraphs[0]
        p_h.text = f"LUMI HCI PRESENTATION  ·  SLIDE {slide_data['num']}  ·  ALLOCATION: {slide_data['timing']}  ·  {slide_data['speaker']}"
        p_h.font.size = Pt(11)
        p_h.font.bold = True
        p_h.font.color.rgb = CYAN_ACCENT

        # Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.0), Inches(11.733), Inches(1.1))
        tf_t = title_box.text_frame
        tf_t.word_wrap = True
        p_t = tf_t.paragraphs[0]
        p_t.text = slide_data['title']
        p_t.font.size = Pt(26)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_LIGHT

        # Subtitle
        p_sub = tf_t.add_paragraph()
        p_sub.text = slide_data['subtitle']
        p_sub.font.size = Pt(14)
        p_sub.font.italic = True
        p_sub.font.color.rgb = CYAN_ACCENT
        p_sub.space_before = Pt(4)

        # 2 Column Boxes
        col_width = Inches(5.666)
        col_height = Inches(4.3)
        top_pos = Inches(2.2)

        # Box 1
        box1 = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), top_pos, col_width, col_height)
        box1.fill.solid()
        box1.fill.fore_color.rgb = SURFACE_COLOR
        box1.line.color.rgb = BORDER_COLOR
        box1.line.width = Pt(1)
        tf1 = box1.text_frame
        tf1.word_wrap = True
        tf1.margin_left = Inches(0.3)
        tf1.margin_right = Inches(0.3)
        tf1.margin_top = Inches(0.3)
        
        b1_data = slide_data['boxes'][0]
        p_b1_title = tf1.paragraphs[0]
        p_b1_title.text = b1_data['title']
        p_b1_title.font.size = Pt(18)
        p_b1_title.font.bold = True
        p_b1_title.font.color.rgb = TEXT_LIGHT
        p_b1_title.space_after = Pt(12)

        for item in b1_data['items']:
            p_item = tf1.add_paragraph()
            p_item.text = f"•  {item}"
            p_item.font.size = Pt(13)
            p_item.font.color.rgb = TEXT_MUTED
            p_item.space_after = Pt(8)

        # Box 2
        box2 = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.866), top_pos, col_width, col_height)
        box2.fill.solid()
        box2.fill.fore_color.rgb = SURFACE_COLOR
        box2.line.color.rgb = BORDER_COLOR
        box2.line.width = Pt(1)
        tf2 = box2.text_frame
        tf2.word_wrap = True
        tf2.margin_left = Inches(0.3)
        tf2.margin_right = Inches(0.3)
        tf2.margin_top = Inches(0.3)

        b2_data = slide_data['boxes'][1]
        p_b2_title = tf2.paragraphs[0]
        p_b2_title.text = b2_data['title']
        p_b2_title.font.size = Pt(18)
        p_b2_title.font.bold = True
        p_b2_title.font.color.rgb = TEXT_LIGHT
        p_b2_title.space_after = Pt(12)

        for item in b2_data['items']:
            p_item = tf2.add_paragraph()
            p_item.text = f"•  {item}"
            p_item.font.size = Pt(13)
            p_item.font.color.rgb = TEXT_MUTED
            p_item.space_after = Pt(8)

        # Footer Cue
        footer_box = slide.shapes.add_textbox(Inches(0.8), Inches(6.65), Inches(11.733), Inches(0.45))
        tf_f = footer_box.text_frame
        tf_f.word_wrap = True
        p_f = tf_f.paragraphs[0]
        p_f.text = f"TARGET: {slide_data['footer']}"
        p_f.font.size = Pt(11)
        p_f.font.bold = True
        p_f.font.color.rgb = GREEN_ACCENT

        # Speaker notes
        notes_slide = slide.notes_slide
        text_frame = notes_slide.notes_text_frame
        text_frame.text = f"[{slide_data['speaker']} - {slide_data['timing']}]\n\n{slide_data['notes']}"

    prs.save(output_path)
    print(f"Presentation successfully saved to {output_path}")

if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else "lumi-idea-presentation.pptx"
    create_deck(out)
