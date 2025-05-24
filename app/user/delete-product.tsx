import { router } from 'expo-router';
import { onValue, ref, remove } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../firebaseConfig';
import useThemeStyles from '../../hooks/useThemeStyles';

type Product = {
  id: string;
  productName: string;
  category: string;
  price: number;
};

export default function DeleteProduct() {
  const styles = useThemeStyles();
  const [products, setProducts] = useState<Product[]>([]);

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

const handleDelete = (id: string) => {
  console.log('Delete pressed for ID:', id);  // Add this for debugging
  Alert.alert(
    'Confirm Delete',
    'Are you sure you want to delete this product?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
await remove(ref(db, `products/${id}`));

            Alert.alert('Deleted', 'Product successfully deleted.');
          } catch (error) {
            console.error('Delete error:', error);  // Also log errors
            Alert.alert('Error', 'Failed to delete product.');
          }
        },
      },
    ]
  );
};


  return (
    <ScrollView contentContainerStyle={[styles.container, { padding: 20 }]}>
      <Text style={[styles.title, { marginBottom: 20 }]}>Delete Product</Text>
      {products.length === 0 ? (
        <Text style={styles.text}>No products available to delete.</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={styles.text}>Name: {item.productName}</Text>
                <Text style={styles.text}>Category: {item.category}</Text>
                <Text style={styles.text}>Price: ${item.price.toFixed(2)}</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                style={{
                  backgroundColor: '#ff4d4d',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 6,
                }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Delete</Text>
              </TouchableOpacity>

            </View>
            
          )}
        />
      )}
                                <Pressable onPress={() => router.push('/user/admin-dashboard')} style={styles.button}>
                      <Text style={styles.buttonText}>Cancel</Text>
                    </Pressable>
    </ScrollView>
  );
}
