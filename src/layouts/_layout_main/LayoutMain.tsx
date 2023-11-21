import { AppShell, Box, Burger, Button, Container, Group, Header, Image, Text, useMantineColorScheme } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../models_store/auth_store';
import { useBreakpoint } from '../../utils/use_breakpoint';
import { AuthMenu } from './_auth_menu';
import DrawerLanding from './_drawer_main';

type Props = {
  children: React.ReactNode;
};

export default function LogoOnlyLayout({ children }: Props) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [appBarHeight, setAppBarHeight] = useState(70);
  const router = useRouter();
  const bp = useBreakpoint();
  const { isAuthenticated, isInitialized } = useAuthStore((state) => state);

  useEffect(() => {
    if (!isAuthenticated) router.push('/signin');
  }, [isAuthenticated, router.pathname]);

  useEffect(() => {
    if (bp == 'xs') {
      setAppBarHeight(50);
    } else {
      setAppBarHeight(60);
    }
  }, [bp]);

  return (
    <>
      <DrawerLanding isOpen={isOpenDrawer} setIsOpen={setIsOpenDrawer} />
      <AppShell
        className='bg-light-100 dark:bg-dark-100'
        padding={0}
        fixed
        header={
          <Header height={appBarHeight} className='dark:bg-dark-100'>
            <Container size='xl' className='flex justify-between align-middle h-full'>
              <Link href={'/signals'}>
                <Group className='cursor-pointer' spacing={0} align='center'>
                  <Image src={colorScheme == 'dark' ? 'svg/logo-white.svg' : 'svg/logo-black.svg'} width={90} className='' />
                </Group>
              </Link>

              {isAuthenticated && (
                <Box className='xs:hidden sm:flex'>
                  <Group>
                    <LinkToPage route='/signals' text='Signals' />
                    <LinkToPage route='/announcements' text='Announcements' />
                    <LinkToPage route='/notifications' text='Notifications' />
                    <LinkToPage route='/users' text='Users' />
                  </Group>
                </Box>
              )}

              <Box className='flex'>
                {!isAuthenticated && (
                  <Group className=''>
                    <Button onClick={() => router.push('/signin')} className='text-black dark:text-white border-dark-800 dark:border-light-800'>
                      <Text>Sign in</Text>
                    </Button>
                  </Group>
                )}

                {isAuthenticated && <AuthMenu />}

                {isAuthenticated && (
                  <Box className='xs:flex sm:hidden ml-4'>
                    <Group>
                      <Burger opened={isOpenDrawer} onClick={() => setIsOpenDrawer((o) => !o)} size='sm' />
                    </Group>
                  </Box>
                )}
              </Box>
            </Container>
          </Header>
        }>
        {children}
      </AppShell>
    </>
  );
}

function LinkToPage({ route = '', text = '' }) {
  return (
    <Link href={route} passHref>
      <Text className='mx-3 hover:opacity-95' component='a'>
        {text}
      </Text>
    </Link>
  );
}
