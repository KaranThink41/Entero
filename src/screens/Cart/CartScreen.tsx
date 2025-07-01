import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { colors } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../../context/CartContext';

const CartScreen = () => {
  const navigation = useNavigation();
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  
  // Calculate bill details based on actual cart items
  const calculateItemTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const calculateOriginalTotal = () => {
    return items.reduce((total, item) => total + (item.originalPrice * item.quantity), 0);
  };
  
  const shippingFee = items.length > 0 ? 79 : 0;
  const freeDeliveryThreshold = 77;
  const subtotal = calculateItemTotal();
  const amountForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const hasFreeDelivery = subtotal >= freeDeliveryThreshold;
  
  const billDetails = {
    itemTotal: subtotal,
    totalDiscount: calculateOriginalTotal() - subtotal,
    shippingFee: hasFreeDelivery ? 0 : shippingFee,
    toBePaid: hasFreeDelivery ? subtotal : subtotal + shippingFee,
    savings: calculateOriginalTotal() - subtotal,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My cart</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container}>
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Text style={[styles.tabText, styles.activeTabText]}>✓ Products</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Lab tests</Text>
          </TouchableOpacity>
        </View>

        {/* Delivery Address */}
        <View style={styles.card}>
          <View style={styles.deliveryContainer}>
            <Text style={styles.deliveryIcon}>📍</Text>
            <View style={styles.deliveryInfo}>
              <Text style={styles.deliveryTitle}>Delivering to</Text>
              <Text style={styles.deliveryAddress}>H-9, Sector 4, Near Marine Drive</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.changeButton}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Free Delivery Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            🚚 {amountForFreeDelivery > 0 ? (
              <>Add items worth <Text style={{fontWeight: 'bold'}}>₹{amountForFreeDelivery.toFixed(2)}</Text> to get free delivery</>
            ) : (
              <>You've got free delivery!</>
            )}
          </Text>
        </View>

        {/* Cart Items */}
        {items.length === 0 ? (
          <View style={styles.emptyCartContainer}>
            <Text style={styles.emptyCartText}>Your cart is empty</Text>
            <TouchableOpacity 
              style={styles.continueShopping}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.continueShoppingText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          items.map(item => (
            <View key={item.id} style={styles.card}>
              {item.prescriptionRequired && (
                <Text style={styles.prescriptionText}>Prescription required</Text>
              )}
              <View style={styles.itemContainer}>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  {item.packSize && <Text style={styles.itemSubtitle}>{item.packSize}</Text>}
                  <View style={styles.priceRow}>
                    {item.discount && <Text style={styles.itemDiscount}>{item.discount}</Text>}
                    <Text style={styles.itemOriginalPrice}>
                      {item.originalPrice > item.price ? `₹${item.originalPrice}` : ''}
                    </Text>
                    <Text style={styles.itemPrice}>₹{item.price}</Text>
                  </View>
                </View>
                <View style={styles.itemActions}>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => removeFromCart(item.id)}
                  >
                    <Text style={styles.deleteButtonText}>✕</Text>
                  </TouchableOpacity>
                  <View style={styles.quantityControl}>
                    <TouchableOpacity 
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity 
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))
        )}

        {/* Coupons & Offers */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Coupons & offers</Text>
          {/* Coupon content goes here */}
        </View>

        {/* Bill Details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Bill details</Text>
          <View style={styles.billRow}>
            <Text>Item total</Text>
            <Text>₹{billDetails.itemTotal.toFixed(2)}</Text>
          </View>
          <View style={styles.billRow}>
            <Text>Total discount</Text>
            <Text style={{color: colors.success}}>- ₹{billDetails.totalDiscount.toFixed(2)}</Text>
          </View>
          <View style={styles.billRow}>
            <Text>Estimated shipping fee</Text>
            <Text>₹{billDetails.shippingFee}</Text>
          </View>
          <View style={styles.separator} />
          <View style={[styles.billRow, styles.totalRow]}>
            <Text style={styles.totalText}>To pay</Text>
            <Text style={styles.totalText}>₹{billDetails.toBePaid}</Text>
          </View>
        </View>

        <View style={styles.savingsBanner}>
            <Text style={styles.savingsText}>🤑 You will save ₹{billDetails.savings.toFixed(2)} on this order!</Text>
        </View>

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerPrice}>₹{billDetails.toBePaid}</Text>
          <Text style={styles.footerPriceLabel}>To be paid</Text>
        </View>
        <TouchableOpacity style={styles.continueButton}>
          <Text style={styles.continueButtonText}>Continue to add prescription</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  emptyCartContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  continueShopping: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  continueShoppingText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  backButton: { fontSize: 24, color: colors.darkGray },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  tabContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: colors.white,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.lightGray,
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  tabText: { color: colors.darkGray },
  activeTabText: { color: colors.primary, fontWeight: 'bold' },
  card: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 15,
    marginTop: 15,
  },
  deliveryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryIcon: { fontSize: 20, marginRight: 10 },
  deliveryInfo: { flex: 1 },
  deliveryTitle: { color: colors.darkGray },
  deliveryAddress: { fontWeight: 'bold' },
  changeButton: { color: colors.primary, fontWeight: 'bold' },
  banner: {
    backgroundColor: colors.successLight,
    padding: 12,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 10,
  },
  bannerText: { color: colors.success, textAlign: 'center' },
  itemAddedText: { fontWeight: 'bold', marginBottom: 10 },
  itemContainer: { flexDirection: 'row' },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.lightGray,
    marginRight: 10,
  },
  itemDetails: { flex: 1 },
  prescriptionText: { color: colors.warning, fontSize: 12, marginBottom: 4 },
  itemTitle: { fontWeight: 'bold' },
  itemSubtitle: { color: colors.darkGray, fontSize: 12 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  itemDiscount: { color: colors.success, marginRight: 5, fontSize: 12 },
  itemOriginalPrice: { color: colors.darkGray, textDecorationLine: 'line-through', marginRight: 5, fontSize: 12 },
  itemPrice: { fontWeight: 'bold' },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: '#FFEBEE',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#F44336',
    fontWeight: 'bold',
  },
  quantityControl: { flexDirection: 'row', alignItems: 'center' },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: { fontSize: 18, color: colors.primary },
  quantityText: { marginHorizontal: 15, fontSize: 16, fontWeight: 'bold' },
  separator: { height: 1, backgroundColor: colors.lightGray, marginVertical: 15 },
  addMoreItems: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  addMoreText: { fontWeight: 'bold' },
  addMoreIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  totalRow: { marginTop: 8 },
  totalText: { fontWeight: 'bold', fontSize: 16 },
  savingsBanner: {
    backgroundColor: colors.successLight,
    padding: 12,
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 10,
  },
  savingsText: { color: colors.success, textAlign: 'center' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  footerPrice: { fontSize: 18, fontWeight: 'bold' },
  footerPriceLabel: { color: colors.darkGray, fontSize: 12 },
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  continueButtonText: { color: colors.white, fontWeight: 'bold' },
});

export default CartScreen;
