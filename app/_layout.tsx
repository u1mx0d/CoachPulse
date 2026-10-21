import { Stack } from 'expo-router';
import { useEffect } from 'react';

import "../global.css";
import { getCurrentUser } from '../lib/appwrite';
import { useAuthStore } from '../store/authStore';

export default function RootLayout() {
  const { setUser, setIsLogged } = useAuthStore();

  useEffect(() => {
    
    getCurrentUser()
      .then((user: any) => {
        if (user) {
          setUser(user);      
          setIsLogged(true);  
        } else {
          setIsLogged(false);
        }
      })
      .catch((error: any) => {
        console.log("Oturum kontrol hatası:", error);
      });
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}