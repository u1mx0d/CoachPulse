import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

interface FormFieldProps {
  title: string;
  value: string;
  placeholder?: string;
  handleChangeText: (text: string) => void;
  otherStyles?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric';
}

export default function FormField({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles = '',
  keyboardType = 'default',
}: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = title.toLowerCase().includes('şifre') || title.toLowerCase().includes('password');

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-slate-300 font-medium mb-2">{title}</Text>

      <View className="w-full h-14 px-4 bg-slate-800 rounded-2xl border border-slate-700 focus:border-orange-500 flex-row items-center">
        <TextInput
          className="flex-1 text-white font-medium text-base h-full"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#64748b"
          onChangeText={handleChangeText}
          secureTextEntry={isPassword && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize="none"
        />

        {/* Şifre Göster/Gizle Butonu */}
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text className="text-orange-500 text-xs font-bold pl-2">
              {showPassword ? 'Gizle' : 'Göster'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}