import { router } from 'expo-router';
import { push, ref, set } from 'firebase/database';
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { db } from '../../firebaseConfig';
import useThemeStyles from '../../hooks/useThemeStyles';

export default function AddProduct() {
  const styles = useThemeStyles();

  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('Smartphone');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [imageUrl, setImageUrl] = useState('');  // <-- new state for image URL

  const handleSubmit = async () => {
    if (!productName.trim()) {
      Alert.alert('Validation Error', 'Product Name is required.');
      return;
    }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid price.');
      return;
    }
    if (!quantity || isNaN(Number(quantity)) || Number(quantity) < 0) {
      Alert.alert('Validation Error', 'Please enter a valid quantity.');
      return;
    }
    // Optional: you can validate if imageUrl looks like a URL (simple check)
    if (imageUrl && !imageUrl.startsWith('http')) {
      Alert.alert('Validation Error', 'Please enter a valid image URL.');
      return;
    }

    try {
      const productsRef = ref(db, 'products');
      const newProductRef = push(productsRef);

      await set(newProductRef, {
        productName: productName.trim(),
        category,
        description: description.trim(),
        price: Number(price),
        quantity: Number(quantity),
        imageUrl: imageUrl.trim(),  // <-- save image URL here
        createdAt: Date.now(),
      });

      Alert.alert('Success', 'Product added successfully.');

      // Reset form
      setProductName('');
      setCategory('Smartphone');
      setDescription('');
      setPrice('');
      setQuantity('');
      setImageUrl('');  // reset image url field

      router.push('/user/view-product')
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add product.');
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { padding: 20 }]}>
      <Text style={[styles.title, { marginBottom: 20 }]}>Add Product</Text>

      {/* Product Name */}
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Product Name"
          placeholderTextColor={styles.text.color + '99'}
          value={productName}
          onChangeText={setProductName}
          style={styles.input}
        />
      </View>

      {/* Category */}
      <View style={{ marginBottom: 12 }}>
        <Text style={[styles.text, { marginBottom: 8 }]}>Category:</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {['Smartphone', 'Tablet', 'Laptop'].map((cat) => (
            <Pressable
              key={cat}
              onPress={() => setCategory(cat)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 5,
                backgroundColor:
                  category === cat ? styles.button.backgroundColor : styles.inputWrapper.backgroundColor,
              }}
            >
              <Text
                style={{
                  color: category === cat ? styles.buttonText.color : styles.text.color,
                  fontWeight: category === cat ? 'bold' : 'normal',
                }}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Description */}
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Description"
          placeholderTextColor={styles.text.color + '99'}
          value={description}
          onChangeText={setDescription}
          style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Price */}
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Price (e.g. 199.99)"
          placeholderTextColor={styles.text.color + '99'}
          value={price}
          onChangeText={setPrice}
          keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'}
          style={styles.input}
        />
      </View>

      {/* Quantity */}
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Quantity"
          placeholderTextColor={styles.text.color + '99'}
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>

      {/* Image URL */}
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Image URL (optional)"
          placeholderTextColor={styles.text.color + '99'}
          value={imageUrl}
          onChangeText={setImageUrl}
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* Submit Button */}
      <Pressable onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Add Product</Text>
      </Pressable>
            <Pressable onPress={() => router.push('/user/admin-dashboard')} style={styles.button}>
        <Text style={styles.buttonText}>Cancel</Text>
      </Pressable>

    </ScrollView>
  );
}
