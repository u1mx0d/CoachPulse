import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { ColorValue, Platform, View } from 'react-native';

const TabIcon = ({ 
  icon, 
  color, 
  focused 
}: { 
  icon: keyof typeof Ionicons.glyphMap, 
  color: ColorValue | string, 
  focused: boolean 
}) => {
  return (
    <View className={`items-center justify-center w-12 h-12 rounded-full mt-4 ${focused ? 'bg-blue-600' : 'bg-transparent'}`}>
      <Ionicons name={icon} size={24} color={focused ? '#ffffff' : color} />
    </View>
  );
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 25 : 20,
          left: 20,
          right: 20,
          backgroundColor: '#171717', 
          borderRadius: 40,
          height: 70,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOpacity: 0.5, 
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 5 },
        },
        tabBarActiveTintColor: '#ffffff', 
        tabBarInactiveTintColor: '#737373', 
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={focused ? "home" : "home-outline"} color={color} focused={focused} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="workouts"
        options={{
          title: 'Antrenman',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={focused ? "barbell" : "barbell-outline"} color={color} focused={focused} />
          ),
        }}
      />

      {/* YENİ EKLENEN BESLENME SEKMESİ */}
      <Tabs.Screen
        name="nutrition"
        options={{
          title: 'Beslenme',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={focused ? "restaurant" : "restaurant-outline"} color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={focused ? "person" : "person-outline"} color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}