import { View } from "react-native";
import { cn } from "@/lib/utils";

interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileContainer({ children, className }: MobileContainerProps) {
  return (
    <View className={cn("flex-1 bg-zinc-50", className)}>
      <View className={cn("flex-1 bg-white", className)}>
        {children}
      </View>
    </View>
  );
}

