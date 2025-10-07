// CodeEditor.jsx
import { useState, useEffect, useRef, useContext } from 'react';

import { CodeEditorContext } from '@/context/CodeEditorContext';

export default function CodeEditor() {



  useEffect(() => {


    try {





    } catch (error) {

    }


  }, [isReady, codeTheme, setCode]);

  // Update language mode


  // Update theme
  

  const handleRun = () => {
    if (language === 'JAVASCRIPT_NODE') {
      try {
        const logs = [];
        const originalLog = console.log;
        console.log = (...args) => {
          logs.push(args.join(' '));
        };

        eval(code);

        console.log = originalLog;
        setOutput(
          logs.length > 0
            ? logs.join('\n')
            : 'Code executed successfully (no output)'
        );
      } catch (err) {
        setOutput(`Error: ${err.message}`);
      }
    } else {
      const selectedLang = languages.find((l) => l.language === language);
      setOutput(
        `Note: Only JavaScript can run in the browser.\nFor ${
          selectedLang?.value || language
        }, use an online compiler or local environment.`
      );
    }
    setShowOutput(true);
  };

  const handleClear = () => {
    if (window.confirm('Clear all code?')) {
      if (cmInstanceRef.current) {
        cmInstanceRef.current.setValue('');
      }
      setShowOutput(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!isReady) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Code Editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div></div>

  );
}
