import { Injectable } from '@angular/core';

import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from '@angular/fire/auth';

import { User as FirebaseUser } from 'firebase/auth';

import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private user: User;
  constructor(private auth: Auth) {}


  get isLoggedIn(): boolean {
    const user = this.auth.currentUser;
    // const user = this.auth.currentUser;
    return user !== null ? true : false;
  }

  get currentUser() {
    return this.auth.currentUser;
  }

  get isEmailVerified(): boolean {
    const user = this.auth.currentUser;
    return user.emailVerified !== false ? true : false;
  }

  currentUserAsync(): Promise<FirebaseUser | null> {
    return new Promise((resolve, reject) => {
      const unsubscribe = this.auth.onAuthStateChanged(
        (user: FirebaseUser | null) => {
          unsubscribe();
          resolve(user); // Ici, user est explicitement typé comme FirebaseUser ou null
        },
        error => {
          reject(error);
        }
      );
    });
  }



  async register({ email, password }) {
    try {
      const user = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return user;
    } catch (e) {
      return null;
    }
  }
  //login with email
  async login({ email, password }) {
    try {
      const user = await signInWithEmailAndPassword(this.auth, email, password);
      return user;
    } catch (e) {
      return null;
    }
  }
  //login with google provider
  googleAuth() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  //login with facebook provider
  facebookAuth() {
    return signInWithPopup(this.auth, new FacebookAuthProvider());
  }

  // Email verification when new user registers
  async sendVerificationMail() {
    await sendEmailVerification(this.auth.currentUser);
  }
  // recover password mail
  async recoverPassword(email: string) {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (e) {
      return null;
    }
  }

  logout() {
    return signOut(this.auth);
  }

  setUser(user: User) {
    return (this.user = user);
  }
}
