export type Difficulty = "Beginner" | "Steady" | "In-depth"

export type LessonExercise = {
  question: string
  options: { id: string; label: string; prompt: string }[]
  correctId: string
  correctFeedback: string
  incorrectFeedback: string
}

export type LessonContent = {
  id: string
  number: number
  title: string
  description: string
  difficulty: Difficulty
  concept: string
  whyItMatters: string
  before: string
  after: string
  whyChanged: string
  exercise: LessonExercise
  studioFocus: string
  studioNote: string
  studioIdea: string
  analyzePrompt: string
}

export type ChoiceChallenge = {
  id: string
  category: string
  title: string
  kind: "choose" | "improve"
  prompt: string
  question: string
  options: { id: string; text: string }[]
  correctId: string
  explanation: string
}

export type MissingChallenge = {
  id: string
  category: string
  title: string
  kind: "missing"
  prompt: string
  question: string
  options: { id: string; text: string }[]
  correctIds: string[]
  explanation: string
}

export type Challenge = ChoiceChallenge | MissingChallenge

export const lessons: LessonContent[] = [
  {
    id: "clear-goal",
    number: 1,
    title: "Start with a clear goal",
    description: "Say what you want AI to do, not only the topic.",
    difficulty: "Beginner",
    concept: "A goal is the action. Explain, compare, draft, or plan tells AI what to produce.",
    whyItMatters: "A topic alone can mean a history, a definition, or a tutorial. The verb chooses one.",
    before: "Tell me about Python.",
    after: "Explain Python functions to a beginner.",
    whyChanged: "The second prompt tells AI exactly what action to perform.",
    exercise: {
      question: "Which prompt is clearer?",
      options: [
        { id: "a", label: "A", prompt: "Explain Python." },
        { id: "b", label: "B", prompt: "Explain Python functions to a beginner using two examples." },
      ],
      correctId: "b",
      correctFeedback: "Exactly! B gives AI a clearer goal, audience, and level of detail.",
      incorrectFeedback: "Not quite. Look for the prompt that tells AI more about what the response should be like.",
    },
    studioFocus: "goal",
    studioNote: "Start with the action you want, then let Lumi ask for the rest.",
    studioIdea: "Tell me about Python.",
    analyzePrompt: "Tell me about Python.",
  },
  {
    id: "context",
    number: 2,
    title: "Add useful context",
    description: "Share the situation so the answer fits your life, not a generic one.",
    difficulty: "Beginner",
    concept: "Context is the background: who you are, what you are preparing for, and what you already know.",
    whyItMatters: "The same request means something different for an exam tomorrow than for a casual overview.",
    before: "Help me study machine learning.",
    after: "I'm a third-year CS student preparing for a machine learning exam. Help me create a study plan.",
    whyChanged: "Context tells AI about the user's situation.",
    exercise: {
      question: "Which prompt gives AI a situation to work with?",
      options: [
        { id: "a", label: "A", prompt: "Help me study machine learning." },
        { id: "b", label: "B", prompt: "I have an exam on Friday and I understand the vocabulary but not the math. Help me study machine learning." },
      ],
      correctId: "b",
      correctFeedback: "Good choice. B names the deadline and what you already understand.",
      incorrectFeedback: "Keep exploring. The more useful prompt tells AI the situation, not only the subject.",
    },
    studioFocus: "context",
    studioNote: "Add the situation AI should know before it answers.",
    studioIdea: "Help me study machine learning.",
    analyzePrompt: "Help me study machine learning.",
  },
  {
    id: "audience",
    number: 3,
    title: "Tell AI who it's helping",
    description: "The reader changes the words, the depth, and the examples.",
    difficulty: "Beginner",
    concept: "Audience is who will read or use the answer: you, a beginner, a professor, a customer.",
    whyItMatters: "Without a reader, the same explanation can be too simple or too technical.",
    before: "Explain neural networks.",
    after: "Explain neural networks to a beginner who knows basic Python.",
    whyChanged: "AI can adjust vocabulary and depth when it knows who the explanation is for.",
    exercise: {
      question: "Which prompt helps AI choose the right level?",
      options: [
        { id: "a", label: "A", prompt: "Explain neural networks." },
        { id: "b", label: "B", prompt: "Explain neural networks to a beginner who knows basic Python." },
      ],
      correctId: "b",
      correctFeedback: "Good choice. Adding the audience helps AI choose the right level of explanation.",
      incorrectFeedback: "Keep exploring. Look for the prompt that says who the explanation is for.",
    },
    studioFocus: "audience",
    studioNote: "Say who the response is for so the language can match them.",
    studioIdea: "Explain neural networks.",
    analyzePrompt: "Explain neural networks.",
  },
  {
    id: "specificity",
    number: 4,
    title: "Be specific",
    description: "Narrow the subject, the number, and the situation you actually need.",
    difficulty: "Steady",
    concept: "Specificity is the concrete detail: the subtopic, the count, the role, the constraint on scope.",
    whyItMatters: "A broad request leaves AI to guess the role, the topic, and the amount.",
    before: "Give me interview questions.",
    after: "Give me 10 Python interview questions for an entry-level data analyst role.",
    whyChanged: "Specific details narrow the response toward what you actually need.",
    exercise: {
      question: "Which prompt is specific enough to use?",
      options: [
        { id: "a", label: "A", prompt: "Give me interview questions." },
        { id: "b", label: "B", prompt: "Give me 10 Python interview questions for an entry-level data analyst role." },
      ],
      correctId: "b",
      correctFeedback: "Good choice. B names the count, the language, and the role.",
      incorrectFeedback: "Keep exploring. The clearer prompt says how many, about what, and for whom.",
    },
    studioFocus: "specificity",
    studioNote: "Name the subject, the number, or the role you actually need.",
    studioIdea: "Give me interview questions.",
    analyzePrompt: "Give me interview questions.",
  },
  {
    id: "output",
    number: 5,
    title: "Choose the right output",
    description: "Ask for the shape that will be easiest to use.",
    difficulty: "Steady",
    concept: "Output is the format: a table, steps, bullets, a paragraph, or code.",
    whyItMatters: "A comparison, a plan, and a list are useful in different shapes.",
    before: "Compare SQL and NoSQL.",
    after: "Compare SQL and NoSQL in a table with columns for structure, scalability, use cases, and examples.",
    whyChanged: "The output format makes the response easier to use.",
    exercise: {
      question: "Which prompt will be easier to scan?",
      options: [
        { id: "a", label: "A", prompt: "Compare SQL and NoSQL." },
        { id: "b", label: "B", prompt: "Compare SQL and NoSQL in a table with columns for structure, scalability, and use cases." },
      ],
      correctId: "b",
      correctFeedback: "Good choice. A table tells AI how to organize the comparison.",
      incorrectFeedback: "Keep exploring. Look for the prompt that names the shape of the answer.",
    },
    studioFocus: "output",
    studioNote: "Choose how you want the answer organized before you build it.",
    studioIdea: "Compare SQL and NoSQL.",
    analyzePrompt: "Compare SQL and NoSQL.",
  },
  {
    id: "constraints",
    number: 6,
    title: "Add useful constraints",
    description: "A limit on length, language, or what to leave out keeps the answer usable.",
    difficulty: "Steady",
    concept: "A constraint is a boundary: word count, simple language, no jargon, or what to exclude.",
    whyItMatters: "A useful limit is a length, a language level, or something to leave out. You do not need one on every prompt.",
    before: "Explain machine learning.",
    after: "Explain machine learning in under 300 words using simple language and no mathematical notation.",
    whyChanged: "Constraints help control the response.",
    exercise: {
      question: "Which prompt sets a useful boundary?",
      options: [
        { id: "a", label: "A", prompt: "Explain machine learning." },
        { id: "b", label: "B", prompt: "Explain machine learning in under 300 words using simple language and no mathematical notation." },
      ],
      correctId: "b",
      correctFeedback: "Good choice. B limits the length and the kind of language.",
      incorrectFeedback: "Keep exploring. A boundary sounds like a length, a language level, or something to leave out.",
    },
    studioFocus: "constraints",
    studioNote: "Open More control if you want a length, a language, or something to leave out.",
    studioIdea: "Explain machine learning.",
    analyzePrompt: "Explain machine learning.",
  },
  {
    id: "examples",
    number: 7,
    title: "Use examples",
    description: "Ask for an example when the idea is easier to see than to define.",
    difficulty: "In-depth",
    concept: "An example shows the idea in a concrete case, or shows the kind of answer you want.",
    whyItMatters: "A concrete case is easier to recognize than a definition alone. Not every prompt needs one.",
    before: "Explain recursion.",
    after: "Explain recursion to a beginner and include two simple code examples.",
    whyChanged: "Examples can make an abstract concept easier to understand.",
    exercise: {
      question: "Which prompt asks AI to show the idea, not only define it?",
      options: [
        { id: "a", label: "A", prompt: "Explain recursion." },
        { id: "b", label: "B", prompt: "Explain recursion to a beginner and include two simple code examples." },
      ],
      correctId: "b",
      correctFeedback: "Good choice. Two code examples give a beginner something to recognize.",
      incorrectFeedback: "Keep exploring. Look for the prompt that asks for a concrete example.",
    },
    studioFocus: "examples",
    studioNote: "If an example would help, add it under More control.",
    studioIdea: "Explain recursion.",
    analyzePrompt: "Explain recursion.",
  },
  {
    id: "refine",
    number: 8,
    title: "Refine and iterate",
    description: "Change one missing piece, then read what became clearer.",
    difficulty: "In-depth",
    concept: "A first prompt is a draft. Add the audience, the reason, or the limit, then compare.",
    whyItMatters: "Adding context and intent makes the request more useful than starting over.",
    before: "Write an email to my professor.",
    after: "Write a polite, concise email to my professor requesting a two-day extension for an assignment because of a scheduling conflict.",
    whyChanged: "Adding context and intent makes the request more useful.",
    exercise: {
      question: "Which revision is the more useful next draft?",
      options: [
        { id: "a", label: "A", prompt: "Write an email to my professor. Make it better." },
        { id: "b", label: "B", prompt: "Write a polite, concise email to my professor requesting a two-day extension because of a scheduling conflict." },
      ],
      correctId: "b",
      correctFeedback: "Good choice. B adds the tone, the request, and the reason.",
      incorrectFeedback: "Keep exploring. “Make it better” does not tell AI what better means.",
    },
    studioFocus: "refine",
    studioNote: "Start from the draft, then add the one detail that was missing.",
    studioIdea: "Write an email to my professor.",
    analyzePrompt: "Write an email to my professor.",
  },
]

export const challenges: Challenge[] = [
  {
    id: "clearer-python",
    category: "Clarity",
    title: "Which request is clearer?",
    kind: "choose",
    prompt: "Two ways to ask about Python.",
    question: "Which prompt gives AI a clearer job?",
    options: [
      { id: "a", text: "Python." },
      { id: "b", text: "Explain how a Python function takes an input and returns a result." },
    ],
    correctId: "b",
    explanation: "B names the action and the piece of Python you want explained. A is only a topic.",
  },
  {
    id: "context-choice",
    category: "Context",
    title: "Which prompt has a situation?",
    kind: "choose",
    prompt: "Two study requests.",
    question: "Which prompt tells AI about the situation?",
    options: [
      { id: "a", text: "Help me study databases." },
      { id: "b", text: "I have a databases exam next week and I get lost on joins. Help me study." },
    ],
    correctId: "b",
    explanation: "B includes the exam and the part that is difficult. That background changes the study plan.",
  },
  {
    id: "audience-missing",
    category: "Audience",
    title: "What could still help?",
    kind: "missing",
    prompt: "Explain Python to a beginner.",
    question: "What could make this prompt more useful? Choose every option that helps.",
    options: [
      { id: "audience", text: "Audience" },
      { id: "output", text: "Output format" },
      { id: "context", text: "Context" },
      { id: "nothing", text: "Nothing" },
    ],
    correctIds: ["output", "context"],
    explanation: "The audience is already there. A format and a little background would still make the answer easier to use. “Nothing” skips those.",
  },
  {
    id: "specific-role",
    category: "Specificity",
    title: "What should you add first?",
    kind: "improve",
    prompt: "Give me interview questions.",
    question: "What is the most useful detail to add first?",
    options: [
      { id: "purple", text: "Make it purple." },
      { id: "detail", text: "Name the role, the topic, and how many questions you want." },
      { id: "longer", text: "Make it longer." },
      { id: "emoji", text: "Add emojis." },
    ],
    correctId: "detail",
    explanation: "The role, topic, and count tell AI what the questions are for. Length, color, and emojis do not.",
  },
  {
    id: "output-table",
    category: "Output",
    title: "Which answer will be easier to use?",
    kind: "choose",
    prompt: "Two comparison requests.",
    question: "Which prompt chooses a format?",
    options: [
      { id: "a", text: "Compare SQL and NoSQL." },
      { id: "b", text: "Compare SQL and NoSQL in a table with columns for structure, scalability, and use cases." },
    ],
    correctId: "b",
    explanation: "B tells AI to use a table and names the columns. The comparison is then easier to scan.",
  },
  {
    id: "constraint-missing",
    category: "Constraints",
    title: "What boundary is missing?",
    kind: "missing",
    prompt: "Explain machine learning to a beginner.",
    question: "Which additions would control the response? Choose every one that helps.",
    options: [
      { id: "words", text: "Keep it under 300 words" },
      { id: "jargon", text: "Use simple language and no mathematical notation" },
      { id: "color", text: "Use a purple font" },
      { id: "nothing", text: "Nothing else is useful" },
    ],
    correctIds: ["words", "jargon"],
    explanation: "A length and a language level shape the explanation. A font color does not change what AI teaches.",
  },
  {
    id: "example-choice",
    category: "Examples",
    title: "Which prompt shows the idea?",
    kind: "choose",
    prompt: "Two ways to ask about recursion.",
    question: "Which prompt asks for an example?",
    options: [
      { id: "a", text: "Explain recursion." },
      { id: "b", text: "Explain recursion to a beginner and include two simple code examples." },
    ],
    correctId: "b",
    explanation: "Two code examples give a beginner a concrete case. A definition alone is easier to forget.",
  },
  {
    id: "mixed-study",
    category: "Mixed",
    title: "What should you add first?",
    kind: "improve",
    prompt: "Help me study.",
    question: "What is the most useful detail to add first?",
    options: [
      { id: "purple", text: "Make it purple." },
      { id: "situation", text: "Tell AI what subject and situation you have." },
      { id: "longer", text: "Make it longer." },
      { id: "emoji", text: "Add emojis." },
    ],
    correctId: "situation",
    explanation: "The subject and the situation give AI something real to plan around. Color, length, and emojis do not.",
  },
]

export const studioCues: Record<string, { step: number; advanced: boolean; note: string }> = {
  goal: { step: 0, advanced: false, note: "Start with the action you want, then let Lumi ask for the rest." },
  context: { step: 3, advanced: false, note: "Add the situation AI should know before it answers." },
  audience: { step: 2, advanced: false, note: "Say who the response is for so the language can match them." },
  specificity: { step: 0, advanced: false, note: "Name the subject, the number, or the role you actually need." },
  output: { step: 5, advanced: false, note: "Choose how you want the answer organized." },
  constraints: { step: 5, advanced: true, note: "More control is open if you want a length, a language, or something to leave out." },
  examples: { step: 5, advanced: true, note: "More control is open if you want to ask for an example." },
  refine: { step: 0, advanced: false, note: "Start from this draft, then add the one detail that was missing." },
}

export function lessonById(id: string) {
  return lessons.find((lesson) => lesson.id === id)
}

export function challengeById(id: string) {
  return challenges.find((challenge) => challenge.id === id)
}
