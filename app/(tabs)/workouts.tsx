import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAllWorkouts } from '../../lib/appwrite';

export default function Workouts() {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tümü');

  const categories = ['Tümü', 'Hipertrofi', 'Kardiyo', 'Güç', 'Esneme'];

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const data = await getAllWorkouts();
        setWorkouts(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  // Arama ve Kategoriye göre filtreleme işlemi
  const filteredWorkouts = workouts.filter(workout => {
    const matchesSearch = workout.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'Tümü' || workout.type === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Başlık */}
        <View className="px-6 mt-8 mb-6">
          <Text className="text-3xl font-extrabold text-white">Keşfet</Text>
          <Text className="text-neutral-400 mt-1">Sana uygun antrenmanı bul</Text>
        </View>

        {/* Arama Çubuğu */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center bg-neutral-900 rounded-2xl px-4 py-3 border border-neutral-800">
            <Ionicons name="search" size={20} color="#525252" />
            <TextInput 
              className="flex-1 text-white ml-3"
              placeholder="Antrenman ara..."
              placeholderTextColor="#525252"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Kategoriler (Yatay Kaydırma) */}
        <View className="mb-6">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6">
            {categories.map((item, index) => (
              <TouchableOpacity 
                key={index}
                onPress={() => setActiveCategory(item)}
                className={`px-5 py-2.5 rounded-full mr-3 border ${
                  activeCategory === item ? 'bg-blue-600 border-blue-600' : 'bg-neutral-900 border-neutral-800'
                }`}
              >
                <Text className={`font-bold ${activeCategory === item ? 'text-white' : 'text-neutral-400'}`}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
            {/* Scroll'un sonundaki boşluğu ayarlamak için sahte kutu */}
            <View className="w-6" />
          </ScrollView>
        </View>

        {/* Antrenman Listesi */}
        <View className="px-6">
          {isLoading ? (
            <ActivityIndicator size="large" color="#3b82f6" className="mt-10" />
          ) : filteredWorkouts.length > 0 ? (
            filteredWorkouts.map((workout) => (
              <TouchableOpacity 
                key={workout.$id}
                activeOpacity={0.7}
                onPress={() => router.push(`/workout/${workout.$id}`)}
                className="bg-neutral-900 rounded-2xl p-5 border border-neutral-800 flex-row items-center justify-between mb-4"
              >
                <View className="flex-1">
                  <View className="bg-blue-600/10 self-start px-2.5 py-1 rounded-md mb-2 border border-blue-600/20">
                    <Text className="text-blue-500 text-xs font-bold uppercase tracking-wider">
                      {workout.type}
                    </Text>
                  </View>
                  <Text className="text-lg font-bold text-white mb-1">
                    {workout.title}
                  </Text>
                  <Text className="text-neutral-400 text-sm">
                    {workout.duration} Dakika • {workout.level}
                  </Text>
                </View>
                
                <View className="w-12 h-12 bg-neutral-800 rounded-full items-center justify-center ml-4">
                  <Ionicons name="play" size={20} color="#3b82f6" />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View className="items-center justify-center mt-10">
              <Ionicons name="barbell-outline" size={48} color="#525252" />
              <Text className="text-neutral-400 mt-4 text-center">Bu kriterlere uygun antrenman bulunamadı.</Text>
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}