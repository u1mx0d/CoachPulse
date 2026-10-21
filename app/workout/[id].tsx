import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getWorkoutExercises } from '../../lib/appwrite';

export default function WorkoutDetail() {
  const { id } = useLocalSearchParams(); // Dashboard'dan gelen Antrenman ID'si
  const router = useRouter();

  // State Yönetimi
  const [exercises, setExercises] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        if (typeof id === 'string') {
          const data = await getWorkoutExercises(id);
          setExercises(data);
        }
      } catch (error) {
        console.log("Veri çekme hatası:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, [id]);

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* 1. Üst Kısım / Geri Butonu */}
        <View className="px-6 mt-4 flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-neutral-900 rounded-full items-center justify-center border border-slate-700"
          >
            <Text className="text-white font-bold">←</Text>
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold ml-4">Antrenman Detayı</Text>
        </View>

        {/* 2. Başlık Alanı */}
        <View className="px-6 mt-8 mb-6">
          <View className="bg-blue-600 self-start px-3 py-1 rounded-lg mb-3">
            <Text className="text-white text-xs font-bold uppercase">Hipertrofi</Text>
          </View>
          <Text className="text-3xl font-extrabold text-white mb-2">Üst Vücut İtme (Push)</Text>
          <Text className="text-slate-400 font-medium">Bu antrenman ID'si: {id}</Text>
        </View>

        {/* 3. Hareketler Listesi (DİNAMİK) */}
        <View className="px-6">
          <Text className="text-xl font-bold text-white mb-4">Egzersizler</Text>
          
          {isLoading ? (
            <ActivityIndicator size="large" color="#f97316" className="mt-4" />
          ) : exercises.length > 0 ? (
            exercises.map((item, index) => (
              <View key={item.$id} className="bg-neutral-900 p-4 rounded-2xl mb-4 border border-slate-700 flex-row items-center">
                <View className="w-12 h-12 bg-slate-700 rounded-full items-center justify-center mr-4">
                  <Text className="text-blue-600 font-bold text-lg">{index + 1}</Text>
                </View>
                <View>
                  <Text className="text-white font-bold text-lg">{item.name}</Text>
                  <Text className="text-slate-400 text-sm mt-1">
                    {item.sets} • {item.reps}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text className="text-slate-400 mt-4">Bu antrenmana henüz hareket eklenmemiş.</Text>
          )}
        </View>

        {/* 4. Başla Butonu */}
       <View className="px-6 mt-8 mb-10">
          <TouchableOpacity 
            onPress={() => router.push(`/session/${id}`)} // YENİ EKLENEN KOD
            className="bg-blue-600 w-full py-4 rounded-2xl items-center shadow-lg shadow-blue-600/30"
          >
            <Text className="text-white font-extrabold text-lg">Antrenmana Başla</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}