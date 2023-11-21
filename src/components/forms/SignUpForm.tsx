import { Box, Button, Text, TextInput } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Send } from 'tabler-icons-react';
import * as Yup from 'yup';
import { createUserWithEmail } from '../../models_services/firebase_auth_services';
import { useAuthStore } from '../../models_store/auth_store';
import { useFirestoreStore } from '../../models_store/firestore_store';

export default function SignInForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, isInitialized } = useAuthStore((state) => state);

  const schema = Yup.object({
    email: Yup.string().required('Required'),
    password: Yup.string().required('Required'),
    passwordConfirm: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
  });

  const form = useForm({
    validate: yupResolver(schema),

    initialValues: {
      email: '',
      password: '',
      passwordConfirm: ''
    }
  });

  const handleSubmit = async () => {
    if (form.validate().hasErrors) return;
    try {
      setIsLoading(true);
      const user = await createUserWithEmail(form.values.email, form.values.password);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      showNotification({
        color: 'red',
        title: 'Error',
        message: 'Invalid email or password',
        autoClose: 6000
      });
    }
  };

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isInitialized]);

  return (
    <Box className='xs:w-full sm:w-[500px] py-10 px-6 rounded-md'>
      <Box className='flex flex-col text-center w-full mx-auto'>
        <Text className='mt-10 xs:text-xl sm:text-2xl font-bold'>Signally! Please create the admin user!</Text>
      </Box>

      <Box className='mt-8 flex flex-col items-center'>
        <Box className='w-full'>
          <TextInput className='mt-4' placeholder='Email' label='Email' {...form.getInputProps('email')} />
          <TextInput type='password' className='mt-4' placeholder='Password' label='Password' {...form.getInputProps('password')} />

          <TextInput
            type='password'
            className='mt-4'
            placeholder='Confirm Password'
            label='Confirm Password'
            {...form.getInputProps('passwordConfirm')}
          />

          <Button
            onClick={handleSubmit}
            loading={isLoading}
            leftIcon={<Send size={14} />}
            variant='filled'
            className='w-full mt-10 border-0 bg-app-yellow text-white hover:bg-opacity-90 transition'>
            Sign up with email
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
