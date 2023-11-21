import { Box, Button, Grid, Group, MantineTheme, Text, Textarea, TextInput } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useForm, yupResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Send } from 'tabler-icons-react';
import * as Yup from 'yup';
import { Announcement } from '../../models/model.announcement';
import { apiUpdateAnnouncement, apiCreateAnnouncement, apiGetAnnouncement } from '../../models_services/firestore_service';

import { getFirebaseStorageDownloadUrl } from '../../models_services/firebase_image_service';
import { FormError } from './_FormError';
import FormSkelenton from './_FormSkelenton';

interface IProps {
  id?: string;
  announcement?: Announcement | null;
}

export default function AnnoucementForm({ id }: { id?: string }) {
  const [isInitLoading, setIsInitLoading] = useState(id != null ? true : false);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  async function getInitData() {
    if (id) setAnnouncement(await apiGetAnnouncement(id));
    setIsInitLoading(false);
  }

  useEffect(() => {
    getInitData();
  }, []);

  if (isInitLoading) return <FormSkelenton />;
  if (!announcement && id) return <FormError />;

  return <Form id={id} announcement={announcement} />;
}

function Form({ id, announcement }: IProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<CustomFile | null>(null);

  const handleDropFiles = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setFile(Object.assign(file, { preview: URL.createObjectURL(file) }));
    }
  };

  const schema = Yup.object({
    title: Yup.string().required('Required'),
    description: Yup.string().required('Required'),
    link: Yup.string().url('Invalid URL'),
    imageUrl: Yup.string()
  });

  const form = useForm({
    validate: yupResolver(schema),
    initialValues: {
      title: announcement?.title ?? '',
      description: announcement?.description ?? '',
      link: announcement?.link ?? '',
      imageUrl: announcement?.imageUrl ?? ''
    }
  });

  const handleSubmit = async () => {
    if (form.validate().hasErrors) return;

    try {
      setIsLoading(true);
      const s = new Announcement();
      s.title = form.values.title;
      s.description = form.values.description;
      s.link = form.values.link;
      s.timestampCreated = announcement?.timestampCreated ?? new Date();
      s.imageUrl = announcement?.imageUrl ?? '';
      if (file) s.imageUrl = await getFirebaseStorageDownloadUrl({ file: file! });

      if (!announcement) await apiCreateAnnouncement(s);
      if (announcement && id) await apiUpdateAnnouncement(id, s);

      setIsLoading(false);

      router.push('/announcements');

      showNotification({ title: 'Success', message: 'Announcement was created', autoClose: 6000 });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      showNotification({ color: 'red', title: 'Error', message: 'There was an error creating the announcement', autoClose: 6000 });
    }
  };

  const DropzoneRemoveImage = () => {
    const removeFile = () => {
      form.setFieldValue('imageUrl', '');
      setFile(null);
    };
    if (file || form.values.imageUrl) {
      return (
        <Button className='btn absolute right-2 top-2 z-40' onClick={removeFile}>
          Remove
        </Button>
      );
    }
    return null;
  };

  const DropzoneChildren = () => {
    if (form.values.imageUrl != '') {
      return (
        <Box className='relative flex justify-center'>
          <img className='h-[300px]' src={form.values.imageUrl} alt='Preview' />
        </Box>
      );
    }
    if (file)
      return (
        <Box className='relative flex justify-center'>
          <img className='h-[300px]' src={file.preview} alt='Preview' />
        </Box>
      );
    return (
      <Box className='min-h-[300px] pointer-events-none flex justify-center items-center text-center'>
        <div>
          <Text size='xl' inline>
            Drag images here or click to select files
          </Text>
          <Text size='sm' color='dimmed' inline mt={7}>
            Attach as many files as you like, each file should not exceed 5mb
          </Text>
        </div>
      </Box>
    );
  };

  return (
    <Box className=''>
      <Grid align={'start'}>
        <Grid.Col md={12} xs={12}>
          <TextInput className='mt-4' placeholder='Name' label='Name' {...form.getInputProps('title')} />
          <Textarea minRows={3} className='mt-4' placeholder='Description' label='Description' {...form.getInputProps('description')} />
          <TextInput className='mt-4' placeholder='Link' label='Link' {...form.getInputProps('link')} />
          <Box className='relative'>
            <DropzoneRemoveImage />
            <Dropzone
              className='mt-8 p-2 z-0'
              multiple={false}
              disabled={file != null || form.values.imageUrl != ''}
              onDrop={handleDropFiles}
              onReject={(files) => console.log('rejected files', files)}
              maxSize={3 * 1024 ** 2}
              accept={IMAGE_MIME_TYPE}>
              <DropzoneChildren />
            </Dropzone>
          </Box>
        </Grid.Col>

        <Grid.Col md={12} xs={12}>
          <Box>
            <Button
              onClick={handleSubmit}
              leftIcon={<Send size={14} />}
              variant='filled'
              className='w-full mt-10 border-0 bg-app-yellow text-black hover:bg-opacity-90 transition'>
              Submit
            </Button>
          </Box>
        </Grid.Col>
      </Grid>
    </Box>
  );
}

export interface CustomFile extends File {
  path?: string;
  preview?: string;
}
