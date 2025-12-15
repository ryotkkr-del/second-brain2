import { View, TextInput, TouchableOpacity } from "react-native";
import { Mic, Send } from "lucide-react-native";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend?: (message: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export function ChatInput({ 
  onSend, 
  placeholder = "今、何を考えていますか?",
  isLoading = false,
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSend?.(message.trim());
      setMessage("");
    }
  };

  return (
    <View className="absolute bottom-16 left-0 right-0 px-4 pb-2 bg-white z-10">
      <View className="flex-row items-center gap-2">
        {/* Microphone button */}
        <TouchableOpacity
          className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-100 items-center justify-center"
          aria-label="音声入力"
        >
          <Mic size={20} color="#3f3f46" />
        </TouchableOpacity>

        {/* Input field */}
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder={placeholder}
          placeholderTextColor="#71717a"
          editable={!isLoading}
          className={cn(
            "flex-1 h-12 px-4 rounded-full bg-zinc-100",
            "border border-transparent text-sm",
            isLoading && "opacity-50"
          )}
          style={{ fontSize: 14 }}
        />

        {/* Send button */}
        <TouchableOpacity
          onPress={handleSend}
          disabled={!message.trim() || isLoading}
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-full items-center justify-center",
            message.trim()
              ? "bg-zinc-900"
              : "bg-zinc-100"
          )}
          aria-label="送信"
        >
          <Send size={20} color={message.trim() ? "#ffffff" : "#a1a1aa"} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

