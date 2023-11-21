import { Container } from '@mantine/core';
import { GetStaticProps } from 'next';
import { ReactElement } from 'react';
import SignInForm from '../../components/forms/SignInForm';
import SignUpForm from '../../components/forms/SignUpForm';
import Page from '../../components/others/Page';
import AuthGuard from '../../guards/AuthGuard';
import Layout from '../../layouts';
import { firestoreAdmin } from '../../_firebase/firebase_admin';

interface Props {
  isSuperAdminConfigured?: boolean | null | undefined;
}

export default function SignInPage({ isSuperAdminConfigured }: Props) {
  return (
    <Layout variant='main'>
      <Page title='Signin'>
        <Container size='xl' className='flex justify-center items-center h-[75vh]'>
          {isSuperAdminConfigured && <SignInForm />}
          {!isSuperAdminConfigured && <SignUpForm />}
        </Container>
      </Page>
    </Layout>
  );
}

SignInPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout variant='main'>{page}</Layout>;
};

export async function getServerSideProps(context: GetStaticProps) {
  const appControl = await firestoreAdmin.collection('appControls').doc('appControls').get();

  const isSuperAdminConfigured = appControl.data()?.isSuperAdminConfigured || false;

  return {
    props: {
      isSuperAdminConfigured: isSuperAdminConfigured
    }
  };
}
