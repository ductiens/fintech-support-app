import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useSendMoney } from "@/src/hooks/use-finance-api";

function formatVND(value: string) {
  if (!value) return "";
  const n = value.replace(/\D/g, "");
  return n.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export default function TransferVsmPayScreen() {
  const router = useRouter();
  const [amountRaw, setAmountRaw] = useState(""); // digits only
  const [amountDisplay, setAmountDisplay] = useState("");
  const [recipient, setRecipient] = useState("");
  const [note, setNote] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [txId, setTxId] = useState("");

  const { mutateAsync: sendMoney } = useSendMoney();

  const feePercent = 0.005; // example fee

  const onChangeAmount = (text: string) => {
    const digits = text.replace(/\D/g, "");
    setAmountRaw(digits);
    setAmountDisplay(formatVND(digits));
  };

  const amountNumber = Number(amountRaw || 0);
  const fee = Math.max(Math.round(amountNumber * feePercent), amountNumber > 0 ? 1000 : 0);
  const total = amountNumber > 0 ? amountNumber + fee : 0;

  const canSend = amountNumber > 0 && recipient.trim().length >= 6;

  const openConfirm = () => {
    if (!canSend) return;
    setShowConfirm(true);
  };

  const doSend = async () => {
    setLoading(true);
    try {
      const response = await sendMoney({
        amount: amountNumber,
        type: "TRANSFER",
        recipient_user_id: recipient.trim(),
        description: note.trim() || undefined,
        idempotency_key: `idem_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      });

      // Response has a "data" property with TransactionResponseData
      if (response && response.transaction_id) {
        setTxId(response.transaction_id);
      } else {
        setTxId(`TX-${Date.now().toString().slice(-6)}`);
      }
      
      setSuccess(true);
      // reset form
      setAmountRaw("");
      setAmountDisplay("");
      setRecipient("");
      setNote("");
      setShowConfirm(false);
    } catch (error: any) {
      Alert.alert(
        "Chuyển tiền thất bại",
        error.message || "Đã xảy ra lỗi trong quá trình thực hiện giao dịch."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
      <SafeAreaView style={styles.root}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={22} color="#111" />
          </Pressable>
          <Text style={styles.title}>Chuyển tiền — Ví V-Smart Pay</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Số tiền (VND)</Text>
          <TextInput
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#B0B0B0"
            style={styles.amountInput}
            value={amountDisplay}
            onChangeText={onChangeAmount}
          />

          <Text style={styles.label}>Người nhận (Số ví hoặc tên)</Text>
          <TextInput style={styles.input} value={recipient} onChangeText={setRecipient} placeholder="Nhập số ví hoặc tên" placeholderTextColor="#B0B0B0" />

          <Text style={styles.label}>Lời nhắn (tùy chọn)</Text>
          <TextInput style={styles.input} value={note} onChangeText={setNote} placeholder="Ví dụ: Thanh toán đơn hàng #123" placeholderTextColor="#B0B0B0" />

          {/* <View style={styles.previewRow}>
            <View>
              <Text style={styles.previewLabel}>Phí</Text>
              <Text style={styles.previewValue}>{fee > 0 ? formatVND(String(fee)) + ' đ' : '-'} </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.previewLabel}>Tổng phí + tiền</Text>
              <Text style={styles.totalValue}>{total > 0 ? formatVND(String(total)) + ' đ' : '-'} </Text>
            </View>
          </View> */}

          <Pressable style={[styles.sendButton, !canSend && styles.sendButtonDisabled]} onPress={openConfirm} disabled={!canSend}>
            <Text style={styles.sendButtonText}>{canSend ? 'Xác nhận' : 'Nhập thông tin'}</Text>
          </Pressable>
        </View>

        {/* Confirm modal */}
        <Modal visible={showConfirm} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Xác nhận chuyển tiền</Text>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Số tiền</Text>
                <Text style={styles.modalValue}>{formatVND(String(amountNumber))} đ</Text>
              </View>
              {/* <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Phí</Text>
                <Text style={styles.modalValue}>{fee > 0 ? formatVND(String(fee)) + ' đ' : '-'}</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Tổng</Text>
                <Text style={[styles.modalValue, { fontWeight: '900' }]}>{total > 0 ? formatVND(String(total)) + ' đ' : '-'}</Text>
              </View> */}
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Người nhận</Text>
                <Text style={styles.modalValue}>{recipient}</Text>
              </View>
              {note ? (
                <View style={[styles.modalRow, { marginTop: 8 }]}> 
                  <Text style={styles.modalLabel}>Lời nhắn</Text>
                  <Text style={styles.modalValue}>{note}</Text>
                </View>
              ) : null}

              <View style={styles.modalActions}>
                <Pressable onPress={() => setShowConfirm(false)} style={styles.modalCancel}>
                  <Text style={styles.modalCancelText}>Quay lại</Text>
                </Pressable>
                <Pressable onPress={doSend} style={styles.modalConfirm}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.modalConfirmText}>Gửi</Text>}
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* Success modal */}
        <Modal visible={success} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.successCard}>
              <Text style={styles.successTitle}>Giao dịch thành công</Text>
              <Text style={styles.successId}>{txId}</Text>
              <Pressable style={styles.successButton} onPress={() => { setSuccess(false); router.push('/transactions'); }}>
                <Text style={styles.successButtonText}>Xem lịch sử</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FAFBFC' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 18, paddingBottom: 12 },
  backButton: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 21, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#ECEFF1' },
  title: { flex: 1, textAlign: 'left', marginLeft: 12, color: '#0B0B0B', fontSize: 18, fontWeight: '800' },
  form: { paddingHorizontal: 20, paddingTop: 20 },
  label: { color: '#7A7A7A', fontSize: 13, fontWeight: '700', marginTop: 16 },
  amountInput: { marginTop: 8, fontSize: 28, fontWeight: '800', color: '#111111', paddingVertical: 8 },
  input: { marginTop: 8, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EEF0F2' },
  previewRow: { marginTop: 18, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 6 },
  previewLabel: { color: '#8A8A8A', fontSize: 13, fontWeight: '600' },
  previewValue: { color: '#111', fontSize: 14, fontWeight: '800', marginTop: 6 },
  totalValue: { color: '#062C20', fontSize: 16, fontWeight: '900', marginTop: 6 },
  sendButton: { marginTop: 28, height: 52, borderRadius: 12, backgroundColor: '#062C20', alignItems: 'center', justifyContent: 'center' },
  sendButtonDisabled: { backgroundColor: '#AFC3B8' },
  sendButtonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.36)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  modalCard: { width: '100%', borderRadius: 12, backgroundColor: '#FFFFFF', padding: 18 },
  modalTitle: { fontSize: 16, fontWeight: '800', marginBottom: 12 },
  modalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  modalLabel: { color: '#7A7A7A', fontSize: 13, fontWeight: '600' },
  modalValue: { color: '#111', fontSize: 14, fontWeight: '700' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 },
  modalCancel: { flex: 1, marginRight: 8, height: 46, borderRadius: 10, backgroundColor: '#F3F4F5', alignItems: 'center', justifyContent: 'center' },
  modalCancelText: { color: '#111', fontWeight: '700' },
  modalConfirm: { flex: 1, marginLeft: 8, height: 46, borderRadius: 10, backgroundColor: '#062C20', alignItems: 'center', justifyContent: 'center' },
  modalConfirmText: { color: '#FFF', fontWeight: '800' },

  successCard: { width: '100%', borderRadius: 12, backgroundColor: '#FFFFFF', padding: 18, alignItems: 'center' },
  successTitle: { fontSize: 16, fontWeight: '900', color: '#062C20' },
  successId: { marginTop: 8, color: '#444', fontWeight: '700' },
  successButton: { marginTop: 16, height: 44, borderRadius: 10, backgroundColor: '#062C20', paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center' },
  successButtonText: { color: '#FFF', fontWeight: '800' },
});