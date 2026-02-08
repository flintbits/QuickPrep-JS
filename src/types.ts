export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  input: Array<unknown>;
  output: unknown;
}

export interface Question {
  id: number;
  title: string;
  difficulty: Difficulty;
  description: string;
  constraints: string[];
  examples: Example[];
  functionName: string;
  starterCode: string;
  tests: TestCase[];
}

export interface TestResult {
  index: number;
  passed: boolean;
  expected: unknown;
  received: unknown;
  input: unknown[];
  error?: string;
}
