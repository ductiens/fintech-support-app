import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra as Record<string, string> | undefined;

export const appConfig = {
  appName: Constants.expoConfig?.name ?? 'React Native Base',
  apiBaseUrl: extra?.apiBaseUrl ?? process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8000',
};
