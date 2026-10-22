import { Stack, useRouter } from 'expo-router'; // useRouter eklendi
import { useEffect } from 'react';
import "../global.css";
import { getCurrentUser } from '../lib/appwrite';
import { useAuthStore } from '../store/authStore';

export default function RootLayout() {
  const { setUser, setIsLogged } = useAuthStore();
  const router = useRouter(); // Yönlendirme motorunu çağırıyoruz

  useEffect(() => {
    // Uygulama açıldığında veya yenilendiğinde aktif oturumu kontrol et
    getCurrentUser()
      .then((user: any) => {
        if (user) {
          // 1. Oturum VARSA hafızaya kaydet ve ANA SAYFAYA yönlendir
          setUser(user);      
          setIsLogged(true);  
          router.replace('/(tabs)'); 
        } else {
          // 2. Oturum YOKSA GİRİŞ EKRANINA yönlendir
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