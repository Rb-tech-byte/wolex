import axios from 'axios';
import { addDoc, collection, deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { Announcement } from '../models/model.announcement';
import { AuthUser } from '../models/model.authuser';
import { Notification } from '../models/model.notification';
import { Signal } from '../models/model.signal';
import { APP_MODE } from '../utils_constants/app_constants';
import { authClient, firestoreClient } from '../_firebase/firebase_client';

/* ------------------------------- NOTE SIGNALS ------------------------------ */
export async function apiCreateSignal(x: Signal): Promise<boolean> {
  if (APP_MODE == 'DEV') return true;
  const jsonWebToken = await authClient.currentUser?.getIdToken(true);

  try {
    await addDoc(collection(firestoreClient, 'signals'), { ...Signal.toJson(x), timestampCreated: serverTimestamp() });
    await axios.post(`/api/notifications`, { title: 'Signal', body: 'New signal added', jsonWebToken });
    return true;
  } catch (error) {
    return false;
  }
}

export async function apiUpdateSignal(id: string, x: Signal): Promise<boolean> {
  if (APP_MODE == 'DEV') return true;
  try {
    await updateDoc(doc(firestoreClient, 'signals', id), { ...Signal.toJson(x), timestampUpdated: serverTimestamp() });
    return true;
  } catch (error) {
    return false;
  }
}

export async function apiGetSignal(id: string) {
  try {
    const x = await getDoc(doc(firestoreClient, 'signals', id));
    if (!x.data()) return null;
    return Signal.fromJson({
      ...x.data(),
      id: x.id,
      timestampCreated: x.data()!.timestampCreated?.toDate(),
      timestampUpdated: x.data()!.timestampUpdated?.toDate(),
      signalDate: x.data()!.signalDate?.toDate(),
      signalTime: x.data()!.signalTime?.toDate(),
      signalDatetime: x.data()!.signalDatetime?.toDate()
    });
  } catch (error) {
    return null;
  }
}

export async function apiDeleteSignal(id: string): Promise<boolean> {
  if (APP_MODE == 'DEV') return true;
  try {
    await deleteDoc(doc(firestoreClient, 'signals', id!));
    return true;
  } catch (error) {
    return false;
  }
}

/* ------------------------------ NOTE Announcement ----------------------------- */
export async function apiCreateAnnouncement(x: Announcement) {
  if (APP_MODE == 'DEV') return true;
  const jsonWebToken = await authClient.currentUser?.getIdToken(true);
  try {
    await addDoc(collection(firestoreClient, 'announcements'), { ...Announcement.toJson(x), timestampCreated: serverTimestamp() });
    await axios.post(`/api/notifications`, { title: 'Announcement', body: 'New Announcement added', jsonWebToken });
    return true;
  } catch (error) {
    return false;
  }
}

export async function apiUpdateAnnouncement(id: string, announcement: Announcement) {
  if (APP_MODE == 'DEV') return true;
  const _announcement = { ...Announcement.toJson(announcement), timestampUpdated: serverTimestamp() };
  delete _announcement.timestampCreated;

  try {
    await updateDoc(doc(firestoreClient, 'announcements', id), { ..._announcement });

    return true;
  } catch (error) {
    return false;
  }
}

export async function apiGetAnnouncement(id: string) {
  try {
    const announcement = await getDoc(doc(firestoreClient, 'announcements', id));
    if (!announcement.data()) return null;
    return Announcement.fromJson({ ...announcement.data(), id: announcement.id });
  } catch (error) {
    return null;
  }
}

export async function apiDeleteAnnouncement(id: string) {
  if (APP_MODE == 'DEV') return true;
  try {
    await deleteDoc(doc(firestoreClient, 'announcements', id));
    return true;
  } catch (error) {
    return false;
  }
}

/* ------------------------------ NOTE NOTIFICATION -------------------------- */
export async function apiCreateNotification(notification: Notification) {
  if (APP_MODE == 'DEV') return true;
  const jsonWebToken = await authClient.currentUser?.getIdToken(true);

  try {
    await addDoc(collection(firestoreClient, 'notifications'), { ...Notification.toJson(notification), timestampCreated: serverTimestamp() });
    await axios.post(`/api/notifications`, { title: 'Announcement', body: 'New Announcement added', jsonWebToken });
    return true;
  } catch (error) {
    return false;
  }
}

/* ------------------------------ NOTE User ----------------------------- */

export async function apiGetAuthUser(id: string) {
  try {
    const x = await getDoc(doc(firestoreClient, 'users', id));
    if (!x.data()) return null;
    return AuthUser.fromJson({
      ...x.data(),
      id: x.id,
      timestampCreated: x.data()!.timestampCreated?.toDate(),
      timestampUpdated: x.data()!.timestampUpdated?.toDate()
    });
  } catch (error) {
    return null;
  }
}

export async function apiUpdateUserLifetime(id: string, value: boolean) {
  if (APP_MODE == 'DEV') return true;
  try {
    await updateDoc(doc(firestoreClient, 'users', id), { subIsLifetime: value });
    return true;
  } catch (error) {
    return false;
  }
}
