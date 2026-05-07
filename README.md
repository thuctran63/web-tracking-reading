# Reading Report Tracker

Web app theo dõi tiến độ đọc sách hằng ngày:
- Report theo ngày với các trường chi tiết quá trình đọc.
- Multi-user qua đăng nhập email/mật khẩu.
- Calendar heatmap kiểu GitHub, tự động xem ngày không report là không đọc.

## Stack

- Next.js (App Router) + TypeScript
- NextAuth (Credentials)
- MongoDB + Mongoose
- Tailwind CSS
- Vitest cho unit test logic calendar/stats

## Setup local

1. Cài dependencies:
   ```bash
   npm install
   ```
2. Tạo file `.env.local` từ `.env.example`:
   ```bash
   copy .env.example .env.local
   ```
3. Cập nhật biến môi trường:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
4. Chạy app:
   ```bash
   npm run dev
   ```
5. Mở [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev`: chạy local dev server
- `npm run build`: build production
- `npm run lint`: kiểm tra lint
- `npm run test`: chạy unit tests
