import { authClient, firestoreClient } from '../_firebase/firebase_client';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, User, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export async function signinWithEmail(email: string, password: string): Promise<User | null> {
  email.trim().toLowerCase();
  try {
    const res = await signInWithEmailAndPassword(authClient, email, password);
    return res.user;
  } catch (error) {
    throw error;
  }
}

export async function resetPassword(email: string): Promise<boolean> {
  email.trim().toLowerCase();

  try {
    const res = await sendPasswordResetEmail(authClient, email);
    return true;
  } catch (error) {
    throw error;
  }
}

export async function createUserWithEmail(email: string, password: string): Promise<User | undefined> {
  try {
    email.trim().toLowerCase();
    const res = await createUserWithEmailAndPassword(authClient, email, password);
    if (res) {
      await setDoc(
        doc(firestoreClient, 'users', res.user.uid),
        { name: '', email: res.user.email, isNotificationsEnabled: true, isAdmin: true, role: 'admin' },
        { merge: true }
      );

      await setDoc(doc(firestoreClient, 'appControls', 'appControls'), { isSuperAdminConfigured: true }, { merge: true });
      return res.user;
    }
  } catch (error) {
    throw error;
  }
}
export async function signOut(): Promise<void> {
  try {
    await authClient.signOut();
  } catch (error) {
    throw error;
  }
}
