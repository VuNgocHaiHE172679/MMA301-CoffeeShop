import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AdminSettingScreen = ({ navigation }) => {
  const [maintenance, setMaintenance] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => navigation.navigate('Login'),
        },
      ]
    );
  };

  const handleBackupDatabase = () => {
    Alert.alert('Backup Database', 'Database backup has been initiated.');
  };

  const handleSystemLogs = () => {
    Alert.alert('System Logs', 'Redirecting to system logs...');
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Redirecting to change password...');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Admin Controls Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Admin Controls</Text>
        <TouchableOpacity style={styles.option} onPress={() => setMaintenance(!maintenance)}>
          <View style={styles.optionContent}>
            <Ionicons name="construct-outline" size={24} color="#007bff" />
            <Text style={styles.optionText}>Maintenance Mode</Text>
          </View>
          <Switch
            value={maintenance}
            onValueChange={setMaintenance}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={maintenance ? '#007bff' : '#f4f3f4'}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={handleBackupDatabase}>
          <View style={styles.optionContent}>
            <Ionicons name="cloud-download-outline" size={24} color="#007bff" />
            <Text style={styles.optionText}>Backup Database</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={handleSystemLogs}>
          <View style={styles.optionContent}>
            <Ionicons name="document-text-outline" size={24} color="#007bff" />
            <Text style={styles.optionText}>System Logs</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Security Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        <TouchableOpacity style={styles.option} onPress={handleChangePassword}>
          <View style={styles.optionContent}>
            <Ionicons name="lock-closed-outline" size={24} color="#007bff" />
            <Text style={styles.optionText}>Change Admin Password</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => setTwoFactorAuth(!twoFactorAuth)}>
          <View style={styles.optionContent}>
            <Ionicons name="shield-checkmark-outline" size={24} color="#007bff" />
            <Text style={styles.optionText}>Two-Factor Authentication</Text>
          </View>
          <Switch
            value={twoFactorAuth}
            onValueChange={setTwoFactorAuth}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={twoFactorAuth ? '#007bff' : '#f4f3f4'}
          />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AdminSettingScreen;