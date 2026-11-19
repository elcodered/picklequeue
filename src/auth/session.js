const SESSION_KEY = 'picklequeue-demo-user';

export function authenticatedUser() {
    return sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY) || '';
}

export function startSession(username, remember) {
    const storage = remember ? localStorage : sessionStorage;
    const otherStorage = remember ? sessionStorage : localStorage;
    otherStorage.removeItem(SESSION_KEY);
    storage.setItem(SESSION_KEY, username);
}

export function endSession() {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
}
