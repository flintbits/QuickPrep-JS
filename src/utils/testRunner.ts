import { TestResult } from "../types";

type WorkerMessage = {
  code: string;
  functionName: string;
  tests: Array<{ input: unknown[]; output: unknown }>;
};

type WorkerResponse =
  | { type: "results"; results: TestResult[] }
  | { type: "error"; error: string };

const workerScript = `
  const isObject = (value) => value !== null && typeof value === 'object';

  const deepEqual = (a, b) => {
    if (b === 'function' && typeof a === 'function') return true;
    if (a === b) return true;
    if (Number.isNaN(a) && Number.isNaN(b)) return true;
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      return a.every((item, index) => deepEqual(item, b[index]));
    }
    if (isObject(a) && isObject(b)) {
      const aKeys = Object.keys(a);
      const bKeys = Object.keys(b);
      if (aKeys.length !== bKeys.length) return false;
      return aKeys.every((key) => deepEqual(a[key], b[key]));
    }
    return false;
  };

  const reviveInput = (value) => {
    if (value && typeof value === 'object' && value.__fn) {
      return new Function('return ' + value.__fn)();
    }
    return value;
  };

  self.onmessage = (event) => {
    const { code, functionName, tests } = event.data;
    try {
      const fn = new Function(code + '\nreturn ' + functionName)();
      const results = tests.map((test, index) => {
        const revivedInput = test.input.map(reviveInput);
        try {
          const output = fn(...revivedInput);
          const passed = deepEqual(output, test.output);
          return {
            index,
            passed,
            expected: test.output,
            received: output,
            input: test.input
          };
        } catch (error) {
          return {
            index,
            passed: false,
            expected: test.output,
            received: null,
            input: test.input,
            error: error instanceof Error ? error.message : String(error)
          };
        }
      });
      self.postMessage({ type: 'results', results });
    } catch (error) {
      self.postMessage({
        type: 'error',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };
`;

const createWorker = () => {
  const blob = new Blob([workerScript], { type: "application/javascript" });
  const url = URL.createObjectURL(blob);
  return new Worker(url);
};

export const runTests = (
  code: string,
  functionName: string,
  tests: Array<{ input: unknown[]; output: unknown }>,
  timeoutMs = 2000
): Promise<TestResult[]> => {
  return new Promise((resolve, reject) => {
    const worker = createWorker();
    const timeout = setTimeout(() => {
      worker.terminate();
      reject(new Error("Execution timed out. Consider optimizing your solution."));
    }, timeoutMs);

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      clearTimeout(timeout);
      worker.terminate();
      if (event.data.type === "results") {
        resolve(event.data.results);
      } else {
        reject(new Error(event.data.error));
      }
    };

    worker.onerror = (event) => {
      clearTimeout(timeout);
      worker.terminate();
      reject(new Error(event.message));
    };

    const message: WorkerMessage = { code, functionName, tests };
    worker.postMessage(message);
  });
};
