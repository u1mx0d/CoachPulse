import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signIn } from '../../lib/appwrite';
import { useAuthStore } from '../../store/authStore';

export default function SignIn() {
  const router = useRouter();
  const { setUser, setIsLogged } = useAuthStore();

  const [form, setForm] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (!form.email || !form.password) {
      alert('Lütfen tüm alanları doldurun.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signIn(form.email, form.password);
      setUser(result);
      setIsLogged(true);
      router.replace('/(tabs)');
    } catch (error: any) {
      alert('Giriş başarısız: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 20 }}>
          
          {/* Logo / İkon Alanı */}
          <View className="items-center mb-6">
            <View className="w-20 h-20 bg-blue-600/10 rounded-3xl items-center justify-center border border-blue-600/30 mb-4 shadow-lg shadow-blue-600/20">
              <Ionicons name="fitness" size={40} color="#3b82f6" />
            </View>
            <Text className="text-3xl font-extrabold text-white tracking-tight">CoachPulse</Text>
         
            <Text className="text-neutral-400 text-sm mt-1 text-center">
              Antrenman yolculuğuna kaldığın yerden devam et
            </Text>
          </View>

          {/* Form Kartı */}
          <View className="bg-neutral-900 p-6 rounded-3xl border border-neutral-800 shadow-xl mb-6">
            
            {/* E-posta */}
            <View className="mb-4">
              <Text className="text-neutral-400 text-xs font-bold mb-2 ml-1 uppercase">E-posta Adresi</Text>
              <View className="flex-row items-center bg-black rounded-2xl px-4 border border-neutral-800">
                <Ionicons name="mail-outline" size={20} color="#525252" />
                <TextInput 
                  className="flex-1 text-white py-4 px-3"
                  placeholder="ornek@email.com"
                  placeholderTextColor="#525252"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={form.email}
                  onChangeText={(e) => setForm({ ...form, email: e })}
                />
              </View>
            </View>

            {/* Şifre */}
            <View className="mb-6">
              <Text className="text-neutral-400 text-xs font-bold mb-2 ml-1 uppercase">Şifre</Text>
              <View className="flex-row items-center bg-black rounded-2xl px-4 border border-neutral-800">
                <Ionicons name="lock-closed-outline" size={20} color="#525252" />
                <TextInput 
                  className="flex-1 text-white py-4 px-3"
                  placeholder="********"
                  placeholderTextColor="#525252"
                  secureTextEntry
                  value={form.password}
                  onChangeText={(e) => setForm({ ...form, password: e })}
                />
              </View>
            </View>

            {/* Giriş Yap Butonu */}
            <TouchableOpacity 
              onPress={submit}
              disabled={isSubmitting}
              className="bg-blue-600 w-full py-4 rounded-2xl items-center shadow-lg shadow-blue-600/30 flex-row justify-center"
            >
              {isSubmitting ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <Text className="text-white font-extrabold text-lg mr-2">Giriş Yap</Text>
                  <Ionicons name="arrow-forward" size={20} color="#ffffff" />
                </>
              )}
            </TouchableOpacity>

          </View>

          {/* Kayıt Ol Yönlendirmesi (Link yerine TouchableOpacity ile kesin çözüm) */}
          <View className="flex-row justify-center items-center pb-4">
            <Text className="text-neutral-500 font-medium">Hesabın yok mu? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
              <Text className="text-blue-500 font-bold">Kayıt Ol</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}