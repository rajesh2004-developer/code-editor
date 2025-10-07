import { CodeEditorContext } from '@/context/CodeEditorContext';
import { useContext, useEffect, useRef, useState } from 'react';
import { languages } from '@/sharedData/languages';
import { templates } from '@/sharedData/Template';
import { modeMappings } from '@/sharedData/modeMappings';

const CodeEditor = () => {
  const {
    language,
    codeTheme,
    code,
    setCode,
    output,
    setOutput,
    setCodeTheme,
  } = useContext(CodeEditorContext);
  const [showOutput, setShowOutput] = useState(false);
  const [lineCount, setLineCount] = useState(1);
  const [charCount, setCharCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const editorRef = useRef(null);
  const cmInstanceRef = useRef(null);

  useEffect(() => {
    const checkCodeMirror = setInterval(() => {
      if (window.CodeMirror) {
        setIsReady(true);
        clearInterval(checkCodeMirror);
      }
    }, 100);
    const timeout = setTimeout(() => {
      clearInterval(checkCodeMirror);
      console.log('CodeMirror failed to load');
    }, 10000);

    return () => {
      clearInterval(checkCodeMirror);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (!isReady || !editorRef.current || cmInstanceRef.current) {
      return;
    }

    try {
      const editor = window.CodeMirror(editorRef.current, {
        value: templates.JAVASCRIPT_NODE || '',
        mode: 'javascript',
        theme: codeTheme,
        lineNumbers: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        styleActiveLine: true,
        indentUnit: 4,
        indentWithTabs: false,
        lineWrapping: true,
      });

      editor.setSize(null, '100%');

      editor.on('change', () => {
        const content = editor.getValue();
        setCode(content);
        setLineCount(editor.lineCount());
        setCharCount(content.length);
      });

      cmInstanceRef.current = editor;
      setCode(templates.JAVASCRIPT_NODE || '');
      setLineCount(editor.lineCount());
      setCharCount((templates.JAVASCRIPT_NODE || '').length);
    } catch (error) {
      console.error('Error initializing CodeMirror:', error);
    }

    return () => {
      if (cmInstanceRef.current) {
        try {
          cmInstanceRef.current.setValue('');
        } catch (e) {
          console.error('Error cleaning up editor:', e);
        }
        cmInstanceRef.current = null;
      }
    };
  }, [isReady, setCode]);

  useEffect(() => {
    if (cmInstanceRef.current && language && modeMappings[language]) {
      try {
        cmInstanceRef.current.setOption('mode', modeMappings[language]);
        setCode(templates[language] || '');
        setLineCount(cmInstanceRef.current.lineCount());
        setCharCount((templates[language] || '').length);
        cmInstanceRef.current.setValue(templates[language] || '');
      } catch (error) {
        console.error('Error setting language mode:', error);
      }
    }
  }, [language]);

  useEffect(() => {
    if (cmInstanceRef.current && codeTheme) {
      try {
        setCodeTheme(codeTheme);
        cmInstanceRef.current.setOption('theme', codeTheme);
      } catch (error) {
        console.error('Error setting theme:', error);
      }
    }
  }, [codeTheme]);

  return (
    <div className="flex flex-col h-[85vh] text-white w-full px-10 ">
      <div className=" overflow-hidden h-full">
        <div
          ref={editorRef}
          className="h-full rounded-md"
          style={{ fontSize: '16px' }}
        ></div>
      </div>
      <div className="bg-gray-800 px-5 py-3 text-xs text-gray-400 flex justify-between items-center">
        <div className="flex gap-5">
          <span>
            Lines: <strong className="text-white">{lineCount}</strong>
          </span>
          <span>
            Characters: <strong className="text-white">{charCount}</strong>
          </span>
        </div>
        <div>Press Ctrl+Space for autocomplete</div>
      </div>
      {showOutput && (
        <div className="bg-gray-950 border-t-2 border-gray-700 p-4 max-h-68 overflow-y-auto">
          <h3 className="text-cyan-400 mb-2 text-base font-semibold">
            Output:
          </h3>
          <div className="bg-gray-800 p-4 rounded-lg font-mono text-sm text-gray-300 whitespace-pre-wrap">
            {output}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
