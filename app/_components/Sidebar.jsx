import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';

export function AppSidebar() {
  const { resolvedTheme } = useTheme();
  const { user } = useUser();
  return (
    <Sidebar>
      <SidebarHeader>
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
            className="w-full p-4"
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <div className="mb-20 w-full flex justify-center">
          {!user ? (
            <SignInButton className={'w-full cursor-pointer'}>
              <Button>SignIn/SignUp</Button>
            </SignInButton>
          ) : (
            <Button
              className={'px-10 cursor-pointer'}
              onClick={(e) => {
                e.currentTarget.querySelector('button').click();
              }}
            >
              <UserButton
                appearance={{
                  elements: {
                    userButtonBox: 'w-10 h-10',
                  },
                }}
              />{' '}
              <span className="text-xl"> Settings</span>
            </Button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
