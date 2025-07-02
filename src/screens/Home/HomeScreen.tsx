import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
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

// Screen padding for consistent spacing
const SCREEN_PADDING = 16;

// Define types for our data
type CategoryCard = {
  id: string;
  title: string;
  icon?: string;
  imageUrl: string;
};

type HealthPackage = {
  id: string;
  title: string;
  icon: string;
  imageUrl: string;
};

type HealthConcern = {
  id: string;
  title: string;
  icon?: string; // Optional icon URL or name
  backgroundColor?: string;
  imageUrl: string; // URL for the health concern image
};

type Brand = {
  id: string;
  name: string;
  logo?: string; // Logo URL or placeholder
};

type TestPackage = {
  id: string;
  title: string;
  imageUrl: string;
  testsIncluded: number;
  price: number;
};



// Mock data for category cards
const categoryCards: CategoryCard[] = [
  { 
    id: '1', 
    title: 'Health Plan', 
    icon: 'health-plan',
    imageUrl: 'https://www.payday-loanpersonal.com/wp-content/uploads/2023/05/Health-Insurance-Plan.jpg'
  },
  { 
    id: '2', 
    title: 'Order with Prescription', 
    icon: 'prescription',
    imageUrl: 'https://t3.ftcdn.net/jpg/00/20/03/32/360_F_20033265_P1tNnv96fPYw00xfz9XOQcM1V4I69d4P.jpg'
  },
  { 
    id: '3', 
    title: 'Care Plan', 
    icon: 'care-plan',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/1225/1225565.png'
  },
  { 
    id: '4', 
    title: 'Pill Reminder', 
    icon: 'pill-reminder',
    imageUrl: 'https://m.media-amazon.com/images/I/61XgX9BK7OL.jpg'
  },
  { 
    id: '5', 
    title: 'Entero Stores', 
    icon: 'store',
    imageUrl: 'https://images.moneycontrol.com/static-mcnews/2021/11/Pharmacy-chain-in-the-US.jpg?impolicy=website&width=770&height=431'
  },
  { 
    id: '6', 
    title: 'Health Products', 
    icon: 'health-products',
    imageUrl: 'https://media.istockphoto.com/id/584574708/photo/soap-bar-and-liquid-shampoo-shower-gel-towels-spa-kit.jpg?s=612x612&w=0&k=20&c=TFeQmTwVUwKY0NDKFFORe3cwDCxRtotFgEujMswn3dc='
  },
];

// Mock data for test packages
const testPackages: TestPackage[] = [
  {
    id: '1',
    title: 'Allergy Test',
    imageUrl: 'https://img.freepik.com/free-photo/allergy-test-concept-with-syringe_23-2148854955.jpg',
    testsIncluded: 12,
    price: 999
  },
  {
    id: '2',
    title: 'Diabetes Package',
    imageUrl: 'https://img.freepik.com/free-photo/doctor-holding-pen-closeup_1098-3491.jpg',
    testsIncluded: 8,
    price: 1299
  },
  {
    id: '3',
    title: 'Thyroid Package',
    imageUrl: 'https://img.freepik.com/free-photo/medical-still-life-arrangement_23-2148858042.jpg',
    testsIncluded: 6,
    price: 899
  },
  {
    id: '4',
    title: 'Weight Management',
    imageUrl: 'https://img.freepik.com/free-photo/young-woman-holding-paper-with-text-lose-weight_23-2148854839.jpg',
    testsIncluded: 10,
    price: 1799
  },
  {
    id: '5',
    title: 'Adult Women',
    imageUrl: 'https://img.freepik.com/free-photo/beautiful-young-woman-doing-yoga_23-2148854835.jpg',
    testsIncluded: 12,
    price: 1599
  },
  {
    id: '6',
    title: 'Senior Women',
    imageUrl: 'https://img.freepik.com/free-photo/elderly-woman-doing-yoga_23-2148854843.jpg',
    testsIncluded: 15,
    price: 1899
  },
  {
    id: '7',
    title: 'Women Fitness',
    imageUrl: 'https://img.freepik.com/free-photo/young-woman-exercising-park_23-2148854838.jpg',
    testsIncluded: 10,
    price: 1699
  },
  {
    id: '8',
    title: 'Adult Men',
    imageUrl: 'https://img.freepik.com/free-photo/young-handsome-man-doing-exercise-gym_23-2148854840.jpg',
    testsIncluded: 12,
    price: 1599
  },
  {
    id: '9',
    title: 'Senior Men',
    imageUrl: 'https://img.freepik.com/free-photo/elderly-man-doing-yoga_23-2148854842.jpg',
    testsIncluded: 16,
    price: 1999
  },
  {
    id: '10',
    title: 'Men Fitness',
    imageUrl: 'https://img.freepik.com/free-photo/young-man-exercising-park_23-2148854839.jpg',
    testsIncluded: 11,
    price: 1699
  },
  {
    id: '11',
    title: 'Stress & Fatigue',
    imageUrl: 'https://img.freepik.com/free-photo/young-woman-feeling-tired-her-bedroom_23-2148854852.jpg',
    testsIncluded: 8,
    price: 1299
  },
  {
    id: '12',
    title: 'Habit & Diet',
    imageUrl: 'https://img.freepik.com/free-photo/healthy-food-selection_23-2148854977.jpg',
    testsIncluded: 9,
    price: 1499
  },
  {
    id: '13',
    title: 'Vitamin Level',
    imageUrl: 'https://img.freepik.com/free-photo/vitamin-supplements-with-fruits-vegetables_23-2148854978.jpg',
    testsIncluded: 7,
    price: 1199
  },
  {
    id: '14',
    title: 'Hormones',
    imageUrl: 'https://img.freepik.com/free-photo/medical-test-tubes-lab_23-2149215310.jpg',
    testsIncluded: 14,
    price: 2199
  },
  {
    id: '15',
    title: 'Genetics',
    imageUrl: 'https://img.freepik.com/free-photo/dna-structure-blue-background_23-2148854979.jpg',
    testsIncluded: 18,
    price: 2599
  },
];

// Mock data for health packages
const healthPackages: HealthPackage[] = [
  { 
    id: '1', 
    title: 'Health Concern', 
    icon: 'health-concern',
    imageUrl: 'https://media.istockphoto.com/id/1190794708/photo/doctor-or-physician-writing-diagnosis-and-giving-a-medical-prescription-to-male-patient.jpg?s=612x612&w=0&k=20&c=n5pElCFiR1L-meB8TOGNTdpt4uS2ChJgcMH2pLQpUb0='
  },
  { 
    id: '2', 
    title: 'Health Checkups', 
    icon: 'health-checkup',
    imageUrl: 'https://wrayhospital.org/wp-content/uploads/2023/11/shutterstock_327930536.jpg'
  },
  { 
    id: '3', 
    title: "Women's Health", 
    icon: 'womens-health',
    imageUrl: 'https://emi.parkview.com/media/Image/Dashboard_835_womens_heart_health_3_23.jpg'
  },
  { 
    id: '4', 
    title: "Men's Health", 
    icon: 'mens-health',
    imageUrl: 'https://assets.rbl.ms/19156644/origin.jpg'
  },
  { 
    id: '5', 
    title: 'Organ Test', 
    icon: 'organ-test',
    imageUrl: 'https://assets.medpagetoday.net/media/images/107xxx/107709.jpg'
  },
  { 
    id: '6', 
    title: 'Special Test', 
    icon: 'special-test',
    imageUrl: 'https://assets.clevelandclinic.org/transform/LargeFeatureImage/f78da9bf-34b8-433a-a789-74dd8a7593d9/single-blood-test-can-detect-50-cancer-2166352700'
  },
];

// Mock data for health concerns
const healthConcerns: HealthConcern[] = [
  { 
    id: '1', 
    title: 'Diabetes', 
    icon: 'diabetes', 
    backgroundColor: colors.primaryLightest,
    imageUrl: 'https://www.helmholtz-hzi.de/fileadmin/_processed_/f/b/csm_AdobeStock_130470296_afa776c598.jpeg'
  },
  { 
    id: '2', 
    title: 'Heart Care', 
    icon: 'heart', 
    backgroundColor: colors.primaryLighter,
    imageUrl: 'https://img.freepik.com/premium-photo/heart-cardiology-person-hands-chest-with-pain-sick-cardiovascular-healthcare-closeup-indigestion-heartburn-health-with-wellness-elderly-care-with-anxiety-attack-hypertension_590464-252063.jpg'
  },
  { 
    id: '3', 
    title: 'Stomach Care', 
    icon: 'stomach', 
    backgroundColor: colors.primaryLight,
    imageUrl: 'https://media.istockphoto.com/id/868196718/photo/abdominal-pain-stomach-ache.jpg?s=612x612&w=0&k=20&c=EwNYDzcDVYtcP0XohcnaiM0EtLb3PXUi5lNkme7rRAk='
  },
  { 
    id: '4', 
    title: 'Liver Care', 
    icon: 'liver', 
    backgroundColor: colors.primaryLightest,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-ItH5C3lOJjUmqF-dxySnZMLHF7xt1J6Ecg&s'
  },
  { 
    id: '5', 
    title: 'Bone, Joint & Muscle', 
    icon: 'bone', 
    backgroundColor: colors.primaryLighter,
    imageUrl: 'https://www.curahospitals.com/wp-content/uploads/2022/06/mobile-banner.png'
  },
  { 
    id: '6', 
    title: 'Kidney Care', 
    icon: 'kidney', 
    backgroundColor: colors.primaryLight,
    imageUrl: 'https://d35oenyzp35321.cloudfront.net/Kidney_faliure_25ed527d13.jpg'
  },
  { 
    id: '7', 
    title: 'Derma Care', 
    icon: 'skin', 
    backgroundColor: colors.primaryLightest,
    imageUrl: 'https://www.dermaartsclinic.com/assets/images/skin-care-model1.webp'
  },
  { 
    id: '8', 
    title: 'Respiratory', 
    icon: 'lungs', 
    backgroundColor: colors.primaryLighter,
    imageUrl: 'https://thumbs.dreamstime.com/b/digital-illustration-human-respiratory-system-red-lungs-bronchial-tubes-trachea-inside-male-body-anatomy-illustration-360044665.jpg'
  },
  { 
    id: '9', 
    title: 'Eye Care', 
    icon: 'eye', 
    backgroundColor: colors.primaryLight,
    imageUrl: 'https://www.clinicbarcelona.org/media/cache/960_jpeg/uploads/media/default/0007/79/951a5b362def439d3ac2dba713e93dae41a004f1.jpg'
  },
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

const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  // Render a category card
  const renderCategoryCard = ({ item }: { item: CategoryCard }) => (
    <TouchableOpacity 
      style={styles.categoryCard}
      onPress={() => {
        if (item.title === 'Order with Prescription') {
          navigation.navigate('AddPrescription');
        }
      }}
    >
      <View style={styles.categoryImageContainer}>
        <Image 
          source={{ uri: item.imageUrl }} 
          style={styles.categoryImage}
          resizeMode="cover"
        />
      </View>
      <Text style={styles.categoryTitle} numberOfLines={1}>{item.title}</Text>
    </TouchableOpacity>
  );

  // Render a test package card
  const renderTestPackage = ({ item }: { item: TestPackage }) => (
    <View style={styles.testPackageCard}>
      <TouchableOpacity>
        <View style={styles.testPackageImageContainer}>
          <Image 
            source={{ uri: item.imageUrl }} 
            style={styles.testPackageImage}
            resizeMode="cover"
          />
        </View>
        <Text style={styles.testPackageTitle} numberOfLines={2}>{item.title}</Text>
      </TouchableOpacity>
    </View>
  );

  // Render a health package card
  const renderHealthPackage = ({ item }: { item: HealthPackage }) => (
    <View style={styles.healthPackageCard}>
      <TouchableOpacity>
        <View style={styles.healthPackageImageContainer}>
          <Image 
            source={{ uri: item.imageUrl }} 
            style={styles.healthPackageImage}
            resizeMode="cover"
          />
        </View>
        <Text style={styles.healthPackageTitle} numberOfLines={2}>{item.title}</Text>
      </TouchableOpacity>
    </View>
  );

  // Render a health concern card
  const renderHealthConcern = ({ item }: { item: HealthConcern }) => (
    <TouchableOpacity style={styles.healthConcernCard}>
      <View style={[styles.healthConcernImageContainer, { backgroundColor: item.backgroundColor }]}>
        <Image 
          source={{ uri: item.imageUrl }} 
          style={styles.healthConcernImage}
          resizeMode="cover"
        />
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



  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
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
          
          {/* Health Packages Row (Circular) */}
          <FlatList
            data={healthPackages}
            renderItem={renderHealthPackage}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.healthPackagesContent}
            style={styles.healthPackagesList}
          />
          
          {/* Test Packages Row (Square) */}
          <FlatList
            data={testPackages}
            renderItem={renderTestPackage}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.testPackagesContent}
            style={styles.testPackagesList}
            ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
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


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  safeArea: {
    backgroundColor: colors.white,
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
    backgroundColor: colors.white,
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
    color: colors.primary,
    fontSize: 10,
    marginLeft: 4,
    opacity: 0.8,
  },
  locationContainer: {
    flex: 1,
  },
  deliverToText: {
    fontSize: 12,
    color: colors.black, // Changed from colors.primary to black
    opacity: 0.9,
  },
  locationText: {
    fontSize: 14,
    color: colors.black, // Changed from colors.primary to black
    fontWeight: '500',
    maxWidth: '85%',
  },
  notificationButton: {
    padding: 8,
    marginRight: 5,
  },
  notificationIcon: {
    fontSize: 20,
    color: colors.primary,
  },
  cartButton: {
    padding: 8,
  },
  cartIconContainer: {
    position: 'relative',
  },
  cartIcon: {
    fontSize: 22,
    color: colors.primary,
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
    paddingTop: 5,
    paddingBottom: 5, // Reduced vertical padding
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
    paddingTop: 0, // Remove top padding
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: colors.white, // White background for the overall grid
  },
  categoryGridContent: {
    paddingTop: 0, // Remove top padding
    paddingBottom: 10,
  },
  categoryCard: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    margin: 5,
    maxWidth: width / 3.2,
    backgroundColor: colors.white, // White background for the entire card
    borderRadius: 12, // Rounded corners
  },
  categoryImageContainer: {
    width: width / 4.5, // Smaller image size
    height: width / 4.5, // Smaller image size
    borderRadius: 12, // Matching the card border radius
    marginBottom: 8,
    overflow: 'hidden',
    backgroundColor: '#FFEBEB', // Pink background only behind the image
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12, // Matching the container border radius
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
    paddingHorizontal: 8,
  },
  healthPackagesList: {
    flexGrow: 0,
  },
  healthPackageCard: {
    width: width / 4.5,
    alignItems: 'center',
    paddingHorizontal: 4,
    marginRight: 8,
  },
  healthPackageImageContainer: {
    width: width / 6,
    height: width / 6,
    borderRadius: width / 12, // Half of width/height to make it circular
    marginBottom: 6,
    overflow: 'hidden',
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  healthPackageImage: {
    width: '100%',
    height: '100%',
    borderRadius: width / 11, // Match container's border radius
  },
  healthPackageTitle: {
    fontSize: 12,
    textAlign: 'center',
    color: colors.darkGray,
    fontWeight: '500',
  },

  // Test Packages Styles
  testPackagesContent: {
    paddingVertical: 10,
    paddingLeft: 16,
    paddingRight: 6,
  },
  testPackagesList: {
    flexGrow: 0,
    marginTop: 10,
  },
  testPackageCard: {
    width: width / 3.5,
    alignItems: 'center',
  },
  testPackageImageContainer: {
    width: width / 3.8,
    height: width / 3.8,
    borderRadius: 8,
    marginBottom: 5,
    overflow: 'hidden',
    backgroundColor: colors.lightGray,
  },
  testPackageImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  testPackageTitle: {
    fontSize: 12,
    textAlign: 'center',
    color: colors.darkGray,
    fontWeight: '500',
    marginTop: 4,
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
  healthConcernImageContainer: {
    width: width / 3.8,
    height: width / 3.8,
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  healthConcernImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
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
});

export default HomeScreen;