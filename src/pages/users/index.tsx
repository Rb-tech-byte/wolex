import { Box, Button, Container, Input, Pagination, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { NextLink } from '@mantine/next';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/router';
import React, { ReactElement, useEffect, useState } from 'react';
import Page from '../../components/others/Page';
import Layout from '../../layouts';
import { AuthUser } from '../../models/model.authuser';
import { apiUpdateUserLifetime } from '../../models_services/firestore_service';
import { useAuthStore } from '../../models_store/auth_store';
import { useFirestoreStore } from '../../models_store/firestore_store';
import { fDateTimeSuffix } from '../../utils/format_time';
import { useBreakpoint } from '../../utils/use_breakpoint';

export default function SignalsIndexPage() {
  const [searchText, setSearchText] = useState<string | null>(null);
  const [itemsPerPage, setItemPerPage] = useState<number>(8);
  const [activePage, setActivePage] = useState(1);
  const authUsers = useFirestoreStore((state) => state.authUsers);
  const [filteredAuthUsers, setFilteredAuthUser] = useState<AuthUser[]>([]);
  const { isAuthenticated, isInitialized } = useAuthStore((state) => state);

  useEffect(() => {
    const start = (activePage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    setFilteredAuthUser(authUsers.slice(start, end));
  }, [activePage, itemsPerPage, authUsers]);

  useEffect(() => {
    if (authUsers && searchText) {
      let _authUsers = authUsers;

      _authUsers = authUsers.filter((user) => {
        return user.email.toLowerCase().includes(searchText.toLowerCase());
      });

      setFilteredAuthUser(_authUsers);
      setFilteredAuthUser(_authUsers.slice(0, itemsPerPage));
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
    <Page title='Contact'>
      <Container size='xl' className=''>
        <Box className='flex text-center justify-between items-center mt-10 mb-10'>
          <Text className='text-xl font-semibold leading-10'>Users</Text>
          <NextLink href='/announcements/create'></NextLink>
        </Box>

        <Input
          onChange={(e: { currentTarget: { value: React.SetStateAction<string | null> } }) => {
            setSearchText(e.currentTarget.value);
          }}
          className='xs:w-full sm:w-1/3'
          placeholder='Search signals...'
        />
        {filteredAuthUsers.map((authUser) => {
          return (
            <Box key={authUser.id} className='border dark:border-dark-500 p-2 my-3 xs:mx-0 sm:mx-0 rounded-lg '>
              <Box className='flex justify-between flex-wrap'>
                <div className='xs:w-[100.0%]  sm:w-[15%] xs:flex sm:flex sm:flex-col'>
                  <Text className={`${itemHeaderStyle}`}>Created</Text>
                  <Text className={`${itemBodyStyle}`}>{fDateTimeSuffix(authUser.timestampCreated)}</Text>
                </div>

                <div className='xs:w-[100.0%]  sm:w-[20%] xs:flex sm:flex sm:flex-col'>
                  <Text className={`${itemHeaderStyle}`}>Email</Text>
                  <Text className={`${itemBodyStyle}`}>{authUser.email}</Text>
                </div>

                <div className='xs:w-[100.0%]  sm:w-[9%] xs:flex sm:flex sm:flex-col'>
                  <Text className={`${itemHeaderStyle}`}>Last Login</Text>
                  <Text className={`${itemBodyStyle}`}>{fDateTimeSuffix(authUser.timestampLastLogin)}</Text>
                </div>

                <div className='xs:w-[50.0%]  sm:w-[9%] xs:flex sm:flex sm:flex-col'>
                  <Text className={`${itemHeaderStyle}`}>Username</Text>
                  <Text className={`${itemBodyStyle}`}>{authUser.name}</Text>
                </div>

                <div className='xs:w-[50.0%]  sm:w-[9%] xs:flex sm:flex sm:flex-col'>
                  <Text className={`${itemHeaderStyle}`}>Sub Active</Text>
                  <Text className={`${itemBodyStyle}`}>{authUser.subIsActive ? 'Yes' : 'No'}</Text>
                </div>

                <div className='xs:w-[50.0%]  sm:w-[9%] xs:flex sm:flex sm:flex-col'>
                  <Text className={`${itemHeaderStyle}`}>Sub Period Type</Text>
                  <Text className={`${itemBodyStyle}`}>{authUser.subPeriodType}</Text>
                </div>

                <div className='xs:w-[50.0%]  sm:w-[9%] xs:flex sm:flex sm:flex-col'>
                  <Text className={`${itemHeaderStyle}`}>Purchase Date</Text>
                  <Text className={`${itemBodyStyle}`}>{fDateTimeSuffix(authUser.subLatestPurchaseDate)}</Text>
                </div>

                <div className='xs:w-[50.0%]  sm:w-[9%] xs:flex sm:flex sm:flex-col'>
                  <Text className={`${itemHeaderStyle}`}>Sub Will Renew</Text>
                  <Text className={`${itemBodyStyle}`}>{authUser.subWillRenew ? 'Yes' : 'No'}</Text>
                </div>

                <div className='xs:w-[50.0%] sm:w-[6%] xs:flex sm:flex sm:flex-col'>
                  <Text className={`${itemHeaderStyle} xs:mt-1 sm:mb-0`}>Sub Lifetime</Text>
                  <TableActions authUser={authUser} />
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
          total={Math.ceil(authUsers.length / itemsPerPage)}
        />
      </Container>
    </Page>
  );
}

SignalsIndexPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout variant='main'>{page}</Layout>;
};

function TableActions({ authUser }: { authUser: AuthUser }) {
  const router = useRouter();
  const modals = useModals();

  const handleSubLifetime = async (modalId: string, authUser: AuthUser) => {
    modals.closeModal(modalId);
    try {
      await apiUpdateUserLifetime(authUser.id, !authUser.subIsLifetime);
      showNotification({ title: 'Success', message: 'User updated', autoClose: 6000 });
    } catch (error) {
      showNotification({ color: 'red', title: 'Error', message: 'User updated', autoClose: 6000 });
    }
  };

  const openSubLifetimeModal = () => {
    const modalId = modals.openModal({
      title: 'Are you sure you want to proceed?',
      centered: true,
      children: (
        <>
          <Text size='sm'>Yes, update the users lifetime subcription.</Text>
          <Box className='mt-6 flex justify-end'>
            <Button variant='outline' className='w-min mx-2' fullWidth onClick={() => modals.closeModal(modalId)} mt='md'>
              No don't do it
            </Button>

            <Button className=' w-min btn-delete mx-2' fullWidth onClick={() => handleSubLifetime(modalId, authUser)} mt='md'>
              {authUser.subIsLifetime ? 'Disable' : 'Enable'}
            </Button>
          </Box>
        </>
      )
    });
  };

  return (
    <Box className='flex'>
      <Button size='xs' className='text-app-yellow border-app-yellow' onClick={openSubLifetimeModal} variant='outline'>
        {authUser.subIsLifetime ? 'Yes' : 'No'}
      </Button>
    </Box>
  );
}
