export function getToken() {
    return localStorage.getItem('token');
}

export function getCurrentUser() {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
}