import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const ACTIVE_COLOR = '#070707';
const INACTIVE_COLOR = '#9A9A9A';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabItem,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color }) => <Feather name="home" size={23} color={color} />,
        }}
      />
      <Tabs.Screen
        name="transfer"
        options={{
          title: 'Chuyển tiền',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="bank-transfer" size={27} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: '',
          tabBarIcon: () => (
            <View style={styles.scanButton}>
              <Ionicons name="qr-code-outline" size={31} color="#FFFFFF" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Giao dịch',
          tabBarIcon: ({ color }) => <Feather name="clock" size={23} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Tài khoản',
          tabBarIcon: ({ color }) => <Feather name="user" size={23} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 20,
    height: 76,
    paddingTop: 10,
    paddingBottom: 12,
    borderTopWidth: 0,
    borderRadius: 38,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 22,
    elevation: 18,
  },
  tabItem: {
    height: 58,
  },
  tabLabel: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: '600',
  },
  scanButton: {
    width: 54,
    height: 54,
    marginTop: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#050505',
  },
});
