import { Box, Button, Grid, NativeSelect, Textarea, TextInput } from '@mantine/core';
import { DatePicker, TimeInput } from '@mantine/dates';
import { useForm, yupResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Send } from 'tabler-icons-react';
import * as Yup from 'yup';
import { Signal } from '../../models/model.signal';
import { apiCreateSignal, apiGetSignal, apiUpdateSignal } from '../../models_services/firestore_service';
import { FormError } from './_FormError';
import FormSkelenton from './_FormSkelenton';
interface IProps {
  id?: string;
  signal?: Signal | null;
}

export default function SignalForm({ id }: { id?: string }) {
  const [isInitLoading, setIsInitLoading] = useState(id != null ? true : false);
  const [signal, setSignal] = useState<Signal | null>(null);

  async function getInitData() {
    if (id) setSignal(await apiGetSignal(id));
    setIsInitLoading(false);
  }

  useEffect(() => {
    getInitData();
  }, []);

  if (isInitLoading) return <FormSkelenton />;
  if (!signal && id) return <FormError />;

  return <Form id={id} signal={signal} />;
}

const schema = Yup.object({
  type: Yup.string().required('Required'),
  symbol: Yup.string().required('Required'),
  signalDate: Yup.date().required('Required'),
  signalTime: Yup.date().required('Required'),
  entry: Yup.number().required('Required'),
  stopLoss: Yup.number().required('Required'),
  takeProfit1: Yup.number().required('Required'),
  takeProfit2: Yup.number().nullable(),
  comment: Yup.string(),
  isActive: Yup.string().required('Required'),
  isFree: Yup.string().required('Required')
});

function Form({ id, signal }: IProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    validate: yupResolver(schema),
    initialValues: {
      type: signal?.type ?? '',
      symbol: signal?.symbol ?? '',
      signalDate: signal?.signalDate ?? null,
      signalTime: signal?.signalTime ?? null,
      entry: signal?.entry ?? '',
      stopLoss: signal?.stopLoss ?? '',
      takeProfit1: signal?.takeProfit1 ?? '',
      takeProfit2: signal?.takeProfit2 ?? '',
      comment: signal?.comment ?? '',
      isActive: getStringFromBool(signal?.isActive ?? true),
      isFree: getStringFromBool(signal?.isFree ?? false)
    }
  });

  const handleSubmit = async () => {
    if (form.validate().hasErrors) return;

    const signalDatetime = new Date(form.values.signalDate!);
    const signalTime = new Date(form.values.signalTime!);
    signalDatetime.setHours(signalTime.getHours());
    signalDatetime.setMinutes(signalTime.getMinutes());

    try {
      setIsLoading(true);
      const s = new Signal();
      s.type = form.values.type;
      s.symbol = form.values.symbol;
      s.signalDate = form.values.signalDate;
      s.signalTime = form.values.signalTime;
      s.signalDatetime = signalDatetime;
      s.entry = Number(form.values.entry);
      s.stopLoss = Number(form.values.stopLoss);
      s.takeProfit1 = Number(form.values.takeProfit1);
      s.takeProfit2 = Number(form.values.takeProfit2);
      s.comment = form.values.comment;
      s.isActive = getBoolFromString(form.values.isActive);
      s.isFree = getBoolFromString(form.values.isFree);
      s.timestampCreated = signal?.timestampCreated ?? new Date();
      s.timestampUpdated = new Date();

      if (!signal) await apiCreateSignal(s);
      if (signal && id) await apiUpdateSignal(id, s);

      setIsLoading(false);

      router.push('/signals');

      showNotification({ title: 'Success', message: 'Signal was created', autoClose: 6000 });
    } catch (error) {
      setIsLoading(false);
      showNotification({ color: 'red', title: 'Error', message: 'There was an error creating the notification', autoClose: 6000 });
    }
  };

  return (
    <Box className=''>
      <Grid align={'start'}>
        <Grid.Col md={12} xs={12}>
          <NativeSelect
            placeholder='Type'
            label='Type'
            data={['Bull', 'Bear']}
            onChange={(e: any) => form.setFieldValue('type', e.target.value)}
            value={form.values.type}
            error={form.errors.type}
          />
          <NativeSelect
            className='mt-4'
            placeholder='Active'
            label='Active'
            data={['Yes', 'No']}
            onChange={(e: any) => form.setFieldValue('isActive', e.target.value)}
            value={form.values.isActive}
            error={form.errors.isActive}
          />

          <NativeSelect
            className='mt-4'
            placeholder='Free'
            label='Free'
            data={['Yes', 'No']}
            onChange={(e: any) => form.setFieldValue('isFree', e.target.value)}
            value={form.values.isFree}
            error={form.errors.isFree}
          />

          <TextInput className='mt-4' placeholder='Name' label='Name' {...form.getInputProps('symbol')} />
        </Grid.Col>

        <Grid.Col md={6} xs={12}>
          <DatePicker label='Pick day' className='mt-4' {...form.getInputProps('signalDate')} />
        </Grid.Col>
        <Grid.Col md={6} xs={12}>
          <TimeInput label='Pick time' className='mt-4' format='12' {...form.getInputProps('signalTime')} />
        </Grid.Col>

        <Grid.Col md={6} xs={12}>
          <TextInput label='Entry' placeholder='Entry' className='mt-4' {...form.getInputProps('entry')} />
        </Grid.Col>
        <Grid.Col md={6} xs={12}>
          <TextInput label='Stop loss' placeholder='Stop loss' className='mt-4' {...form.getInputProps('stopLoss')} />
        </Grid.Col>

        <Grid.Col md={6} xs={12}>
          <TextInput label='Take profit 1' placeholder='Take profit 1' className='mt-4' {...form.getInputProps('takeProfit1')} />
        </Grid.Col>
        <Grid.Col md={6} xs={12}>
          <TextInput label='Take profit 2' placeholder='Take profit 2' className='mt-4' {...form.getInputProps('takeProfit2')} />
        </Grid.Col>

        <Grid.Col md={12} xs={12}>
          <Box>
            <Textarea label='Result' placeholder='Result' minRows={4} maxLength={140} className='mt-4' {...form.getInputProps('comment')} />
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

function getStringFromBool(isActive?: boolean) {
  if (isActive === undefined || isActive === null) return 'Yes';
  return isActive === true ? 'Yes' : 'No';
}

function getBoolFromString(isActive?: string) {
  if (isActive == 'Yes') return true;
  return false;
}
