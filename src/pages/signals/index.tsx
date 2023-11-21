import { Box, Button, Container, Input, Pagination, Text, TextInput } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { NextLink } from '@mantine/next';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/router';
import React, { ReactElement, useEffect, useState } from 'react';
import { Edit, Trash } from 'tabler-icons-react';
import Page from '../../components/others/Page';
import Layout from '../../layouts';
import { Signal } from '../../models/model.signal';
import { apiDeleteSignal } from '../../models_services/firestore_service';
import { useAuthStore } from '../../models_store/auth_store';
import { useFirestoreStore } from '../../models_store/firestore_store';
import { fDateTimeSuffix } from '../../utils/format_time';
import { numToPrecision } from '../../utils/number_format';
import { useBreakpoint } from '../../utils/use_breakpoint';

export default function SignalsIndexPage() {
  const [searchText, setSearchText] = useState<string | null>(null);
  const [itemsPerPage, setItemPerPage] = useState<number>(8);
  const [activePage, setActivePage] = useState(1);
  const signals = useFirestoreStore((state) => state.signals);
  const [filteredSignals, setFilteredSignals] = useState<Signal[]>([]);
  const { isAuthenticated, isInitialized } = useAuthStore((state) => state);

  useEffect(() => {
    const start = (activePage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    setFilteredSignals(signals.slice(start, end));
  }, [activePage, itemsPerPage, signals]);

  useEffect(() => {
    if (signals && searchText) {
      let _signals = signals;

      _signals = signals.filter((signal) => {
        return signal.symbol.toLowerCase().includes(searchText.toLowerCase());
      });

      setFilteredSignals(_signals);
      setFilteredSignals(_signals.slice(0, itemsPerPage));
      setActivePage(1);
    }
  }, [searchText]);

  const bp = useBreakpoint();
  useEffect(() => {
    if (bp == 'xs') setItemPerPage(4);
    if (bp != 'xs') setItemPerPage(8);
  }, [bp]);

  const itemHeaderStyle = `dark:text-dark-900 text-[13px] xs:mb-2 sm:mb-2 xs:mr-3 sm:mr-0`;
  const itemBodyStyle = `font-bold text-sm`;

  if (!isAuthenticated) return null;

  return (
    <Page title='Signals'>
      <Container size='xl' className=''>
        <Box className='flex text-center justify-between items-center mt-10 mb-10'>
          <Text className='text-xl font-semibold leading-10'>Signals</Text>
          <NextLink href='/signals/create'>
            <Button type='submit' variant='white' className='border-0 bg-app-yellow text-black hover:bg-opacity-90 transition'>
              New signal
            </Button>
          </NextLink>
        </Box>

        <Input
          onChange={(e: { currentTarget: { value: React.SetStateAction<string | null> } }) => {
            setSearchText(e.currentTarget.value);
          }}
          className='xs:w-full sm:w-1/3'
          placeholder='Search signals...'
        />

        {filteredSignals.map((signal) => {
          return (
            <Box key={signal.id} className='border dark:border-dark-500 p-2 my-3 xs:mx-0 sm:mx-0 rounded-lg '>
              <Box className='flex justify-between flex-wrap'>
                <div className='xs:w-[50.0%]  sm:w-[16%] xs:flex sm:flex sm:flex-col'>
                  <Text className={`${itemHeaderStyle}`}>Date</Text>
                  <Text className={`${itemBodyStyle}`}>{fDateTimeSuffix(signal.signalDatetime)}</Text>
                </div>

                <div className='xs:w-[50.0%] sm:w-[8%] xs:flex sm:flex sm:flex-col'>
                  <Text className={`${itemHeaderStyle}`}>Active</Text>
                  <Text className='font-bold'>{signal.isActive ? 'Yes' : 'No'}</Text>
                </div>
                <div className='xs:w-[50.0%] sm:w-[8%] xs:flex sm:flex sm:flex-col'>
                  <Text className={`${itemHeaderStyle}`}>Free</Text>
                  <Text className='font-bold'>{signal.isFree ? 'Yes' : 'No'}</Text>
                </div>
                <div className='xs:w-[50.0%] sm:w-[8%] xs:flex sm:flex sm:flex-col'>
                  <Text className={`${itemHeaderStyle}`}>Type</Text>
                  <Text className='font-bold'>
                    <GetSignal signal={signal.type}></GetSignal>
                  </Text>
                </div>

                <div className='xs:w-[50.0%]  sm:w-[8%] xs:flex sm:flex sm:flex-col'>
                  <Text className={`${itemHeaderStyle}`}>Symbol</Text>
                  <Text className={`${itemBodyStyle}`}>{signal.symbol}</Text>
                </div>

                <div className='xs:w-[50.0%] sm:w-[8%] xs:flex sm:flex sm:flex-col'>
                  <Text className={`${itemHeaderStyle}`}>Entry price</Text>
                  <Text className={`${itemBodyStyle}`}>{numToPrecision(signal.entry, 8)}</Text>
                </div>

                <div className='xs:w-[50.0%] sm:w-[8%] xs:flex sm:flex sm:flex-col'>
                  <Text className={`${itemHeaderStyle}`}>Take profit1</Text>
                  <Text className={`${itemBodyStyle}`}>{numToPrecision(signal.takeProfit1, 8)}</Text>
                </div>
                <div className='xs:w-[50.0%] sm:w-[8%] xs:flex sm:flex sm:flex-col'>
                  <Text className={`${itemHeaderStyle}`}>Take profit2</Text>
                  <Text className={`${itemBodyStyle}`}>{numToPrecision(signal.takeProfit2, 8)}</Text>
                </div>
                <div className='xs:w-[50.0%] sm:w-[8%] xs:flex sm:flex sm:flex-col'>
                  <Text className={`${itemHeaderStyle}`}>Stop loss</Text>
                  <Text className={`${itemBodyStyle}`}>{numToPrecision(signal.stopLoss, 8)}</Text>
                </div>
                <div className='xs:w-[50.0%] sm:w-[12%] xs:flex sm:flex sm:flex-col'>
                  <Text className={`${itemHeaderStyle}`}>Comment</Text>
                  <Text className={`${itemBodyStyle}`}>{signal.comment}</Text>
                </div>
                <div className='xs:w-[50.0%] sm:w-[6%] xs:flex sm:flex sm:flex-col'>
                  <Text className={`${itemHeaderStyle} sm:mb-0`}>Action</Text>
                  <Actions id={signal.id} />
                </div>
              </Box>
            </Box>
          );
        })}

        <Pagination
          className='sm:mx-2 mb-8 flex justify-end'
          styles={(theme) => ({
            item: {
              '&[data-active]': {
                backgroundColor: '#FCCF2F',
                color: '#000'
              }
            }
          })}
          page={activePage}
          onChange={setActivePage}
          total={Math.ceil(signals.length / itemsPerPage)}
        />
      </Container>
    </Page>
  );
}

SignalsIndexPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout variant='main'>{page}</Layout>;
};

/* ----------------------------- NOTE FUNCTIONS ----------------------------- */

function GetSignal({ signal }: { signal: string }) {
  if (signal === 'Bull') {
    return <Text className='italic text-md text-brand font-extrabold'>Bull</Text>;
  }

  return <Text className='italic text-md text-warning font-bold   rounded-full'>Bear</Text>;
}

function Actions({ id }: { id: string }) {
  const router = useRouter();
  const modals = useModals();

  const handleDelete = async (modalId: string) => {
    modals.closeModal(modalId);
    try {
      await apiDeleteSignal(id);
      showNotification({ title: 'Success', message: 'Signal deleted', autoClose: 6000 });
    } catch (error) {
      showNotification({ color: 'red', title: 'Error', message: 'There was an error deleting the signal', autoClose: 6000 });
    }
  };

  const openDeleteModal = () => {
    const modalId = modals.openModal({
      title: 'Are you sure you want to proceed?',
      centered: true,
      children: (
        <>
          <Text size='sm'>Delete this signal? This action cannot be undone.</Text>
          <Box className='mt-6 flex justify-end'>
            <Button
              variant='outline'
              className='w-min mx-2 border border-light-800 text-dark-400'
              fullWidth
              onClick={() => modals.closeModal(modalId)}
              mt='md'>
              No don't delete it
            </Button>

            <Button className=' w-min btn-delete mx-2' fullWidth onClick={() => handleDelete(modalId)} mt='md'>
              Delete signal
            </Button>
          </Box>
        </>
      )
    });
  };

  return (
    <Box className='flex'>
      <Edit className='cursor-pointer text-app-yellow mr-2' onClick={() => router.push(`/signals/${id}`)} />{' '}
      <Trash className='cursor-pointer text-red-400' onClick={openDeleteModal} />
    </Box>
  );
}
