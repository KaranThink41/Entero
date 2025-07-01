import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  FlatList,
  StatusBar,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { colors } from '../../theme/colors';
import CartCounter from '../../components/CartCounter';
import { useCart } from '../../context/CartContext';

const { width } = Dimensions.get('window');

// Define types for our data
type PopularCategory = {
  id: string;
  title: string;
  imageUrl: string;
};

type DealItem = {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  rating?: number;
  ratingCount?: number;
  deliveryTime?: string;
  quantity?: number;
};

type HealthConcern = {
  id: string;
  title: string;
  imageUrl: string;
};

// Mock Data
const healthConcerns: HealthConcern[] = [
  { id: '1', title: 'Diabetes', imageUrl: 'https://www.helmholtz-hzi.de/fileadmin/_processed_/f/b/csm_AdobeStock_130470296_afa776c598.jpeg' },
  { id: '2', title: 'Heart Care', imageUrl: 'https://img.freepik.com/premium-photo/heart-cardiology-person-hands-chest-with-pain-sick-cardiovascular-healthcare-closeup-indigestion-heartburn-health-with-wellness-elderly-care-with-anxiety-attack-hypertension_590464-252063.jpg' },
  { id: '3', title: 'Stomach Care', imageUrl: 'https://media.istockphoto.com/id/868196718/photo/abdominal-pain-stomach-ache.jpg?s=612x612&w=0&k=20&c=EwNYDzcDVYtcP0XohcnaiM0EtLb3PXUi5lNkme7rRAk=' },
  { id: '4', title: 'Liver Care', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-ItH5C3lOJjUmqF-dxySnZMLHF7xt1J6Ecg&s' },
  { id: '5', title: 'Bone, Joint & Muscle', imageUrl: 'https://www.curahospitals.com/wp-content/uploads/2022/06/mobile-banner.png' },
  { id: '6', title: 'Kidney Care', imageUrl: 'https://d35oenyzp35321.cloudfront.net/Kidney_faliure_25ed527d13.jpg' },
  { id: '7', title: 'Derma Care', imageUrl: 'https://www.dermaartsclinic.com/assets/images/skin-care-model1.webp' },
  { id: '8', title: 'Respiratory', imageUrl: 'https://thumbs.dreamstime.com/b/digital-illustration-human-respiratory-system-red-lungs-bronchial-tubes-trachea-inside-male-body-anatomy-illustration-360044665.jpg' },
  { id: '9', title: 'Eye Care', imageUrl: 'https://www.clinicbarcelona.org/media/cache/960_jpeg/uploads/media/default/0007/79/951a5b362def439d3ac2dba713e93dae41a004f1.jpg' },
];

const popularCategories: PopularCategory[] = [
    { id: '1', title: 'Vitamins & Supplements', imageUrl: 'https://img.freepik.com/free-photo/flat-lay-health-still-life-arrangement-with-copy-space_23-2148854064.jpg' },
    { id: '2', title: 'Healthcare Device', imageUrl: 'https://img.freepik.com/free-photo/blood-pressure-monitor-with-results-table_23-2148854964.jpg' },
    { id: '3', title: 'Personal Care', imageUrl: 'https://img.freepik.com/free-photo/natural-cosmetics-with-lavender-extract_23-2148854067.jpg' },
    { id: '4', title: 'Nutritional Drinks', imageUrl: 'https://img.freepik.com/free-photo/protein-shake-with-chocolate-flavour_23-2148854968.jpg' },
    { id: '5', title: 'Mega Deals', imageUrl: 'https://img.freepik.com/free-vector/special-offer-sale-discount-banner_1017-31359.jpg' },
    { id: '6', title: 'Sexual Wellness', imageUrl: 'https://img.freepik.com/free-photo/condoms-with-feathers-pink-background_23-2148854972.jpg' },
    { id: '7', title: 'Skin Care', imageUrl: 'https://img.freepik.com/free-photo/natural-cosmetics-with-aloe-vera_23-2148854066.jpg' },
    { id: '8', title: 'Summer', imageUrl: 'https://img.freepik.com/free-photo/sunscreen-with-beach-accessories_23-2148854974.jpg' },
    { id: '9', title: 'Multivitamins', imageUrl: 'https://img.freepik.com/free-photo/vitamins-with-fruits-vegetables_23-2148854978.jpg' },
  ];

const skinCareDeals: DealItem[] = [
    { 
      id: '1', 
      title: 'Cerave Moisturising Cream for dry skin', 
      imageUrl: 'https://i.postimg.cc/P5gqjH1M/cerave.png', 
      price: 599, 
      originalPrice: 699, 
      discount: '15% off',
      rating: 5,
      ratingCount: 11,
      deliveryTime: 'Delivery by tomorrow 11 am'
    },
    { 
      id: '2', 
      title: 'La Shield SPF40 Sunscreen', 
      imageUrl: 'https://i.postimg.cc/tJ0M6NDz/lashield.png', 
      price: 689, 
      originalPrice: 815, 
      discount: '15% off',
      rating: 4,
      ratingCount: 8,
      deliveryTime: 'Delivery by tomorrow 11 am'
    },
    { 
      id: '3', 
      title: 'Cetaphil Moisturising Lotion 100 ml bottle', 
      imageUrl: 'https://i.postimg.cc/mkcT27Yy/cetaphil.png', 
      price: 511, 
      originalPrice: 549, 
      discount: '7% off',
      rating: 4.5,
      ratingCount: 9,
      deliveryTime: 'Delivery by tomorrow 11 am'
    },
  ];
  
  const painReliefDeals: DealItem[] = [
    { 
      id: '1', 
      title: 'Volini Spray for Sprain', 
      imageUrl: 'https://i.postimg.cc/L8p5f4f7/volini.png', 
      price: 150, 
      originalPrice: 160, 
      discount: '6% off',
      rating: 4,
      ratingCount: 7,
      deliveryTime: 'Delivery by tomorrow 11 am'
    },
    { 
      id: '2', 
      title: 'Crocin Pain Relief Tablet', 
      imageUrl: 'https://i.postimg.cc/W3s2Ld38/crocin.png', 
      price: 50, 
      originalPrice: 55, 
      discount: '9% off',
      rating: 4.5,
      ratingCount: 12,
      deliveryTime: 'Delivery by tomorrow 11 am'
    },
    { 
      id: '3', 
      title: 'Saridon Advance Tablet', 
      imageUrl: 'https://i.postimg.cc/sXyVpWvM/saridon.png', 
      price: 40, 
      originalPrice: 45, 
      discount: '11% off',
      rating: 4,
      ratingCount: 8,
      deliveryTime: 'Delivery by tomorrow 11 am'
    },
  ];

const everydayMedicines: DealItem[] = [
    { 
      id: '1', 
      title: 'Otrivin Oxy Fast Relief Nasal Spray', 
      imageUrl: 'https://i.postimg.cc/L8p5f4f7/volini.png', 
      price: 120, 
      originalPrice: 135, 
      discount: '11% off',
      rating: 4.2,
      ratingCount: 15,
      deliveryTime: 'Delivery by tomorrow 11 am'
    },
    { 
      id: '2', 
      title: 'Dolo 650 Tablet', 
      imageUrl: 'https://i.postimg.cc/W3s2Ld38/crocin.png', 
      price: 30, 
      originalPrice: 35, 
      discount: '14% off',
      rating: 4.8,
      ratingCount: 42,
      deliveryTime: 'Delivery by tomorrow 11 am'
    },
    { 
      id: '3', 
      title: 'Dabur Chyawanprash 500g', 
      imageUrl: 'https://i.postimg.cc/sXyVpWvM/saridon.png', 
      price: 290, 
      originalPrice: 325, 
      discount: '11% off',
      rating: 4.5,
      ratingCount: 28,
      deliveryTime: 'Delivery by tomorrow 11 am'
    },
  ];

const travelEssentials: DealItem[] = [
    { 
      id: '1', 
      title: 'ENO Digestive Powder Sachets', 
      imageUrl: 'https://i.postimg.cc/L8p5f4f7/volini.png', 
      price: 85, 
      originalPrice: 95, 
      discount: '11% off',
      rating: 4.3,
      ratingCount: 19,
      deliveryTime: 'Delivery by tomorrow 11 am'
    },
    { 
      id: '2', 
      title: 'Crocin Pain Relief Tablet', 
      imageUrl: 'https://i.postimg.cc/W3s2Ld38/crocin.png', 
      price: 50, 
      originalPrice: 55, 
      discount: '9% off',
      rating: 4.5,
      ratingCount: 12,
      deliveryTime: 'Delivery by tomorrow 11 am'
    },
    { 
      id: '3', 
      title: 'Dettol Hand Sanitizer 50ml', 
      imageUrl: 'https://i.postimg.cc/sXyVpWvM/saridon.png', 
      price: 75, 
      originalPrice: 85, 
      discount: '12% off',
      rating: 4.4,
      ratingCount: 23,
      deliveryTime: 'Delivery by tomorrow 11 am'
    },
    { 
      id: '4', 
      title: 'Colgate MaxFresh Toothpaste', 
      imageUrl: 'https://i.postimg.cc/sXyVpWvM/saridon.png', 
      price: 110, 
      originalPrice: 120, 
      discount: '8% off',
      rating: 4.2,
      ratingCount: 17,
      deliveryTime: 'Delivery by tomorrow 11 am'
    },
  ];

const PharmacyScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  // Create a unique ID for each card instance

  
  // Use cart context for managing quantities
  const { addToCart, updateQuantity, items } = useCart();

  const getCardQuantity = (item: DealItem) => {
    const existingItem = items.find(cartItem => cartItem.id === item.id);
    return existingItem ? existingItem.quantity : 0;
  };

  const increaseQuantity = (item: DealItem) => {
    const currentQuantity = getCardQuantity(item);
    if (currentQuantity === 0) {
      addToCart({
        id: item.id || '',
        title: item.title || '',
        price: item.price || 0,
        originalPrice: item.originalPrice || 0,
        discount: item.discount || '',
        imageUrl: item.imageUrl || '',
        quantity: 1
      });
    } else {
      updateQuantity(item.id, currentQuantity + 1);
    }
  };

  const decreaseQuantity = (item: DealItem) => {
    const currentQuantity = getCardQuantity(item);
    if (currentQuantity > 0) {
      updateQuantity(item.id, currentQuantity - 1);
    }
  };

  const renderHealthConcern = ({ item }: { item: HealthConcern }) => (
    <TouchableOpacity 
      style={styles.healthConcernCard}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    >
      <View style={styles.healthConcernImageContainer}>
        <Image source={{ uri: item.imageUrl }} style={styles.healthConcernImage} resizeMode="cover" />
      </View>
      <Text style={styles.healthConcernTitle} numberOfLines={1}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderPopularCategory = ({ item }: { item: PopularCategory }) => (
    <TouchableOpacity 
      style={styles.categoryCard}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    >
      <View style={styles.categoryImageContainer}>
        <Image source={{ uri: item.imageUrl }} style={styles.categoryImage} resizeMode="cover" />
      </View>
      <Text style={styles.categoryTitle} numberOfLines={2}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderDealItem = ({ item, sectionId }: { item: DealItem, sectionId: string }) => {
    const quantity = getCardQuantity(item);
    
    return (
      <TouchableOpacity 
        style={styles.dealCard}
        onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
      >
        <View style={styles.dealCardContent}>
          {/* Inner card for image */}
          <View style={styles.imageCard}>
            <Image source={{ uri: item.imageUrl }} style={styles.dealImage} resizeMode="contain" />
          </View>
          
          {/* Product details */}
          <Text style={styles.dealTitle} numberOfLines={2}>{item.title}</Text>
          
          {/* Product size info */}
          <Text style={styles.productSize}>
            {item.title.includes('Cream') ? '50 gms' : 
             item.title.includes('Lotion') ? '100 ml bottle' : 
             item.title.includes('Sunscreen') ? '50 gms' : 
             item.title.includes('Spray') ? '' : 
             item.title.includes('Tablet') ? '' : ''}
          </Text>
          
          {/* Rating */}
          {item.rating !== undefined && (
            <View style={styles.ratingContainer}>
              <View style={styles.starContainer}>
                {[1, 2, 3, 4, 5].map((star) => {
                  // Use emoji stars for better compatibility
                  const starChar = star <= (item.rating || 0) ? '\u2b50' : '\u2606';
                  return (
                    <Text key={star} style={styles.starIcon}>
                      {starChar}
                    </Text>
                  );
                })}
              </View>
              {item.ratingCount && (
                <Text style={styles.ratingCount}>({item.ratingCount})</Text>
              )}
            </View>
          )}
          
          {/* Delivery info */}
          {item.deliveryTime && (
            <Text style={styles.deliveryText}>{item.deliveryTime}</Text>
          )}
          
          {/* Price information */}
          <View style={styles.priceContainer}>
            <Text style={styles.dealPrice}>₹{item.price}</Text>
            {item.originalPrice && <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>}
            {item.discount && <Text style={styles.discountText}>{item.discount}</Text>}
          </View>
        </View>
        
        {/* Cart controls */}
        {quantity === 0 ? (
          <TouchableOpacity 
            style={styles.addToCartButton}
            onPress={(e) => {
              e.stopPropagation();
              increaseQuantity(item);
            }}
          >
            <Text style={styles.addToCartText}>Add to cart</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.quantityControlContainer}>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={(e) => {
                e.stopPropagation(); // Prevent triggering the parent TouchableOpacity
                decreaseQuantity(item);
              }}
            >
              <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>
            
            <Text style={styles.quantityText}>{quantity}</Text>
            
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={(e) => {
                e.stopPropagation(); // Prevent triggering the parent TouchableOpacity
                increaseQuantity(item);
              }}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <View style={styles.header}>
          <View style={styles.locationContainer}>
              <Text style={styles.deliverToText}>Deliver to</Text>
              <TouchableOpacity style={styles.locationRow}>
                  <Text style={styles.locationText} numberOfLines={1}>National Institute of Fashion Technology...</Text>
                  <Text style={styles.downArrow}>▼</Text>
              </TouchableOpacity>
          </View>
          <View style={styles.headerRightContainer}>
              <TouchableOpacity style={styles.notificationButton}>
                  <Text style={styles.notificationIcon}>🔔</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cartButton}>
                  <Text style={styles.cartIcon}>🛒</Text>
                  <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>0</Text></View>
              </TouchableOpacity>
          </View>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput style={styles.searchInput} placeholder="Search your medicine" placeholderTextColor="#888" />
            <TouchableOpacity style={styles.micButton}>
              <Text style={styles.micIcon}>🎤</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.actionCardContainer}>
            <View style={styles.actionCard}>
                <Text style={styles.actionCardText}>Call to order medicine</Text>
                <TouchableOpacity style={styles.actionButton}><Text style={styles.actionButtonText}>Call Now</Text></TouchableOpacity>
            </View>
            <View style={styles.actionCard}>
                <Text style={styles.actionCardText}>Order with prescription</Text>
                <TouchableOpacity style={styles.actionButton}><Text style={styles.actionButtonText}>Order Now</Text></TouchableOpacity>
            </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Shop by health concerns</Text>
          <FlatList
            data={healthConcerns}
            renderItem={renderHealthConcern}
            keyExtractor={(item) => item.id}
            numColumns={3}
            scrollEnabled={false}
            contentContainerStyle={styles.healthConcernsContent}
          />
        </View>

        <View style={styles.sectionContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', { productId: '2' })}>
                <Image source={{uri: 'https://i.postimg.cc/tJ0M6NDz/lashield.png'}} style={styles.bannerImage} />
            </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Popular Categories</Text>
          <FlatList
            data={popularCategories}
            renderItem={renderPopularCategory}
            keyExtractor={(item) => item.id}
            numColumns={3}
            scrollEnabled={false}
            contentContainerStyle={styles.categoryGridContent}
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Best deals in skin care</Text>
          <FlatList
            data={skinCareDeals}
            renderItem={({item}) => renderDealItem({item, sectionId: 'skincare'})}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dealsContent}
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Top deals in Pain relief and cough cold</Text>
          <FlatList
            data={painReliefDeals}
            renderItem={({item}) => renderDealItem({item, sectionId: 'painrelief'})}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dealsContent}
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Everyday Genuine Medicine</Text>
          <FlatList
            data={everydayMedicines}
            renderItem={({item}) => renderDealItem({item, sectionId: 'everyday'})}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dealsContent}
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Trusted Travel Essentials</Text>
          <FlatList
            data={travelEssentials}
            renderItem={({item}) => renderDealItem({item, sectionId: 'travel'})}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dealsContent}
          />
        </View>
      </ScrollView>
      
      {/* Cart Counter */}
      <CartCounter />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.white,
  },
  locationContainer: {
    flex: 1,
  },
  deliverToText: {
    fontSize: 12,
    color: colors.black,
    opacity: 0.9,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: colors.black,
    fontWeight: '500',
    maxWidth: '85%',
  },
  downArrow: {
    color: colors.primary,
    fontSize: 10,
    marginLeft: 4,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    padding: 8,
  },
  notificationIcon: {
    fontSize: 20,
    color: colors.primary,
  },
  cartButton: {
    padding: 8,
  },
  cartIcon: {
    fontSize: 22,
    color: colors.primary,
  },
  cartBadge: {
    position: 'absolute',
    right: 5,
    top: 5,
    backgroundColor: colors.warning,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: colors.black,
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.white,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE0E0',
    paddingHorizontal: 15,
    height: 46,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: colors.darkGray,
  },
  searchIcon: {
    fontSize: 16,
    color: '#888',
  },
  micButton: {
    padding: 5,
  },
  micIcon: {
    fontSize: 16,
    color: colors.primary,
  },
  actionCardContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.white,
  },
  actionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
  },
  actionCardText: {
    fontSize: 16,
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  sectionContainer: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.white,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  healthConcernsContent: {
    paddingVertical: 10,
  },
  healthConcernCard: {
    flex: 1,
    alignItems: 'center',
    margin: 5,
    maxWidth: width / 3 - 20,
  },
  healthConcernImageContainer: {
    width: width / 3.8,
    height: width / 3.8,
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
    backgroundColor: '#FFEBEB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  healthConcernImage: {
    width: '100%',
    height: '100%',
  },
  healthConcernTitle: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  bannerImage: {
      width: '100%',
      height: 100,
      borderRadius: 8,
  },
  categoryGridContent: {
    paddingVertical: 10,
  },
  categoryCard: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    margin: 5,
    maxWidth: width / 3 - 20,
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  categoryImageContainer: {
    width: width / 4.5,
    height: width / 4.5,
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
    backgroundColor: '#FFEBEB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryTitle: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  dealsContent: {
    paddingVertical: 10,
  },
  dealCard: {
    backgroundColor: colors.white, // White background
    borderRadius: 8,
    padding: 10,
    marginRight: 15,
    width: width / 2.5,
    height: 280, // Fixed height for consistency
    borderWidth: 0, // No border
    justifyContent: 'space-between', // To position button at bottom
  },
  dealCardContent: {
    flex: 1, // Take up available space
  },
  imageCard: {
    backgroundColor: colors.white,
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 5,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100, // Fixed height for image card
  },
  dealImage: {
    width: '80%',
    height: 80,
    resizeMode: 'contain',
  },
  productSize: {
    fontSize: 12,
    color: colors.darkGray,
    marginBottom: 2,
  },
  dealTitle: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 2,
    height: 36, // Fixed height for title (2 lines)
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  starContainer: {
    flexDirection: 'row',
  },
  starIcon: {
    color: '#FFD700',
    fontSize: 12,
    marginRight: 1,
  },
  ratingCount: {
    fontSize: 11,
    color: colors.darkGray,
    marginLeft: 4,
  },
  deliveryText: {
    fontSize: 10,
    color: colors.darkGray,
    marginBottom: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 3,
  },
  dealPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.black,
    marginRight: 5,
  },
  originalPrice: {
    fontSize: 12,
    color: colors.darkGray,
    textDecorationLine: 'line-through',
    marginRight: 5,
  },
  discountText: {
    fontSize: 12,
    color: colors.success,
  },
  addToCartButton: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingVertical: 6,
    marginTop: 5,
    alignItems: 'center',
    width: '100%',
  },
  addToCartText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  quantityControlContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    height: 30,
  },
  quantityButton: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.black,
  },
});

export default PharmacyScreen;
