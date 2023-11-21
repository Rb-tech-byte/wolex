import { Box, Button, Drawer, Text } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Iconify from '../../components/others/Iconify';
import { useBreakpoint } from '../../utils/use_breakpoint';

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function DrawerLanding({ isOpen, setIsOpen }: Props) {
  const router = useRouter();

  const bp = useBreakpoint();

  useEffect(() => {
    if (bp == 'xs') {
    } else {
      setIsOpen(false);
    }
  }, [bp]);

  return (
    <Drawer className='py-4 px-4 w-full' title='' position='right' withCloseButton={false} opened={isOpen} onClose={() => setIsOpen(false)}>
      <Box onClick={() => setIsOpen(false)} className='flex justify-end m-0 cursor-pointer'>
        <Iconify className='' icon={'ep:circle-close'} width={30} height={30} />
      </Box>

      <Box className='flex flex-col h-[calc(90vh)] justify-center items-center'>
        <LinkToPage onClick={() => setIsOpen(false)} route='/signals' text='Signals' />
        <LinkToPage onClick={() => setIsOpen(false)} route='/announcements' text='Announcements' />
        <LinkToPage onClick={() => setIsOpen(false)} route='/notifications' text='Notifications' />
        <LinkToPage onClick={() => setIsOpen(false)} route='/users' text='Users' />

        <Button
          onClick={() => {
            setIsOpen(false);
            router.push('/signin');
          }}
          className=' text-black w-[200px] dark:text-white border-dark-800 dark:border-light-800 my-3'>
          <Text>Sign in</Text>
        </Button>
      </Box>
    </Drawer>
  );
}

interface LinkToPageProps {
  route: string;
  text: string;
  onClick: () => void;
}

function LinkToPage({ route, text, onClick }: LinkToPageProps) {
  return (
    <Link className='' href={route} passHref>
      <Text onClick={onClick} className='font-bold mx-3 hover:opacity-95 my-[13px]' component='a'>
        {text}
      </Text>
    </Link>
  );
}
