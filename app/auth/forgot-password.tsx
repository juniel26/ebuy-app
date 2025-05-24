import { useRouter } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { auth } from '../../firebaseConfig';
import useThemeStyles from '../../hooks/useThemeStyles';

export default function ForgotPassword() {
  const styles = useThemeStyles(); // YOUR THEME
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState<'success' | 'error' | ''>('');
  const [showPopup, setShowPopup] = useState(false);

  const showPopupMessage = (type: 'success' | 'error', message: string) => {
    setPopupType(type);
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const handleReset = async () => {
    setShowPopup(false);
    if (!email) {
      showPopupMessage('error', 'Please enter your email address.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      showPopupMessage('success', `A password reset link has been sent to ${email}. Please check your inbox.`);
      setTimeout(() => router.push('/auth/login'), 3000);
    } catch (error: any) {
      showPopupMessage('error', error.message || 'Failed to send password reset email.');
    }
  };

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
            paddingHorizontal: 20,
            paddingVertical: 40,
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ width: '100%', maxWidth: 400 }}>
          <Text style={[styles.title, { textAlign: 'center', marginBottom: 30 }]}>
            Reset Password
          </Text>

<TextInput
  placeholder="Enter your email"
  placeholderTextColor={Platform.OS === 'android' ? '#666' : '#888'} // better contrast for Android
  style={[
    styles.input,
    {
      borderColor: '#4BB543',
      borderWidth: 1,
      borderRadius: 10,
      marginBottom: 20,
      paddingLeft: 12,
      height: 50, // ← important fix for Android
      color: '#000', // ← ensure visible text (override dark mode)
      backgroundColor: '#fff', // optional: ensure light background if using themes
    },
  ]}
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  autoCapitalize="none"
/>


          <Pressable
            style={[
              styles.button,
              {
                backgroundColor: 'transparent',
                borderColor: '#4BB543',
                borderWidth: 2,
                padding: 14,
              },
            ]}
            onPress={handleReset}
          >
            <Text style={{ color: '#4BB543', fontWeight: 'bold', textAlign: 'center' }}>
              Send Reset Link
            </Text>
          </Pressable>

          <Pressable onPress={() => router.push('/auth/login')} style={{ marginTop: 12 }}>
            <Text style={{ color: '#4BB543', textAlign: 'center' }}>Back to Login</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Popup container */}
      {showPopup && (
        <View
          style={{
            position: 'absolute',
            top: 30,
            left: 20,
            right: 20,
            padding: 15,
            borderRadius: 8,
            backgroundColor: popupType === 'success' ? '#4BB543' : '#FF4136',
            zIndex: 999,
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
            {popupMessage}
          </Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
