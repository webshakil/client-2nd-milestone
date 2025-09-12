import { userService } from './user/userService.js';
import { electionService } from './election/electionService.js';
import { analyticsService } from './analytics/analyticsService.js';

// Lazy loading for other services
const services = {
  user: userService,
  election: electionService,
  analytics: analyticsService,
  
  // Lazy loaded services
  get notification() {
    return import('./notification/notificationService.js').then(m => m.notificationService);
  },
  get payment() {
    return import('./payment/paymentService.js').then(m => m.paymentService);
  },
  get content() {
    return import('./content/contentService.js').then(m => m.contentService);
  },
  get audit() {
    return import('./audit/auditService.js').then(m => m.auditService);
  },
  get campaign() {
    return import('./campaign/campaignService.js').then(m => m.campaignService);
  }
};

export { services };