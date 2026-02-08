import { TestResult } from "../types";

interface ConsoleOutputProps {
  results: TestResult[];
  error?: string;
}

const ConsoleOutput = ({ results, error }: ConsoleOutputProps) => {
  return (
    <section className="panel console-panel">
      <div className="console-header">
        <h3>Output Console</h3>
      </div>
      <div className="console-body">
        {error && <div className="console-error">Error: {error}</div>}
        {!error && results.length === 0 && (
          <div className="console-placeholder">Run your code to see results.</div>
        )}
        {!error &&
          results.map((result) => (
            <div
              key={result.index}
              className={`console-item ${result.passed ? "pass" : "fail"}`}
            >
              <div>
                Test {result.index + 1}: {result.passed ? "Passed" : "Failed"}
              </div>
              <div className="console-details">
                <div>
                  <strong>Input:</strong> {JSON.stringify(result.input)}
                </div>
                {result.error ? (
                  <div>
                    <strong>Error:</strong> {result.error}
                  </div>
                ) : (
                  <>
                    <div>
                      <strong>Expected:</strong> {JSON.stringify(result.expected)}
                    </div>
                    <div>
                      <strong>Received:</strong> {JSON.stringify(result.received)}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
      </div>
    </section>
  );
};

export default ConsoleOutput;
