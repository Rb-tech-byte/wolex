import create from 'zustand';
import { authClient } from '../_firebase/firebase_client';

type State = {
  isInitialized: boolean;
  isAuthenticated: boolean;

  streamAuthStateChanged: () => void;
};

export const useAuthStore = create<State>((set) => ({
  isInitialized: false,
  isAuthenticated: false,

  streamAuthStateChanged: () => {
    authClient.onAuthStateChanged((u: any) => {
      set((state) => {
        return { ...state, isAuthenticated: u ? true : false, isInitialized: true };
      });
    });
  }
}));
