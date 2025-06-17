import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import userService from '../../api/userService';

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    address: '',
    phone: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          Alert.alert('Error', 'User ID not found');
          return;
        }

        const response = await userService.getUserById(userId);
        console.log(response);
        if (response.user) {
          setUser(response.user);
          setFormData({
            fullname: response.user.fullname || '',
            email: response.user.email || '',
            address: response.user.address || '',
            phone: response.user.phone || '',
          });
        } else {
          Alert.alert('Error', 'Failed to fetch user information');
        }
      } catch (err) {
        Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSave = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'User ID not found');
        return;
      }

      const response = await userService.updateUser(userId, formData);
      if (response) {
        Alert.alert('Success', 'Profile updated successfully');
        setUser({ ...user, ...formData }); 
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No user data found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}> 
        <View style={styles.profileContainer}>
          <Text style={styles.title}>Profile Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.profileLabel}>Full Name:</Text>
            <TextInput
              style={styles.input}
              value={formData.fullname}
              onChangeText={(text) => setFormData({ ...formData, fullname: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.profileLabel}>Email:</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              editable={false} // Không cho phép chỉnh sửa email
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.profileLabel}>Address:</Text>
            <TextInput
              style={styles.input}
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.profileLabel}>Phone:</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
            />
          </View>

          <Text style={styles.profileLabel}>Role: {user.role}</Text>

          <Text style={styles.profileLabel}>Created At: {new Date(user.createdAt).toLocaleString()}</Text>

          <Text style={styles.profileLabel}>Last Updated: {new Date(user.updatedAt).toLocaleString()}</Text>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  profileContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 15,
  },
  profileLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginBottom: 10,
  },
  profileValue: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333',
    marginBottom: 10,
  },
  input: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
