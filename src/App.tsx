import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import easyQuestions from "./data/easy.json";
import mediumQuestions from "./data/medium.json";
import hardQuestions from "./data/hard.json";
import CodeEditor from "./components/CodeEditor";
import ConsoleOutput from "./components/ConsoleOutput";
import ProblemView from "./components/ProblemView";
import Sidebar from "./components/Sidebar";
import { Difficulty, Question, TestResult } from "./types";
import { runTests } from "./utils/testRunner";

const questions = [...easyQuestions, ...mediumQuestions, ...hardQuestions] as Question[];

const codeKey = (id: number) => `code_${id}`;
const solvedKey = (id: number) => `solved_${id}`;

const QuestionPage = () => {
  const params = useParams();
  const questionId = Number(params.id ?? questions[0]?.id);
  const question = questions.find((item) => item.id === questionId) ?? questions[0];

  const [code, setCode] = useState(question.starterCode);
  const [results, setResults] = useState<TestResult[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | "All">("All");
  const [solvedMap, setSolvedMap] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const stored = localStorage.getItem(codeKey(question.id));
    setCode(stored ?? question.starterCode);
    setResults([]);
    setError(undefined);
  }, [question.id, question.starterCode]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      localStorage.setItem(codeKey(question.id), code);
    }, 300);
    return () => window.clearTimeout(handle);
  }, [code, question.id]);

  useEffect(() => {
    const initial: Record<number, boolean> = {};
    questions.forEach((item) => {
      initial[item.id] = localStorage.getItem(solvedKey(item.id)) === "true";
    });
    setSolvedMap(initial);
  }, []);

  const handleRun = async () => {
    setError(undefined);
    try {
      const runResults = await runTests(code, question.functionName, question.tests);
      setResults(runResults);
      const solved = runResults.every((result) => result.passed);
      localStorage.setItem(solvedKey(question.id), String(solved));
      setSolvedMap((prev) => ({ ...prev, [question.id]: solved }));
    } catch (runError) {
      const message = runError instanceof Error ? runError.message : String(runError);
      setError(message);
      setResults([]);
    }
  };

  const handleReset = () => {
    setCode(question.starterCode);
    setResults([]);
    setError(undefined);
    localStorage.removeItem(codeKey(question.id));
  };

  return (
    <div className="app-layout">
      <Sidebar
        questions={questions}
        selectedId={question.id}
        search={search}
        difficulty={difficulty}
        solvedMap={solvedMap}
        onSearchChange={setSearch}
        onDifficultyChange={setDifficulty}
      />
      <main className="main-content">
        <div className="panel-grid">
          <ProblemView question={question} />
          <CodeEditor
            code={code}
            onChange={setCode}
            onRun={handleRun}
            onReset={handleReset}
          />
        </div>
        <ConsoleOutput results={results} error={error} />
      </main>
    </div>
  );
};

const App = () => {
  const defaultId = questions[0]?.id ?? 1;
  const questionRoutes = useMemo(
    () => (
      <Route path="/question/:id" element={<QuestionPage />} />
    ),
    []
  );

  return (
    <Routes>
      {questionRoutes}
      <Route path="*" element={<Navigate to={`/question/${defaultId}`} replace />} />
    </Routes>
  );
};

export default App;
