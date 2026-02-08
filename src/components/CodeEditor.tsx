import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  onRun: () => void;
  onReset: () => void;
}

const CodeEditor = ({ code, onChange, onRun, onReset }: CodeEditorProps) => {
  return (
    <section className="panel editor-panel">
      <div className="editor-header">
        <h3>Code Editor</h3>
        <div className="editor-actions">
          <button className="button secondary" onClick={onReset}>
            Reset Code
          </button>
          <button className="button primary" onClick={onRun}>
            Run Code
          </button>
        </div>
      </div>
      <div className="editor-wrapper">
        <Editor
          height="100%"
          defaultLanguage="typescript"
          value={code}
          onChange={(value) => onChange(value ?? "")}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false
          }}
        />
      </div>
    </section>
  );
};

export default CodeEditor;
