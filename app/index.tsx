import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { getCurrentUser } from '../lib/appwrite'; // Appwrite fonksiyonumuzu çağırdık
import { useAuthStore } from '../store/authStore';

export default function Index() {
  const { isLoading, isLogged, setUser, setIsLogged } = useAuthStore();

  useEffect(() => {
    // Uygulama açıldığında çalışacak oturum kontrol fonksiyonu
    const checkSession = async () => {
      try {
        const user = await getCurrentUser();
        
        if (user) {
          // Eğer sunucuda aktif bir kullanıcı varsa hafızaya yaz ve giriş yapıldı olarak işaretle
          setUser(user);
          setIsLogged(true);
        } else {
          // Kullanıcı yoksa hafızayı temizle
          setIsLogged(false);
          setUser(null);
        }
      } catch (error) {
        console.log("Oturum kontrol hatası:", error);
      } finally {
        // İşlem bitince yükleme ekranını (çarkı) kapat
        useAuthStore.setState({ isLoading: false });
      }
    };

    checkSession();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-900">
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  if (isLogged) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/sign-in" />;
}