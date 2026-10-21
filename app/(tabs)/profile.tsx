import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from '../../lib/appwrite';
import { useAuthStore } from '../../store/authStore';

export default function Profile() {
  const router = useRouter();
  

  const { user, logout, setTargetCalories } = useAuthStore();

  // Hangi sekmenin açık olduğunu tutan state (null = ana menü)
  const [activeTab, setActiveTab] = useState<string | null>(null);

  // Kalori Formu State'leri
  const [gender, setGender] = useState<'erkek' | 'kadin'>('erkek');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState<'sedentary' | 'light' | 'moderate' | 'active'>('moderate');
  const [goal, setGoal] = useState<'lose' | 'maintain' | 'gain'>('maintain');
  const [dailyCalories, setDailyCalories] = useState<number | null>(null);

  // Gelişmiş Kalori Hesaplama Motoru
  const calculateCalories = () => {
    if (!age || !height || !weight) {
      alert("Lütfen yaş, boy ve kilo alanlarını doldurun.");
      return;
    }

    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);

    // 1. BMR (Bazal Metabolizma) Hesaplama
    let bmr = gender === 'erkek' 
      ? (10 * w) + (6.25 * h) - (5 * a) + 5 
      : (10 * w) + (6.25 * h) - (5 * a) - 161;

    // 2. Hareketlilik Çarpanı
    const activityMultipliers = {
      sedentary: 1.2,    // Masa başı, hareketsiz
      light: 1.375,      // Haftada 1-3 gün hafif egzersiz
      moderate: 1.55,    // Haftada 3-5 gün orta egzersiz
      active: 1.725      // Haftada 6-7 gün ağır egzersiz
    };
    let tdee = bmr * activityMultipliers[activity];

    // 3. Hedefe Göre Kalori Ayarı
    let finalCalories = tdee;
    if (goal === 'lose') finalCalories -= 500; // Kilo vermek için kalori açığı
    if (goal === 'gain') finalCalories += 300; // Kas yapmak için kalori fazlası

    const roundedCalories = Math.round(finalCalories);
    setDailyCalories(roundedCalories);
    
    
    setTargetCalories(roundedCalories);
  };

  const handleLogout = async () => {
    try {
      await signOut(); 
      logout();        
      router.replace('/sign-in'); 
    } catch (error) {
      alert("Çıkış yapılırken bir hata oluştu.");
    }
  };

  // --- ALT GÖRÜNÜM: Vücut Analizi ---
  const renderAnalysis = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
      <View className="px-6 mt-4">
        {/* Geri Butonu ve Başlık */}
        <View className="flex-row items-center mb-8">
          <TouchableOpacity onPress={() => setActiveTab(null)} className="w-10 h-10 bg-neutral-900 rounded-full items-center justify-center border border-neutral-800">
            <Ionicons name="arrow-back" size={20} color="#ffffff" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white ml-4">Vücut Analizi</Text>
        </View>

        <Text className="text-white font-bold text-lg mb-4">1. Temel Bilgiler</Text>
        <View className="bg-neutral-900 p-5 rounded-3xl border border-neutral-800 mb-6">
          <View className="flex-row gap-4 mb-4">
            <TouchableOpacity onPress={() => setGender('erkek')} className={`flex-1 py-3 rounded-xl border ${gender === 'erkek' ? 'border-blue-600 bg-blue-600/10' : 'border-neutral-700'}`}>
              <Text className={`text-center font-bold ${gender === 'erkek' ? 'text-blue-500' : 'text-neutral-400'}`}>Erkek</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setGender('kadin')} className={`flex-1 py-3 rounded-xl border ${gender === 'kadin' ? 'border-blue-600 bg-blue-600/10' : 'border-neutral-700'}`}>
              <Text className={`text-center font-bold ${gender === 'kadin' ? 'text-blue-500' : 'text-neutral-400'}`}>Kadın</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="text-neutral-400 text-xs mb-2">Yaş</Text>
              <TextInput className="bg-black text-white px-4 py-3 rounded-xl border border-neutral-800" placeholder="25" placeholderTextColor="#525252" keyboardType="numeric" value={age} onChangeText={setAge} />
            </View>
            <View className="flex-1">
              <Text className="text-neutral-400 text-xs mb-2">Boy (cm)</Text>
              <TextInput className="bg-black text-white px-4 py-3 rounded-xl border border-neutral-800" placeholder="180" placeholderTextColor="#525252" keyboardType="numeric" value={height} onChangeText={setHeight} />
            </View>
            <View className="flex-1">
              <Text className="text-neutral-400 text-xs mb-2">Kilo (kg)</Text>
              <TextInput className="bg-black text-white px-4 py-3 rounded-xl border border-neutral-800" placeholder="75" placeholderTextColor="#525252" keyboardType="numeric" value={weight} onChangeText={setWeight} />
            </View>
          </View>
        </View>

        <Text className="text-white font-bold text-lg mb-4">2. Günlük Hareketlilik</Text>
        <View className="flex-row flex-wrap justify-between mb-6">
          {[
            { id: 'sedentary', title: 'Masa Başı', desc: 'Hareketsiz' },
            { id: 'light', title: 'Hafif', desc: '1-3 Gün Spor' },
            { id: 'moderate', title: 'Orta', desc: '3-5 Gün Spor' },
            { id: 'active', title: 'Aktif', desc: 'Her Gün Spor' }
          ].map((item) => (
            <TouchableOpacity key={item.id} onPress={() => setActivity(item.id as any)} className={`w-[48%] p-4 rounded-xl border mb-3 ${activity === item.id ? 'border-blue-600 bg-blue-600/10' : 'border-neutral-800 bg-neutral-900'}`}>
              <Text className={`font-bold ${activity === item.id ? 'text-blue-500' : 'text-white'}`}>{item.title}</Text>
              <Text className="text-neutral-500 text-xs mt-1">{item.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-white font-bold text-lg mb-4">3. Hedefin Nedir?</Text>
        <View className="bg-neutral-900 p-2 rounded-2xl border border-neutral-800 mb-6">
          {[
            { id: 'lose', title: 'Kilo Ver (Yağ Yak)' },
            { id: 'maintain', title: 'Kilonu Koru' },
            { id: 'gain', title: 'Kilo Al (Kas Yap)' }
          ].map((item) => (
            <TouchableOpacity key={item.id} onPress={() => setGoal(item.id as any)} className={`p-4 rounded-xl ${goal === item.id ? 'bg-blue-600' : 'bg-transparent'}`}>
              <Text className={`font-bold text-center ${goal === item.id ? 'text-white' : 'text-neutral-400'}`}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity onPress={calculateCalories} className="bg-blue-600 w-full py-4 rounded-xl items-center mb-6">
          <Text className="text-white font-extrabold text-lg">Kalori İhtiyacımı Hesapla</Text>
        </TouchableOpacity>

        {dailyCalories && (
          <View className="bg-neutral-900 rounded-3xl p-6 border border-blue-600/50 mb-10">
            <Text className="text-neutral-400 font-medium text-center">Günlük Hedef Kalorin</Text>
            <Text className="text-5xl font-extrabold text-blue-500 text-center mt-2">{dailyCalories} <Text className="text-xl text-neutral-500">kcal</Text></Text>
            <Text className="text-neutral-400 text-sm mt-4 text-center">
              Seçtiğin hedefe ({goal === 'lose' ? 'Kilo Verme' : goal === 'gain' ? 'Kas Yapma' : 'Kilo Koruma'}) ulaşman için her gün ortalama bu kadar kalori almalısın.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );

  // --- ALT GÖRÜNÜM: Ayarlar ---
  const renderSettings = () => (
    <View className="px-6 mt-4 flex-1">
      <View className="flex-row items-center mb-8">
        <TouchableOpacity onPress={() => setActiveTab(null)} className="w-10 h-10 bg-neutral-900 rounded-full items-center justify-center border border-neutral-800">
          <Ionicons name="arrow-back" size={20} color="#ffffff" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white ml-4">Ayarlar</Text>
      </View>
      <View className="flex-1 items-center justify-center">
        <Ionicons name="construct-outline" size={64} color="#3b82f6" />
        <Text className="text-white font-bold text-xl mt-4">Yapım Aşamasında</Text>
        <Text className="text-neutral-500 text-center mt-2">Uygulama ayarları (bildirimler, tema vb.) yakında buraya eklenecek.</Text>
      </View>
    </View>
  );

  // --- ANA MENÜ GÖRÜNÜMÜ ---
  const renderMainMenu = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Profil Başlığı */}
      <View className="px-6 mt-8 mb-10 flex-row items-center">
        <View className="w-16 h-16 bg-blue-600/20 rounded-full items-center justify-center border border-blue-600/50">
          <Text className="text-blue-500 font-extrabold text-2xl">{user?.name ? user.name.charAt(0).toUpperCase() : 'S'}</Text>
        </View>
        <View className="ml-4">
          <Text className="text-2xl font-extrabold text-white">{user?.name || 'Sporcu'}</Text>
          <Text className="text-neutral-400 font-medium">{user?.email || 'sporcu@email.com'}</Text>
        </View>
      </View>

      {/* Menü Listesi */}
      <View className="px-6">
        <MenuButton icon="body-outline" title="Vücut Analizi & Hedefler" subtitle="Kalori hesaplama ve vücut tipi" onPress={() => setActiveTab('analysis')} color="#3b82f6" />
        <MenuButton icon="time-outline" title="Antrenman Geçmişi" subtitle="Tamamlanan antrenmanların" onPress={() => {}} color="#10b981" />
        <MenuButton icon="heart-outline" title="Favori Hareketler" subtitle="Kaydettiğin egzersizler" onPress={() => {}} color="#f43f5e" />
        <MenuButton icon="settings-outline" title="Ayarlar" subtitle="Uygulama tercihleri" onPress={() => setActiveTab('settings')} color="#8b5cf6" />
      </View>

      {/* Çıkış Yap Butonu */}
      <View className="px-6 mt-8">
        <TouchableOpacity onPress={handleLogout} className="bg-neutral-900 border border-neutral-800 w-full py-4 rounded-2xl flex-row items-center justify-center">
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text className="text-red-500 font-bold text-lg ml-2">Hesaptan Çıkış Yap</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        {activeTab === 'analysis' ? renderAnalysis() : 
         activeTab === 'settings' ? renderSettings() : 
         renderMainMenu()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Menü Seçenekleri İçin Tekrar Kullanılabilir Bileşen
const MenuButton = ({ icon, title, subtitle, onPress, color }: any) => (
  <TouchableOpacity onPress={onPress} className="flex-row items-center bg-neutral-900 p-4 rounded-2xl border border-neutral-800 mb-4">
    <View className="w-12 h-12 rounded-full items-center justify-center" style={{ backgroundColor: `${color}15` }}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <View className="ml-4 flex-1">
      <Text className="text-white font-bold text-lg">{title}</Text>
      <Text className="text-neutral-500 text-sm mt-0.5">{subtitle}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#525252" />
  </TouchableOpacity>
);