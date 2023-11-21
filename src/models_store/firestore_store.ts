import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import create from 'zustand';
import { Announcement } from '../models/model.announcement';
import { AuthUser } from '../models/model.authuser';
import { Signal } from '../models/model.signal';
import { firestoreClient } from '../_firebase/firebase_client';

type State = {
  signals: Signal[];
  announcements: Announcement[];
  authUsers: AuthUser[];
  subscriptions: any;

  streamSignals: () => void;
  streamAnnouncements: () => void;
  streamAuthUsers: () => void;
  closeSubscriptions: () => void;
};

export const useFirestoreStore = create<State>((set, get) => ({
  subscriptions: {},
  signals: [],
  announcements: [],
  authUsers: [],

  streamSignals: () => {
    const q = query(collection(firestoreClient, 'signals'), orderBy('timestampCreated', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const x = querySnapshot.docs.map((doc) => {
        return Signal.fromJson({
          ...doc.data(),
          id: doc.id,
          timestampCreated: doc.data()!.timestampCreated?.toDate(),
          timestampUpdated: doc.data()!.timestampUpdated?.toDate(),
          signalDate: doc.data()!.signalDate?.toDate(),
          signalTime: doc.data()!.signalTime?.toDate(),
          signalDatetime: doc.data()!.signalDatetime?.toDate()
        });
      });
      set((state) => {
        return { ...state, signals: x };
      });
    });

    set((state) => {
      return { ...state, subscriptions: { ...state.subscriptions, signals: unsubscribe } };
    });
  },

  streamAnnouncements: () => {
    const q = query(collection(firestoreClient, 'announcements'), orderBy('timestampCreated', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const x = querySnapshot.docs.map((doc) => {
        return Announcement.fromJson({
          ...doc.data(),
          id: doc.id,
          timestampCreated: doc.data()!.timestampCreated?.toDate(),
          timestampUpdated: doc.data()!.timestampUpdated?.toDate()
        });
      });
      set((state) => {
        return { ...state, announcements: x };
      });
    });
    set((state) => {
      return { ...state, subscriptions: { ...state.subscriptions, announcements: unsubscribe } };
    });
  },

  streamAuthUsers: () => {
    const q = query(collection(firestoreClient, 'users'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const x = querySnapshot.docs.map((doc) => {
        return AuthUser.fromJson({
          ...doc.data(),
          id: doc.id,
          timestampCreated: doc.data()!.timestampCreated?.toDate(),
          timestampUpdated: doc.data()!.timestampUpdated?.toDate(),
          timestampLastLogin: doc.data()!.lastLogin?.toDate()
        });
      });
      set((state) => {
        return { ...state, authUsers: x };
      });
    });

    set((state) => {
      return { ...state, subscriptions: { ...state.subscriptions, authUsers: unsubscribe } };
    });
  },

  closeSubscriptions: () => {
    get().subscriptions.signals();
    get().subscriptions.announcements();
    get().subscriptions.authUsers();
  }
}));
