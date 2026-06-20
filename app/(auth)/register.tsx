import { router } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuth } from '@/src/providers/auth-provider';

const { height } = Dimensions.get('window');

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(60)).current;
  const circleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 30,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Subtle floating background animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(circleAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(circleAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const isFormValid = 
    fullName.trim().length > 0 && 
    phone.trim().length >= 10 && 
    password.length >= 6 && 
    password === confirmPassword;

  const handleRegister = async () => {
    if (!isFormValid) {
      if (password !== confirmPassword) {
        Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp.');
      } else {
        Alert.alert('Lỗi', 'Vui lòng điền đầy đủ và chính xác thông tin.');
      }
      return;
    }
    
    setLoading(true);
    try {
      await signUp({ full_name: fullName.trim(), phone: phone.trim(), password });
      // signUp will automatically signIn and update the auth context
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert(
        'Đăng ký thất bại',
        error.message || 'Có lỗi xảy ra, vui lòng thử lại sau.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Immersive Deep Background */}
      <LinearGradient
        colors={['#061A14', '#093626', '#045339']}
        style={StyleSheet.absoluteFill}
      />

      {/* Floating Animated Orbs */}
      <Animated.View 
        style={[
          styles.glowOrb1, 
          { 
            transform: [{ 
              translateY: circleAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -40] }) 
            }] 
          }
        ]} 
      />
      <Animated.View 
        style={[
          styles.glowOrb2, 
          { 
            transform: [{ 
              translateY: circleAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 40] }) 
            }] 
          }
        ]} 
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Brand Hero */}
          <View style={styles.heroSection}>
            <View style={styles.badge}>
              <Feather name="shield" size={16} color="#00FF9D" />
              <Text style={styles.badgeText}>Thành viên mới</Text>
            </View>
            <Text style={styles.heroTitle}>Bắt đầu hành trình{'\n'}tài chính.</Text>
            <Text style={styles.heroSubtitle}>Tạo tài khoản V-Smart Pay trong vài giây để tận hưởng tiện ích vô hạn.</Text>
          </View>

          {/* Plush Form Bottom Sheet */}
          <Animated.View 
            style={[
              styles.bottomSheet, 
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <Text style={styles.sheetTitle}>Đăng ký</Text>

            <View style={styles.formGroup}>
              {/* Full Name Input */}
              <View style={styles.inputCard}>
                <View style={styles.inputPrefix}>
                  <View style={styles.iconWrapper}>
                    <Feather name="user" size={20} color="#718096" />
                  </View>
                  <View style={styles.separator} />
                </View>
                <TextInput
                  placeholder="Họ và tên"
                  placeholderTextColor="#A0AEC0"
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>

              {/* Phone Input */}
              <View style={styles.inputCard}>
                <View style={styles.inputPrefix}>
                  <Text style={styles.flag}>🇻🇳</Text>
                  <Text style={styles.countryCode}>+84</Text>
                  <View style={styles.separator} />
                </View>
                <TextInput
                  autoCapitalize="none"
                  keyboardType="phone-pad"
                  placeholder="Nhập số điện thoại"
                  placeholderTextColor="#A0AEC0"
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputCard}>
                <View style={styles.inputPrefix}>
                  <View style={styles.iconWrapper}>
                    <Feather name="lock" size={20} color="#718096" />
                  </View>
                  <View style={styles.separator} />
                </View>
                <TextInput
                  placeholder="Nhập mật khẩu (từ 6 ký tự)"
                  placeholderTextColor="#A0AEC0"
                  secureTextEntry={!showPassword}
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                  activeOpacity={0.6}
                >
                  <Feather
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={22}
                    color="#A0AEC0"
                  />
                </TouchableOpacity>
              </View>

              {/* Confirm Password Input */}
              <View style={[styles.inputCard, password && confirmPassword && password !== confirmPassword ? styles.inputCardError : null]}>
                <View style={styles.inputPrefix}>
                  <View style={styles.iconWrapper}>
                    <Feather name="check-circle" size={20} color={password && confirmPassword && password !== confirmPassword ? "#E53E3E" : "#718096"} />
                  </View>
                  <View style={styles.separator} />
                </View>
                <TextInput
                  placeholder="Xác nhận mật khẩu"
                  placeholderTextColor="#A0AEC0"
                  secureTextEntry={!showPassword}
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>
              {password.length > 0 && confirmPassword.length > 0 && password !== confirmPassword && (
                <Text style={styles.errorText}>Mật khẩu không khớp</Text>
              )}

              {/* Sweeping Gradient Button */}
              <TouchableOpacity
                onPress={handleRegister}
                disabled={loading || !isFormValid}
                activeOpacity={0.8}
                style={[styles.submitBtnContainer, { marginTop: 10 }]}
              >
                <LinearGradient
                  colors={
                    loading || !isFormValid 
                      ? ['#E2E8F0', '#CBD5E0'] 
                      : ['#00D084', '#00B27A']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientBtn}
                >
                  <Text style={[styles.btnText, (loading || !isFormValid) && styles.btnTextDisabled]}>
                    {loading ? 'Đang xử lý...' : 'Tạo tài khoản'}
                  </Text>
                  {!loading && isFormValid && (
                    <Feather name="arrow-right" size={20} color="#FFF" style={{ marginLeft: 8 }} />
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Redirect to Login */}
              <View style={styles.footerContainer}>
                <Text style={styles.footerText}>Đã có tài khoản? </Text>
                <TouchableOpacity onPress={() => router.replace('/login' as any)}>
                  <Text style={styles.footerLink}>Đăng nhập ngay</Text>
                </TouchableOpacity>
              </View>

            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#061A14',
  },
  glowOrb1: {
    position: 'absolute',
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: '#00D084',
    opacity: 0.12,
    top: -50,
    left: -100,
    filter: [{ blur: 40 }],
  },
  glowOrb2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#00FF9D',
    opacity: 0.08,
    top: height * 0.25,
    right: -80,
    filter: [{ blur: 40 }],
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  heroSection: {
    paddingHorizontal: 32,
    paddingTop: Platform.OS === 'ios' ? 80 : (StatusBar.currentHeight || 0) + 40,
    paddingBottom: 30,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 157, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 157, 0.2)',
  },
  badgeText: {
    color: '#00FF9D',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 48,
    letterSpacing: -1,
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 22,
    fontWeight: '500',
    paddingRight: 40,
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 32,
    paddingTop: 36,
    paddingBottom: Platform.OS === 'ios' ? 50 : 40,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 24,
  },
  sheetTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A202C',
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  formGroup: {
    gap: 16,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 20,
    height: 60,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputCardError: {
    borderColor: '#FC8181',
    backgroundColor: '#FFF5F5',
  },
  errorText: {
    color: '#E53E3E',
    fontSize: 13,
    marginTop: -10,
    marginLeft: 16,
    fontWeight: '500',
  },
  inputPrefix: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  iconWrapper: {
    width: 28,
    alignItems: 'center',
  },
  flag: {
    fontSize: 20,
    marginRight: 6,
  },
  countryCode: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D3748',
  },
  separator: {
    width: 1.5,
    height: 24,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    fontWeight: '600',
    color: '#1A202C',
    padding: 0,
  },
  eyeBtn: {
    padding: 8,
    marginRight: -4,
  },
  submitBtnContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#00B27A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  gradientBtn: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  btnText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  btnTextDisabled: {
    color: '#A0AEC0',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    color: '#718096',
    fontSize: 15,
    fontWeight: '500',
  },
  footerLink: {
    color: '#00D084',
    fontSize: 15,
    fontWeight: '700',
  },
});
