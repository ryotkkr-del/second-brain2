import { View, Text, TouchableOpacity } from "react-native";
import { Home, CheckSquare, Calendar, MoreHorizontal } from "lucide-react-native";
import { usePathname, useRouter } from "expo-router";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: CheckSquare, label: "Tasks", href: "/tasks" },
  { icon: Calendar, label: "Schedule", href: "/schedule" },
  { icon: MoreHorizontal, label: "More", href: "/more" },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View className="absolute bottom-0 left-0 right-0 border-t border-zinc-200 bg-white z-20">
      <View className="flex-row items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <TouchableOpacity
              key={item.href}
              onPress={() => router.push(item.href as any)}
              className={cn(
                "flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg",
                isActive ? "text-zinc-900" : "text-zinc-500"
              )}
            >
              <Icon size={20} color={isActive ? "#18181b" : "#71717a"} />
              <Text className={cn("text-xs", isActive ? "text-zinc-900" : "text-zinc-500")} style={{ fontWeight: "500" }}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {/* Home indicator for mobile devices */}
      <View className="h-1 w-32 mx-auto bg-zinc-300 rounded-full mb-1" />
    </View>
  );
}

