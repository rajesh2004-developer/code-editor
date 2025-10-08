import { CodeEditorContext } from '@/context/CodeEditorContext';
import { useContext, useEffect, useRef, useState } from 'react';
import { templates } from '@/sharedData/Template';
import { modeMappings } from '@/sharedData/modeMappings';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/Config/firebaseConfig';
import { useUser } from '@clerk/nextjs';

const CodeEditor = () => {
  const {
    language,
    codeTheme,
    code,
    setCode,
    output,
    setOutput,
    setCodeTheme,
    clearCode,
    setClearCode,
    showOutput,
    codeId,
    setShowOutput,
  } = useContext(CodeEditorContext);
  const [lineCount, setLineCount] = useState(1);
  const [charCount, setCharCount] = useState(0);

  const [isReady, setIsReady] = useState(false);
  const editorRef = useRef(null);
  const cmInstanceRef = useRef(null);
  const { user } = useUser();

  const updateCodeThemeOrLanguage = async () => {
    if (!user?.primaryEmailAddress?.emailAddress || !language || !codeTheme) {
      return;
    }
    const userRef = doc(db, 'users', user?.primaryEmailAddress?.emailAddress);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      updateDoc(userRef, {
        language: language,
        codeTheme: codeTheme,
      });
    }
  };

  useEffect(() => {
    const checkCodeMirror = setInterval(() => {
      if (window.CodeMirror) {
        setIsReady(true);
        clearInterval(checkCodeMirror);
      }
    }, 100);
    const timeout = setTimeout(() => {
      clearInterval(checkCodeMirror);
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
        extraKeys: {
          'Ctrl-Space': 'autocomplete',
          Enter: 'newlineAndIndentContinueComment',
        },
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

    console.log(window.CodeMirror.modes);

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

  // useEffect(() => {

  //   const fetchCodeFromFireDB = async (language) => {
  //     try {
  //       const codeRef = doc(db, 'code', codeId);
  //       const codeSnap = await getDoc(codeRef);
  //       if (codeSnap.exists()) {
  //         const data = codeSnap.data();
  //         const codes = data?.codes || [];
  //         const index = codes.findIndex(
  //           (c) => c.language == language
  //         );
  //         if (index !== -1) {
  //           if (codes[index].code) {
  //             setCode(codes[index].code);
  //             setCharCount((codes[index].code || '').length);
  //           } else {
  //             setCode(templates[language] || '');
  //             setCharCount((templates[language] || '').length);
  //           }
  //           if (codes[index].output) {
  //             setOutput(codes[index].output);
  //             setShowOutput(true);
  //           } else {
  //             setOutput('');
  //             setShowOutput(false);
  //           }
  //         }
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   if (cmInstanceRef.current && language && modeMappings[language]) {
  //     try {
  //       cmInstanceRef.current.setOption('mode', modeMappings[language]);
  //       fetchCodeFromFireDB(language);
  //       setLineCount(cmInstanceRef.current.lineCount());
  //       cmInstanceRef.current.setValue(code || '');
  //       updateCodeThemeOrLanguage();
  //     } catch (error) {
  //       console.error('Error setting language mode:', error);
  //     }
  //   }
  // }, [language]);

  useEffect(() => {
    const fetchCodeFromFireDB = async (language) => {
      try {
        const codeRef = doc(db, 'code', codeId);
        const codeSnap = await getDoc(codeRef);
        if (codeSnap.exists()) {
          const data = codeSnap.data();
          const codes = data?.codes || [];
          const index = codes.findIndex((c) => c.language == language);
          if (index !== -1) {
            const fetchedCode = codes[index].code || '';
            setCode(fetchedCode);
            setCharCount(fetchedCode.length);
            const fetchedOutput = codes[index].output || '';
            setOutput(fetchedOutput);
            setShowOutput(!!fetchedOutput);
          } else {
            const fetchedCode = templates[language] || '';
            setCode(fetchedCode);
            setCharCount(fetchedCode.length);
            setOutput('');
            setShowOutput(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    updateCodeThemeOrLanguage();

    if (cmInstanceRef.current && language && modeMappings[language]) {
      cmInstanceRef.current.setOption('mode', modeMappings[language]);
      fetchCodeFromFireDB(language);
    }
  }, [language]);

  // Use another useEffect to update the editor value once `code` state changes:
  useEffect(() => {
    if (cmInstanceRef.current) {
      const currentValue = cmInstanceRef.current.getValue();
      if (code !== currentValue) {
        const cursor = cmInstanceRef.current.getCursor();
        cmInstanceRef.current.setValue(code || '');
        cmInstanceRef.current.setCursor(cursor);
      }
      setLineCount(cmInstanceRef.current.lineCount());
    }
  }, [code]);

  useEffect(() => {
    if (cmInstanceRef.current && codeTheme) {
      try {
        setCodeTheme(codeTheme);
        cmInstanceRef.current.setOption('theme', codeTheme);
        updateCodeThemeOrLanguage();
      } catch (error) {
        console.error('Error setting theme:', error);
      }
    }
  }, [codeTheme]);

  const clearCodefromDB = async () => {
    try {
      const codeRef = doc(db, 'code', codeId);
      const codeSnap = await getDoc(codeRef);
      if (codeSnap.exists()) {
        const data = codeSnap.data();
        const codes = data?.codes || [];
        const index = codes.findIndex((c) => c.language == language);
        if (index !== -1) {
          codes.splice(index, 1);
          await updateDoc(codeRef, {
            codes,
            updatedAt: new Date(),
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClear = () => {
    if (window.confirm('Clear all code from DB?')) {
      if (cmInstanceRef.current) {
        clearCodefromDB();
        cmInstanceRef.current.setValue('');
        setCode(templates[language] || '');
        setLineCount(cmInstanceRef.current.lineCount());
        setCharCount((templates[language] || '').length);
        cmInstanceRef.current.setValue(templates[language] || '');
      }
      setShowOutput(false);
    }
  };
  useEffect(() => {
    if (clearCode) {
      handleClear();
      setClearCode(false);
    }
  }, [clearCode]);

  return (
    <div className="flex flex-col h-[85vh] text-white w-full px-3 sm:px-10 mt-2 rounded-md justify-center">
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
        <div className="bg-gray-950 border-t-2 border-gray-700 p-4 max-h-[300px] overflow-y-auto min-h-[200px]">
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
