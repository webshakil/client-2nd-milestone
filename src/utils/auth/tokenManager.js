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
    const timestamp = localStorage.getItem('vottery_token_timestamp');
    if (!timestamp) return true;
    
    const tokenAge = Date.now() - parseInt(timestamp);
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    
    return tokenAge >= maxAge;
  }
};