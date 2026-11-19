# Product & Sprint Backlog – BrewLite

Tài liệu danh sách công việc (Issues) chia theo Sprint 1 và Sprint 2, gắn với mã yêu cầu (`FR-xx`, `NFR-xx`) và phân công thành viên (**Phan Tấn Tài** và **Võ Quốc Phong**).

---

## Sprint 1: Yêu cầu, Mô hình hóa, Kiến trúc & MVP Xem Menu (Tuần 1 – Tuần 3)

| ID | Tiêu đề Issue | Mã liên quan | Phụ trách | Trạng thái |
|---|---|---|---|---|
| ISS-01 | Khởi tạo repository khung, quy trình PR/branch, traceability matrix | NFR-05 | Phong | In Progress |
| ISS-02 | Viết tài liệu Bối cảnh và phạm vi (`context-and-scope.md`) | FR-01..FR-13 | A | Done |
| ISS-03 | Đặc tả yêu cầu phần mềm (`srs.md`) & Use-case checkout (`uc-01-checkout.md`) | FR-01..FR-13, NFR-01..06 | A | Todo |
| ISS-04 | Vẽ Class Diagram (`class.puml` + `.svg`) khớp mô hình dữ liệu & API | FR-01..FR-13 | Phong | Todo |
| ISS-05 | Vẽ Use-case Overview, Use-case Checkout & Activity Diagram | FR-01..FR-09 | A | Todo |
| ISS-06 | Vẽ Sequence Diagram cho luồng đặt đơn & thanh toán (`sequence-checkout`) | FR-06, FR-07, FR-09 | Phong | Todo |
| ISS-07 | Viết tài liệu Kiến trúc hệ thống & các ADR (Monorepo, Prisma, Auth, Payment) | NFR-02..NFR-05 | A | Todo |
| ISS-08 | Vẽ Deployment Diagram (`deployment.puml` + `.svg`) | NFR-05 | Phong | Todo |
| ISS-09 | Thiết lập GitHub Actions CI (`ci.yml`, `secret-scan.yml`) & bật Branch Protection | NFR-02, NFR-05, NFR-06 | Phong | Todo |
| ISS-10 | Khởi tạo NestJS + Prisma schema, migration, seed & Global Exception Filter | NFR-02, NFR-03 | Phong | Todo |
| ISS-11 | Xây dựng API `GET /health` kiểm tra kết nối PostgreSQL | NFR-03 | A | Todo |
| ISS-12 | Xây dựng API `GET /products` (lọc category) & `GET /products/:id` + Unit test | FR-01, FR-02, FR-03 | Phong | Todo |
| ISS-13 | Khởi tạo Next.js mobile-first/PWA & trang Menu (loading/empty/error) + Component test | FR-01, FR-02, NFR-04 | A | Todo |
| ISS-14 | Deploy thử bản khung lên Vercel + Render + Postgres & kiểm tra GHCR | NFR-05 | Phong | Todo |

---

## Sprint 2: Luồng Đặt đơn – Thanh toán – Theo dõi, Kiểm thử & Production (Tuần 4 – Tuần 5)

| ID | Tiêu đề Issue | Mã liên quan | Phụ trách | Trạng thái |
|---|---|---|---|---|
| ISS-15 | Xây dựng API `POST /auth/register`, `POST /auth/login`, JWT Guard & Role Guard | FR-05, NFR-02 | A | Todo |
| ISS-16 | Xây dựng API `POST /orders`, `GET /orders`, `GET /orders/:id` (transaction & trừ tồn kho) | FR-06, FR-08 | A | Todo |
| ISS-17 | Xây dựng API `POST /payments` (mô phỏng Ví/Thẻ & Idempotency key) | FR-07 | A | Todo |
| ISS-18 | Xây dựng API `GET /staff/orders` & `PATCH /staff/orders/:id/status` | FR-09 | A | Todo |
| ISS-19 | Xây dựng UI Chi tiết sản phẩm (chọn size, topping) & Giỏ hàng client-side | FR-03, FR-04, NFR-04 | Phong | Todo |
| ISS-20 | Xây dựng UI Đăng ký, Đăng nhập & quản lý phiên JWT | FR-05, NFR-04 | Phong | Todo |
| ISS-21 | Xây dựng UI Đặt đơn, Thanh toán mô phỏng (xử lý 402 & retry) | FR-06, FR-07, NFR-04 | Phong | Todo |
| ISS-22 | Xây dựng UI Theo dõi đơn (polling 5s), Lịch sử đơn & Màn hình xử lý của Staff | FR-08, FR-09, NFR-04 | Phong | Todo |
| ISS-23 | Viết Integration Tests (`INT-Txx`) cho Auth, Order transaction, Payment idempotency | FR-05..FR-09, NFR-06 | A | Todo |
| ISS-24 | Viết E2E Test Playwright (`E2E-Txx`) luồng Menu → Xác nhận đơn | FR-01..FR-09, NFR-06 | Phong | Todo |
| ISS-25 | Cấu hình `docker-compose.yml` chạy trọn bộ Web + API + Postgres ở local | NFR-05 | A & Phong | Todo |
| ISS-26 | Thiết lập Pipeline CD (`cd.yml`), Smoke Test & Rollback guide khi push tag `vX.Y.Z` | NFR-03, NFR-05 | Phong | Todo |
| ISS-27 | Tạo Render Postgres production, hoàn thiện `deployment.md`, `security-audit.md` & Release `v1.0.0` | NFR-02..NFR-05 | A & Phong | Todo |