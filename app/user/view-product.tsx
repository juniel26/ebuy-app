import { router } from 'expo-router';
import { onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, Text, View } from 'react-native';
import { db } from '../../firebaseConfig';
import useThemeStyles from '../../hooks/useThemeStyles';

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl?: string;
};

export default function ViewProduct() {
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

  return (
    <View style={[styles.container, { padding: 20, flex: 1 }]}>
      <Text style={[styles.title, { marginBottom: 20 }]}>View Products</Text>

      {products.length === 0 ? (
        <View >
          <Text style={styles.text}>No products available.</Text>
        </View>
      ) : (
        <View style={{ flex: 1, width: '90%', alignSelf: 'center' }}>
          <FlatList
            data={products}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={{ marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 10 }}>
                {item.imageUrl ? (
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={{ width: '100%', height: 200, marginBottom: 10, borderRadius: 8 }}
                    resizeMode="cover"
                  />
                ) : null}
                <Text style={styles.text}>Name: {item.name}</Text>
                <Text style={styles.text}>Category: {item.category}</Text>
                <Text style={styles.text}>Price: ${item.price.toFixed(2)}</Text>
              </View>
            )}
          />
        </View>
      )}

      <Pressable onPress={() => router.push('/user/admin-dashboard')} style={styles.button}>
        <Text style={styles.buttonText}>Back</Text>
      </Pressable>
    </View>
  );
}
