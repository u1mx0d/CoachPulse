import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addMeal, deleteMeal, getFoodLibrary, getTodayMeals } from '../../lib/appwrite';
import { useAuthStore } from '../../store/authStore';

export default function Nutrition() {
  const { user, targetCalories } = useAuthStore();
  
  const [meals, setMeals] = useState<any[]>([]);
  const [foodDatabase, setFoodDatabase] = useState<any[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [entryMode, setEntryMode] = useState<'search' | 'manual'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  
  // YENİ: quantity (Adet/Porsiyon) state'i eklendi (Varsayılan: 1)
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [quantity, setQuantity] = useState('1'); 
  const [mealType, setMealType] = useState('Kahvaltı');

  const mealTypes = ['Kahvaltı', 'Öğle', 'Akşam', 'Ara Öğün'];

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [user])
  );

  const fetchData = async () => {
    if (!user?.$id) return;
    try {
      const [mealsData, foodsData] = await Promise.all([
        getTodayMeals(user.$id),
        getFoodLibrary()
      ]);
      setMeals(mealsData);
      setFoodDatabase(foodsData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMeal = (mealId: string, foodName: string) => {
    Alert.alert(
      "Öğünü Sil",
      `${foodName} öğününü silmek istediğinize emin misiniz?`,
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive", // iOS'ta butonu kırmızı yapar
          onPress: async () => {
            try {
              setIsLoading(true); // Yüklenme animasyonunu başlat
              await deleteMeal(mealId); // Veritabanından sil
              await fetchData(); // Listeyi güncelle
            } catch (error) {
              alert("Öğün silinirken bir hata oluştu.");
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleAddMeal = async () => {
    if (!foodName || !calories) {
      alert("Lütfen yemek adını ve kalorisini girin.");
      return;
    }

  
    const qty = parseFloat(quantity.replace(',', '.')) || 1; 
    const unitCal = parseInt(calories) || 0;
    const totalCalories = Math.round(qty * unitCal); // Toplam kaloriyi hesapla
    

    const finalFoodName = qty !== 1 ? `${foodName} (x${qty})` : foodName;

    setIsSubmitting(true);
    try {
      await addMeal(user.$id, finalFoodName, totalCalories, mealType);
      
      await fetchData(); 
      setFoodName('');
      setCalories('');
      setQuantity('1'); // Formu sıfırlarken adeti tekrar 1 yap
      setMealType('Kahvaltı');
      setSearchQuery('');
      setEntryMode('search');
      setIsModalVisible(false);
    } catch (error) {
      alert("Yemek eklenirken bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredFoods = foodDatabase.filter(food => 
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectFood = (food: any) => {
    setFoodName(food.name);
    setCalories(food.calories.toString());
    setQuantity('1'); // Yeni besin seçildiğinde adeti 1'e sabitle
    setEntryMode('manual');
  };

  const consumedCalories = meals.reduce((acc, curr) => acc + curr.calories, 0);
  const remainingCalories = targetCalories - consumedCalories;
  const caloriePercent = Math.min(Math.round((consumedCalories / targetCalories) * 100), 100);

  const getMealIcon = (type: string) => {
    switch (type) {
      case 'Kahvaltı': return 'sunny-outline';
      case 'Öğle': return 'partly-sunny-outline';
      case 'Akşam': return 'moon-outline';
      default: return 'cafe-outline';
    }
  };

  // Dinamik Toplam Kalori Göstergesi İçin
  const currentTotalCalories = Math.round((parseFloat(quantity.replace(',', '.')) || 1) * (parseInt(calories) || 0));

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="px-6 mt-6">
          
          <View className="flex-row justify-between items-center mb-8">
            <View>
              <Text className="text-3xl font-extrabold text-white">Beslenme</Text>
              <Text className="text-neutral-400 text-sm mt-1">Bugünkü yakıtın ve kalori takibin</Text>
            </View>
            <TouchableOpacity 
              onPress={() => setIsModalVisible(true)}
              className="w-12 h-12 bg-blue-600 rounded-full items-center justify-center shadow-lg shadow-blue-600/30"
            >
              <Ionicons name="add" size={28} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <View className="bg-neutral-900 rounded-3xl p-6 mb-8 border border-neutral-800 shadow-xl">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-white font-bold text-lg">Günlük Özet</Text>
              <View className="bg-blue-600/10 px-3 py-1 rounded-full border border-blue-600/20">
                <Text className="text-blue-500 font-bold text-xs">{caloriePercent}% Doldu</Text>
              </View>
            </View>

            <View className="flex-row justify-between items-center mb-6">
              <View className="items-center flex-1">
                <Text className="text-neutral-400 text-xs font-medium mb-1">Alınan</Text>
                <Text className="text-2xl font-extrabold text-white">{consumedCalories}</Text>
              </View>
              
              <View className="items-center flex-1 border-x border-neutral-800 px-2">
                <Text className="text-neutral-400 text-xs font-medium mb-1">Kalan</Text>
                <Text className={`text-3xl font-extrabold ${remainingCalories < 0 ? 'text-red-500' : 'text-blue-500'}`}>
                  {remainingCalories > 0 ? remainingCalories : 0}
                </Text>
              </View>

              <View className="items-center flex-1">
                <Text className="text-neutral-400 text-xs font-medium mb-1">Hedef</Text>
                <Text className="text-2xl font-extrabold text-white">{targetCalories}</Text>
              </View>
            </View>

            <View className="h-3 w-full bg-neutral-800 rounded-full overflow-hidden">
              <View className={`h-full rounded-full ${remainingCalories < 0 ? 'bg-red-500' : 'bg-blue-600'}`} style={{ width: `${caloriePercent}%` }} />
            </View>
          </View>

          <Text className="text-xl font-bold text-white mb-4">Bugün Yediklerin</Text>
          
          {isLoading ? (
            <ActivityIndicator color="#3b82f6" className="mt-10" />
          ) : meals.length === 0 ? (
            <View className="bg-neutral-900 rounded-3xl p-8 items-center border border-neutral-800 border-dashed">
              <Ionicons name="restaurant-outline" size={48} color="#525252" className="mb-4" />
              <Text className="text-neutral-400 text-center font-medium">Bugün henüz hiçbir şey yemedin.</Text>
            </View>
          ) : (
            meals.map((meal) => (
              <View key={meal.$id} className="flex-row items-center bg-neutral-900 p-4 rounded-2xl mb-3 border border-neutral-800">
                {/* Sol İkon */}
                <View className="w-12 h-12 bg-blue-600/10 rounded-full items-center justify-center mr-4 border border-blue-600/20">
                  <Ionicons name={getMealIcon(meal.mealType)} size={20} color="#3b82f6" />
                </View>
                
                {/* Orta Kısım: İsim ve Öğün Tipi */}
                <View className="flex-1">
                  <Text className="text-white font-bold text-base" numberOfLines={1}>{meal.foodName}</Text>
                  <Text className="text-neutral-500 text-xs mt-0.5">{meal.mealType}</Text>
                </View>
                
                {/* Sağ Kısım: Kalori ve Silme Butonu */}
                <View className="flex-row items-center">
                  <View className="items-end mr-3">
                    <Text className="text-blue-500 font-extrabold text-lg">{meal.calories} <Text className="text-xs text-neutral-500 font-normal">kcal</Text></Text>
                  </View>
                  
                  {/* YENİ: Silme Butonu */}
                  <TouchableOpacity 
                    onPress={() => handleDeleteMeal(meal.$id, meal.foodName)}
                    className="w-10 h-10 bg-red-500/10 rounded-full items-center justify-center border border-red-500/20"
                  >
                    <Ionicons name="trash-outline" size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

        </View>
      </ScrollView>

      {/* --- YEMEK EKLEME MODALI --- */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 justify-end">
          <TouchableOpacity className="absolute inset-0 bg-black/80" activeOpacity={1} onPress={() => setIsModalVisible(false)} />
          
          <View className="bg-neutral-900 rounded-t-3xl p-6 border-t border-neutral-800 h-[70%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-extrabold text-white">Öğün Ekle</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color="#525252" />
              </TouchableOpacity>
            </View>

            <View className="flex-row bg-black p-1 rounded-2xl mb-6">
              <TouchableOpacity onPress={() => setEntryMode('search')} className={`flex-1 py-3 rounded-xl items-center ${entryMode === 'search' ? 'bg-neutral-800' : ''}`}>
                <Text className={`font-bold ${entryMode === 'search' ? 'text-white' : 'text-neutral-500'}`}>Hazır Seç</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEntryMode('manual')} className={`flex-1 py-3 rounded-xl items-center ${entryMode === 'manual' ? 'bg-neutral-800' : ''}`}>
                <Text className={`font-bold ${entryMode === 'manual' ? 'text-white' : 'text-neutral-500'}`}>Manuel Ekle</Text>
              </TouchableOpacity>
            </View>

            {entryMode === 'search' ? (
              <View className="flex-1">
                <View className="flex-row items-center bg-black rounded-2xl px-4 border border-neutral-800 mb-4">
                  <Ionicons name="search" size={20} color="#525252" />
                  <TextInput 
                    className="flex-1 text-white py-4 px-3"
                    placeholder="Besin ara (Örn: Yulaf)..."
                    placeholderTextColor="#525252"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>
                <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                  {filteredFoods.map(food => (
                    <TouchableOpacity key={food.$id || food.id} onPress={() => handleSelectFood(food)} className="flex-row justify-between items-center bg-black p-4 rounded-2xl mb-3 border border-neutral-800">
                      <Text className="text-white font-medium">{food.name}</Text>
                      <Text className="text-blue-500 font-bold">{food.calories} kcal</Text>
                    </TouchableOpacity>
                  ))}
                  {filteredFoods.length === 0 && (
                    <Text className="text-neutral-500 text-center mt-4">Besin bulunamadı, manuel olarak ekleyebilirsiniz.</Text>
                  )}
                </ScrollView>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text className="text-neutral-400 text-xs font-bold mb-2 ml-1 uppercase">Yemeğin Adı</Text>
                <TextInput 
                  className="bg-black text-white px-4 py-4 rounded-2xl border border-neutral-800 mb-4"
                  placeholder="Örn: 2 Yumurta ve Yulaf"
                  placeholderTextColor="#525252"
                  value={foodName}
                  onChangeText={setFoodName}
                />

                {/* YENİ: Porsiyon ve Birim Kalori Yan Yana */}
                <View className="flex-row gap-4 mb-4">
                  <View className="flex-1">
                    <Text className="text-neutral-400 text-xs font-bold mb-2 ml-1 uppercase">Porsiyon / Adet</Text>
                    <TextInput 
                      className="bg-black text-white px-4 py-4 rounded-2xl border border-neutral-800"
                      placeholder="1"
                      keyboardType="numeric"
                      value={quantity}
                      onChangeText={setQuantity}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-neutral-400 text-xs font-bold mb-2 ml-1 uppercase">Birim Kalori</Text>
                    <TextInput 
                      className="bg-black text-white px-4 py-4 rounded-2xl border border-neutral-800"
                      placeholder="350"
                      keyboardType="numeric"
                      value={calories}
                      onChangeText={setCalories}
                    />
                  </View>
                </View>

                {/* YENİ: Dinamik Toplam Kalori Göstergesi (Sadece çarpan 1'den büyükse ve geçerliyse görünsün) */}
                {currentTotalCalories > 0 && quantity !== '1' && (
                  <View className="bg-blue-600/10 p-4 rounded-2xl border border-blue-600/30 mb-6 flex-row justify-between items-center">
                    <Text className="text-blue-500 font-bold">Hesaplanan Toplam Kalori:</Text>
                    <Text className="text-blue-500 font-extrabold text-xl">{currentTotalCalories} kcal</Text>
                  </View>
                )}

                <Text className="text-neutral-400 text-xs font-bold mb-2 ml-1 uppercase">Öğün Tipi</Text>
                <View className="flex-row flex-wrap justify-between mb-8 gap-y-3">
                  {mealTypes.map((type) => (
                    <TouchableOpacity 
                      key={type}
                      onPress={() => setMealType(type)}
                      className={`w-[48%] py-3 rounded-xl border items-center ${mealType === type ? 'border-blue-600 bg-blue-600/10' : 'border-neutral-800 bg-black'}`}
                    >
                      <Text className={`font-bold ${mealType === type ? 'text-blue-500' : 'text-neutral-400'}`}>{type}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity 
                  onPress={handleAddMeal}
                  disabled={isSubmitting}
                  className="bg-blue-600 w-full py-4 rounded-2xl items-center shadow-lg shadow-blue-600/30 flex-row justify-center mb-6"
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text className="text-white font-extrabold text-lg">Öğünü Kaydet</Text>
                  )}
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}