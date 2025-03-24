import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, useTheme, Portal, Dialog, TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useUser } from '../context/UserContext';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileOption from '../components/profile/ProfileOption';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import wardash from '../api/services/wardash';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const Profile = () => {
  const theme = useTheme();
  const { user, setUser, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    organization: '',
  });
  const [changePasswordDialogVisible, setChangePasswordDialogVisible] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }); 

  useEffect(() => {
    if (!userLoading && !user) {
      router.replace('/(auth)/signIn');
      return;
    }

    if (user) {
      setEditForm({
        name: user.name || '',
        email: user.email || '',
        organization: user.organization || '',
      });
    }
  }, [user, userLoading]);

  // Show loading indicator while checking authentication
  if (userLoading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Don't render anything if not authenticated
  if (!user) {
    return null;
  }

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const response = await wardash.patch(`/users/${user.id}`, editForm);
      
      if (response.data.success) {
        setUser(response.data.user);
        setEditDialogVisible(false);
        showToast('Profile updated successfully');
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      showToast(error.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await wardash.post(`/users/${user.id}/change-password`, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      if (response.data.success) {
        setChangePasswordDialogVisible(false);
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        showToast('Password changed successfully');
      } else {
        throw new Error(response.data.message || 'Failed to change password');
      }
    } catch (error) {
      showToast(error.message || 'Failed to change password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        showToast('Location permission denied', 'error');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const response = await wardash.patch(`/users/${user.id}`, {
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      });

      if (response.data.success) {
        setUser(response.data.user);
        showToast('Location updated successfully');
      } else {
        throw new Error(response.data.message || 'Failed to update location');
      }
    } catch (error) {
      showToast(error.message || 'Failed to update location', 'error');
    }
  };

  const handleUpdateAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const formData = new FormData();
        formData.append('avatar', {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          name: 'avatar.jpg',
        });

        const response = await wardash.post(`/users/${user.id}/avatar`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.success) {
          setUser(response.data.user);
          showToast('Profile picture updated successfully');
        } else {
          throw new Error(response.data.message || 'Failed to update profile picture');
        }
      }
    } catch (error) {
      showToast(error.message || 'Failed to update profile picture', 'error');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await wardash.delete(`/users/${user.id}`);
              if (response.data.success) {
                router.replace('/(auth)/signIn');
              } else {
                throw new Error(response.data.message || 'Failed to delete account');
              }
            } catch (error) {
              showToast(error.message || 'Failed to delete account', 'error');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        <ProfileHeader user={user} onAvatarPress={handleUpdateAvatar} />
        
        <View style={styles.section}>
          <ProfileOption
            icon="account-edit"
            title="Edit Profile"
            onPress={() => setEditDialogVisible(true)}
          />
          <ProfileOption
            icon="lock-reset"
            title="Change Password"
            onPress={() => setChangePasswordDialogVisible(true)}
          />
          <ProfileOption
            icon="map-marker"
            title="Update Location"
            onPress={handleUpdateLocation}
          />
          <ProfileOption
            icon="bell-outline"
            title="Notification Settings"
            onPress={() => router.push('/settings')}
          />
          <ProfileOption
            icon="shield-lock"
            title="Privacy & Security"
            onPress={() => Alert.alert('Privacy & Security', 'Coming soon')}
          />
          <ProfileOption
            icon="help-circle"
            title="Help & Support"
            onPress={() => Alert.alert('Help & Support', 'Coming soon')}
          />
          <ProfileOption
            icon="information"
            title="About"
            onPress={() => Alert.alert('About', 'DisasterWatch v1.0.0')}
          />
          <ProfileOption
            icon="logout"
            title="Logout"
            onPress={() => router.push('/(auth)/signIn')}
            danger
          />
          <ProfileOption
            icon="delete"
            title="Delete Account"
            onPress={handleDeleteAccount}
            danger
          />
        </View>
      </ScrollView>

      <Portal>
        <Dialog visible={editDialogVisible} onDismiss={() => setEditDialogVisible(false)}>
          <Dialog.Title>Edit Profile</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Name"
              value={editForm.name}
              onChangeText={(text) => setEditForm({ ...editForm, name: text })}
              style={styles.input}
            />
            <TextInput
              label="Email"
              value={editForm.email}
              onChangeText={(text) => setEditForm({ ...editForm, email: text })}
              keyboardType="email-address"
              style={styles.input}
            />
            <TextInput
              label="Organization"
              value={editForm.organization}
              onChangeText={(text) => setEditForm({ ...editForm, organization: text })}
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleUpdateProfile} loading={loading}>
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={changePasswordDialogVisible} onDismiss={() => setChangePasswordDialogVisible(false)}>
          <Dialog.Title>Change Password</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Current Password"
              value={passwordForm.currentPassword}
              onChangeText={(text) => setPasswordForm({ ...passwordForm, currentPassword: text })}
              secureTextEntry
              style={styles.input}
            />
            <TextInput
              label="New Password"
              value={passwordForm.newPassword}
              onChangeText={(text) => setPasswordForm({ ...passwordForm, newPassword: text })}
              secureTextEntry
              style={styles.input}
            />
            <TextInput
              label="Confirm New Password"
              value={passwordForm.confirmPassword}
              onChangeText={(text) => setPasswordForm({ ...passwordForm, confirmPassword: text })}
              secureTextEntry
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setChangePasswordDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleChangePassword} loading={loading}>
              Change Password
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginTop: 16,
  },
  input: {
    marginBottom: 16,
  },
});

export default Profile;