import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getLatestWorkout, getTodayMeals, getUserCompletions } from '../../lib/appwrite';
import { useAuthStore } from '../../store/authStore';

export default function Dashboard() {
  const { user, targetCalories } = useAuthStore();
  const router = useRouter();
  
  const [latestWorkout, setLatestWorkout] = useState<any>(null);
  const [completions, setCompletions] = useState<any[]>([]);
  const [todayMeals, setTodayMeals] = useState<any[]>([]); 
  const [isLoading, setIsLoading] = useState(true);


  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const workoutData = await getLatestWorkout();
          setLatestWorkout(workoutData);

          if (user?.$id) {
            const userCompletions = await getUserCompletions(user.$id);
            setCompletions(userCompletions);
            
            // Bugünün yemeklerini çekiyoruz
            const mealsData = await getTodayMeals(user.$id);
            setTodayMeals(mealsData);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }, [user])
  );


  const totalCompleted = completions.length;
  const totalCaloriesBurned = completions.reduce((acc, curr) => acc + curr.caloriesBurned, 0);
  const progressPercent = Math.min(Math.round((totalCompleted / 5) * 100), 100);


  const consumedCalories = todayMeals.reduce((acc, curr) => acc + curr.calories, 0);
  const caloriePercent = Math.min(Math.round((consumedCalories / targetCalories) * 100), 100);


  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="px-6 mt-6">
          
          {/* 1. Header */}
          <View className="flex-row justify-between items-center mb-8">
            <View>
              <Text className="text-neutral-400 text-sm font-medium mb-1">
                Günaydın, Harika Görünüyorsun 🔥
              </Text>
              <Text className="text-3xl font-extrabold text-white">
                {user?.name || 'Sporcu'}
              </Text>
            </View>
            
            <TouchableOpacity 
              onPress={() => router.push('/(tabs)/profile')}
              className="w-12 h-12 bg-neutral-900 rounded-full items-center justify-center border border-neutral-800"
            >
              <Text className="text-blue-500 font-bold text-lg">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 2. Günlük Kalori / Beslenme İlerleme Barı */}
          <View className="bg-neutral-900 rounded-3xl p-6 mb-6 border border-neutral-800 shadow-xl">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <View className="w-8 h-8 bg-blue-600/10 rounded-full items-center justify-center mr-3">
                  <Ionicons name="restaurant" size={16} color="#3b82f6" />
                </View>
                <Text className="text-white font-bold text-lg">Günlük Kalori Bütçesi</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/(tabs)/nutrition')}>
                <Text className="text-blue-500 font-bold text-xs">Beslenmeye Git</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-between items-end mb-4">
              <View>
                <Text className="text-3xl font-extrabold text-white">
                  {consumedCalories} <Text className="text-neutral-500 text-xl">/ {targetCalories} kcal</Text>
                </Text>
                <Text className="text-neutral-400 text-xs mt-1">Alınan / Hedeflenen Kalori</Text>
              </View>
              <View className="items-end">
                <Text className="text-blue-500 font-bold text-base">%{caloriePercent}</Text>
              </View>
            </View>

            {/* Kalori İlerleme Çubuğu */}
            <View className="h-2.5 w-full bg-neutral-800 rounded-full overflow-hidden">
              <View className="h-full bg-blue-600 rounded-full" style={{ width: `${caloriePercent}%` }} />
            </View>
          </View>

          {/* 3. Haftalık Hedef Kartı */}
          <View className="bg-neutral-900 rounded-3xl p-6 mb-8 border border-neutral-800 shadow-xl">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white font-bold text-lg">Haftalık Antrenman</Text>
              <View className="bg-blue-600/10 px-3 py-1 rounded-full border border-blue-600/20">
                <Text className="text-blue-500 font-bold text-xs">Aktif Takip</Text>
              </View>
            </View>

            <View className="flex-row justify-between items-end mb-4">
              <View>
                <Text className="text-4xl font-extrabold text-white">{totalCompleted} <Text className="text-neutral-500 text-2xl">/ 5</Text></Text>
                <Text className="text-neutral-400 text-sm mt-1">Antrenman Tamamlandı</Text>
              </View>
              <View className="items-end">
                <Text className="text-blue-500 font-bold text-lg">%{progressPercent}</Text>
              </View>
            </View>

            <View className="h-2.5 w-full bg-neutral-800 rounded-full overflow-hidden">
              <View className="h-full bg-blue-600 rounded-full" style={{ width: `${progressPercent}%` }} />
            </View>
          </View>

          {/* 4. Öne Çıkan Antrenman */}
          <View className="mb-8">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-white">Öne Çıkan Antrenman</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/workouts')}>
                <Text className="text-blue-500 font-bold text-sm">Tümünü Gör</Text>
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <View className="bg-neutral-900 rounded-3xl p-8 items-center justify-center border border-neutral-800">
                <ActivityIndicator color="#3b82f6" />
              </View>
            ) : latestWorkout ? (
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => router.push(`/workout/${latestWorkout.$id}`)}
                className="bg-neutral-900 rounded-3xl p-6 border border-neutral-800 shadow-xl"
              >
                <View className="flex-row justify-between items-start mb-4">
                  <View className="bg-blue-600/10 px-3 py-1.5 rounded-xl border border-blue-600/20">
                    <Text className="text-blue-500 text-xs font-bold uppercase tracking-wider">
                      {latestWorkout.type}
                    </Text>
                  </View>
                  <View className="w-10 h-10 bg-blue-600 rounded-full items-center justify-center shadow-lg">
                    <Ionicons name="play" size={18} color="#ffffff" />
                  </View>
                </View>
                <Text className="text-2xl font-extrabold text-white mb-2">{latestWorkout.title}</Text>
                <View className="flex-row items-center">
                  <Text className="text-neutral-400 text-sm font-medium">
                    ⏱ {latestWorkout.duration} Dakika  •  ⚡ {latestWorkout.level}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}
          </View>

          {/* 5. Aktivite Özeti */}
          <Text className="text-xl font-bold text-white mb-4">Aktivite Özeti</Text>
          <View className="flex-row gap-4">
            <View className="flex-1 bg-neutral-900 p-5 rounded-3xl border border-neutral-800">
              <View className="w-10 h-10 bg-blue-600/10 rounded-2xl items-center justify-center mb-3">
                <Ionicons name="flame" size={20} color="#3b82f6" />
              </View>
              <Text className="text-neutral-400 text-xs font-medium mb-1">Yakılan Kalori</Text>
              <Text className="text-2xl font-extrabold text-white">{totalCaloriesBurned} <Text className="text-sm font-normal text-neutral-500">kcal</Text></Text>
            </View>

            <View className="flex-1 bg-neutral-900 p-5 rounded-3xl border border-neutral-800">
              <View className="w-10 h-10 bg-green-500/10 rounded-2xl items-center justify-center mb-3">
                <Ionicons name="barbell" size={20} color="#10b981" />
              </View>
              <Text className="text-neutral-400 text-xs font-medium mb-1">Toplam İdman</Text>
              <Text className="text-2xl font-extrabold text-white">{totalCompleted} <Text className="text-sm font-normal text-neutral-500">Adet</Text></Text>
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}