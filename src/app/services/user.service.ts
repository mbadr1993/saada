import { Injectable } from '@angular/core';

export interface AppUser {
  uid: string;
  username?: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  // Add more fields as needed
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/`;
}

function getCookie(name: string): string | null {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, null as string | null);
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private _user: AppUser | null = null;
  private cookieName = 'app_user';
  private sessionKey = 'app_user';
  private timeoutId: any;

  get user(): AppUser | null {
    return this._user;
  }

  set user(user: AppUser | null) {
    // Default: store in cookie for backward compatibility
    this.setUser(user, true);
  }

  /**
   * Set user and persist in cookie or sessionStorage
   * @param user AppUser|null
   * @param rememberMe true=use cookie, false=use sessionStorage
   */
  setUser(user: AppUser | null, rememberMe: boolean) {
    this._user = user;
    if (user) {
      if (rememberMe) {
        setCookie(this.cookieName, JSON.stringify(user), 1); // 1 day expiry
        sessionStorage.removeItem(this.sessionKey);
      } else {
        sessionStorage.setItem(this.sessionKey, JSON.stringify(user));
        deleteCookie(this.cookieName);
      }
    } else {
      deleteCookie(this.cookieName);
      sessionStorage.removeItem(this.sessionKey);
    }
  }

  /**
   * Load user from cookie or sessionStorage
   */
  loadUser() {
    const cookie = getCookie(this.cookieName);
    if (cookie) {
      try {
        this._user = JSON.parse(cookie);
        return;
      } catch {
        this._user = null;
      }
    }
    const session = sessionStorage.getItem(this.sessionKey);
    if (session) {
      try {
        this._user = JSON.parse(session);
      } catch {
        this._user = null;
      }
    }
  }

  loadUserFromCookie() {
    // Deprecated: use loadUser instead
    this.loadUser();
  }

  clearUser() {
    this._user = null;
    deleteCookie(this.cookieName);
    sessionStorage.removeItem(this.sessionKey);
  }

  setAutoSignOut(minutes: number, signOutCallback: () => void) {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout(() => {
      this.clearUser();
      signOutCallback();
    }, minutes * 60 * 1000);
  }
}
