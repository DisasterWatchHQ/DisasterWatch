import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const HeaderBar = ({ showBack = false, title = "DisasterWatch" }) => {
  const router = useRouter();

  return (
    <View className="flex-row h-[50px] items-center justify-between bg-neutral-700 border-1- border-neutral-800 mt-8 px-4">
      {showBack && (
        <TouchableOpacity 
          onPress={() => router.back()}
          className="items-start"
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      )}
      
      <Text className="text-neutral-100 text-2xl font-bold">{title}</Text>

      <TouchableOpacity 
        onPress={() => router.push('/profile')}
        className="items-end"
      >
        <Image 
          source={require('../assets/default_profile.png')} //pass the image here
          className="w-[48px] h-[48px] rounded-sm"
        />
        {/* <MaterialIcons name="account-circle" size={32} color="white" /> */}
      </TouchableOpacity>
    </View>
  );
};

export default HeaderBar;