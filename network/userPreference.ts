import { NativeModules } from 'react-native';

const NativePreference = NativeModules?.Jbridge || NativeModules?.PreferenceModule || null;
console.log('NativePreferenceBridge', NativePreference);

export const getPreference = async (key: string): Promise<string | null> => {
  if (NativePreference?.getPreference) {
    return NativePreference.getPreference(key);
  }

  return null;
};

export const setPreference = async (key: string, value: string): Promise<void> => {
  if (NativePreference?.setPreference) {
    return NativePreference.setPreference(key, value);
  }
};

export const clearPreference = async (key: string): Promise<void> => {
  if (NativePreference?.clearPreference) {
    return NativePreference.clearPreference(key);
  }
};

export const clearAllPreferences = async (): Promise<void> => {
  if (NativePreference?.clearAllPreferences) {
    return NativePreference.clearAllPreferences();
  }

  await clearSecurePreference('token');
  await clearPreference('auth');
  await clearPreference('user');
};

export const setSecurePreference = async (key: string, value: string): Promise<void> => {
  if (NativePreference?.setSecurePreference) {
    return NativePreference.setSecurePreference(key, value);
  }

  return setPreference(key, value);
};

export const getSecurePreference = async (key: string): Promise<string | null> => {
  if (NativePreference?.getSecurePreference) {
    return NativePreference.getSecurePreference(key);
  }

  return getPreference(key);
};

export const clearSecurePreference = async (key: string): Promise<void> => {
  if (NativePreference?.clearSecurePreference) {
    return NativePreference.clearSecurePreference(key);
  }

  return clearPreference(key);
};
