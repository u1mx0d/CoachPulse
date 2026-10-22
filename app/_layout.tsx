import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import "../global.css";
import { getCurrentUser, getUserProfile } from '../lib/appwrite';
import { useAuthStore } from '../store/authStore';

export default function RootLayout() {
  const { setUser, setIsLogged, setTargetCalories } = useAuthStore(); // YENİ: setTargetCalories eklendi
  const router = useRouter();

  useEffect(() => {
    getCurrentUser()
      .then(async (user: any) => {
        if (user) {
          setUser(user);
          setIsLogged(true);

          // YENİ: Veritabanından profili çek ve kalori hedefini hafızaya yaz
          const profile = await getUserProfile(user.$id);
          if (profile) {
            setTargetCalories(profile.targetCalories);
          }

          router.replace('/(tabs)');
        } else {
          setIsLogged(false);
          router.replace('/(auth)/sign-in');
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