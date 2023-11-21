import { Box, Container, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import AnnouncementForm from '../../components/forms/AnnouncementForm';
import Page from '../../components/others/Page';
import Layout from '../../layouts';
import { useAuthStore } from '../../models_store/auth_store';

export default function PageX() {
  const router = useRouter();
  const id = router.query.id as string;
  const { isAuthenticated, isInitialized } = useAuthStore((state) => state);

  if (!isAuthenticated) return null;

  return (
    <Page title='Contact'>
      <Container size='md' className=''>
        <Box className='flex flex-col w-full mx-auto mt-10 mb-10'>
          <Text className='text-xl font-medium leading-10'>Create a new announcement</Text>
        </Box>
        <AnnouncementForm id={id} />
      </Container>
    </Page>
  );
}

PageX.getLayout = function getLayout(page: ReactElement) {
  return <Layout variant='main'>{page}</Layout>;
};
