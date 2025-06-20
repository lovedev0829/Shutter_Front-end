import React, { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
const math = require('mathjs');

const FormulaEditor = () => {
  const [variablesInput, setVariablesInput] = useState('A=12,B=5,C=3');
  const [scope, setScope] = useState({ A: 12, B: 5, C: 3 });
  const [formula, setFormula] = useState('=if(A > 10, A * 2, A + 5)');
  const [result, setResult] = useState(null);
  const mathInstance = useRef(null);

  useEffect(() => {
    const instance = math.create(math.all);
    instance.import({
      if: (condition, trueVal, falseVal) => (condition ? trueVal : falseVal)
    }, { override: true });

    mathInstance.current = instance;
    evaluateFormula(formula);
    // eslint-disable-next-line
  }, []);

  const updateScope = () => {
    const newScope = {};
    variablesInput.split(',').forEach(pair => {
      const [key, value] = pair.split('=');
      if (key && value) {
        newScope[key.trim()] = parseFloat(value.trim());
      }
    });
    setScope(newScope);
    evaluateFormula(formula, newScope);
  };

  const evaluateFormula = (expr = formula, updatedScope = scope) => {
    try {
      const raw = expr.replace(/^=/, '');
      const evaluated = mathInstance.current.evaluate(raw, updatedScope);
      setResult(evaluated);
    } catch (err) {
      setResult(`Error: ${err.message}`);
    }
  };

  const handleEditorChange = (value) => {
    setFormula(value);
    evaluateFormula(value);
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h2>Formula Editor (Supports IF + Variables)</h2>

      <p><strong>Examples:</strong></p>
      <ul>
        <li><code>=if(A &gt; 10, A * 2, A + 5)</code></li>
        <li><code>=if(B == 5, B + C, 0)</code></li>
      </ul>

      <label>
        Define Variables (e.g. A=12,B=5,C=3):
        <br />
        <input
          style={{ width: 300, padding: 5, marginRight: 10 }}
          value={variablesInput}
          onChange={(e) => setVariablesInput(e.target.value)}
        />
        <button onClick={updateScope}>Update Variables</button>
      </label>

      <div style={{ height: 160, border: '1px solid #ccc', marginTop: 10 }}>
        <Editor
          height="160px"
          defaultLanguage="javascript"
          theme="light"
          value={formula}
          onChange={handleEditorChange}
          options={{ fontSize: 16, minimap: { enabled: false } }}
        />
      </div>

      <div id="result" style={{ marginTop: 10, fontFamily: 'monospace' }}>
        <strong>Result:</strong>{' '}
        {typeof result === 'string' && result.startsWith('Error')
          ? <span style={{ color: 'red' }}>{result}</span>
          : result}
      </div>
    </div>
  );
};

export default FormulaEditor;
