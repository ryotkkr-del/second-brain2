import { MobileContainer } from "@/components/mobile-container.native";
import { BottomNav } from "@/components/bottom-nav.native";
import { View, Text } from "react-native";

export default function MorePage() {
  return (
    <MobileContainer>
      <View className="sticky top-0 z-10 bg-white border-b border-zinc-200">
        <View className="px-4 py-4">
          <Text className="text-xl font-semibold text-center">More</Text>
        </View>
      </View>
      <View className="p-4">
        <Text className="text-zinc-500 text-center mt-8">設定はここに表示されます</Text>
      </View>
      <BottomNav />
    </MobileContainer>
  );
}

