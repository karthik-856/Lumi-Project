"""Identifiers shared with frontend/src/data/curriculum.ts and data/library.ts.

Lesson pages still read the TypeScript curriculum. These rows exist so progress
and saved prompts have a stable id to point at. Titles match the frontend.
"""

DEMO_USER_ID = "lumi-explorer"
DEMO_USER_NAME = "Lumi Explorer"

LESSONS = [
    (1, "clear-goal", "Start with a clear goal", "Say what you want AI to do, not only the topic.", "Beginner"),
    (2, "context", "Add useful context", "Share the situation so the answer fits your life, not a generic one.", "Beginner"),
    (3, "audience", "Tell AI who it's helping", "The reader changes the words, the depth, and the examples.", "Beginner"),
    (4, "specificity", "Be specific", "Narrow the subject, the number, and the situation you actually need.", "Steady"),
    (5, "output", "Choose the right output", "Ask for the shape that will be easiest to use.", "Steady"),
    (6, "constraints", "Add useful constraints", "A limit on length, language, or what to leave out keeps the answer usable.", "Steady"),
    (7, "examples", "Use examples", "Ask for an example when the idea is easier to see than to define.", "In-depth"),
    (8, "refine", "Refine and iterate", "Change one missing piece, then read what became clearer.", "In-depth"),
]

CHALLENGES = [
    ("clearer-python", "Clarity", "Which request is clearer?", "choose"),
    ("context-choice", "Context", "Which prompt has a situation?", "choose"),
    ("audience-missing", "Audience", "What could still help?", "missing"),
    ("specific-role", "Specificity", "What should you add first?", "improve"),
    ("output-table", "Output", "Which answer will be easier to use?", "choose"),
    ("constraint-missing", "Constraints", "What boundary is missing?", "missing"),
    ("example-choice", "Examples", "Which prompt shows the idea?", "choose"),
    ("mixed-study", "Mixed", "What should you add first?", "improve"),
]

ACHIEVEMENT_CATALOG = [
    ("first-lesson", "First lesson", "You finished a lesson."),
    ("first-challenge", "First challenge", "You practiced with a challenge."),
    ("clear-communicator", "Clear communicator", "You finished the lesson on a clear goal."),
    ("context-builder", "Context builder", "You finished the lesson on useful context."),
    ("prompt-explorer", "Prompt explorer", "You have worked through five concepts."),
]

SEED_PROGRESS = {
    "clear-goal": "completed",
    "context": "completed",
    "audience": "in_progress",
}
