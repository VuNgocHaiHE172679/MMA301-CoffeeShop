import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  Linking,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const SettingScreen = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [faqModalVisible, setFaqModalVisible] = useState(false);
  const [faqQuestion, setFaqQuestion] = useState('');

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
  const toggleNotifications = () => setIsNotificationsEnabled((prev) => !prev);

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@example.com');
  };

  const handleLogout = () => {
    // Xử lý đăng xuất
    navigation.navigate('Login');
  };

  const handleOpenFaqModal = () => setFaqModalVisible(true);
  const handleCloseFaqModal = () => {
    setFaqQuestion('');
    setFaqModalVisible(false);
  };

  const handleSubmitFaq = () => {
    if (!faqQuestion.trim()) {
      Alert.alert('Validation', 'Please enter your question.');
      return;
    }
    // TODO: Gửi câu hỏi lên server tại đây nếu cần
    Alert.alert('Submitted', 'Your question has been sent!');
    handleCloseFaqModal();
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.title, isDarkMode && styles.darkText]}>Settings</Text>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Account</Text>
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person" size={20} color={isDarkMode ? '#fff' : '#000'} />
          <Text style={[styles.optionText, isDarkMode && styles.darkText]}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Ionicons name="lock-closed" size={20} color={isDarkMode ? '#fff' : '#000'} />
          <Text style={[styles.optionText, isDarkMode && styles.darkText]}>Change Password</Text>
        </TouchableOpacity>
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        {/* <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Preferences</Text> */}
        {/* <View style={styles.option}>
          <Ionicons name="moon" size={20} color={isDarkMode ? '#fff' : '#000'} />
          <Text style={[styles.optionText, isDarkMode && styles.darkText]}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            thumbColor={isDarkMode ? '#007bff' : '#f4f3f4'}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
          />
        </View> */}
        {/* <View style={styles.option}>
          <Ionicons name="notifications" size={20} color={isDarkMode ? '#fff' : '#000'} />
          <Text style={[styles.optionText, isDarkMode && styles.darkText]}>Notifications</Text>
          <Switch
            value={isNotificationsEnabled}
            onValueChange={toggleNotifications}
            thumbColor={isNotificationsEnabled ? '#007bff' : '#f4f3f4'}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
          />
        </View> */}
      </View>

      {/* Help & Support Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Help & Support</Text>
        <TouchableOpacity style={styles.option} onPress={handleOpenFaqModal}>
          <Ionicons name="help-circle" size={20} color={isDarkMode ? '#fff' : '#000'} />
          <Text style={[styles.optionText, isDarkMode && styles.darkText]}>FAQs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={handleContactSupport}>
          <Ionicons name="mail" size={20} color={isDarkMode ? '#fff' : '#000'} />
          <Text style={[styles.optionText, isDarkMode && styles.darkText]}>Contact Support</Text>
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>About</Text>
        <TouchableOpacity style={styles.option}>
          <Ionicons name="information-circle" size={20} color={isDarkMode ? '#fff' : '#000'} />
          <Text style={[styles.optionText, isDarkMode && styles.darkText]}>App Version 1.0.0</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* FAQ Modal */}
      <Modal
        visible={faqModalVisible}
        animationType="slide"
        transparent
        onRequestClose={handleCloseFaqModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ask a Question</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter your question..."
              value={faqQuestion}
              onChangeText={setFaqQuestion}
              multiline
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity onPress={handleCloseFaqModal} style={styles.modalButton}>
                <Text style={{ color: '#333' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSubmitFaq} style={[styles.modalButton, { marginLeft: 10 }]}>
                <Text style={{ color: '#007bff' }}>Submit</Text>
              </TouchableOpacity>
            </View>
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
    padding: 15,
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  darkText: {
    color: '#fff',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '85%',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    minHeight: 60,
    fontSize: 16,
    marginBottom: 15,
    color: '#333',
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

export default SettingScreen;