import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Platform,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { colors } from '../../theme/colors';
import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
} from 'react-native-audio-recorder-player';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';

// Types
type ImageAsset = {
  uri: string;
};

type AudioRecordingResult = {
  uri: string;
  duration: number;
};

const AddPrescriptionScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<Array<{uri: string}>>([]);
  const [recording, setRecording] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioRecorderPlayer] = useState(new AudioRecorderPlayer());
  const [loading, setLoading] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  useEffect(() => {
    return () => {
      // Cleanup audio recorder on unmount
      if (isRecording) {
        audioRecorderPlayer.stopRecorder();
      }
    };
  }, []);

  const requestCameraPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const permission = Platform.Version >= 33 
          ? PERMISSIONS.ANDROID.CAMERA
          : PERMISSIONS.ANDROID.CAMERA;
        
        const result = await request(permission);
        return result === RESULTS.GRANTED;
      } catch (error) {
        console.warn('Camera permission error:', error);
        return false;
      }
    } else {
      // iOS
      const result = await request(PERMISSIONS.IOS.CAMERA);
      return result === RESULTS.GRANTED;
    }
  };

  const requestStoragePermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const permission = Platform.Version >= 33 
          ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
        
        const result = await request(permission);
        return result === RESULTS.GRANTED;
      } catch (error) {
        console.warn('Storage permission error:', error);
        return false;
      }
    }
    return true; // iOS doesn't need storage permission for image picker
  };

  const requestAudioPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const result = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
        return result === RESULTS.GRANTED;
      } catch (error) {
        console.warn('Audio permission error:', error);
        return false;
      }
    } else {
      const result = await request(PERMISSIONS.IOS.MICROPHONE);
      return result === RESULTS.GRANTED;
    }
  };

  const handleAddPhoto = async () => {
    const hasStoragePermission = await requestStoragePermission();
    if (!hasStoragePermission) {
      Alert.alert('Permission Denied', 'Storage permission is required to access photos.');
      return;
    }

    setLoading(true);
    try {
      launchImageLibrary(
        { 
          mediaType: 'photo',
          quality: 0.8,
          maxWidth: 1200,
          maxHeight: 1200,
        },
        (response: ImagePickerResponse) => {
          setLoading(false);
          if (response.didCancel || response.errorMessage) {
            if (response.errorMessage) {
              Alert.alert('Error', response.errorMessage);
            }
            return;
          }
          
          if (response.assets && response.assets.length > 0 && response.assets[0].uri) {
            setImages(prev => [...prev, { uri: response.assets![0].uri! }]);
          }
        }
      );
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied', 
        'Camera permission is required to take photos. Please enable it in your device settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => {
            // You can use react-native-settings or Linking to open settings
            // For now, just show an alert
            Alert.alert('Please go to Settings > Apps > Entero > Permissions and enable Camera');
          }}
        ]
      );
      return;
    }

    setLoading(true);
    try {
      launchCamera(
        { 
          mediaType: 'photo',
          cameraType: 'back',
          quality: 0.8,
          maxWidth: 1200,
          maxHeight: 1200,
        },
        (response: ImagePickerResponse) => {
          setLoading(false);
          if (response.didCancel || response.errorMessage) {
            if (response.errorMessage) {
              Alert.alert('Error', response.errorMessage);
            }
            return;
          }
          
          if (response.assets && response.assets.length > 0 && response.assets[0].uri) {
            setImages(prev => [...prev, { uri: response.assets![0].uri! }]);
          }
        }
      );
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const handleRecordVoice = async () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      try {
        // Stop the recorder and get the audio file URI
        const audioUri = await audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener();
        
        // Set the recording URI (this will be used when submitting the form)
        setRecording(audioUri);
        setRecordingTime(0);
      } catch (error) {
        console.error('Stop recording error:', error);
        Alert.alert('Error', 'Failed to stop recording');
      }
    } else {
      // Start recording
      const hasPermission = await requestAudioPermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission Denied', 
          'Microphone permission is required to record audio. Please enable it in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => {
              Alert.alert('Please go to Settings > Apps > Entero > Permissions and enable Microphone');
            }}
          ]
        );
        return;
      }

      setIsRecording(true);
      setRecording(null);
      setRecordingTime(0);
      
      try {
        // Configure audio settings for better quality and compatibility
        const audioSet = {
          AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
          AudioSourceAndroid: AudioSourceAndroidType.MIC,
          AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
          AVNumberOfChannelsKeyIOS: 2,
          AVFormatIDKeyIOS: AVEncodingOption.aac,
        };
        
        // Start recording with default path (let the system handle temporary storage)
        await audioRecorderPlayer.startRecorder(undefined, audioSet);
        
        // Update the UI with recording time
        audioRecorderPlayer.addRecordBackListener((e) => {
          setRecordingTime(Math.floor(e.currentPosition / 1000));
        });
      } catch (error) {
        console.error('Start recording error:', error);
        Alert.alert('Error', 'Failed to start recording');
        setIsRecording(false);
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    if (images.length === 0 && !recording && !description.trim()) {
      Alert.alert('Missing Information', 'Please add at least one prescription image, voice note, or description.');
      return;
    }

    // In a real app, you would upload the prescription data here
    Alert.alert(
      'Prescription Added',
      'Your prescription has been added to your cart successfully!',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Cart')
        }
      ]
    );
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const renderImageItem = (uri: string, index: number) => (
    <View key={index} style={styles.imageContainer}>
      <Image source={{ uri }} style={styles.prescriptionImage} />
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => removeImage(index)}
      >
        <Text style={styles.removeButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Prescription</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Prescription Details</Text>
          <Text style={styles.sectionSubtitle}>
            Upload your prescription or describe your requirements
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity 
            style={[styles.optionButton, loading && styles.disabledButton]} 
            onPress={handleTakePhoto}
            disabled={loading}
          >
            <View style={styles.optionIconContainer}>
              <Text style={styles.iconText}>📷</Text>
            </View>
            <Text style={styles.optionText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.optionButton, loading && styles.disabledButton]} 
            onPress={handleAddPhoto}
            disabled={loading}
          >
            <View style={styles.optionIconContainer}>
              <Text style={styles.iconText}>🖼️</Text>
            </View>
            <Text style={styles.optionText}>Upload Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.optionButton, 
              isRecording && styles.activeRecording,
              loading && styles.disabledButton
            ]} 
            onPress={handleRecordVoice}
            disabled={loading}
          >
            <View style={[
              styles.optionIconContainer,
              isRecording && styles.activeRecordingIconContainer
            ]}>
              <Text 
                style={[styles.iconText, isRecording && styles.activeRecordingIcon]}
              >
                {isRecording ? "⏹️" : "🎤"}
              </Text>
            </View>
            <Text style={[styles.optionText, isRecording && styles.activeRecordingText]}>
              {isRecording ? `Recording ${formatTime(recordingTime)}` : "Voice Note"}
            </Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Processing...</Text>
          </View>
        )}

        {images.length > 0 && (
          <View style={styles.imagesSection}>
            <Text style={styles.sectionTitle}>Uploaded Images ({images.length})</Text>
            <View style={styles.imagesGrid}>
              {images.map((img, index) => renderImageItem(img.uri, index))}
            </View>
          </View>
        )}

        {recording && (
          <View style={styles.recordingContainer}>
            <Text style={styles.sectionTitle}>Voice Note</Text>
            <View style={styles.recordingItem}>
              <Text style={styles.recordingIcon}>🎵</Text>
              <View style={styles.recordingTextContainer}>
                <Text style={styles.recordingText}>Voice recording</Text>
                <Text style={styles.recordingTime}>{new Date().toLocaleTimeString()}</Text>
              </View>
              <TouchableOpacity 
                onPress={() => setRecording(null)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteIcon}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>Additional Notes (Optional)</Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Describe your prescription, dosage instructions, or any specific requirements..."
            placeholderTextColor="#888"
            multiline
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.disabledButton]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Processing...' : 'Submit Prescription'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: colors.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  backButtonText: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.black,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  optionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.6,
  },
  optionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.primary + '20',
  },
  activeRecordingIconContainer: {
    backgroundColor: colors.primary,
  },
  iconText: {
    fontSize: 24,
  },
  activeRecordingIcon: {
    color: colors.white,
  },
  optionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.black,
    textAlign: 'center',
  },
  activeRecording: {
    backgroundColor: colors.primary + '10',
    borderColor: colors.primary,
    borderWidth: 2,
  },
  activeRecordingText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  imagesSection: {
    marginBottom: 24,
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  imageContainer: {
    width: '48%',
    aspectRatio: 1,
    margin: '1%',
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  prescriptionImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.white,
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  removeButtonText: {
    fontSize: 18,
    color: '#ff4444',
    fontWeight: 'bold',
  },
  recordingContainer: {
    marginBottom: 24,
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recordingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  recordingIcon: {
    fontSize: 24,
    color: colors.primary,
    marginRight: 12,
  },
  recordingTextContainer: {
    flex: 1,
  },
  recordingText: {
    fontSize: 16,
    color: colors.black,
    fontWeight: '500',
  },
  recordingTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
  },
  deleteIcon: {
    fontSize: 20,
    color: '#ff4444',
  },
  descriptionContainer: {
    marginBottom: 24,
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  descriptionInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    color: colors.black,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddPrescriptionScreen;