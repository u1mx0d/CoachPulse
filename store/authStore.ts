import { create } from 'zustand';

// 1. Tip Tanımlaması: targetCalories ve setTargetCalories eklendi
interface AuthState {
  user: any | null;       
  isLoading: boolean;     
  isLogged: boolean;      
  
  // YENİ: Kalori bütçesi için global state
  targetCalories: number;
  
  // Aksiyonlar
  setUser: (user: any) => void;
  setIsLogged: (status: boolean) => void;
  setTargetCalories: (calories: number) => void; // YENİ
  logout: () => void;
}

// 2. Zustand Store (Global Hafıza) Oluşturulması
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true, 
  isLogged: false,
  
  // YENİ: Varsayılan kalori hedefi
  targetCalories: 2400,

  // Değerleri güncelleyen fonksiyonlar
  setUser: (user) => set({ user: user }),
  setIsLogged: (status) => set({ isLogged: status }),
  
  // YENİ: Kalori güncelleyici
  setTargetCalories: (calories) => set({ targetCalories: calories }),
  
  // Çıkış yapıldığında kalori hedefini de sıfırlayabiliriz veya aynı bırakabiliriz
  logout: () => set({ user: null, isLogged: false, targetCalories: 2400 })
}));