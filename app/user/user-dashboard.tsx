import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ref as dbRef, get, onValue, push, ref, set, update } from 'firebase/database';

import React, { useEffect, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { auth, db } from '../../firebaseConfig';
import useThemeStyles from '../../hooks/useThemeStyles';

type Product = {
  quantity: number;
  id: string;
  productName: string;
  category: string;
  price: number;
  imageUrl?: string;
};

export default function UserDashboard() {
  const styles = useThemeStyles();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [showProfile, setShowProfile] = useState(false);

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      if (currentUser?.emailVerified) {
        setUser(currentUser);
      } else {
        router.replace('/auth/login');
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const productsRef = ref(db, 'products');
    const unsubscribe = onValue(productsRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const loadedProducts = Object.entries(data).map(([key, value]: [string, any]) => ({
          id: key,
          ...value,
        }));
        setProducts(loadedProducts);
      } else {
        setProducts([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const addToCart = async (product: Product) => {
    if (!user) {
      setPopupMessage('You must be logged in to add products to the cart.');
      setPopupVisible(true);
      return;
    }

    const cartRef = dbRef(db, `users/${user.uid}/cart`);
    try {
      const snapshot = await get(cartRef);
      const cartData = snapshot.val();
      let existingKey: string | null = null;
      let existingQuantity = 0;

      if (cartData) {
        for (const [key, item] of Object.entries(cartData)) {
          if ((item as Product).id === product.id) {
            existingKey = key;
            existingQuantity = (item as Product).quantity || 1;
            break;
          }
        }
      }

      if (existingKey) {
        const updatedQuantity = existingQuantity + 1;
        await update(dbRef(db, `users/${user.uid}/cart/${existingKey}`), {
          quantity: updatedQuantity,
        });
        setPopupMessage(`Updated quantity for "${product.productName}" to ${updatedQuantity}.`);
      } else {
        const newProduct = { ...product, quantity: 1 };
        const newCartItemRef = push(cartRef);
        await set(newCartItemRef, newProduct);
        setPopupMessage(`"${product.productName}" has been added to your cart.`);
      }

      setPopupVisible(true);
    } catch (error: any) {
      setPopupMessage(`Error adding to cart: ${error.message}`);
      setPopupVisible(true);
    }
  };

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View
            style={{
              height: 60,
              width: '100%',
              backgroundColor: styles.card?.backgroundColor,
              justifyContent: 'flex-end',
              alignItems: 'center',
              paddingHorizontal: 16,
              flexDirection: 'row',
              gap: 20,
            }}
          >
            <Pressable onPress={() => router.push('/user/cart')}>
              <Ionicons name="cart-outline" size={30} color="#4BB543" />
            </Pressable>
            <Pressable onPress={() => setShowProfile(!showProfile)}>
              <Ionicons name="person-circle-outline" size={36} color="#4BB543" />
            </Pressable>
          </View>

          {/* Profile Card */}
          {showProfile && (
            <View
              style={{
                position: 'absolute',
                top: 60,
                right: 16,
                width: 375,
                backgroundColor: styles.card?.backgroundColor || '#fff',
                borderRadius: 16,
                padding: 24,
                elevation: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
                zIndex: 1000,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: '600', color: '#ffffff', marginBottom: 10 }}>
                {user.email}
              </Text>
              <Pressable
                style={{
                  backgroundColor: '#4BB543',
                  paddingVertical: 14,
                  borderRadius: 12,
                  width: '100%',
                  alignItems: 'center',
                }}
                onPress={() => {
                  auth.signOut();
                  router.replace('/auth/login');
                }}
              >
                <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }}>Logout</Text>
              </Pressable>
            </View>
          )}

          {/* Scrollable Products */}
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 24,
              paddingBottom: 120,
              alignItems: 'center',
              backgroundColor: '#077f8a'
            }}
            showsVerticalScrollIndicator={false}
          >
            <Text style={[styles.title, { marginBottom: 10 }]}>Available Products</Text>
            {products.map(product => (
<Pressable
  key={product.id}
  onPress={() => router.push({ pathname: '/user/view-product-info', params: { id: product.id } })}
  style={{
    backgroundColor: '#bfd9db',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  }}
>
  {product.imageUrl && (
    <Image
      source={{ uri: product.imageUrl }}
      style={{ width: '100%', height: 180, borderRadius: 8, marginBottom: 10 }}
    />
  )}
  <Text style={[styles.text, { fontSize: 18, fontWeight: 'bold' }]}>{product.productName}</Text>
  <Text style={styles.text}>Category: {product.category}</Text>
  <Text style={styles.text}>Price: {product.price.toFixed(2)}</Text>

  <Pressable
    onPress={(e) => {
      e.stopPropagation(); // prevent navigation
      addToCart(product);
    }}
    style={{
      marginTop: 10,
      backgroundColor: '#4BB543',
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: 'center',
    }}
  >
    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Add to Cart</Text>
  </Pressable>
</Pressable>

            ))}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      {/* Popup Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={popupVisible}
        onRequestClose={() => setPopupVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              padding: 30,
              borderRadius: 20,
              width: '80%',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>
              Notification
            </Text>
            <Text style={{ fontSize: 16, marginBottom: 20 }}>{popupMessage}</Text>

            <Pressable
              onPress={() => setPopupVisible(false)}
              style={{
                backgroundColor: '#4BB543',
                paddingVertical: 10,
                paddingHorizontal: 25,
                borderRadius: 10,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
