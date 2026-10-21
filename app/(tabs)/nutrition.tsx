import { Ionicons } from '@expo/vector-icons';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Nutrition() {
  // Şimdilik sadece Arayüz (UI) tasarımı için sahte veriler kullanıyoruz
  const goalCalories = 2400;
  const foodCalories = 1450;
  const exerciseCalories = 300;
  const remainingCalories = goalCalories - foodCalories + exerciseCalories;
  
  // İlerleme çubuğu yüzdesi
  const progressPercentage = (foodCalories / (goalCalories + exerciseCalories)) * 100;

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Başlık */}
        <View className="px-6 mt-8 mb-6">
          <Text className="text-3xl font-extrabold text-white">Beslenme</Text>
          <Text className="text-neutral-400 mt-1">Günlük Kalori ve Makro Takibi</Text>
        </View>

        {/* 1. Günlük Kalori Özeti Kartı (Matematiksel Vizyonun) */}
        <View className="px-6 mb-8">
          <View className="bg-neutral-900 p-6 rounded-3xl border border-neutral-800 shadow-lg">
            <Text className="text-white font-bold text-lg mb-4">Kalori Özeti</Text>
            
            <View className="flex-row justify-between items-center mb-6">
              <View className="items-center">
                <Text className="text-neutral-400 text-xs mb-1">Hedef</Text>
                <Text className="text-white font-bold text-xl">{goalCalories}</Text>
              </View>
              <Text className="text-neutral-500 font-bold text-xl">-</Text>
              <View className="items-center">
                <Text className="text-neutral-400 text-xs mb-1">Yemek</Text>
                <Text className="text-blue-500 font-bold text-xl">{foodCalories}</Text>
              </View>
              <Text className="text-neutral-500 font-bold text-xl">+</Text>
              <View className="items-center">
                <Text className="text-neutral-400 text-xs mb-1">Egzersiz</Text>
                <Text className="text-green-500 font-bold text-xl">{exerciseCalories}</Text>
              </View>
              <Text className="text-neutral-500 font-bold text-xl">=</Text>
              <View className="items-center">
                <Text className="text-neutral-400 text-xs mb-1">Kalan</Text>
                <Text className="text-white font-extrabold text-2xl">{remainingCalories}</Text>
              </View>
            </View>

            {/* İlerleme Çubuğu */}
            <View className="h-3 w-full bg-neutral-800 rounded-full overflow-hidden">
              <View 
                className="h-full bg-blue-600 rounded-full" 
                style={{ width: `${progressPercentage}%` }} 
              />
            </View>
          </View>
        </View>

        {/* 2. Öğünler Listesi (Örnek Tasarım) */}
        <View className="px-6">
          
          {/* Kahvaltı */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-white font-bold text-lg">Kahvaltı</Text>
              <Text className="text-blue-500 font-bold">450 kcal</Text>
            </View>
            
            <View className="bg-neutral-900 rounded-2xl border border-neutral-800 p-4 mb-3">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-white font-bold">Yulaf Ezmesi</Text>
                  <Text className="text-neutral-500 text-xs mt-1">100g • Karb: 60g, Protein: 13g</Text>
                </View>
                <Text className="text-neutral-300 font-bold">350 kcal</Text>
              </View>
              <View className="h-[1px] bg-neutral-800 my-3" />
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-white font-bold">Haşlanmış Yumurta</Text>
                  <Text className="text-neutral-500 text-xs mt-1">1 Adet (Büyük)</Text>
                </View>
                <Text className="text-neutral-300 font-bold">100 kcal</Text>
              </View>
            </View>

            {/* Yemek Ekle Butonu */}
            <TouchableOpacity className="flex-row items-center justify-center py-3 bg-blue-600/10 rounded-xl border border-blue-600/30">
              <Ionicons name="add-circle-outline" size={20} color="#3b82f6" />
              <Text className="text-blue-500 font-bold ml-2">Kahvaltıya Yemek Ekle</Text>
            </TouchableOpacity>
          </View>

          {/* Öğle Yemeği */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-white font-bold text-lg">Öğle Yemeği</Text>
              <Text className="text-blue-500 font-bold">1000 kcal</Text>
            </View>
            
            <View className="bg-neutral-900 rounded-2xl border border-neutral-800 p-4 mb-3">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-white font-bold">Izgara Tavuk Göğsü</Text>
                  <Text className="text-neutral-500 text-xs mt-1">200g • Protein: 62g</Text>
                </View>
                <Text className="text-neutral-300 font-bold">330 kcal</Text>
              </View>
              <View className="h-[1px] bg-neutral-800 my-3" />
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-white font-bold">Pirinç Pilavı</Text>
                  <Text className="text-neutral-500 text-xs mt-1">1.5 Porsiyon (150g)</Text>
                </View>
                <Text className="text-neutral-300 font-bold">670 kcal</Text>
              </View>
            </View>

            <TouchableOpacity className="flex-row items-center justify-center py-3 bg-blue-600/10 rounded-xl border border-blue-600/30">
              <Ionicons name="add-circle-outline" size={20} color="#3b82f6" />
              <Text className="text-blue-500 font-bold ml-2">Öğle Yemeğine Ekle</Text>
            </TouchableOpacity>
          </View>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}