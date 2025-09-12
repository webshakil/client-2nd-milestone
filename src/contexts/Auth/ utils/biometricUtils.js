// Utilities for biometric authentication
export const b64ToBytes = (b64) => {
  const normalized = b64.replace(/-/g, '+').replace(/_/g, '/');
  const pad = normalized.length % 4 === 2 ? '==' : normalized.length % 4 === 3 ? '=' : '';
  const str = atob(normalized + pad);
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i);
  return bytes;
};

export const isBiometricSupported = async () => {
  return window.PublicKeyCredential && 
    await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().catch(() => false);
};

export const getDeviceInfo = () => {
  return {
    type: /mobile/i.test(navigator.userAgent) ? 'mobile' :
          /tablet/i.test(navigator.userAgent) ? 'tablet' : 'desktop',
    browser: { name: navigator.userAgent, version: navigator.appVersion },
    os: { name: navigator.platform, version: navigator.platform },
    screen: { 
      width: screen.width, 
      height: screen.height, 
      colorDepth: screen.colorDepth, 
      pixelRatio: window.devicePixelRatio || 1 
    }
  };
};

export const getCapabilities = () => {
  return { 
    hasWebAuthn: !!window.PublicKeyCredential, 
    platform: navigator.platform, 
    userAgent: navigator.userAgent 
  };
};

export const getLocation = () => {
  return { 
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, 
    language: navigator.language 
  };
};

export const getBiometricData = () => {
  return { 
    userAgent: navigator.userAgent, 
    language: navigator.language, 
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, 
    timestamp: Date.now(),
    capabilities: getCapabilities()
  };
};