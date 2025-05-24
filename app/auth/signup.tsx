import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification
} from 'firebase/auth';
import { ref, set } from 'firebase/database';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { auth, db } from '../../firebaseConfig';
import useThemeStyles from '../../hooks/useThemeStyles';

export default function SignUp() {
  const styles = useThemeStyles();
  const router = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState<'success' | 'error' | ''>('');
  const [showPopup, setShowPopup] = useState(false);

  const validateEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);
  const validatePhone = (phone: string) => /^\d{10,15}$/.test(phone);

  const showPopupMessage = (type: 'success' | 'error', message: string) => {
    setPopupType(type);
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const handleSignUp = async () => {
    setShowPopup(false);

    if (name.trim().length < 2) return showPopupMessage('error', 'Please enter a valid full name.');
    if (!validatePhone(phone)) return showPopupMessage('error', 'Phone must be 10 to 15 digits.');
    if (!validateEmail(email)) return showPopupMessage('error', 'Enter a valid email.');
    if (password.length < 6) return showPopupMessage('error', 'Password must be at least 6 characters.');
    if (password !== confirmPassword) return showPopupMessage('error', 'Passwords do not match.');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);
      await set(ref(db, 'users/' + user.uid), {
        name,
        phone,
        email,
        createdAt: new Date().toISOString(),
        emailVerified: user.emailVerified,
      });

      showPopupMessage('success', 'Verification email sent. Please check your inbox.');
      setTimeout(() => router.push('/auth/login'), 3000);
    } catch (error: any) {
      showPopupMessage('error', error.message || 'An error occurred.');
    }
  };

  return (
    <View style={[styles.container, { justifyContent: 'center', padding: 20 }]}>
      {/* Center Icon + App Title */}
{/* <Image
  source={require('../../assets/images/sc_icon.png')}
  style={{
    width: 100,
    height: 100,
    marginBottom: 20,  // Adds space below the image
    alignSelf: 'center' // Centers the image horizontally
  }}
  resizeMode="contain"
/> */}

<Text style={[styles.title, { fontSize: 24 }]}>E-BUY</Text>

      {/* Input Fields with Icons */}
      <View style={styles.inputWrapper}>
        <MaterialIcons name="person" size={24} color="green" style={styles.icon} />
        <TextInput
          placeholder="Full Name"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
      </View>

      <View style={styles.inputWrapper}>
        <MaterialIcons name="phone" size={24} color="green" style={styles.icon} />
        <TextInput
          placeholder="Phone Number"
          placeholderTextColor="#888"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={styles.input}
        />
      </View>

      <View style={styles.inputWrapper}>
        <MaterialIcons name="email" size={24} color="green" style={styles.icon} />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.input}
        />
      </View>

      <View style={styles.inputWrapper}>
        <MaterialIcons name="lock" size={24} color="green" style={styles.icon} />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
      </View>

      <View style={styles.inputWrapper}>
        <MaterialIcons name="lock-outline" size={24} color="green" style={styles.icon} />
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="#888"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
        />
      </View>



      {/* Register Button */}
<Pressable onPress={handleSignUp} style={styles.button}>
  <Text style={styles.buttonText}>Register</Text>
</Pressable>

      {/* Already have an account */}
      <Text style={{ marginTop: 20, textAlign: 'center', color: '#bfd9db' }}>Already have an account?</Text>
      <Pressable onPress={() => router.push('/auth/login')}>
        <Text style={{
          textAlign: 'center',
          color: '#bfd9db',
          fontWeight: 'bold',
          paddingLeft: 10,
          paddingRight: 10,
        }}>Login</Text>

      </Pressable>

      {/* Popup */}
      {showPopup && (
        <View style={{
          position: 'absolute',
          top: 30,
          left: 20,
          right: 20,
          padding: 15,
          borderRadius: 8,
          backgroundColor: popupType === 'success' ? '#4BB543' : '#FF4136',
          zIndex: 999,
        }}>
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>{popupMessage}</Text>
        </View>
      )}
    </View>
  );
}
