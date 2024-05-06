//* utils/storage.ts
import Cookies from "js-cookie";

export default {
  setLocal(key: any, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
    // localStorage.setItem(key, value);
  },
  getLocal(key: any): any {
    let keys = localStorage.getItem(key);
    if (keys && keys != "undefined") {
      return JSON.parse(keys as string);
    } else {
      return keys as string;
    }
    // return localStorage.getItem(key) as string;
  },
  removeLocal(key: any) {
    localStorage.removeItem(key);
  },
  //sessionStorage
  setSession(key: any, value: any): void {
    // sessionStorage.setItem(key, JSON.stringify(value));
    sessionStorage.setItem(key, value);
  },
  getSession(key: any): any {
    // return JSON.parse(sessionStorage.getItem(key) as string);
    return sessionStorage.getItem(key) as string;
  },
  removeSession(key: any): void {
    sessionStorage.removeItem(key);
  },
  //cookie
  setCookie(key: any, value: any): void {
    Cookies.set(key, value);
  },
  // 创建一个有效期为 7 天的 Cookie
  // Cookies.set('key', 'value', { expires: 7 });
  getCookie(key: any): any {
    return Cookies.get(key);
  },
  removeCookie(key: any) {
    Cookies.remove(key);
  },
  clearAllCookies() {
    const cookies = Object.keys(Cookies.get());
    cookies.forEach((cookie) => {
      Cookies.remove(cookie);
    });
  },
};
