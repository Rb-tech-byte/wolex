import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import { LoadingScreen } from '../components/others/LoadingScreen';
import { useAuthStore } from '../models_store/auth_store';
import ResetPasswordPage from '../pages/reset-password';

type Props = {
  children: ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const { pathname, push } = useRouter();
  const [requestedLocation, setRequestedLocation] = useState<string | null>(null);
  const { isAuthenticated, isInitialized } = useAuthStore((state) => state);

  useEffect(() => {
    if (requestedLocation && pathname !== requestedLocation) {
      setRequestedLocation(null);
      push(requestedLocation);
    }
  }, [pathname, push, requestedLocation]);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated && pathname.includes('/reset-password')) {
    if (pathname !== requestedLocation) setRequestedLocation(pathname);
    return <ResetPasswordPage />;
  }

  if (!isAuthenticated) {
    if (pathname !== requestedLocation) setRequestedLocation(pathname);
    // return <SignInPage />;
  }

  return <>{children}</>;
}
