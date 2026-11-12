import type { PromptItem } from "@/types/library"

export const defaultPrompts: PromptItem[] = [
  {
    id: "exam-prep",
    title: "Exam preparation",
    excerpt: "Help me prepare for a databases exam with a short study plan and practice questions.",
    intent: "Study",
    updatedLabel: "Yesterday",
    saved: true,
    favorite: true,
    idea: "I want AI to help me prepare for my databases exam.",
    answers: [
      { label: "Goal", value: "Learn" },
      { label: "Audience", value: "Me — a second-year student" },
      { label: "Tone", value: "Friendly" },
      { label: "Output", value: "Step-by-step" },
    ],
    sections: [
      { label: "Role", body: "You are a patient tutor." },
      {
        label: "Context",
        body: "The exam covers relational databases: keys, normalization, and SQL joins. I have attended the lectures and feel shaky on joins.",
      },
      { label: "Task", body: "Help me prepare, then quiz me." },
      { label: "Audience", body: "A second-year student who needs plain explanations before harder questions." },
      { label: "Tone", body: "Friendly and clear." },
      {
        label: "Output",
        body: "A short study plan, then five practice questions. Hide the answers until I ask.",
      },
      { label: "Constraints", body: "Explain any technical word in everyday language the first time you use it." },
    ],
  },
  {
    id: "resume",
    title: "Resume writing",
    excerpt: "Rewrite my project bullet points so a hiring manager can see what changed because of my work.",
    intent: "Write",
    updatedLabel: "3 days ago",
    saved: true,
    favorite: false,
    idea: "I want help rewriting the project section of my resume.",
    answers: [
      { label: "Goal", value: "Write" },
      { label: "Audience", value: "A hiring manager" },
      { label: "Tone", value: "Professional" },
      { label: "Output", value: "Bullet points" },
    ],
    sections: [
      { label: "Role", body: "You are a careful career editor." },
      {
        label: "Context",
        body: "I am a student applying for a junior product role. My projects include a campus events site and a group research summary.",
      },
      { label: "Task", body: "Rewrite my bullets so the result of the work is obvious." },
      { label: "Audience", body: "A hiring manager skimming for evidence, not a list of tools." },
      { label: "Tone", body: "Professional and specific." },
      { label: "Output", body: "Three to five bullets, each starting with a verb." },
      { label: "Constraints", body: "Do not invent numbers. If a result is missing, ask me for it." },
    ],
  },
  {
    id: "python-functions",
    title: "Python functions",
    excerpt: "Explain functions to a beginner with two small examples I can type myself.",
    intent: "Code",
    updatedLabel: "Last week",
    saved: false,
    favorite: false,
    idea: "I want to understand Python functions well enough to write my own.",
    answers: [
      { label: "Goal", value: "Learn" },
      { label: "Audience", value: "Me — a beginner" },
      { label: "Tone", value: "Simple" },
      { label: "Output", value: "Step-by-step, with code" },
    ],
    sections: [
      { label: "Role", body: "You are a patient programming teacher." },
      { label: "Context", body: "I can write variables and if statements. I have not written a function before." },
      { label: "Task", body: "Explain what a function is and why someone would write one." },
      { label: "Audience", body: "A beginner who wants to type along." },
      { label: "Tone", body: "Simple, with no unexplained jargon." },
      { label: "Output", body: "A short explanation, then two tiny examples, then one exercise." },
      { label: "Constraints", body: "Keep each example under ten lines." },
    ],
  },
]

export const libraryStorageKey = "lumi-sample-library"
