import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ref as dbRef, onValue, remove } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, Pressable, Text, View } from 'react-native';
import { auth, db } from '../../firebaseConfig';
import useThemeStyles from '../../hooks/useThemeStyles';

type Product = {
  id: string;
  productName: string;
  category: string;
  price: number;
  imageUrl?: string;
  quantity?: number;
};

export default function Cart() {
  const styles = useThemeStyles();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [cartProducts, setCartProducts] = useState<Product[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(currentUser => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.replace('/auth/login');
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    const cartRef = dbRef(db, `users/${user.uid}/cart`);
    const unsubscribeCart = onValue(cartRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const productsArray = Object.entries(data).map(([key, value]: [string, any]) => ({
          id: key,
          ...value,
        }));
        setCartProducts(productsArray);
      } else {
        setCartProducts([]);
      }
    });

    return () => unsubscribeCart();
  }, [user]);

const handleRemoveFromCart = async (productId: string) => {
  if (!user) return;

  const productRef = dbRef(db, `users/${user.uid}/cart/${productId}`);
  try {
    await remove(productRef);
    Alert.alert('Removed', 'Product removed from cart.');
    setCartProducts(prev => prev.filter(p => p.id !== productId));
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
  } catch (error: any) {
    Alert.alert('Error', error.message || 'Failed to remove product.');
  }
};


  const toggleSelectItem = (productId: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.title}>Loading Cart...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { padding: 16 }]}>
      {/* Header with back button */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
<Pressable onPress={() => router.replace('/user/user-dashboard')} style={{ padding: 8 }}>
  <Ionicons name="arrow-back" size={28} color={styles.text.color} />
</Pressable>

        <Text style={[styles.title, { flex: 1, textAlign: 'center' }]}>My Cart</Text>
        <View style={{ width: 36 }} />
      </View>

      {cartProducts.length === 0 ? (
        <Text style={styles.text}>Your cart is empty.</Text>
      ) : (
        <>
          <FlatList
            data={cartProducts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={{
                  backgroundColor: '#a3a3a3',
                  padding: 16,
                  borderRadius: 12,
                  marginBottom: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Pressable
                  onPress={() => toggleSelectItem(item.id)}
                  style={{
                    marginRight: 12,
                    padding: 4,
                    borderWidth: 2,
                    borderColor: selectedItems.has(item.id) ? '#22c55e' : '#ccc',
                    borderRadius: 16,
                    backgroundColor: selectedItems.has(item.id) ? '#bbf7d0' : '#fff',
                  }}
                >
                  <Ionicons
                    name={selectedItems.has(item.id) ? 'checkmark-circle' : 'ellipse-outline'}
                    size={24}
                    color={selectedItems.has(item.id) ? '#22c55e' : '#9ca3af'}
                  />
                </Pressable>

                {item.imageUrl && (
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={{ width: 60, height: 60, borderRadius: 8, marginRight: 12 }}
                  />
                )}
                <View style={{ flex: 1 }}>
<Text style={[styles.text, { fontWeight: 'bold', fontSize: 16 }]}>{item.productName}</Text>

                  <Text style={styles.text}>Category: {item.category}</Text>
                  <Text style={styles.text}>Price: ₱{item.price.toFixed(2)}</Text>
                  <Text style={styles.text}>Quantity: {item.quantity || 1}</Text>
                </View>
                <Pressable onPress={() => handleRemoveFromCart(item.id)}>
                  <Ionicons name="trash-outline" size={24} color="red" />
                </Pressable>
              </View>
            )}
          />
          <Pressable
            style={{
              backgroundColor: '#22c55e',
              padding: 16,
              borderRadius: 8,
              alignItems: 'center',
              marginTop: 10,
            }}
            onPress={() => {
              const selectedProducts = cartProducts.filter(product =>
                selectedItems.has(product.id)
              );

              if (selectedProducts.length === 0) {
                Alert.alert('No Selection', 'Please select at least one item to checkout.');
                return;
              }

              router.push({
                pathname: '/user/create-checkout',
                params: {
                  cartData: JSON.stringify(selectedProducts),
                },
              });
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Proceed to Checkout</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
