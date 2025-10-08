'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './_components/Sidebar';
import Navbar from './_components/Navbar';
import { use, useEffect, useState } from 'react';
import { CodeEditorContext } from '@/context/CodeEditorContext';
import CodeEditor from './_components/CodeEditor';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/Config/firebaseConfig';
import { useUser } from '@clerk/nextjs';
import uniqid from 'uniqid';

export function ThemeProvider({ children, ...props }) {
  const [language, setLanguage] = useState('JAVASCRIPT_NODE');
  const [codeTheme, setCodeTheme] = useState('monokai');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const { user } = useUser();
  const [codeId, setCodeId] = useState('');
  const [clearCode, setClearCode] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  const createNewUser = async () => {
    try {
      const userRef = doc(db, 'users', user?.primaryEmailAddress?.emailAddress);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setCodeId(data.codeId);
        setCodeTheme(data.codeTheme);
        setLanguage(data.language);
        console.log('User already exists');
      } else {
        const id = uniqid();
        await setDoc(userRef, {
          name: user?.fullName,
          email: user?.primaryEmailAddress?.emailAddress,
          createdAt: new Date(),
          language: language,
          codeTheme: codeTheme,
          codeId: id,
        });
        setCodeId(id);
        console.log('New user created');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    user && createNewUser();
  }, [user]);

  useEffect(() => {
    const linkHint = document.createElement('link');
    linkHint.rel = 'stylesheet';
    linkHint.href =
      'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/hint/show-hint.min.css';
    document.head.appendChild(linkHint);
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
      // other modes ...
      await loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/hint/show-hint.min.js'
      ); // autocomplete CSS + JS
      await loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/hint/anyword-hint.min.js'
      );
      //
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
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/mode/simple.min.js'
      );
      await loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/rust/rust.min.js'
      );
      await loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/swift/swift.min.js'
      );
      await loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/htmlmixed/htmlmixed.min.js'
      );
      await loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/clike/clike.min.js'
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
          clearCode,
          setClearCode,
          showOutput,
          setShowOutput,
          codeId,
          setCodeId,
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
