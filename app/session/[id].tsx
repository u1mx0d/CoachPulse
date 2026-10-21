import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // <-- YENİ EKLENEN
import { getWorkoutExercises, saveCompletedWorkout } from '../../lib/appwrite';
import { useAuthStore } from '../../store/authStore';

export default function ActiveSession() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { user } = useAuthStore();

  const [exercises, setExercises] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Hareketleri buluttan çek
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        if (typeof id === 'string') {
          const data = await getWorkoutExercises(id);
          setExercises(data);
        }
      } catch (error) {
        console.log("Hareketler çekilemedi:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExercises();
  }, [id]);

  // Sonraki Harekete Geç veya Bitir
  const handleNext = async () => {
  if (currentIndex < exercises.length - 1) {
    setCurrentIndex(prev => prev + 1);
  } else {
    try {
      // Antrenman süresini dinamik alalım veya varsayılan 30 dk verelim
      if (user?.$id) {
        await saveCompletedWorkout(user.$id, "Aktif Antrenman", 30);
      }
      alert("Tebrikler! Antrenman başarıyla kaydedildi.");
      router.replace('/'); 
    } catch (error) {
      alert("Kayıt sırasında bir hata oluştu.");
      router.replace('/');
    }
  }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-neutral-400 mt-4 font-medium">Antrenman Hazırlanıyor...</Text>
      </SafeAreaView>
    );
  }

  if (exercises.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-black justify-center items-center px-6">
        <Text className="text-white text-center">Bu antrenmana ait hareket bulunamadı.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-6 bg-blue-600 px-6 py-3 rounded-xl">
          <Text className="text-white font-bold">Geri Dön</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const currentExercise = exercises[currentIndex];
  const isLastExercise = currentIndex === exercises.length - 1;

  return (
    <SafeAreaView className="flex-1 bg-black flex-col justify-between">
      
      {/* Üst Bar: İlerleme ve Çıkış */}
      <View className="px-6 mt-6 flex-row justify-between items-center">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 bg-neutral-900 rounded-full items-center justify-center border border-neutral-800"
        >
          <Ionicons name="close" size={24} color="#ef4444" />
        </TouchableOpacity>
        
        <View className="bg-neutral-900 px-4 py-2 rounded-full border border-neutral-800">
          <Text className="text-blue-500 font-bold">
            Hareket {currentIndex + 1} / {exercises.length}
          </Text>
        </View>
      </View>

      {/* Orta Kısım: Odaklanılan Hareket */}
      <View className="px-6 items-center flex-1 justify-center">
        <View className="w-24 h-24 bg-blue-600/20 rounded-full items-center justify-center mb-6 border border-blue-600/30">
          <Ionicons name="barbell" size={48} color="#3b82f6" />
        </View>
        
        <Text className="text-4xl font-extrabold text-white text-center mb-4">
          {currentExercise.name}
        </Text>
        
        <View className="flex-row gap-4 mt-2">
          <View className="bg-neutral-900 px-6 py-3 rounded-2xl border border-neutral-800 items-center">
            <Text className="text-neutral-500 text-xs mb-1 uppercase font-bold">Set</Text>
            <Text className="text-white font-extrabold text-xl">{currentExercise.sets}</Text>
          </View>
          <View className="bg-neutral-900 px-6 py-3 rounded-2xl border border-neutral-800 items-center">
            <Text className="text-neutral-500 text-xs mb-1 uppercase font-bold">Tekrar</Text>
            <Text className="text-white font-extrabold text-xl">{currentExercise.reps}</Text>
          </View>
        </View>
      </View>

      {/* Alt Kısım: İleri Butonu */}
      <View className="px-6 mb-10 mt-auto">
        <TouchableOpacity 
          onPress={handleNext}
          className={`${isLastExercise ? 'bg-green-500' : 'bg-blue-600'} w-full py-5 rounded-2xl items-center flex-row justify-center shadow-lg`}
        >
          <Text className="text-white font-extrabold text-xl mr-2">
            {isLastExercise ? 'Antrenmanı Bitir' : 'Sonraki Hareket'}
          </Text>
          <Ionicons name={isLastExercise ? "checkmark-circle" : "arrow-forward-circle"} size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}