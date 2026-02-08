import { Question } from "../types";

interface ProblemViewProps {
  question: Question;
}

const ProblemView = ({ question }: ProblemViewProps) => {
  return (
    <section className="panel problem-panel">
      <div className="problem-header">
        <h2>{question.title}</h2>
        <span className={`difficulty-tag ${question.difficulty.toLowerCase()}`}>
          {question.difficulty}
        </span>
      </div>
      <p className="problem-description">{question.description}</p>

      <div className="problem-section">
        <h3>Constraints</h3>
        <ul>
          {question.constraints.map((constraint) => (
            <li key={constraint}>{constraint}</li>
          ))}
        </ul>
      </div>

      <div className="problem-section">
        <h3>Examples</h3>
        {question.examples.map((example, index) => (
          <div key={`${example.input}-${index}`} className="example-card">
            <p>
              <strong>Input:</strong> {example.input}
            </p>
            <p>
              <strong>Output:</strong> {example.output}
            </p>
            {example.explanation && (
              <p>
                <strong>Explanation:</strong> {example.explanation}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="problem-section">
        <h3>Test Cases</h3>
        <ul>
          {question.tests.map((test, index) => (
            <li key={index}>
              <strong>Input:</strong> {JSON.stringify(test.input)} |{" "}
              <strong>Output:</strong> {JSON.stringify(test.output)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ProblemView;
