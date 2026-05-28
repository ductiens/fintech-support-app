import { Feather, Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type ChatMessage = {
  id: string;
  role: 'bot' | 'user';
  text: string;
};

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'bot',
    text: 'Xin chào! Tôi có thể hỗ trợ bạn tra cứu giao dịch, hạn mức và hướng dẫn chuyển tiền.',
  },
];

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const handleSend = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      text: trimmedMessage,
    };

    const botMessage: ChatMessage = {
      id: `${Date.now()}-bot`,
      role: 'bot',
      text: 'Mình đã nhận được yêu cầu. Tính năng kết nối AI/API thật sẽ được gắn ở bước tiếp theo.',
    };

    setMessages((currentMessages) => [...currentMessages, userMessage, botMessage]);
    setMessage('');
  };

  return (
    <View pointerEvents="box-none" style={styles.overlay}>
      {isOpen ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          pointerEvents="box-none"
          style={styles.chatWindowWrap}>
          <View style={styles.chatWindow}>
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={styles.botAvatar}>
                  <Ionicons name="chatbubble-ellipses" size={20} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={styles.headerTitle}>V-Smart Assistant</Text>
                  <Text style={styles.headerStatus}>Đang hoạt động</Text>
                </View>
              </View>

              <Pressable hitSlop={10} onPress={() => setIsOpen(false)} style={styles.closeButton}>
                <Feather name="x" size={20} color="#111111" />
              </Pressable>
            </View>

            <FlatList
              contentContainerStyle={styles.messageList}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={[styles.messageBubble, item.role === 'user' ? styles.userBubble : styles.botBubble]}>
                  <Text style={[styles.messageText, item.role === 'user' ? styles.userText : styles.botText]}>
                    {item.text}
                  </Text>
                </View>
              )}
              showsVerticalScrollIndicator={false}
            />

            <View style={styles.inputRow}>
              <TextInput
                placeholder="Nhập tin nhắn..."
                placeholderTextColor="#8A8A8A"
                style={styles.input}
                value={message}
                onChangeText={setMessage}
                onSubmitEditing={handleSend}
              />
              <Pressable onPress={handleSend} style={styles.sendButton}>
                <Feather name="send" size={18} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      ) : null}

      <Pressable onPress={() => setIsOpen((currentValue) => !currentValue)} style={styles.floatingButton}>
        <Ionicons name={isOpen ? 'close' : 'chatbubble-ellipses'} size={28} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 112,
    width: 62,
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 31,
    backgroundColor: '#062C20',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 18,
  },
  chatWindowWrap: {
    position: 'absolute',
    right: 14,
    bottom: 188,
  },
  chatWindow: {
    width: 342,
    height: 500,
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 28,
    elevation: 24,
  },
  header: {
    height: 76,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#062C20',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  botAvatar: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
    backgroundColor: '#00B887',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  headerStatus: {
    marginTop: 3,
    color: '#BDEFE0',
    fontSize: 12,
    fontWeight: '600',
  },
  closeButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
  },
  messageList: {
    flexGrow: 1,
    gap: 10,
    padding: 14,
    backgroundColor: '#F6F7F7',
  },
  messageBubble: {
    maxWidth: '82%',
    borderRadius: 18,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  botBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 6,
    backgroundColor: '#062C20',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  botText: {
    color: '#1D1D1D',
  },
  userText: {
    color: '#FFFFFF',
  },
  inputRow: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#ECECEC',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    paddingHorizontal: 16,
    color: '#111111',
    fontSize: 15,
    backgroundColor: '#F3F3F3',
  },
  sendButton: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 23,
    backgroundColor: '#062C20',
  },
});
