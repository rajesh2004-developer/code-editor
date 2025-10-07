import { Button } from '@/components/ui/button';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { Download, Eraser, Moon, Play, Save, Sun, Upload } from 'lucide-react';
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

const Navbar = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const { user } = useUser();
  const { language, setLanguage, codeTheme, setCodeTheme } =
    useContext(CodeEditorContext);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <nav className="p-3 flex items-center justify-between w-full shadow-md flex-wrap gap-2  z-50 bg-white dark:bg-black">
        <Link href={'/'}>
          <Image
            src={
              resolvedTheme == 'dark'
                ? '/command_logo_dark.svg'
                : '/command_logo_light.svg'
            }
            alt="logo"
            width={'20'}
            height={'20'}
            className="w-40 sm:w-50"
          />
        </Link>
        {user && (
          <div className="flex items-center gap-3 h-full">
            <Button variant={'ghost'}>
              <Upload />
            </Button>
            <Button className={''} variant={'ghost'}>
              <Play />
            </Button>
            <Button variant={'ghost'}>
              <Download />
            </Button>
            <Button variant={'ghost'}>
              <Eraser />
            </Button>
          </div>
        )}
        <div className="flex items-center gap-5">
          <Select
            defaultValue="JAVA8"
            onValueChange={(value) => setLanguage(value)}
            value={language}
          >
            <SelectTrigger className="w-[180px]">
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
            <SelectTrigger className="w-[180px]">
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
        <div className="flex items-center gap-6 justify-around">
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
            <Button variant={'ghost'} size={'icon'}>
              {resolvedTheme == 'dark' ? (
                <Sun onClick={() => setTheme('light')} />
              ) : (
                <Moon onClick={() => setTheme('dark')} />
              )}
            </Button>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
