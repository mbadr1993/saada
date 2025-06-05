import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  UserCredential,
  createUserWithEmailAndPassword,
} from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { doc, getDoc, setDoc } from 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private auth: Auth, private firestore: Firestore) {}

  /**
   * Sign in using a username and password.
   * Looks up the username in Firestore, retrieves the email, and signs in with email/password.
   * @param username The username to look up
   * @param password The password to use for sign in
   * @returns Promise<UserCredential>
   */
  async loginWithUsername(
    username: string,
    password: string
  ): Promise<UserCredential> {
    const usernameRef = doc(this.firestore, 'usernames', username);
    const usernameDoc = await getDoc(usernameRef);
    if (!usernameDoc.exists()) {
      throw new Error('Username not found');
    }
    const { email } = usernameDoc.data() as { email: string };
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  /**
   * Register a new user with username and password using email and password method.
   * Stores the username to email mapping in Firestore.
   * @param username The username to register
   * @param email The email to register
   * @param password The password to register
   * @returns Promise<UserCredential>
   */
  async registerWithUsername(
    username: string,
    email: string,
    password: string
  ): Promise<UserCredential> {
    // Check if username already exists
    const usernameRef = doc(this.firestore, 'usernames', username);
    const usernameDoc = await getDoc(usernameRef);
    if (usernameDoc.exists()) {
      throw new Error('Username already exists');
    }
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    // Store username to email mapping in Firestore
    await setDoc(usernameRef, { email });
    return userCredential;
  }
}
