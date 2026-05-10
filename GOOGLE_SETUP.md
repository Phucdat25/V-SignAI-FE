# Google Sign-In Setup Guide

## ✅ Backend đã có sẵn Google Client ID

Backend của bạn đã có Google Client ID: `367800881851-0vas7cftbs3afhorluk2u9ipp4btttm9.apps.googleusercontent.com`

## 1. Cấu hình Google Console với Client ID có sẵn

### Bước 1: Truy cập Google Cloud Console
1. Mở trình duyệt và truy cập: https://console.cloud.google.com/
2. Đăng nhập bằng tài khoản Google của bạn

### Bước 2: Tìm Project chứa Client ID
1. Trong menu bên trái, chọn "APIs & Services" > "Credentials"
2. Tìm Client ID: `367800881851-0vas7cftbs3afhorluk2u9ipp4btttm9.apps.googleusercontent.com`
3. Nếu không thấy, có thể Client ID này đã được tạo trong project khác

### Bước 3: Cập nhật Authorized Origins
1. Click vào Client ID để edit
2. **Authorized JavaScript origins:**
   - Thêm: `http://localhost:5173` (dev server hiện tại)
   - Thêm: `https://yourdomain.com` (production)
3. **Authorized redirect URIs:**
   - Thêm: `http://localhost:5173` (dev server hiện tại)
   - Thêm: `https://yourdomain.com` (production)
4. Click "Save"

## 2. Frontend đã được cấu hình

File `.env` đã có Client ID đúng:
```
VITE_GOOGLE_CLIENT_ID=367800881851-0vas7cftbs3afhorluk2u9ipp4btttm9.apps.googleusercontent.com
```

## 3. Test

1. Restart dev server: `npm run dev`
2. Truy cập: http://localhost:5173/login
3. Click nút "Continue with Google"
4. Chọn tài khoản Google để đăng nhập

1. Restart dev server: `npm run dev`
2. Truy cập: http://localhost:5173/login
3. Click nút "Continue with Google"
4. Chọn tài khoản Google để đăng nhập

## 4. Troubleshooting

### Lỗi "invalid_client"
- ✅ Kiểm tra Client ID có đúng format không
- ✅ Kiểm tra đã thêm `http://localhost:5175` vào Authorized origins chưa
- ✅ Kiểm tra project đã enable Google Sign-In API chưa

### Lỗi "Origin not allowed"
- ✅ Thêm `http://localhost:5173` vào Authorized JavaScript origins
- ✅ Restart dev server sau khi thay đổi .env

### Nút Google không hiển thị
- ✅ Kiểm tra console browser có lỗi gì không
- ✅ Kiểm tra Client ID có trong .env không
- ✅ Kiểm tra script Google đã load chưa

## 5. Production Deployment

Đừng quên:
- Thêm domain thật vào Authorized origins
- Cập nhật VITE_GOOGLE_CLIENT_ID với production Client ID nếu khác