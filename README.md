# 🛒 E-BUY Mobile App

Welcome to **E-BUY**, a role-based e-commerce mobile app built with **React Native** and **Expo Go**. It features Firebase-powered user authentication and real-time product and cart management, making it perfect for both regular users and admins.

---

## 📱 Try the App on Your Phone

➡️ [Open in Expo Go](https://expo.dev/accounts/juniel26/projects/ebuy-app/builds/d5abe5a8-6a0b-46b3-8281-6847a0d494a0)  
Scan the QR code using Expo Go or open the link from your Android device browser to preview the app.


---

## 🔐 Authentication Features

- **Email-based Signup** with Firebase **Email Verification**
- **Secure Login** only if the email is verified
- **Forgot Password** via Firebase email reset
- **Firebase Auth State Listener** to handle user session
- Role-based access to **User** or **Admin** dashboards

---

## 👤 Regular User Dashboard

- 🧾 **View Products**
- 🛒 **Add to Cart**
- 🛍️ **Place Orders**
- 🧺 **View Cart and Manage Items**

---

## 🛠️ Admin Dashboard

- ➕ **Add Products**
- 📦 **View All Products**
- Admin role is verified using Firebase-stored user role or email

---

## 🧠 Built With

- ⚛️ **React Native**
- 📦 **Expo Go**
- 🔐 **Firebase Authentication**
- 🗂️ **Firebase Firestore**
- 🔁 **React Navigation**

---

## 🚀 Getting Started (For Developers)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/e-buy.git
cd e-buy

2. Install Dependencies
bash
Copy
Edit
npm install

// firebaseConfig.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';
import { getReactNativePersistence } from 'firebase/auth/react-native';
import { getDatabase } from 'firebase/database';


const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  databaseURL: "https://your-firebase-url.firebasedatabase.app",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getDatabase(app);



4. Start the App
bash
Copy
Edit
npx expo start
