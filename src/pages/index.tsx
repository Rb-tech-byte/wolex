import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '../models_store/auth_store';

export default function Index() {
  const { isAuthenticated, isInitialized } = useAuthStore((state) => state);

  const router = useRouter();

  function getRouter() {
    if (!isInitialized) return;
    if (isAuthenticated) return router.push('/signals');
    if (!isAuthenticated) return router.push('/signin');
  }

  useEffect(() => {
    getRouter();
  }, [isAuthenticated, isInitialized]);

  return <div></div>;
}
