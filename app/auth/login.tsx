import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';

import { get, getDatabase, ref } from 'firebase/database';
import { Pressable, Text, TextInput, View } from 'react-native';
import { auth } from '../../firebaseConfig';
import useThemeStyles from '../../hooks/useThemeStyles';


export default function Login() {
  const styles = useThemeStyles();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState<'success' | 'error' | ''>('');
  const [popupVisible, setPopupVisible] = useState(false);

  const showPopup = (message: string, type: 'success' | 'error') => {
    setPopupMessage(message);
    setPopupType(type);
    setPopupVisible(true);
    setTimeout(() => {
      setPopupVisible(false);
      setPopupMessage('');
      setPopupType('');
    }, 3000);
  };

const handleLogin = async () => {
  if (!email || !password) {
    showPopup('Please enter email and password', 'error');
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      showPopup('Please verify your email before logging in. Check your inbox.', 'error');
      await auth.signOut();
      return;
    }

    showPopup('Login successful! Checking role...', 'success');

    const db = getDatabase();
    const roleRef = ref(db, `users/${user.uid}/role`);
    const snapshot = await get(roleRef);

    const role = snapshot.exists() ? snapshot.val() : null;

    setTimeout(() => {
      if (role === 'admin') {
        router.push('/user/admin-dashboard');
      } else {
        router.push('/user/user-dashboard');
      }
    }, 1500);
  } catch (error: any) {
    showPopup(error.message || 'An error occurred.', 'error');
  }
};


  const PopupContainer = () => {
    if (!popupVisible) return null;
    const backgroundColor = popupType === 'success' ? '#4BB543' : '#FF3333';

    return (
      <View
        style={{
          position: 'absolute',
          top: 50,
          left: 20,
          right: 20,
          padding: 15,
          backgroundColor,
          borderRadius: 8,
          zIndex: 1000,
          elevation: 5,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>
          {popupMessage}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, position: 'relative' }]}>
      <PopupContainer />

{/* <Image
  source={require('../../assets/images/sc_icon.png')}
  style={{
    width: 100,
    height: 100,
    marginBottom: 20,  
    alignSelf: 'center' 
  }}
  resizeMode="contain"
/> */}


<Text style={[styles.title, { fontSize: 24 }]}>E-BUY</Text>

<Text style={[styles.subtitle, { color: styles.title.color }]}>
  Welcome Back!
</Text>

<Text style={styles.subtitle}>
  Please enter your email and password to Sign In
</Text>


      {/* Email input with icon */}
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#eee', borderRadius: 10, padding: 10, marginBottom: 12, width: '100%' }}>
        <Ionicons name="mail-outline" size={20} color="#888" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          style={{ flex: 1 }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Password input with icon */}
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#eee', borderRadius: 10, padding: 10, width: '100%' }}>
        <Ionicons name="lock-closed-outline" size={20} color="#888" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{ flex: 1 }}
        />
      </View>

{/* Forgot password - right align */}
{/* <Pressable onPress={() => router.push('/auth/forgot-password')} style={{ alignSelf: 'flex-end', marginTop: 6 }}>
  <Text style={[styles.linkAccent, { textDecorationLine: 'underline', fontSize: 13 }]}>
    Forgot Password?
  </Text>
</Pressable> */}

      {/* Login button */}
      <Pressable style={[styles.button, { marginTop: 20, width: '100%' }]} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>

{/* Register */}
<Text style={[styles.linkText, { marginTop: 20, textAlign: 'center' }]}>
  Don’t have an account?
</Text>

<Pressable onPress={() => router.push('/auth/signup')} style={{ marginTop: 8 }}>
  <Text
    style={[
      styles.linkAccent,
      {
        fontWeight: 'bold',
        textAlign: 'center',
        textDecorationLine: 'underline',
      },
    ]}
  >
    Register
  </Text>
</Pressable>
    </View>
  );
}
