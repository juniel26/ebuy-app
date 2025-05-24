import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { auth } from '../../firebaseConfig';
import useThemeStyles from '../../hooks/useThemeStyles';

export default function AdminDashboard() {
  const styles = useThemeStyles();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        if (currentUser.emailVerified) {
          setUser(currentUser);
        } else {
          Alert.alert(
            'Email Not Verified',
            'Please verify your email before accessing the dashboard.'
          );
          auth.signOut();
          router.replace('/auth/login');
        }
      } else {
        router.replace('/auth/login');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace('/auth/login');
    } catch (error: any) {
      Alert.alert('Logout Failed', error.message || 'An error occurred.');
    }
  };

  if (!user) {
    return (
      <View
        style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}
      >
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          {
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          },
        ]}
      >
        {/* Admin Profile Card */}
        <View
          style={{
            backgroundColor:  '#c4cfce',
            borderRadius: 16,
            padding: 24,
            width: '100%',
            maxWidth: 400,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 5,
            marginBottom: 30,
          }}
        >
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <Ionicons name="shield-checkmark-outline" size={80} color="#0033cc" />

            <Text
              style={{
                fontSize: 20,
                fontWeight: '600',
                color: styles.text.color,
                marginTop: 10,
              }}
            >
              {user.email}
            </Text>
            <Text style={{ fontSize: 14, color: '#888', marginTop: 4 }}>
              Admin Verified ✔️
            </Text>
          </View>

          <View style={{ marginTop: 20 }}>
            <Text
              style={{ fontSize: 16, color: styles.text.color, textAlign: 'center' }}
            >
              Welcome, Admin! 🚀
            </Text>
          </View>
        </View>

        {/* Manage Products Buttons */}
        <View style={{ width: '100%', maxWidth: 400, marginBottom: 30 }}>
          <Text style={[styles.title, { marginBottom: 10 }]}>Manage Products</Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Pressable
              style={[styles.button, { flex: 1, marginRight: 6 }]}
              onPress={() => router.push('/user/add-product')}
            >
              <Text style={styles.buttonText}>Add</Text>
            </Pressable>
            {/* <Pressable
              style={[styles.button, { flex: 1, marginHorizontal: 6 }]}
              onPress={() => router.push('/user/delete-product')}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </Pressable> */}
            <Pressable
              style={[styles.button, { flex: 1, marginLeft: 6 }]}
              onPress={() => router.push('/user/view-product')}
            >
              <Text style={styles.buttonText}>View</Text>
            </Pressable>
          </View>
        </View>

        {/* Logout Button */}
        <Pressable
          style={{
            paddingVertical: 14,
            paddingHorizontal: 24,
            borderRadius: 12,
            width: '100%',
            maxWidth: 300,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
            backgroundColor: '#cc3300',
          }}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#ffffff" />

          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
            Logout
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
