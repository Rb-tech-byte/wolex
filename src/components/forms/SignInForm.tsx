import { Box, Button, Text, TextInput } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Send } from 'tabler-icons-react';
import * as Yup from 'yup';
import { signinWithEmail } from '../../models_services/firebase_auth_services';
import { useAuthStore } from '../../models_store/auth_store';
import { useFirestoreStore } from '../../models_store/firestore_store';

export default function SignInForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, isInitialized } = useAuthStore((state) => state);
  const { streamSignals, streamAnnouncements, streamAuthUsers } = useFirestoreStore((state) => state);

  const schema = Yup.object({
    email: Yup.string().required('Required'),
    password: Yup.string().required('Required')
  });

  const form = useForm({
    validate: yupResolver(schema),

    initialValues: {
      email: '',
      password: ''
    }
  });

  const handleSubmit = async () => {
    if (form.validate().hasErrors) return;
    try {
      setIsLoading(true);
      const user = await signinWithEmail(form.values.email, form.values.password);
      if (user) {
        router.push('/signals');
        streamAnnouncements();
        streamSignals();
        streamAuthUsers();
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      showNotification({
        color: 'red',
        title: 'Error',
        message: 'Invalid email or password',
        autoClose: 6000
      });
    }
  };

  return (
    <Box className='xs:w-full sm:w-[500px] py-10 px-6 rounded-md'>
      <Box className='flex flex-col text-center w-full mx-auto '>
        <Text className='mt-4 text-2xl font-bold'>Signally account login</Text>
      </Box>

      <Box className='mt-8 flex flex-col items-center'>
        <Box className='w-full'>
          <TextInput placeholder='Email' label='Email' radius={0} {...form.getInputProps('email')} />
          <TextInput type='password' className='mt-4' placeholder='Password' label='Password' {...form.getInputProps('password')} />

          <Button
            onClick={handleSubmit}
            loading={isLoading}
            leftIcon={<Send size={14} />}
            variant='filled'
            className='w-full mt-10 border-0 bg-app-yellow text-black hover:bg-opacity-90 transition'>
            Sign in with email
          </Button>
        </Box>

        <Box className='mt-4 flex flex-col flex-wrap justify-start items-start w-full'>
          <Button
            onClick={() => router.push('/reset-password')}
            className='btn-text text-app-yellowText hover:text-opacity-80 text-[14px] mt-[2px] transition'>
            Forgot password?
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
