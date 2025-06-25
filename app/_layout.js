import { Stack } from 'expo-router';
import { useStore } from '../store/useStore';
import { TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function Layout() {
  const { isLoggedIn, onboardingComplete } = useStore();
  const router = useRouter();

  return (
    <Stack>
      {/* Authentication Screens */}
      {!isLoggedIn ? (
        <>
          <Stack.Screen 
            name="login" 
            options={{ 
              headerShown: false,
              animation: 'fade'
            }} 
          />
          <Stack.Screen 
            name="otp" 
            options={{ 
              title: 'Verify OTP',
              headerBackTitle: 'Back to Login',
              animation: 'slide_from_right'
            }}
          />
        </>
      ) : !onboardingComplete ? (
       
        <>
          <Stack.Screen 
            name="onboarding" 
            options={{ 
              headerShown: false,
              animation: 'slide_from_right'
            }} 
          />
          <Stack.Screen 
            name="location" 
            options={{ 
              title: 'Enable Location',
              headerBackTitle: 'Back',
              headerRight: () => (
                <TouchableOpacity onPress={() => router.push('/address')}>
                  <Text style={{ color: '#007AFF', marginRight: 15 }}>Skip</Text>
                </TouchableOpacity>
              )
            }}
          />
          <Stack.Screen 
            name="address" 
            options={{ 
              title: 'Your Address',
              headerBackTitle: 'Back',
              headerRight: () => (
                <TouchableOpacity onPress={() => router.push('/samples')}>
                  <Text style={{ color: '#007AFF', marginRight: 15 }}>Skip</Text>
                </TouchableOpacity>
              )
            }}
          />
          <Stack.Screen 
            name="samples" 
            options={{ 
              title: 'Select Samples',
              headerBackTitle: 'Back',
              headerRight: () => (
                <TouchableOpacity onPress={() => router.replace('/home')}>
                  <Text style={{ color: '#007AFF', marginRight: 15 }}>Skip</Text>
                </TouchableOpacity>
              )
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen 
            name="index" // Home screen
            options={{ 
              headerShown: false
            }} 
          />
          <Stack.Screen 
            name="profile" 
            options={{ 
              title: 'My Profile',
              headerBackTitle: 'Back'
            }}
          />
        </>
      )}
    </Stack>
  );
}