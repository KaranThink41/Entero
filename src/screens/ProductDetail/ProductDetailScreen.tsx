import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useCart } from '../../context/CartContext';
import CartCounter from '../../components/CartCounter';
import { colors } from '../../theme/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

const ProductDetailScreen = ({ route, navigation }: Props) => {
  // Use optional chaining to handle potential undefined productId
  const { productId } = route.params || {};
  
  // Mock product database - in a real app, this would come from an API or database
  const productDatabase = {
    // Skin care products
    '1': {
      id: '1',
      title: 'Cerave Moisturising Cream for dry skin',
      subtitle: '50 gms',
      manufacturer: 'By CeraVe',
      imageUrl: 'https://i.postimg.cc/P5gqjH1M/cerave.png',
      price: 599,
      originalPrice: 699,
      discount: '15% off',
      peopleBought: '1245 people bought this recently',
      packSizes: ['50 gms', '100 gms'],
      deliveryTime: 'Earliest delivery by 10pm, Today',
    },
    '2': {
      id: '2',
      title: 'La Shield SPF40 Sunscreen',
      subtitle: '50 gms',
      manufacturer: 'By La Shield',
      imageUrl: 'https://i.postimg.cc/tJ0M6NDz/lashield.png',
      price: 689,
      originalPrice: 815,
      discount: '15% off',
      peopleBought: '876 people bought this recently',
      packSizes: ['50 gms', '100 gms'],
      deliveryTime: 'Earliest delivery by 10pm, Today',
    },
    '3': {
      id: '3',
      title: 'Cetaphil Moisturising Lotion',
      subtitle: '100 ml bottle',
      manufacturer: 'By Cetaphil',
      imageUrl: 'https://i.postimg.cc/mkcT27Yy/cetaphil.png',
      price: 511,
      originalPrice: 549,
      discount: '7% off',
      peopleBought: '1023 people bought this recently',
      packSizes: ['100 ml', '200 ml'],
      deliveryTime: 'Earliest delivery by 10pm, Today',
    },
    // Pain relief products
    '4': {
      id: '4',
      title: 'Volini Spray for Sprain',
      subtitle: '100 ml spray',
      manufacturer: 'By Volini',
      imageUrl: 'https://i.postimg.cc/L8p5f4f7/volini.png',
      price: 150,
      originalPrice: 160,
      discount: '6% off',
      peopleBought: '789 people bought this recently',
      packSizes: ['100 ml', '50 ml'],
      deliveryTime: 'Earliest delivery by 10pm, Today',
    },
    '5': {
      id: '5',
      title: 'Crocin Pain Relief Tablet',
      subtitle: '15 tablets in a strip',
      manufacturer: 'By Crocin',
      imageUrl: 'https://i.postimg.cc/W3s2Ld38/crocin.png',
      price: 50,
      originalPrice: 55,
      discount: '9% off',
      peopleBought: '1567 people bought this recently',
      packSizes: ['15 tablets', '10 tablets'],
      deliveryTime: 'Earliest delivery by 10pm, Today',
    },
    // Default product if ID not found
    'default': {
      id: 'default',
      title: 'Azithral 500 tablet',
      subtitle: '5 tablets in a strip',
      manufacturer: 'By Alembic Pharmaceuticals Ltd',
      imageUrl: 'https://i.postimg.cc/P5gqjH1M/cerave.png',
      price: 123,
      originalPrice: 131.94,
      discount: '6% off',
      peopleBought: '2051 people bought this recently',
      packSizes: ['5 tablets', '3 tablets'],
      deliveryTime: 'Earliest delivery by 10pm, Today',
    }
  };
  
  // Get the product from our database based on ID, or use default if not found
  const product = productId && productDatabase[productId as keyof typeof productDatabase]
    ? productDatabase[productId as keyof typeof productDatabase]
    : productDatabase['default'];
    
  const { addToCart, items, updateQuantity } = useCart();
  const [selectedPackSize, setSelectedPackSize] = useState('50 gms');
  
  // Check if this product is already in the cart
  const existingCartItem = items.find(item => item.id === product.id);
  const cartQuantity = existingCartItem ? existingCartItem.quantity : 0;
  
  const handleAddToCart = () => {
    if (existingCartItem) {
      // If already in cart, increase quantity
      updateQuantity(product.id, cartQuantity + 1);
    } else {
      // If not in cart, add it
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        originalPrice: product.originalPrice,
        discount: product.discount,
        imageUrl: product.imageUrl,
        quantity: 1,
        packSize: selectedPackSize
      });
    }
  };
  
  const decreaseQuantity = () => {
    if (cartQuantity > 0) {
      updateQuantity(product.id, cartQuantity - 1);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.headerButton}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity>
              <Text style={styles.headerButton}>🔗</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.headerButton}>🔍</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.headerButton}>🛒</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.imageContainer}>
          <Image source={{ uri: product.imageUrl }} style={styles.productImage} resizeMode="contain" />
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.subtitle}>{product.subtitle}</Text>
          <Text style={styles.manufacturer}>{product.manufacturer}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.discount}>{product.discount}</Text>
            <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
            <Text style={styles.price}>₹{product.price}</Text>
          </View>

          <Text style={styles.peopleBought}>{product.peopleBought}</Text>

          <Text style={styles.packSizeTitle}>Pack size (in a strip)</Text>
          <View style={styles.packSizeContainer}>
            <TouchableOpacity
              style={[styles.packSizeButton, selectedPackSize === '50 gms' ? styles.selectedPackSize : {}]}
              onPress={() => setSelectedPackSize('50 gms')}
            >
              <Text style={[styles.packSizeText, selectedPackSize === '50 gms' ? styles.selectedPackSizeText : {}]}>50 gms</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.packSizeButton, selectedPackSize === '100 gms' ? styles.selectedPackSize : {}]}
              onPress={() => setSelectedPackSize('100 gms')}
            >
              <Text style={[styles.packSizeText, selectedPackSize === '100 gms' ? styles.selectedPackSizeText : {}]}>100 gms</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.deliveryTime}>{product.deliveryTime}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {cartQuantity === 0 ? (
          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <Text style={styles.addToCartButtonText}>Add to cart</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.quantityControlContainer}>
            <TouchableOpacity style={styles.quantityButton} onPress={decreaseQuantity}>
              <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{cartQuantity}</Text>
            <TouchableOpacity style={styles.quantityButton} onPress={handleAddToCart}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity style={styles.buyNowButton} onPress={() => navigation.navigate('Cart')}>
          <Text style={styles.buttonText}>Buy now</Text>
        </TouchableOpacity>
      </View>
      
      {/* Cart Counter */}
      <CartCounter />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerButton: {
    fontSize: 24,
    marginHorizontal: 10,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  productImage: {
    width: width * 0.8,
    height: width * 0.5,
  },
  detailsContainer: {
    paddingHorizontal: 20,
  },
  title: { fontSize: 20, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: colors.darkGray, marginVertical: 5 },
  manufacturer: { fontSize: 14, color: colors.darkGray },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  discount: { color: colors.success, marginRight: 10, fontWeight: 'bold' },
  originalPrice: { textDecorationLine: 'line-through', color: colors.darkGray, marginRight: 10 },
  price: { fontSize: 18, fontWeight: 'bold' },
  peopleBought: { color: colors.darkGray, marginVertical: 10 },
  packSizeTitle: { fontWeight: 'bold', marginVertical: 10 },
  packSizeContainer: { flexDirection: 'row' },
  packSizeButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  selectedPackSize: {
    backgroundColor: colors.primary,
  },
  packSizeText: {
    color: colors.primary,
  },
  selectedPackSizeText: {
    color: colors.white,
  },
  deliveryTime: { fontWeight: 'bold', marginVertical: 20 },
  footer: {
    flexDirection: 'row',
    padding: 10,
    paddingBottom: 25, // Added more padding at the bottom
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: colors.white, // Ensure white background
  },
  addToCartButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    marginRight: 10,
    backgroundColor: colors.white,
  },
  addToCartButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  quantityControlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 5,
    height: 50,
    flex: 1,
    marginRight: 10,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.darkGray,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.darkGray,
  },
});

export default ProductDetailScreen;
