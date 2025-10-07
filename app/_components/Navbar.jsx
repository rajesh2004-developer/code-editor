import { Button } from '@/components/ui/button';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { Download, Moon, Play, Save, Sun, Upload } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { languages } from '@/sharedData/languages';

const Navbar = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const { user } = useUser();

  return (
    <>
      <nav className="p-3 flex items-center justify-between w-full shadow-md flex-wrap gap-2 sticky top-0 z-50 bg-white dark:bg-black">
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
          </div>
        )}
        <div className="flex items-center gap-3">
          <Select defaultValue="JAVA8">
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
          {resolvedTheme == 'dark' ? (
            <Sun onClick={() => setTheme('light')} />
          ) : (
            <Moon onClick={() => setTheme('dark')} />
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
