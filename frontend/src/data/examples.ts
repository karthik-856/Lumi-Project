export const exampleOriginal = "Explain machine learning."

export const exampleSegments = [
  { text: "Explain supervised machine learning" },
  { text: " to a third-year computer science student", label: "Added audience" },
  { text: " using simple language, " },
  { text: "three real-world examples", label: "Added examples" },
  { text: ", and a comparison with traditional programming. " },
  { text: "Present the explanation in structured bullet points.", label: "Added format" },
] as const

export const exampleWhy = {
  question: "Why specify the audience?",
  answer:
    "AI can adjust its vocabulary and level of detail depending on who will read the response. A classmate and a professor do not need the same explanation.",
}

export const exampleScores = [
  { label: "Clarity", value: 92 },
  { label: "Context", value: 80 },
  { label: "Specificity", value: 85 },
  { label: "Audience", value: 90 },
  { label: "Output", value: 70 },
  { label: "Constraints", value: 30 },
]

export const exampleOverall = 78

export const guideSteps = [
  {
    title: "Idea",
    question: "What are you trying to accomplish?",
    detail: "You start in your own words. The wording does not have to be polished.",
  },
  {
    title: "Goal",
    question: "What would you like AI to do?",
    detail: "Learn, create, analyze, write, solve, or brainstorm.",
  },
  {
    title: "Audience",
    question: "Who will use or read the result?",
    detail: "The reader changes the vocabulary and the depth.",
  },
  {
    title: "Context",
    question: "What should AI know before answering?",
    detail: "The situation, the material, and what you have already tried.",
  },
  {
    title: "Tone",
    question: "How should it sound?",
    detail: "Friendly, academic, professional, creative, simple, or persuasive.",
  },
  {
    title: "Output",
    question: "What shape should the answer take?",
    detail: "A paragraph, bullets, a table, steps, a checklist, or code.",
  },
]
