# React Native Base App

Base này được dựng từ Expo + Expo Router để tái sử dụng cho nhiều dự án mobile.

## Tech stack

- Expo SDK 54
- React Native 0.81
- React 19
- TypeScript strict mode
- Expo Router file-based routing

## Run project

```bash
npm install
npm run start
```

Mở app bằng Expo Go, iOS simulator, Android emulator hoặc web tuỳ môi trường.

## Folder structure

```txt
app/
  _layout.tsx          # Root layout, providers, navigation stack
  index.tsx            # Redirect theo trạng thái đăng nhập
  (auth)/              # Auth flow
    _layout.tsx
    login.tsx
  (tabs)/              # Main app tabs
    _layout.tsx
    index.tsx
    settings.tsx

src/
  components/          # UI dùng lại nhiều nơi
    app-button.tsx
    screen.tsx
  config/              # App/env config
    app-config.ts
  hooks/               # Custom hooks
    use-api.ts
  lib/                 # Core libraries/wrappers
    api-client.ts
  providers/           # Global providers
    auth-provider.tsx
```

## How to use for a new project

1. Đổi `name`, `slug`, `scheme` trong `app.json`.
2. Đổi `name` trong `package.json`.
3. Sửa `EXPO_PUBLIC_API_BASE_URL` theo backend của dự án.
4. Thay mock login trong `src/providers/auth-provider.tsx` bằng API thật.
5. Thêm màn hình mới trong `app/` theo routing của Expo Router.
6. Thêm UI dùng chung vào `src/components/`.
7. Thêm logic gọi API theo module vào `src/features/<feature-name>/` nếu dự án lớn.

## Environment variables

Tạo file `.env`:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:8000
```

Lưu ý khi test trên điện thoại thật: không dùng `localhost` nếu backend chạy trên laptop. Hãy dùng IP LAN của laptop, ví dụ:

```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.10:8000
```

## Recommended feature structure

Khi app lớn hơn, nên tổ chức theo feature:

```txt
src/features/auth/
  api.ts
  types.ts

src/features/chat/
  api.ts
  types.ts
  components/

src/features/profile/
  api.ts
  types.ts
```

Cách này giúp base dùng được cho fintech, ecommerce, chat app, admin app hoặc app học tập.
