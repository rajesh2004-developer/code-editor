'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './_components/Sidebar';
import Navbar from './_components/Navbar';
import { useEffect, useState } from 'react';
import { CodeEditorContext } from '@/context/CodeEditorContext';
import CodeEditor from './_components/CodeEditor';

export function ThemeProvider({ children, ...props }) {
  const [language, setLanguage] = useState('JAVASCRIPT_NODE');
  const [codeTheme, setCodeTheme] = useState('monokai');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');

  useEffect(() => {
    const link1 = document.createElement('link');
    link1.rel = 'stylesheet';
    link1.href =
      'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.css';
    document.head.appendChild(link1);

    const link2 = document.createElement('link');
    link2.rel = 'stylesheet';
    link2.href =
      'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/monokai.min.css';
    document.head.appendChild(link2);

    const link3 = document.createElement('link');
    link3.rel = 'stylesheet';
    link3.href =
      'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/dracula.min.css';
    document.head.appendChild(link3);

    const link4 = document.createElement('link');
    link4.rel = 'stylesheet';
    link4.href =
      'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/material.min.css';
    document.head.appendChild(link4);

    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const loadAllScripts = async () => {
      await loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js'
      );
      await loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/javascript/javascript.min.js'
      );
      await loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/python/python.min.js'
      );
      await loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/clike/clike.min.js'
      );
      await loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/go/go.min.js'
      );
      await loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/ruby/ruby.min.js'
      );
      await loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/rust/rust.min.js'
      );
      await loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/swift/swift.min.js'
      );
      await loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/php/php.min.js'
      );
      await loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/r/r.min.js'
      );
      await loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/perl/perl.min.js'
      );
      await loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/pascal/pascal.min.js'
      );
      await loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/haskell/haskell.min.js'
      );
      await loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/clojure/clojure.min.js'
      );
      await loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/edit/closebrackets.min.js'
      );
      await loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/edit/matchbrackets.min.js'
      );
      await loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/selection/active-line.min.js'
      );
    };
    loadAllScripts();
  }, []);

  return (
    <NextThemesProvider {...props}>
      <CodeEditorContext.Provider
        value={{
          language,
          setLanguage,
          codeTheme,
          setCodeTheme,
          code,
          setCode,
          output,
          setOutput,
        }}
      >
        <main className="w-full">
          <Navbar />
          <CodeEditor />
          {children}
        </main>
      </CodeEditorContext.Provider>
    </NextThemesProvider>
  );
}
