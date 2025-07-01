import React from 'react';
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
import { colors } from '../../theme/colors';

const { width } = Dimensions.get('window');

// Define types for our data
type CategoryCard = {
  id: string;
  title: string;
  icon?: string; // Optional icon URL or name
};

type HealthPackage = {
  id: string;
  title: string;
  icon?: string; // Optional icon URL or name
};

type HealthConcern = {
  id: string;
  title: string;
  icon?: string; // Optional icon URL or name
  backgroundColor?: string;
};

type Brand = {
  id: string;
  name: string;
  logo?: string; // Logo URL or placeholder
};

type TabItem = {
  id: string;
  icon: string;
  label: string;
  active?: boolean;
};

// Mock data for category cards
const categoryCards: CategoryCard[] = [
  { id: '1', title: 'Health Plan', icon: 'health-plan' },
  { id: '2', title: 'Order with Prescription', icon: 'prescription' },
  { id: '3', title: 'Care Plan', icon: 'care-plan' },
  { id: '4', title: 'Pill Reminder', icon: 'pill-reminder' },
  { id: '5', title: '1 Mg Stores', icon: 'store' },
  { id: '6', title: 'Health Products', icon: 'health-products' },
];

// Mock data for health packages
const healthPackages: HealthPackage[] = [
  { id: '1', title: 'Health Concern', icon: 'health-concern' },
  { id: '2', title: 'Health Checkups', icon: 'health-checkup' },
  { id: '3', title: "Women's Health", icon: 'womens-health' },
  { id: '4', title: "Men's Health", icon: 'mens-health' },
];

// Mock data for health concerns
const healthConcerns: HealthConcern[] = [
  { id: '1', title: 'Diabetes', icon: 'diabetes', backgroundColor: colors.primaryLightest },
  { id: '2', title: 'Heart Care', icon: 'heart', backgroundColor: colors.primaryLighter },
  { id: '3', title: 'Stomach Care', icon: 'stomach', backgroundColor: colors.primaryLight },
  { id: '4', title: 'Liver Care', icon: 'liver', backgroundColor: colors.primaryLightest },
  { id: '5', title: 'Bone, Joint & Muscle', icon: 'bone', backgroundColor: colors.primaryLighter },
  { id: '6', title: 'Kidney Care', icon: 'kidney', backgroundColor: colors.primaryLight },
  { id: '7', title: 'Derma Care', icon: 'skin', backgroundColor: colors.primaryLightest },
  { id: '8', title: 'Respiratory', icon: 'lungs', backgroundColor: colors.primaryLighter },
  { id: '9', title: 'Eye Care', icon: 'eye', backgroundColor: colors.primaryLight },
];

// Mock data for top brands
const topBrands: Brand[] = [
  { id: '1', name: 'Mamaearth', logo: 'https://miro.medium.com/v2/resize:fit:1400/0*UwLrJr_aQ9tI0PC-.png' },
  { id: '2', name: 'Wellbeing Nutrition', logo: 'https://m.media-amazon.com/images/S/al-eu-726f4d26-7fdb/64a5b29c-aa82-4aab-af22-c8d871bc9bc7.png' },
  { id: '3', name: 'The Derma Co', logo: 'https://airiamall.com/wp-content/uploads/2025/01/The-Derma-Co-Airia-Mall-Gurugram.png' },
  { id: '4', name: "Dr. Vaidya's", logo: 'https://panel.gokwik.co/storage/app/public/images/screenshot_2024-08-06_at_11.09.15_am-removebg-preview_1722922774.png' },
  { id: '5', name: 'Himalaya', logo: 'https://zerocreativity0.wordpress.com/wp-content/uploads/2017/01/himalaya-logo.jpg?w=736' },
  { id: '6', name: 'Cetaphil', logo: 'https://www.cetaphil.com/on/demandware.static/Sites-Galderma-US-Site/-/default/dw96f659a6/images/Cetaphil_Logo_285.png' },
  { id: '7', name: 'Dettol', logo: 'https://images.squarespace-cdn.com/content/v1/66ad47450527ea3ca863ff9a/1728989279347-V5O75ZEDCNT6UX6XSUTH/Dettol-logo-2010.png' },
  { id: '8', name: 'Tata 1mg', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTab9L_gCurShRMjsv-x7sgO5yVlfpS1DvcMg&s' },
  { id: '9', name: 'mCaffeine', logo: 'https://www.amicuscapital.in/wp-content/uploads/2020/09/mCaffeine-Logo-1.png' },
  { id: '10', name: 'Abbott', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Abbott_Laboratories_logo.svg/1024px-Abbott_Laboratories_logo.svg.png' },
  { id: '11', name: 'Dabur', logo: 'https://download.logo.wine/logo/Dabur/Dabur-Logo.wine.png' },
  { id: '12', name: 'Protinex', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS15_yCScE3pocRQ_4x4JzT477S762pDlJU9w&s' },
];

// Bottom tab icons
const tabItems: TabItem[] = [
  { id: '1', icon: '🏠', label: 'Home', active: true },
  { id: '2', icon: '👨‍⚕️', label: 'Doctor' },
  { id: '3', icon: '💊', label: 'Pharmacy' },
  { id: '4', icon: '🧪', label: 'Lab Test' },
  { id: '5', icon: '👤', label: 'Profile' },
];

const HomeScreen = () => {
  // Render a category card
  const renderCategoryCard = ({ item }: { item: CategoryCard }) => (
    <TouchableOpacity style={styles.categoryCard}>
      <View style={styles.categoryIconPlaceholder}>
        {/* We would use a proper Image component here with the icon source */}
        {/* <Image source={require(`../assets/icons/${item.icon}.png`)} style={styles.categoryIcon} /> */}
      </View>
      <Text style={styles.categoryTitle} numberOfLines={1}>{item.title}</Text>
    </TouchableOpacity>
  );

  // Render a health package card
  const renderHealthPackage = ({ item }: { item: HealthPackage }) => (
    <TouchableOpacity style={styles.healthPackageCard}>
      <View style={styles.healthPackageIconPlaceholder}>
        {/* We would use a proper Image component here with the icon source */}
        {/* <Image source={require(`../assets/icons/${item.icon}.png`)} style={styles.healthPackageIcon} /> */}
      </View>
      <Text style={styles.healthPackageTitle} numberOfLines={2}>{item.title}</Text>
    </TouchableOpacity>
  );

  // Render a health concern card
  const renderHealthConcern = ({ item }: { item: HealthConcern }) => (
    <TouchableOpacity style={styles.healthConcernCard}>
      <View style={[styles.healthConcernIconPlaceholder, { backgroundColor: item.backgroundColor }]}>
        {/* We would use a proper Image component here with the icon source */}
        {/* <Image source={require(`../assets/icons/${item.icon}.png`)} style={styles.healthConcernIcon} /> */}
      </View>
      <Text style={styles.healthConcernTitle} numberOfLines={1}>{item.title}</Text>
    </TouchableOpacity>
  );

  // Render a brand logo
  const renderBrand = ({ item }: { item: Brand }) => (
    <TouchableOpacity style={styles.brandCard}>
      <Image 
        source={{ uri: item.logo }} 
        style={styles.brandLogo}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );

  // Render a bottom tab item
  const renderTabItem = ({ item }: { item: TabItem }) => (
    <TouchableOpacity style={[styles.tabItem, item.active ? styles.activeTabItem : null]}>
      <Text style={[styles.tabIcon, item.active ? styles.activeTabIcon : null]}>{item.icon}</Text>
      <Text style={[styles.tabLabel, item.active ? styles.activeTabLabel : null]}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.safeArea}>
        <SafeAreaView style={styles.safeAreaContent}>
          <View style={styles.header}>
            <View style={styles.locationContainer}>
              <Text style={styles.deliverToText}>Deliver to</Text>
              <View style={styles.locationRow}>
                <Text style={styles.locationText} numberOfLines={1}>
                  National Institute of Fashion Technology...
                </Text>
                <Text style={styles.downArrow}>▼</Text>
              </View>
            </View>
            <View style={styles.headerRightContainer}>
              <TouchableOpacity style={styles.notificationButton}>
                <Text style={styles.notificationIcon}>🔔</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cartButton}>
                <View style={styles.cartIconContainer}>
                  <Text style={styles.cartIcon}>🛒</Text>
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>0</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput 
                style={styles.searchInput} 
                placeholder="Search tests and packages"
                placeholderTextColor="#888"
              />
              <TouchableOpacity style={styles.micButton}>
                <Text style={styles.micIcon}>🎤</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Category Cards */}
        <View style={styles.categoryGrid}>
          <FlatList
            data={categoryCards}
            renderItem={renderCategoryCard}
            keyExtractor={(item) => item.id}
            numColumns={3}
            scrollEnabled={false}
            contentContainerStyle={styles.categoryGridContent}
          />
        </View>

        {/* Shop by Health Concerns Section */}
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

        {/* Lab Test and Health Packages Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Lab test and health packages</Text>
          <FlatList
            data={healthPackages}
            renderItem={renderHealthPackage}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.healthPackagesContent}
          />
        </View>

        {/* Top Brands Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Top brands</Text>
          <FlatList
            data={topBrands}
            renderItem={renderBrand}
            keyExtractor={(item) => item.id}
            numColumns={4}
            scrollEnabled={false}
            contentContainerStyle={styles.brandsContent}
          />
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        {tabItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.tabItem}>
            <Text style={styles.tabIcon}>{item.icon}</Text>
            <Text style={styles.tabLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  safeArea: {
    backgroundColor: colors.primary,
    paddingTop: StatusBar.currentHeight,
  },
  safeAreaContent: {
    paddingBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: colors.primary,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  downArrow: {
    color: colors.white,
    fontSize: 10,
    marginLeft: 4,
    opacity: 0.8,
  },
  locationContainer: {
    flex: 1,
  },
  deliverToText: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.9,
  },
  locationText: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '500',
    maxWidth: '85%',
  },
  notificationButton: {
    padding: 8,
    marginRight: 5,
  },
  notificationIcon: {
    fontSize: 20,
    color: colors.white,
  },
  cartButton: {
    padding: 8,
  },
  cartIconContainer: {
    position: 'relative',
  },
  cartIcon: {
    fontSize: 22,
    color: colors.white,
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -8,
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
    backgroundColor: colors.primary,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    height: 46,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: '#888',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.darkGray,
    padding: 0,
  },
  searchDivider: {
    width: 1,
    height: 20,
    backgroundColor: colors.lightGray,
    marginHorizontal: 10,
  },
  micButton: {
    padding: 5,
  },
  micIcon: {
    fontSize: 16,
    color: colors.primary,
  },
  content: {
    flex: 1,
    backgroundColor: colors.lightGray,
  },
  categoryGrid: {
    padding: 16,
    backgroundColor: colors.white,
  },
  categoryGridContent: {
    paddingVertical: 10,
  },
  categoryCard: {
    flex: 1,
    alignItems: 'center',
    padding: 5,
    margin: 5,
    maxWidth: width / 3.2,
  },
  categoryIconPlaceholder: {
    width: width / 3.8,
    height: width / 3.8,
    backgroundColor: colors.primaryLightest,
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 12,
    textAlign: 'center',
    color: colors.darkGray,
    fontWeight: '500',
    marginTop: 4,
  },
  sectionContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: colors.white,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.black,
  },
  healthPackagesContent: {
    paddingVertical: 10,
  },
  healthPackageCard: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    margin: 5,
  },
  healthPackageIconPlaceholder: {
    width: width / 6,
    height: width / 6,
    backgroundColor: colors.lightGray,
    borderRadius: width / 12,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  healthPackageTitle: {
    fontSize: 12,
    textAlign: 'center',
    color: colors.darkGray,
    fontWeight: '500',
  },
  healthConcernsContent: {
    paddingVertical: 10,
  },
  healthConcernCard: {
    flex: 1,
    alignItems: 'center',
    padding: 5,
    margin: 5,
    maxWidth: width / 3.2,
  },
  healthConcernIconPlaceholder: {
    width: width / 3.8,
    height: width / 3.8,
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  healthConcernTitle: {
    fontSize: 12,
    textAlign: 'center',
    color: colors.darkGray,
    fontWeight: '500',
    marginTop: 4,
  },
  brandsContent: {
    paddingVertical: 10,
  },
  brandCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    margin: 5,
    maxWidth: width / 4.5,
    backgroundColor: 'transparent',
  },
  brandLogo: {
    width: width / 5,
    height: width / 8,
    resizeMode: 'contain',
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    backgroundColor: colors.white,
    paddingVertical: 10,
    paddingBottom: 15,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  activeTabItem: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 5,
    color: colors.darkGray,
  },
  activeTabIcon: {
    color: colors.primary,
  },
  tabLabel: {
    fontSize: 12,
    color: colors.darkGray,
    fontWeight: '500',
  },
  activeTabLabel: {
    color: colors.primary,
    fontWeight: '700',
  },
});

export default HomeScreen;