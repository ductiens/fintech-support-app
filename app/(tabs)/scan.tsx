import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScanScreen() {
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Text style={styles.title}>Quét mã QR</Text>
        <View style={styles.scanFrame}>
          <Ionicons name="qr-code-outline" size={150} color="#050505" />
        </View>
        <Text style={styles.description}>Đưa mã QR vào khung để thanh toán hoặc chuyển tiền.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 56,
    paddingBottom: 110,
  },
  title: {
    alignSelf: 'flex-start',
    color: '#0D0D0D',
    fontSize: 28,
    fontWeight: '900',
  },
  scanFrame: {
    marginTop: 86,
    width: 245,
    height: 245,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#111111',
    borderRadius: 30,
    backgroundColor: '#F8F8F8',
  },
  description: {
    marginTop: 28,
    color: '#6A6A6A',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
});
