/// <reference types="node" />
import { readFileSync } from "node:fs"
import { analyzePrompt } from "../lib/prompt-analyzer.ts"
import { improvePrompt } from "../lib/prompt-improver.ts"

const raw = readFileSync(0, "utf8")
const input = JSON.parse(raw || "{}") as { op?: string; text?: string }
const text = input.text ?? ""
const analysis = analyzePrompt(text)

if (input.op === "improve") {
  process.stdout.write(JSON.stringify({ improved_text: improvePrompt(text, analysis), analysis }))
} else {
  process.stdout.write(JSON.stringify(analysis))
}
