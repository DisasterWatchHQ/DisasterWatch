import { createOfflineAwareAPI } from './config/apiWrapper';
import * as authService from './services/auth';
import * as warningsService from './services/warnings';
import * as resourcesService from './services/resources';
import * as notificationsService from './services/notifications';

export const auth = createOfflineAwareAPI(authService);
export const warnings = createOfflineAwareAPI(warningsService);
export const resources = createOfflineAwareAPI(resourcesService);
export const notifications = notificationsService;

export const services = {
  auth: authService,
  warnings: warningsService,
  resources: resourcesService,
  notifications: notificationsService,
};

export * from './services/auth';
export * from './services/warnings';
export * from './services/resources';
export * from './services/notifications'; 