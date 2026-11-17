// Expected public contract, independent of the application's URL implementation.
export const base = '/guesthouse-website/';
export const siteUrl = `https://yani0514.github.io${base}`;
export const localUrl = `http://127.0.0.1:4173${base}`;
export const publicUrl = (path: string) => `${base}${path.replace(/^\/+/, '')}`;
