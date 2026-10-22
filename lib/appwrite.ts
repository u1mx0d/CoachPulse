import { Account, Client, Databases, ID, Query } from 'react-native-appwrite';


const client = new Client();


const appwriteConfig = {
  endpoint: 'https://fra.cloud.appwrite.io/v1', 
  projectId: '6ad8dbe9000ffffaf24f',

  databaseId : '6ad8e722000d46b77516',
  workoutCollectionId : '6ad8e736000a2331328d',

  
  exerciseCollectionId: '6ad8ed020017447040e1',

  completionCollectionId: '6ad8ffa80025e9a4fd2c',

  mealCollectionId : '6ad9e9320015232898ae',

  foodLibraryCollectionId : '6ad9edc70030f1916366',

};


client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform('com.alperen.coachpulse'); 

// 3. Modülleri dışarı aktarıyoruz (Kayıt, Giriş işlemleri için Account modülü)
export const account = new Account(client);
export const databases = new Databases(client);


export const createUser = async (email: string, password: string, name: string) => {
  try {
    
    const newAccount = await account.create(ID.unique(), email, password, name);
    return newAccount;
  } catch (error: any) {
    console.error("Kayıt Hatası:", error);
    throw new Error(error.message); 
  }
};

// 1. Giriş Yapma (Oturum Açma) Fonksiyonu
export const signIn = async (email: string, password: string) => {
  try {
    // 1. Eğer arka planda takılı kalmış aktif bir oturum varsa, önce onu temizle
    try {
      await account.deleteSession('current');
    } catch (e) {
      // Aktif oturum yoksa hata verir, umursama devam et.
    }

    // 2. Yeni oturumu oluştur
    const session = await account.createEmailPasswordSession(email, password);
    
    // 3. Kullanıcı bilgilerini çek
    const currentUser = await account.get();
    
    return currentUser;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// 2. Aktif Kullanıcıyı Getirme Fonksiyonu
export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    return currentAccount;
  } catch (error) {
    console.log("Kullanıcı bulunamadı", error);
    return null;
  }
};

export const signOut = async () => {
  try {
    // Appwrite'daki aktif oturumu (session) bulut üzerinden siler
    const session = await account.deleteSession('current');
    return session;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getLatestWorkout = async () => {
  try {
    const workouts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.workoutCollectionId
    );
    
    // Veritabanındaki ilk antrenmanı döndürüyoruz
    return workouts.documents[0]; 
  } catch (error: any) {
    console.log("Antrenman çekilirken hata:", error);
    throw new Error(error.message);
  }
};

export const getWorkoutExercises = async (workoutId: string) => {
  try {
    const exercises = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.exerciseCollectionId,
   
      [Query.equal('workoutId', workoutId)] 
    );
    
    return exercises.documents;
  } catch (error: any) {
    console.log("Egzersizler çekilirken hata:", error);
    throw new Error(error.message);
  }
};

// Mevcut getLatestWorkout fonksiyonunun altına ekle:

export const getAllWorkouts = async () => {
  try {
    const workouts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.workoutCollectionId
    );
    return workouts.documents; // İlkini değil, tüm diziyi döndürüyoruz
  } catch (error: any) {
    console.log("Tüm antrenmanlar çekilirken hata:", error);
    throw new Error(error.message);
  }
};

export const saveCompletedWorkout = async (userId: string, workoutTitle: string, duration: number) => {
  try {
    // Dakika başına ortalama 8-10 kalori yaktığını varsayan dinamik bir mini algoritma
    const caloriesBurned = duration * 9; 
    const today = new Date().toISOString().split('T')[0];

    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.completionCollectionId,
      ID.unique(),
      {
        userId,
        workoutTitle,
        caloriesBurned,
        date: today,
      }
    );
    return response;
  } catch (error: any) {
    console.log("Antrenman kaydedilirken hata:", error);
    throw new Error(error.message);
  }
};

// 2. Kullanıcının Tamamladığı Antrenmanları Çekme
export const getUserCompletions = async (userId: string) => {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.completionCollectionId,
      [Query.equal('userId', userId)]
    );
    return response.documents;
  } catch (error: any) {
    console.log("Geçmiş çekilirken hata:", error);
    return [];
  }
};

// --- BESLENME (MEALS) FONKSİYONLARI ---

// 1. Yeni Yemek Ekleme
export const addMeal = async (
  userId: string, 
  foodName: string, 
  calories: number, 
  mealType: string
) => {
  try {
    // Bugünün tarihini 'YYYY-MM-DD' formatında alıyoruz
    const today = new Date().toISOString().split('T')[0];

    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.mealCollectionId,
      ID.unique(),
      {
        userId,
        foodName,
        calories,
        mealType,
        date: today,
      }
    );
    return response;
  } catch (error: any) {
    console.log("Yemek eklenirken hata:", error);
    throw new Error(error.message);
  }
};

// 2. Bugünün Yemeklerini Getirme
export const getTodayMeals = async (userId: string) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.mealCollectionId,
      [
        Query.equal('userId', userId),
        Query.equal('date', today) // Sadece bugünün verilerini filtrele!
      ]
    );
    return response.documents;
  } catch (error: any) {
    console.log("Bugünün yemekleri çekilirken hata:", error);
    return [];
  }
};

// --- HAZIR BESİN KÜTÜPHANESİ FONKSİYONU ---
export const getFoodLibrary = async () => {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.foodLibraryCollectionId,
      [Query.limit(100)] // Şimdilik ilk 100 besini çekiyoruz
    );
    return response.documents;
  } catch (error: any) {
    console.log("Besin kütüphanesi çekilirken hata:", error);
    return [];
  }
};

// 3. Yemek Silme
export const deleteMeal = async (mealId: string) => {
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.mealCollectionId,
      mealId
    );
    return true;
  } catch (error: any) {
    console.log("Yemek silinirken hata:", error);
    throw new Error(error.message);
  }
};