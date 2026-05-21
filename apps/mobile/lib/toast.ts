import { Alert } from 'react-native'

// Simple toast utility — replace with react-native-toast-notifications in prod
export const toast = {
  success: (message: string) => {
    console.log('[SUCCESS]', message)
    // In production: ToastAndroid.show(message, ...) or use a toast library
  },
  error: (message: string) => {
    console.error('[ERROR]', message)
    Alert.alert('Terjadi Kesalahan', message, [{ text: 'OK' }])
  },
  info: (message: string) => {
    console.log('[INFO]', message)
  },
}
