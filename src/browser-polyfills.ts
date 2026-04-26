// Browser polyfills for Node.js compatibility
if (typeof global === 'undefined') {
  (window as any).global = window;
}

if (typeof process === 'undefined') {
  (window as any).process = {
    env: { NODE_ENV: 'production' },
    version: '',
    platform: 'browser'
  };
}

if (typeof Buffer === 'undefined') {
  (window as any).Buffer = {};
}