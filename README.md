# 🎓 Student Information Management System (SIMS)

Hệ thống Quản lý Thông tin Sinh viên (SIMS) được xây dựng theo mô hình kiến trúc chuẩn Doanh nghiệp Full-Stack: **ASP.NET Core .NET 8 Web API (Backend C#)** kết hợp với **React 19 + TypeScript + Vite (Frontend)** và CSDL **MySQL**.

---

## 📂 1. Cấu trúc Dự án (Project Layout)

Dự án được tổ chức theo cấu trúc chuẩn Đa nền tảng (Cross-Platform):

```text
SIMS-Student-Information-Management-System-main/
├── README.md                     # Tài liệu hướng dẫn dự án
├── .gitignore                    # Cấu hình Git ignore chung cho .NET & Node.js
├── .gitattributes                # Cấu hình LF line endings cho Windows & Mac
├── backend/                      # Mã nguồn C# .NET 8 Backend
│   ├── SIMS.sln                  # Solution File (mở bằng Visual Studio / VS Code)
│   ├── database_schema.sql       # Script khởi tạo CSDL MySQL & Dữ liệu mẫu
│   └── SIMS.Api/                 # ASP.NET Core Web API Project
│       ├── Controllers/          # RESTful API Controllers
│       ├── Data/                 # DbContext & Entity Framework Core
│       ├── Models/               # Entities (User, Student, Faculty, Course, etc.)
│       └── Program.cs            # Entry point & CORS/JWT configuration
└── frontend/                     # Mã nguồn React Frontend
    ├── src/                      # Components, Store, Facades, Repositories
    ├── index.html                # Entry HTML
    ├── package.json              # NPM Dependencies
    └── vite.config.ts            # Cấu hình Vite Dev Server
```

---

## 🚀 2. Hướng dẫn Khởi chạy & Kiểm thử tại Local (Local Development)

### Yêu cầu Môi trường (Prerequisites)
- **Node.js**: v18+ 
- **.NET SDK**: .NET 8.0 SDK
- **CSDL**: MySQL Server 8.0+ (Sử dụng **MAMP** / phpMyAdmin, MySQL Workbench, hoặc Docker Container)

---

### Bước 1: Khởi tạo CSDL MySQL
1. Khởi chạy **MAMP** (Bấm **Start Servers** để khởi động MySQL Server trên cổng mặc định `3306` hoặc `8889`).
2. Truy cập **phpMyAdmin** trong MAMP (hoặc MySQL Workbench/DBeaver).
3. Mở tab **SQL** (hoặc nút **Import**), sao chép/chọn file script [backend/database_schema.sql](backend/database_schema.sql) và nhấn **Go/Execute** để tự động tạo CSDL `sims_db` cùng các bảng và dữ liệu mẫu thử nghiệm.

---

### Bước 2: Khởi chạy Backend ASP.NET Core API (.NET 8)
Mở cửa sổ Terminal 1:
```bash
# Khai báo PATH .NET nếu gặp lỗi 'command not found: dotnet' (chạy 1 lần duy nhất trên Mac):
echo 'export PATH="$HOME/.dotnet:$PATH"' >> ~/.zshrc && source ~/.zshrc

# Khởi chạy Backend:
cd backend/SIMS.Api
dotnet run
```
👉 Backend API sẽ khởi chạy tại: `http://localhost:5000` (hoặc `https://localhost:5001`).

---

### Bước 3: Khởi chạy Frontend React
Mở cửa sổ Terminal 2:
```bash
cd frontend
npm install   # Cài đặt thư viện (nếu mới clone)
npm run dev
```
👉 Giao diện Web Frontend sẽ khởi chạy tại: `http://localhost:3000`.

---

## 🔍 3. Phương pháp Kiểm thử Tính năng tại Local

| Công cụ / Phương pháp | Đường dẫn truy cập | Mục đích kiểm thử |
| :--- | :--- | :--- |
| **Giao diện Web (React UI)** | `http://localhost:3000` | Trải nghiệm trực quan thao tác người dùng (Đăng nhập, quản lý sinh viên, chấm điểm, phân môn). |
| **Swagger UI (Backend API)** | `http://localhost:5000/swagger` | Test trực tiếp các RESTful API C# bằng giao diện "Try it out" mà không cần thông qua Frontend. |
| **Postman / Bruno** | `http://localhost:5000/api/...` | Kiểm thử chuyên sâu HTTP Request/Response, JWT Bearer Tokens và kiểm tra các mã lỗi HTTP Status. |

## 🔐 4. Tài khoản & Mật khẩu Mặc định (Default Credentials)

| Role (Vai trò) | Phương thức Khởi tạo / Đăng ký | Mật khẩu Mặc định | Ghi chú |
| :--- | :--- | :--- | :--- |
| **Admin (Quản trị viên)** | Dữ liệu mẫu (Database Seed) | `admin123` | Đăng nhập tài khoản: `admin@elevate.edu` |
| **Faculty (Giảng viên)** | Do Admin tạo từ **`Faculty Directory`** | `elevate2026` | Đăng nhập bằng Email công vụ + `elevate2026`, sau đó Admin duyệt tích màu xanh (`Approve`) để kích hoạt. |
| **Student (Sinh viên được cấp)** | Do Admin tạo từ **`Student Directory`** | `elevate2026` | Đăng nhập bằng Email sinh viên + `elevate2026`. |
| **Student (Tự Đăng ký)** | Sinh viên tự đăng ký ngoài màn hình Register | *(Do Sinh viên tự nhập)* | Khi đăng ký tài khoản mới ngoài form Register, sinh viên tự điền **Password** và **Confirm Password**. |

1. Role: Admin (Quản trị viên)

Email: Admin@elevate.edu
Mật khẩu: Password123!
2. Role: Faculty (Giảng viên)

Email: faculty1@elevate.edu (bạn có thể thử từ faculty1 đến faculty12)
Mật khẩu: Password123!
3. Role: Student (Sinh viên)

Email: student1@elevate.edu (bạn có thể thử từ student1 đến student15)
Mật khẩu: Password123!

> 💡 **Lưu ý Security:** Sau lần đăng nhập đầu tiên bằng mật khẩu mặc định (`elevate2026`), người dùng có thể chủ động truy cập vào tab **My Profile** để đổi sang mật khẩu riêng!

---

## 🛡️ 5. Hướng dẫn Pentest (Kiểm thử Bảo mật) tại Local


Trước khi đẩy ứng dụng lên Server thật, tiến hành kiểm thử các lỗ hổng OWASP Top 10 tại Local:

1. **Kiểm thử Phân quyền (Broken Access Control / IDOR)**:
   * Đăng nhập tài khoản quyền `Student`, dùng Postman gọi API xóa/sửa dữ liệu của Admin (`DELETE /api/students/{id}`).
   * *Kỳ vọng:* Backend phải trả về `403 Forbidden`.
2. **Kiểm thử Xác thực JWT Token**:
   * Thử thay đổi chữ ký Token hoặc gửi Request không có Header `Authorization: Bearer`.
   * *Kỳ vọng:* Backend phải trả về `401 Unauthorized`.
3. **Quét lỗ hổng Tự động**:
   * Sử dụng công cụ **OWASP ZAP** hoặc **Burp Suite** quét địa chỉ `http://localhost:5000` để phát hiện lỗ hổng XSS, SQLi, CORS misconfiguration.

---

## 🌐 5. Giải pháp Deployment Server Thật Miễn Phí (Production)

Khi hoàn thành dự án, bạn có thể triển khai miễn phí lên Cloud:
* **Frontend (React)**: Triển khai trên **Vercel** hoặc **Netlify** (Miễn phí HTTPS + Tự động deploy từ GitHub).
* **Backend (.NET 8 API)**: Triển khai trên **Render.com** hoặc **MonsterASP.net** (Hỗ trợ C# .NET 8 Web API).
* **Database (MySQL)**: Triển khai trên **Aiven.io** hoặc **TiDB Cloud** (Free 5GB MySQL instance).

---

## 💻 6. Lưu ý Tương thích Đa Nền Tảng (Windows & macOS)

- File `.gitattributes` đã được cấu hình `* text=auto` ép chuẩn `LF` cho tất cả các file code C#, TS, TSX, JSON. Thành viên dùng **Windows** (Visual Studio 2022) hay **macOS** (VS Code) clone về đều chạy mượt mà không gặp lỗi xung đột dòng code.
- File `.gitignore` tự động loại bỏ thư mục rác `bin/`, `obj/`, `.vs/`, `node_modules/`, `dist/`.
