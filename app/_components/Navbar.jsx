import { Button } from '@/components/ui/button';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import {
  Check,
  Copy,
  Download,
  Eraser,
  Moon,
  Play,
  Save,
  Sun,
  Upload,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { languages } from '@/sharedData/languages';
import { useContext, useEffect, useState } from 'react';
import { CodeEditorContext } from '@/context/CodeEditorContext';
import { codeThemes } from '@/sharedData/codeTheme';
import axios from 'axios';
import { languageExtensions } from '@/sharedData/languageExtentions';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/Config/firebaseConfig';

const Navbar = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const { user } = useUser();
  const {
    language,
    setLanguage,
    codeTheme,
    setCodeTheme,
    setClearCode,
    code,
    output,
    setOutput,
    setShowOutput,
    showOutput,
    codeId,
    setCodeId,
  } = useContext(CodeEditorContext);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const handleRun = async () => {
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
      try {
        setShowOutput(true);
        setOutput('Compiling...');

        // Step 1: Submit code for compilation
        const compileRes = await axios.post('/api/compile-code', {
          code: code,
          language: language,
        });
        const compileData = compileRes.data;
        console.log('Compile response:', compileData);

        if (!compileData?.status_update_url) {
          setOutput('Compilation failed to start');
          return;
        }

        const statusUrl = compileData.status_update_url;

        // Step 2: Poll for compilation and execution status
        setOutput('Running...');
        let attempts = 0;
        const maxAttempts = 20; // Poll for up to 20 seconds
        let executeData;

        while (attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second

          const executeRes = await axios.post('/api/execute-code', {
            url: statusUrl,
          });
          executeData = executeRes.data;
          console.log('Execute response:', executeData);

          // Check if execution is complete
          if (
            executeData?.result?.run_status?.status === 'AC' ||
            executeData?.result?.run_status?.status === 'CE' ||
            executeData?.result?.run_status?.status === 'RE'
          ) {
            break; // Execution completed
          }

          attempts++;
        }

        if (!executeData?.result?.run_status) {
          setOutput('Execution timed out or failed');
          return;
        }

        // Check for compilation errors
        if (executeData.result.compile_status !== 'OK') {
          setOutput(
            'Compilation Error:\n' +
              (executeData.result.compile_status || 'Unknown error')
          );
          return;
        }

        // Check for runtime errors
        if (executeData.result.run_status.status === 'RE') {
          setOutput(
            'Runtime Error:\n' +
              (executeData.result.run_status.stderr || 'Unknown error')
          );
          return;
        }

        // Step 3: Get the output
        const outputUrl = executeData.result.run_status.output;
        if (!outputUrl) {
          setOutput('No output');
          return;
        }

        const outputRes = await axios.post('/api/get-output', {
          url: outputUrl,
        });
        const outputData = outputRes.data;
        console.log('Output:', outputData);

        setOutput(outputData || 'Program executed successfully (no output)');
      } catch (error) {
        console.error('Error:', error);
        setOutput('Error: ' + (error.response?.data?.error || error.message));
      }
    }
    setShowOutput(true);
  };
  function getJavaClassName() {
    const classRegex = /public\s+class\s+([A-Za-z0-9_]+)/;
    const match = code.match(classRegex);
    if (match && match[1]) {
      return match[1];
    }
    // fallback
    const classRegexSimple = /class\s+([A-Za-z0-9_]+)/;
    const matchSimple = code.match(classRegexSimple);
    if (matchSimple && matchSimple[1]) {
      return matchSimple[1];
    }
    return 'Main'; // default class name
  }

  const handleDownloadfile = () => {
    let filenameBase = 'code';

    if (language === 'JAVA8' || language === 'JAVA14') {
      filenameBase = getJavaClassName();
    }

    const ext = languageExtensions[language] || 'txt';
    const filename = `${filenameBase}.${ext}`;

    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleUpload = async () => {
    try {
      const codeRef = doc(db, 'code', codeId);
      const codeSnap = await getDoc(codeRef);
      const codeObject = {
        language,
        code,
        output,
      };
      if (codeSnap.exists()) {
        const data = codeSnap.data();
        const codes = data?.codes || [];
        const index = codes.findIndex((c) => c.language == codeObject.language);
        if (index !== -1) {
          codes[index].code = code;
          codes[index].output = output;
        } else {
          codes.push(codeObject);
        }
        await updateDoc(codeRef, {
          codes,
          updatedAt: new Date(),
        });
      } else {
        await setDoc(codeRef, {
          codes: [codeObject],
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <nav className="p-3 flex flex-wrap items-center justify-between w-full shadow-md gap-2 z-50 bg-white dark:bg-black">
        {/* Logo Section */}
        <Link href={'/'}>
          <Image
            src={
              resolvedTheme == 'dark'
                ? '/command_logo_dark.svg'
                : '/command_logo_light.svg'
            }
            alt="logo"
            width="20"
            height="20"
            className="w-40 sm:w-50"
          />
        </Link>

        {/* User Controls - Stack on mobile */}
        {user && (
          <div className="flex items-center gap-3 h-full flex-wrap xs:flex-nowrap">
            <Button variant={'ghost'} onClick={() => handleUpload()}>
              <Upload />
            </Button>
            <Button className={''} variant={'ghost'} onClick={handleRun}>
              <Play />
            </Button>
            <Button variant={'ghost'} onClick={() => handleDownloadfile()}>
              <Download />
            </Button>
            <Button variant={'ghost'} onClick={handleCopy}>
              {copied ? <Check /> : <Copy />}
            </Button>
            <Button variant={'ghost'} onClick={() => setClearCode(true)}>
              <Eraser />
            </Button>
          </div>
        )}

        {/* Language and Theme Selectors */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 w-full sm:w-auto mt-3 sm:mt-0">
          <Select
            defaultValue="JAVA8"
            onValueChange={(value) => setLanguage(value)}
            value={language}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Java 8" />
            </SelectTrigger>
            <SelectContent>
              {languages &&
                languages.map((lang, index) => (
                  <SelectItem value={lang.language} key={index}>
                    {lang.value}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Select
            defaultValue="monokai"
            onValueChange={(value) => setCodeTheme(value)}
            value={codeTheme}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Java 8" />
            </SelectTrigger>
            <SelectContent>
              {codeThemes &&
                codeThemes.map((cd, index) => (
                  <SelectItem value={cd.theme} key={index}>
                    {cd.value}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* End section - responsive column on small screens */}
        <div className="flex items-center gap-4 sm:gap-6 justify-around mt-3 sm:mt-0">
          {user && (
            <Button>
              <Save />
            </Button>
          )}
          {!user ? (
            <SignInButton className={'cursor-pointer h-full'}>
              <Button className={'py-2 px-3 h-full'}>SignIn</Button>
            </SignInButton>
          ) : (
            <UserButton
              appearance={{
                elements: {
                  userButtonBox: 'w-10 h-10 cursor-pointer',
                },
              }}
            />
          )}
          {mounted && (
            <Button
              variant={'ghost'}
              size={'icon'}
              onClick={() =>
                setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
              }
            >
              {resolvedTheme === 'dark' ? <Sun /> : <Moon />}
            </Button>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
