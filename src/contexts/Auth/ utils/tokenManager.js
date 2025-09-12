const parseTokenExpiry = (expiry) => {
  const match = expiry.match(/^(\d+)([smhd])$/);
  if (!match) return 60000; // 1 minute default
  
  const value = parseInt(match[1]);
  const unit = match[2];
  
  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default: return 60000;
  }
};

// Token Management Utility with Rotation Support
export const TokenManager = {
  setTokens: (accessToken, refreshToken, expiryInfo) => {
    localStorage.setItem('vottery_access_token', accessToken);
    localStorage.setItem('vottery_refresh_token', refreshToken);
    localStorage.setItem('vottery_token_expiry', JSON.stringify(expiryInfo));
    localStorage.setItem('vottery_token_timestamp', Date.now().toString());
  },

  getAccessToken: () => localStorage.getItem('vottery_access_token'),
  
  getRefreshToken: () => localStorage.getItem('vottery_refresh_token'),
  
  clearTokens: () => {
    localStorage.removeItem('vottery_access_token');
    localStorage.removeItem('vottery_refresh_token');
    localStorage.removeItem('vottery_token_expiry');
    localStorage.removeItem('vottery_token_timestamp');
    localStorage.removeItem('vottery_user_data');
  },

  isTokenExpired: () => {
    const expiryInfo = localStorage.getItem('vottery_token_expiry');
    if (!expiryInfo) return true;
    
    try {
      const { accessTokenExpiry } = JSON.parse(expiryInfo);
      // Parse the backend expiry format (e.g., "7d", "1h", "30m")
      const expiryMs = parseTokenExpiry(accessTokenExpiry);
      const timestamp = localStorage.getItem('vottery_token_timestamp');
      
      if (!timestamp) return true;
      
      const tokenAge = Date.now() - parseInt(timestamp);
      return tokenAge >= expiryMs;
    } catch {
      return true;
    }
  }
};