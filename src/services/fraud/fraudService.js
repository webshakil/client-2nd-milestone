// Bare minimum fraud service to resolve import error
const fraudService = {
  // Placeholder methods - implement as needed
  detectFraud: async () => ({ success: true, data: [] }),
  getFraudReports: async () => ({ success: true, data: [] }),
  updateFraudStatus: async () => ({ success: true }),
  deleteFraudReport: async () => ({ success: true })
};

export default fraudService;