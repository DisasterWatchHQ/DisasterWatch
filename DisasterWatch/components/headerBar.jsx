import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, IconButton, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';

const HeaderBar = ({ showBack = false, title = "DisasterWatch", subtitle, containerStyle }) => {
  const router = useRouter();
  const theme = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.header}>
        <View>
          {showBack && (
            <IconButton
              icon="arrow-left"
              mode="text"
              size={20}
              onPress={() => router.back()}
              style={styles.backButton}
            />
          )}
          <Text variant="headlineMedium" style={styles.title}>
            {title}
          </Text>
          {subtitle && (
            <Text variant="bodyMedium" style={styles.subtitle}>
              {subtitle}
            </Text>
          )}
        </View>
        <View style={styles.headerButtons}>
          <IconButton
            icon="bell"
            mode="text"
            size={20}
            onPress={() => {}}
            style={styles.actionButton}
          />
          <IconButton
            icon="cog"
            mode="text"
            size={20}
            onPress={() => router.push('/settings')}
            style={styles.actionButton}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 4,
  },
  actionButton: {
    margin: 0,
    width: 32,
    height: 32,
  },
  backButton: {
    margin: 0,
  }
});

export default HeaderBar;