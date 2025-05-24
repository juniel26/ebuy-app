import { useLocalSearchParams, useRouter } from 'expo-router';
import { get, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { db } from '../../firebaseConfig';
import useThemeStyles from '../../hooks/useThemeStyles';

type Product = {
  id: string;
  productName: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  description?: string;
};

export default function ViewProduct() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const styles = useThemeStyles();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);

  

  useEffect(() => {
    if (id) {
      const productRef = ref(db, `products/${id}`);
      get(productRef).then(snapshot => {
        if (snapshot.exists()) {
          setProduct({ id, ...snapshot.val() });
        }
      });
    }
  }, [id]);

  if (!product) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }]}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        backgroundColor: '#077f8a', // Overall background is transparent
        minHeight: '100%',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          backgroundColor: '#fff', // Product container has white background
          borderRadius: 16,
          padding: 16,
          width: '100%',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4, // For Android shadow
        }}
      >
        {product.imageUrl && (
          <Image
            source={{ uri: product.imageUrl }}
            style={{
              width: '100%',
              height: 250,
              borderRadius: 10,
              marginBottom: 20,
            }}
          />
        )}
        <Text style={[styles.title, { fontSize: 26 }]}>{product.productName}</Text>
        <Text style={[styles.text, { fontSize: 18 }]}>Category: {product.category}</Text>
        <Text style={[styles.text, { fontSize: 18 }]}>Price: ₱{product.price.toFixed(2)}</Text>
        {product.description && (
          <Text style={[styles.text, { fontSize: 16, marginTop: 10 }]}>
            Description: {product.description}
          </Text>
        )}

        <Pressable
          onPress={() => router.back()}
          style={{
            marginTop: 30,
            backgroundColor: '#4BB543',
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Go Back</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
