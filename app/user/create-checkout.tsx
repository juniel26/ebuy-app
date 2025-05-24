import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import useThemeStyles from '../../hooks/useThemeStyles';

export default function CreateCheckout() {
  const router = useRouter();
  const { cartData } = useLocalSearchParams();
  const cartProducts = cartData ? JSON.parse(cartData as string) : [];

  const [fullname, setFullname] = useState('');
  const [address, setAddress] = useState('');
  const [paymentOption, setPaymentOption] = useState('COD');

  const [showConfirmation, setShowConfirmation] = useState(false);
  const styles = useThemeStyles();

useEffect(() => {
  let timer: number;
  if (showConfirmation) {
    timer = setTimeout(() => {
      router.replace('/user/cart');
    }, 5000);
  }
  return () => clearTimeout(timer);
}, [showConfirmation]);


  const handlePlaceOrder = () => {
    if (!fullname || !address) {
      alert('Please fill in all required fields.');
      return;
    }

    setShowConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
      router.replace('/user/user-dashboard');
  };

    const handleCancel = () => {
    // Simply navigate back to the cart screen
    router.replace('/user/cart');
  };

  const calculateTotalPrice = () => {
  return cartProducts.reduce((sum: number, item: any) => {
    const qty = item.quantity || 1;
    return sum + item.price * qty;
  }, 0);
};

  return (
    <>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Checkout</Text>

        {/* Form Inputs */}
        <Text style={{ marginBottom: 4 }}>Full Name</Text>
        <TextInput
          value={fullname}
          onChangeText={setFullname}
          placeholder="Enter your name"
          style={{ borderWidth: 1, padding: 8, borderRadius: 6, marginBottom: 12 }}
        />

        <Text style={{ marginBottom: 4 }}>Address</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          placeholder="Enter your delivery address"
          style={{ borderWidth: 1, padding: 8, borderRadius: 6, marginBottom: 12 }}
        />

        <Text style={{ marginBottom: 8 }}>Payment Option: Cash on Delivery (COD)</Text>

        {/* Product Summary */}
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>Order Summary:</Text>
        {cartProducts.map((item: any) => (
          <View
            key={item.id}
            style={{ padding: 10, borderWidth: 1, borderRadius: 6, marginBottom: 10 }}
          >
            <Text>Name: {item.productName}</Text>
            <Text>Category: {item.category}</Text>
            <Text>Price: ₱{item.price}</Text>
            <Text>Qty: {item.quantity || 1}</Text>


          </View>
        ))}
            {/* After the map rendering each item */}
<View style={{ marginTop: 12 }}>
  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
    Total Amount: ₱{calculateTotalPrice().toFixed(2)}
  </Text>
</View>
        

        {/* Place Order */}
        <Pressable
          onPress={handlePlaceOrder}
          style={{
            backgroundColor: '#16a34a',
            padding: 14,
            borderRadius: 8,
            alignItems: 'center',
            marginTop: 16,
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Place Order</Text>
        </Pressable>

        {/* Cancel Button */}
        <Pressable
          onPress={handleCancel}
          style={{
            backgroundColor: '#dc2626', // red color
            padding: 14,
            borderRadius: 8,
            alignItems: 'center',
            marginTop: 12,
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Cancel</Text>
        </Pressable>
      </ScrollView>

      {/* Confirmation Popup */}
      <Modal visible={showConfirmation} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 8,
              width: '80%',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
              Your order has been confirmed
            </Text>

            <Pressable
              onPress={handleCloseConfirmation}
              style={{
                backgroundColor: '#16a34a',
                paddingVertical: 10,
                paddingHorizontal: 30,
                borderRadius: 6,
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}
