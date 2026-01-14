export const STORAGE_KEYS = {
  TUTORIAL_COMPLETED: '@playmon/tutorial_completed',
  AUTH_TOKEN: '@playmon/auth_token',
  REFRESH_TOKEN: '@playmon/refresh_token',
  USER_DATA: '@playmon/user_data',
  RECENT_SEARCHES: '@playmon/recent_searches',
  SUBSCRIPTIONS_CACHE: '@playmon/subscriptions_cache',
  PUSH_TOKEN: '@playmon/push_token',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
