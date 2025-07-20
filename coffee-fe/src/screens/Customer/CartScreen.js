import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';
import orderService from '../../api/orderService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartScreen = ({ navigation }) => {
  const { items, total, addToCart, removeFromCart, clearCart } = useCart();
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);

  const handleCheckout = async () => {
    if (items.length === 0) {
      Alert.alert('Error', 'Your cart is empty');
      return;
    }

    const userId = await AsyncStorage.getItem('userId');

    if (!userId) {
      Alert.alert('Error', 'User ID not found');
      return;
    }
    try {
      const orderData = {
        userId,
        items: items.map(item => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
      };

      // Submit the order
      const response = await orderService.createOrder(orderData);

      if (response?.text) {       
        Alert.alert('Stock', response.message);
        clearCart();
        navigation.navigate('Home');
        return;
      }

      if (response.result) {
        // Show invoice modal instead of Alert
        setInvoiceData({
          orderId: response.result._id || Math.floor(Math.random() * 1000000),
          date: new Date(),
          items: [...items],
          total: total,
        });
        setShowInvoice(true);
        clearCart();
      } else {
        Alert.alert('Error', 'Failed to place order. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {items?.length > 0 ? (
        <ScrollView contentContainerStyle={styles.scrollView}>
          {items?.map((item, index) => (
            <View key={`${item.product._id}_${index}`} style={styles.cartItem}>
              <Image source={{ uri: item.product.image }} style={styles.productImage} />
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{item.product.name}</Text>
                <Text style={styles.productPrice}>${item.product.price}</Text>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    onPress={() => removeFromCart(item.product._id)}
                    style={styles.quantityButton}
                  >
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity
                    onPress={() => addToCart(item.product)}
                    style={styles.quantityButton}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.itemTotal}>${(item.product.price * item.quantity).toFixed(2)}</Text>

              {/* Remove Button */}
              <TouchableOpacity
                onPress={() => removeFromCart(item.product._id)}
                style={styles.removeButton}
              >
                <Ionicons name="trash-outline" size={22} color="red" />
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* Clear All Cart Button */}
          <TouchableOpacity
            style={styles.clearAllButton}
            onPress={() => {
              Alert.alert(
                'Clear Cart',
                'Are you sure you want to remove all items from your cart?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'OK', onPress: clearCart }
                ]
              );
            }}
          >
            <Text style={styles.clearAllButtonText}>Clear All Cart</Text>
          </TouchableOpacity>

          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>Total</Text>
            <Text style={styles.summaryAmount}>${total.toFixed(2)}</Text>
          </View>

          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>Checkout</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <View style={styles.emptyCartContainer}>
          <Ionicons name="cart-outline" size={80} color="#ccc" />
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
          <TouchableOpacity
            style={styles.continueShopping}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.continueShoppingText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        visible={showInvoice}
        animationType="slide"
        transparent
        onRequestClose={() => setShowInvoice(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.3)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 24,
            width: '90%',
            elevation: 10,
          }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}>Invoice</Text>
            <Text style={{ fontSize: 16, marginBottom: 5 }}>Order ID: {invoiceData?.orderId}</Text>
            <Text style={{ fontSize: 16, marginBottom: 5 }}>Date: {invoiceData?.date?.toLocaleString()}</Text>
            <View style={{ borderBottomWidth: 1, borderColor: '#eee', marginVertical: 10 }} />
            {invoiceData?.items?.map((item, idx) => (
              <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ fontSize: 15 }}>{item.product.name} x{item.quantity}</Text>
                <Text style={{ fontSize: 15 }}>${(item.product.price * item.quantity).toFixed(2)}</Text>
              </View>
            ))}
            <View style={{ borderTopWidth: 1, borderColor: '#eee', marginVertical: 10 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 17, fontWeight: 'bold' }}>Total</Text>
              <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#007bff' }}>${invoiceData?.total?.toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              style={{
                marginTop: 20,
                backgroundColor: '#007bff',
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: 'center'
              }}
              onPress={() => {
                setShowInvoice(false);
                setTimeout(() => {
                  Alert.alert(
                    'Thank you!',
                    'Thank you for your purchase!',
                    [
                      {
                        text: 'OK',
                        onPress: () => navigation.navigate('Home')
                      }
                    ],
                    { cancelable: false }
                  );
                }, 300);
              }}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollView: {
    padding: 15,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 15,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: '#007bff',
    marginBottom: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 15,
  },
  summaryText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
  checkoutButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyCartContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCartText: {
    fontSize: 18,
    color: '#888',
    marginTop: 20,
  },
  continueShopping: {
    marginTop: 20,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  continueShoppingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    borderTopColor: '#ddd',
    marginLeft: 20,
  },
  removeButtonText: {
    fontSize: 14,
    color: 'red',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  clearAllButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  clearAllButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartScreen;
