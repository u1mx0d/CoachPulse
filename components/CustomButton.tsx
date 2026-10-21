import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';

interface CustomButtonProps {
  title: string;
  handlePress: () => void;
  containerStyles?: string;
  textStyles?: string;
  isLoading?: boolean;
}

export default function CustomButton({
  title,
  handlePress,
  containerStyles = '',
  textStyles = '',
  isLoading = false,
}: CustomButtonProps) {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-orange-500 rounded-2xl min-h-[56px] justify-center items-center ${containerStyles} ${
        isLoading ? 'opacity-50' : ''
      }`}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <Text className={`text-white font-extrabold text-base ${textStyles}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}