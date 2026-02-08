import { ChangeEvent, useMemo } from "react";
import { Link } from "react-router-dom";
import { Difficulty, Question } from "../types";

interface SidebarProps {
  questions: Question[];
  selectedId?: number;
  search: string;
  difficulty: Difficulty | "All";
  solvedMap: Record<number, boolean>;
  onSearchChange: (value: string) => void;
  onDifficultyChange: (value: Difficulty | "All") => void;
}

const difficultyColors: Record<Difficulty, string> = {
  Easy: "difficulty easy",
  Medium: "difficulty medium",
  Hard: "difficulty hard"
};

const Sidebar = ({
  questions,
  selectedId,
  search,
  difficulty,
  solvedMap,
  onSearchChange,
  onDifficultyChange
}: SidebarProps) => {
  const filtered = useMemo(() => {
    const lower = search.toLowerCase();
    return questions.filter((question) => {
      const matchesSearch = question.title.toLowerCase().includes(lower);
      const matchesDifficulty =
        difficulty === "All" || question.difficulty === difficulty;
      return matchesSearch && matchesDifficulty;
    });
  }, [questions, search, difficulty]);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  const handleDifficulty = (event: ChangeEvent<HTMLSelectElement>) => {
    onDifficultyChange(event.target.value as Difficulty | "All");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>QuickPrep JS</h1>
        <p>LeetCode-style practice</p>
      </div>
      <div className="sidebar-controls">
        <input
          className="input"
          placeholder="Search questions"
          value={search}
          onChange={handleSearch}
        />
        <select
          className="input"
          value={difficulty}
          onChange={handleDifficulty}
        >
          <option value="All">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>
      <div className="question-list">
        {filtered.map((question) => {
          const isActive = question.id === selectedId;
          const isSolved = solvedMap[question.id];
          return (
            <Link
              key={question.id}
              to={`/question/${question.id}`}
              className={`question-item ${isActive ? "active" : ""}`}
            >
              <div className="question-title">
                <span>
                  {question.id}. {question.title}
                </span>
                {isSolved && <span className="solved">✔</span>}
              </div>
              <span className={difficultyColors[question.difficulty]}>
                {question.difficulty}
              </span>
            </Link>
          );
        })}
        {filtered.length === 0 && (
          <div className="empty-state">No questions found.</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
