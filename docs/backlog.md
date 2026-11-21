# Product & Sprint Backlog – BrewLite

Tài liệu danh sách công việc (Issues) bám sát `docs/requirements/user-stories.md` và `docs/requirements/srs.md` (mục 7.3), gắn mã User Story (`US-01..US-18`), mã yêu cầu (`FR-xx`, `NFR-xx`) và phân công thành viên (**Phan Tấn Tài** và **Võ Quốc Phong**). Trạng thái chi tiết của từng issue được theo dõi trên GitHub Project board.

---

## Sprint 1: Yêu cầu, Mô hình hóa, Kiến trúc & MVP Xem Menu (Tuần 1 – Tuần 3)

**Sprint Goal:** Có hệ thống ban đầu chạy được với chức năng xem menu (`FR-01`), dữ liệu mẫu PostgreSQL, giao diện mobile-first và nền tảng CI cơ bản.

| Mã Issue | Mã US | Tiêu đề Issue | FR/NFR liên quan | Phụ trách |
|---|---|---|---|---|
| ISS-01 | US-17 | US-17: Khởi tạo repository khung, quy trình PR/branch và ma trận truy vết | NFR-05 | Võ Quốc Phong |
| ISS-02 | US-17 | US-17: Viết tài liệu Bối cảnh và phạm vi (`context-and-scope.md`) | FR-01..FR-13 | Phan Tấn Tài |
| ISS-03 | US-17 | US-17: Đặc tả yêu cầu phần mềm (`srs.md`), User Stories & UC-01 (`uc-01-checkout.md`) | FR-01..FR-13, NFR-01..06 | Phan Tấn Tài |
| ISS-04 | US-17 | US-17: Vẽ Class Diagram (`class-domain.puml` + `.svg`) khớp mô hình dữ liệu & API | FR-01..FR-13 | Võ Quốc Phong |
| ISS-05 | US-17 | US-17: Vẽ Use-case Overview, Use-case Checkout & Activity Diagram | FR-01..FR-09 | Phan Tấn Tài |
| ISS-06 | US-17 | US-17: Vẽ Sequence Diagram đặt đơn & thanh toán (`sequence-checkout.puml` + `.svg`) | FR-06, FR-07, FR-09 | Võ Quốc Phong |
| ISS-07 | US-17 | US-17: Viết tài liệu Kiến trúc hệ thống (`architecture.md`) & các ADR | NFR-02..NFR-05 | Phan Tấn Tài |
| ISS-08 | US-17 | US-17: Vẽ Deployment Diagram (`deployment-production.puml` + `.svg`) | NFR-05 | Võ Quốc Phong |
| ISS-09 | US-17 | US-17: Khởi tạo NestJS + Prisma schema, migration, seed & Global Exception Filter | NFR-02, NFR-03 | Võ Quốc Phong |
| ISS-10 | US-17 | US-17: Xây dựng API `GET /health` kiểm tra kết nối PostgreSQL | NFR-03 | Phan Tấn Tài |
| ISS-11 | US-01 | US-01: Xem menu – Xây dựng API `GET /products` & Unit test | FR-01 | Võ Quốc Phong |
| ISS-12 | US-01 | US-01: Xem menu – Khởi tạo Next.js mobile-first/PWA & màn hình Menu (loading/empty/error) | FR-01, NFR-04 | Phan Tấn Tài |
| ISS-13 | US-18 | US-18: Thiết lập GitHub Actions CI (`ci.yml`, `secret-scan.yml`) & bật Branch Protection | NFR-02, NFR-05, NFR-06 | Võ Quốc Phong |
| ISS-14 | US-18 | US-18: Deploy thử bản khung lên Vercel + Render + Postgres & kiểm tra GHCR | NFR-05 | Võ Quốc Phong |

---

## Sprint 2: Hoàn thiện Luồng Đặt đơn – Thanh toán – Theo dõi & Production (Tuần 4 – Tuần 5)

**Sprint Goal:** Hoàn thành toàn bộ luồng nghiệp vụ Must từ menu đến xác nhận đơn, kiểm thử tự động và triển khai production.

| Mã Issue | Mã US | Tiêu đề Issue | FR/NFR liên quan | Phụ trách |
|---|---|---|---|---|
| ISS-15 | US-03 | US-03: Chi tiết sản phẩm – API `GET /products/:id` (size, topping) & UI chọn tùy chọn | FR-03, NFR-04 | Võ Quốc Phong |
| ISS-16 | US-04 | US-04: Giỏ hàng và tính tổng tiền – Lưu trữ client-side, khôi phục khi reload | FR-04, NFR-04 | Võ Quốc Phong |
| ISS-17 | US-05 | US-05: Đăng ký tài khoản CUSTOMER – API `POST /auth/register` & UI Đăng ký | FR-05, NFR-02, NFR-04 | Phan Tấn Tài & Võ Quốc Phong |
| ISS-18 | US-06 | US-06: Đăng nhập & phân quyền JWT – API `POST /auth/login`, Guards & UI Đăng nhập | FR-05, NFR-02, NFR-04 | Phan Tấn Tài & Võ Quốc Phong |
| ISS-19 | US-07 | US-07: Đặt đơn hàng – API `POST /orders` (transaction, trừ tồn kho) & UI Đặt đơn | FR-06, NFR-04 | Phan Tấn Tài & Võ Quốc Phong |
| ISS-20 | US-08 | US-08: Thanh toán mô phỏng – API `POST /payments` (Ví/Thẻ, idempotency) & UI Thanh toán | FR-07, NFR-02, NFR-04 | Phan Tấn Tài & Võ Quốc Phong |
| ISS-21 | US-09 | US-09: Xác nhận và lịch sử đơn – API `GET /orders`, `GET /orders/:id` & UI Lịch sử đơn | FR-08, NFR-04 | Phan Tấn Tài & Võ Quốc Phong |
| ISS-22 | US-10 | US-10: Theo dõi trạng thái đơn – UI polling mỗi 5 giây tới trạng thái kết thúc | FR-09, NFR-04 | Võ Quốc Phong |
| ISS-23 | US-11 | US-11: Xử lý đơn tại quầy – API `GET /staff/orders`, `PATCH /staff/orders/:id/status` & UI Staff | FR-09, NFR-04 | Phan Tấn Tài & Võ Quốc Phong |
| ISS-24 | US-18 | US-18: Viết Integration Tests (`INT-Txx`) & E2E Test Playwright (`E2E-Txx`) | FR-01..FR-09, NFR-06 | Phan Tấn Tài & Võ Quốc Phong |
| ISS-25 | US-18 | US-18: Cấu hình `docker-compose.yml`, Pipeline CD (`cd.yml`), Smoke Test & Production | NFR-02..NFR-05 | Phan Tấn Tài & Võ Quốc Phong |

---

## Sau Must: Chức năng mở rộng (Should / Could)

Chỉ triển khai sau khi toàn bộ các hạng mục Must ở Sprint 1 và Sprint 2 đã chạy ổn định trên production và vượt qua kiểm thử.

| Mã Issue | Mã US | Tiêu đề Issue | FR/NFR liên quan | Ưu tiên | Phụ trách |
|---|---|---|---|---|---|
| ISS-26 | US-02 | US-02: Lọc sản phẩm theo danh mục (`GET /products?category=...`) | FR-02 | Should | Phan Tấn Tài & Võ Quốc Phong |
| ISS-27 | US-12 | US-12: Tự hủy đơn PENDING quá 30 phút & hoàn tồn kho (lazy expiration) | FR-10 | Should | Phan Tấn Tài |
| ISS-28 | US-13 | US-13: Áp dụng mã khuyến mãi cố định/phần trăm khi đặt đơn | FR-11 | Should | Phan Tấn Tài & Võ Quốc Phong |
| ISS-29 | US-15 | US-15: Quản lý sản phẩm và điều chỉnh tồn kho cho Manager | FR-13 | Could | Phan Tấn Tài & Võ Quốc Phong |
| ISS-30 | US-14 | US-14: Tích điểm khách hàng thân thiết khi đơn COMPLETED | FR-12 | Could | Phan Tấn Tài & Võ Quốc Phong |
| ISS-31 | US-16 | US-16: Lọc sản phẩm theo khoảng giá | FR-02 (lọc giá) | Could | Võ Quốc Phong |