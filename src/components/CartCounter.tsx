import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { colors } from '../theme/colors';
import { useCart } from '../context/CartContext';

const { width } = Dimensions.get('window');

// Track if the cart has been dismissed with a ref that persists between renders
let isDismissed = false;
let lastItemCount = 0;

const CartCounter: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { getItemCount, getTotalPrice } = useCart();
  const [isVisible, setIsVisible] = useState(!isDismissed);
  
  const itemCount = getItemCount();
  
  // If the item count changes and increases, make the counter visible again
  React.useEffect(() => {
    if (itemCount > lastItemCount) {
      setIsVisible(true);
      isDismissed = false;
    }
    lastItemCount = itemCount;
  }, [itemCount]);
  
  // Handle dismissal
  const handleDismiss = () => {
    setIsVisible(false);
    isDismissed = true;
  };
  
  // Don't show the counter if there are no items in the cart or if dismissed
  if (itemCount === 0 || !isVisible) {
    return null;
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.counterContainer}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={handleDismiss}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.infoContainer}>
          <Text style={styles.itemCount}>{itemCount} {itemCount === 1 ? 'item' : 'items'}</Text>
          <Text style={styles.price}>₹{getTotalPrice()}</Text>
        </View>
        <TouchableOpacity 
          style={styles.viewCartButton}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.viewCartText}>View Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.white,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.darkGray,
  },
  container: {
    position: 'absolute',
    bottom: 60, // Position above the tab bar
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  counterContainer: {
    width: width * 0.9,
    backgroundColor: colors.primary,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoContainer: {
    flexDirection: 'column',
  },
  itemCount: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  price: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewCartButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  viewCartText: {
    color: colors.white,
    fontWeight: 'bold',
  },
});

export default CartCounter;
