# V-Smart Pay - Mobile Client & AI Support Companion App

Ứng dụng di động dành cho khách hàng trong hệ sinh thái **V-Smart Pay**, được xây dựng dựa trên Expo và React Native. Ứng dụng cung cấp các chức năng cốt lõi về quản lý ví tài chính, chuyển nhận tiền và tích hợp **Trợ thủ AI hỗ trợ trực tuyến (VSmart Chatbot)**.

---

## 🚀 Tính Năng Chính

1. **Quản Lý Ví Tài Chính**:
   - Theo dõi số dư tài khoản theo thời gian thực (VND).
   - Xem lịch sử giao dịch gần đây (Nạp tiền, Rút tiền, Chuyển/Nhận tiền).
   
2. **Chuyển Nhận Tiền Nhanh**:
   - Chuyển tiền tới người dùng khác trong hệ thống qua số tài khoản/ID ví.
   - Tính toán phí giao dịch tự động và hiển thị chi tiết trước khi xác nhận.
   - Cơ chế xác nhận giao dịch an toàn thông qua mã giao dịch (Transaction ID).

3. **Trợ Lý Ảo AI (VSmart Chatbot)**:
   - Tích hợp chatbot AI nổi trực tiếp trong ứng dụng (`FloatingChatbot`).
   - Hỗ trợ công nghệ **AI Streaming** (phản hồi hiển thị theo từng ký tự thời gian thực giống ChatGPT).
   - Truy cập lịch sử hội thoại cũ hoặc tạo phiên chat mới dễ dàng.
   - Tự động nhận diện ý định và cung cấp câu trả lời có nguồn dẫn (RAG - Retrieval-Augmented Generation) liên quan tới tài chính/bảo mật.

4. **Tiện Ích Khác**:
   - Quét mã QR (`scan`) để giao dịch nhanh.
   - Cài đặt tài khoản và cấu hình thông báo.

---

## 🛠️ Công Nghệ Sử Dụng

- **Framework**: [Expo SDK 54](https://docs.expo.dev/versions/v54.0.0/)
- **Runtime**: React Native 0.81 & React 19
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **State Management & API Request**: 
  - [TanStack React Query v5](https://tanstack.com/query/latest) để quản lý cache và trạng thái API.
  - Axios làm HTTP client gọi API đến Backend.
- **Styling**: Vanilla React Native StyleSheet kết hợp với `expo-linear-gradient` cho hiệu ứng giao diện premium.
- **Icons**: `@expo/vector-icons` (Feather, Ionicons, MaterialCommunityIcons).

---

## ⚙️ Cấu Hình Môi Trường (.env)

Tạo file `.env` ở thư mục gốc của dự án mobile:

```env
EXPO_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

> [!IMPORTANT]
> **Lưu ý khi kiểm tra trên thiết bị di động thật (Real Device)**:
> Không sử dụng `localhost` hoặc `127.0.0.1` nếu Backend chạy trên máy tính cá nhân của bạn. Hãy thay thế bằng địa chỉ **IP mạng LAN** của máy tính, ví dụ:
> ```env
> EXPO_PUBLIC_API_BASE_URL=http://192.168.1.10:8000
> ```

---

## 🏃 Khởi Chạy Dự Án

### Yêu cầu hệ thống:
- Node.js 18+
- Điện thoại thật cài sẵn ứng dụng **Expo Go** (tải trên App Store / Google Play) hoặc máy ảo iOS/Android.

### Các bước thực hiện:

1. **Cài đặt thư viện**:
   ```bash
   npm install
   ```

2. **Chạy Metro Bundler**:
   ```bash
   npm run start
   ```

3. **Mở ứng dụng**:
   - Quét mã QR hiển thị trên terminal bằng ứng dụng Expo Go (Android) hoặc Camera mặc định (iOS).
   - Hoặc nhấn `a` để mở trên máy ảo Android, `i` để mở trên máy ảo iOS.

---

## 📁 Cấu Trúc Thư Mục

```txt
fintech-support-app/
├── app/                      # Cấu trúc định tuyến (Expo Router)
│   ├── (auth)/               # Luồng đăng nhập/đăng ký
│   │   ├── _layout.tsx
│   │   └── login.tsx
│   ├── (tabs)/               # Các tab chính trong ứng dụng
│   │   ├── _layout.tsx       # Cấu hình thanh điều hướng dưới cùng (Bottom Tab)
│   │   ├── index.tsx         # Màn hình chính (Dashboard, số dư, GD gần đây)
│   │   ├── scan.tsx          # Màn hình quét mã QR
│   │   ├── settings.tsx      # Cài đặt tài khoản & ứng dụng
│   │   ├── transactions.tsx  # Danh sách lịch sử giao dịch
│   │   └── transfer.tsx      # Lựa chọn nạp/rút/chuyển tiền
│   ├── _layout.tsx           # Root layout, tích hợp Providers (Auth, React Query)
│   ├── index.tsx             # Redirect màn hình theo trạng thái đăng nhập
│   ├── modal.tsx             # Modal dùng chung
│   └── transfer-vsmpay.tsx   # Màn hình chi tiết chuyển tiền V-Smart Pay
│
├── src/                      # Source code logic & components
│   ├── components/           # UI Component dùng chung
│   │   └── floating-chatbot.tsx # Chatbot nổi AI hỗ trợ Streaming & Lịch sử
│   ├── config/               # Cấu hình hệ thống (app-config.ts)
│   ├── hooks/                # Custom hooks tương tác API qua React Query
│   │   ├── use-api.ts        # Axios base wrapper
│   │   ├── use-chat-api.ts   # Các API liên quan tới Chatbot & Phiên chat
│   │   └── use-finance-api.ts# Các API liên quan tới User, Wallet, Transactions
│   └── providers/            # Các Context Provider toàn cục
│       └── auth-provider.tsx # Quản lý Access Token và trạng thái đăng nhập
```

---

## 🔗 Liên Kết Hệ Thống
Ứng dụng di động này tương tác trực tiếp với:
- **Backend API**: Hệ thống ví điện tử Python (`mini-wallet-python`) cung cấp API tài chính và API RAG Chatbot.
- **Admin Dashboard**: Hệ thống CSKH (`VSmartPay-CSKH-Web-Admin-Dashboard`) nơi nhân viên CSKH theo dõi các phiên chat và tiếp quản cuộc trò chuyện khi cần (Human Takeover).
