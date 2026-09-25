# Hướng dẫn Thiết lập Google OAuth 2.0 & Cấu hình Môi trường TA12
# (Google OAuth 2.0 Setup & Environment Configuration Guide)

Tài liệu này hướng dẫn chi tiết cách tạo và cấu hình ứng dụng Google OAuth 2.0 trên Google Cloud Console, thiết lập các biến môi trường cho Web Học sinh (Port 3000) và Cổng Quản trị Admin (Port 3001), đồng thời giải thích cơ chế bảo mật xác thực mã hóa của hệ thống TA12.

---

## 1. Tạo và Cấu hình Google Cloud Console Project

### Bước 1: Tạo Project mới
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/).
2. Đăng nhập bằng tài khoản Google quản trị (khuyến nghị sử dụng tài khoản `dot71714@gmail.com`).
3. Nhấp vào thanh chọn dự án ở góc trên bên trái -> Chọn **New Project** (Dự án mới).
4. Đặt tên dự án: `TA12 - On Thi Vao 10`.
5. Nhấp **Create** (Tạo).

### Bước 2: Thiết lập OAuth Consent Screen (Màn hình đồng ý OAuth)
1. Trong menu điều hướng bên trái, chọn **APIs & Services** -> **OAuth consent screen**.
2. Chọn **User Type**: **External** (Bên ngoài) -> Nhấp **Create**.
3. Điền thông tin ứng dụng:
   - **App name**: `TA12 - Ôn thi vào 10`
   - **User support email**: `dot71714@gmail.com`
   - **Developer contact information**: `dot71714@gmail.com`
4. Nhấp **Save and Continue** (Lưu và tiếp tục).
5. **Scopes** (Phạm vi truy cập): Nhấp **Add or Remove Scopes**, chọn:
   - `openid`
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - Nhấp **Update** -> **Save and Continue**.
6. **Test Users** (Người dùng thử nghiệm):
   - Thêm email quản trị: `dot71714@gmail.com`
   - Thêm các email học sinh dùng để thử nghiệm.
   - Nhấp **Save and Continue** -> **Back to Dashboard**.

### Bước 3: Tạo OAuth 2.0 Client ID Credentials
1. Trong menu bên trái, chọn **Credentials** (Thông tin xác thực).
2. Nhấp **+ CREATE CREDENTIALS** -> Chọn **OAuth client ID**.
3. Chọn **Application type**: **Web application** (Ứng dụng web).
4. Đặt tên: `TA12 Web Client`.
5. **Authorized JavaScript origins** (Nguồn gốc JavaScript được phép):
   - `http://localhost:3000` (Web Học sinh)
   - `http://localhost:3001` (Cổng Quản trị Admin)
6. **Authorized redirect URIs** (URI chuyển hướng được phép):
   - `http://localhost:3000/api/auth/callback/google`
   - `http://localhost:3001/api/auth/callback/google`
7. Nhấp **Create** (Tạo).
8. Cửa sổ bật lên hiển thị **Client ID** và **Client Secret**. Sao chép cả 2 giá trị này để cấu hình ở bước tiếp theo.

---

## 2. Cấu hình Biến môi trường (Environment Variables)

### 2.1. Cấu hình cho Web Học sinh (Root App - Port 3000)

Tạo tệp `.env.local` tại thư mục gốc của dự án (`/`):

```env
# =============================================================================
# TA12 Student Web Application Environment Configuration
# =============================================================================

# 1. Google OAuth 2.0 Credentials (từ Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-google-client-secret

# 2. Session HMAC Security (Khóa bí mật ký phiên làm việc học sinh)
# Tạo chuỗi ngẫu nhiên an toàn (khuyến nghị 64 ký tự hex)
AUTH_SECRET=ta12_grade10_english_prep_auth_secret_2026_super_secure_key

# 3. Superadmin Master Key & Email (Quản trị viên tối cao)
SUPERADMIN_EMAIL=dot71714@gmail.com
ADMIN_MASTER_KEY=ta12_superadmin_secret_key_2026

# 4. Service URLs
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_URL=http://localhost:3001
```

### 2.2. Cấu hình cho Cổng Quản trị Admin (Admin App - Port 3001)

Tạo tệp `admin/.env.local` tại thư mục `admin/`:

```env
# =============================================================================
# TA12 Dedicated Admin Portal Environment Configuration
# =============================================================================

# 1. Google OAuth 2.0 Credentials (dùng chung Client ID hoặc tạo riêng)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-google-client-secret

# 2. Admin Session Security (Khóa ký phiên Quản trị viên)
AUTH_SECRET=ta12_admin_super_secret_portal_2026_high_security_key

# 3. Superadmin Access Control & Master Key Fallback
SUPERADMIN_EMAIL=dot71714@gmail.com
ADMIN_MASTER_KEY=ta12_superadmin_secret_key_2026

# 4. Port & Service URLs
PORT=3001
NEXT_PUBLIC_STUDENT_PORTAL_URL=http://localhost:3000
```

---

## 3. Kiến trúc Bảo mật & Cơ chế Hoạt động

### 3.1. Xác thực Chữ ký Khóa công khai RS256 Google JWKS
Hệ thống sử dụng thư viện mật mã tích hợp của Node.js (`crypto.createPublicKey` và `crypto.verify`) để kiểm tra toàn vẹn mã hóa `id_token` mà không cần cài đặt thêm các thư viện bên thứ ba:
1. Máy chủ tải danh sách khóa công khai chính thức của Google từ `https://www.googleapis.com/oauth2/v3/certs`.
2. Khóa công khai được lưu vào bộ nhớ đệm (In-Memory Cache) theo tiêu chuẩn `Cache-Control` (mặc định 1 giờ).
3. Khi nhận callback từ Google, hệ thống kiểm tra:
   - Header JWT: thuật toán bắt buộc là `RS256`, trích xuất `kid` (Key ID).
   - Xác minh chữ ký RSA-SHA256 với khóa công khai khớp `kid`.
   - Kiểm tra `iss` bắt buộc thuộc `accounts.google.com` hoặc `https://accounts.google.com`.
   - Kiểm tra `aud` khớp chính xác `GOOGLE_CLIENT_ID`.
   - Kiểm tra `exp` còn hạn sử dụng (`exp > Date.now() / 1000`).
   - Kiểm tra `email_verified === true` do Google xác nhận.

### 3.2. Chống tấn công giả mạo CSRF (State Token)
Khi người dùng bấm "Đăng nhập bằng Google":
1. Máy chủ tạo mã `state` gồm `nonce` ngẫu nhiên, timestamp và `returnUrl`, được ký bằng chữ ký số HMAC-SHA256 bí mật.
2. Mã `state` được gửi kèm URL chuyển hướng đến Google và đồng thời lưu vào cookie HTTP-only `ta12_oauth_state` (Web học sinh) hoặc `ta12_admin_oauth_state` (Web Admin) với thời gian hết hạn 10 phút.
3. Khi Google gọi callback, hệ thống kiểm tra tính hợp lệ của chữ ký HMAC và đối chiếu với cookie để ngăn chặn hoàn toàn tấn công Replay Attack và Cross-Site Request Forgery.

### 3.3. Cổng Quản trị Admin: Zero-Bypass Gate
- **Chỉ duy nhất** tài khoản Google có email `dot71714@gmail.com` với `email_verified: true` mới được cấp phiên làm việc Quản trị viên (`ta12_admin_session`).
- Bất kỳ tài khoản Google nào khác đăng nhập vào Cổng Admin đều bị từ chối với mã **HTTP 403 Forbidden** và hiển thị màn hình cảnh báo bảo mật.
- Cơ chế dự phòng khi chưa cấu hình Google Cloud Client ID (Dev/Local Fallback): Bắt buộc phải nhập đúng **Mật khẩu Quản trị viên Tối cao (Superadmin Master Key)** bí mật. Không có nút bấm 1-click hoặc gửi email tự do nào được phép tồn tại.

### 3.4. Web Học sinh: Kiểm soát Phê duyệt (Approval Gate)
- Học sinh mới đăng nhập bằng Google sẽ được lưu vào SQLite (`data/ta12_users.sqlite`) với trạng thái mặc định là `pending` (Chờ phê duyệt).
- Người dùng có trạng thái `pending` hoặc `rejected` bị khóa cứng tại màn hình `ApprovalWaitingScreen`, không thể truy cập các phòng thi `/exam/[examId]`, chủ điểm `/practice/[topicId]`, hoặc API ghi nhận tiến trình `/api/progress` (trả về mã 403 Forbidden).
- Khi Quản trị viên phê duyệt trên Cổng Admin hoặc nếu email học sinh nằm trong danh sách **Pre-whitelist**, tài khoản sẽ tự động chuyển sang `approved` và được mở khóa toàn bộ nội dung.

---

## 4. Vận hành Ngoại tuyến & Bộ Kiểm thử Tự động (Offline Test Suite)
- Trong môi trường kiểm thử tự động nội bộ (`npm test`), hệ thống tự động sử dụng cơ chế kiểm thử khóa RSA cục bộ (Local JWKS Mock Hook) thông qua hàm `setCachedJWKSForTesting`, cho phép kiểm tra toàn diện 100% tính nguyên vẹn của chữ ký mật mã RS256 mà không phát sinh bất kỳ yêu cầu mạng nào ra bên ngoài, đảm bảo tiêu chuẩn vận hành độc lập offline và độ tin cậy tuyệt đối.
