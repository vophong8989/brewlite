# Product & Sprint Backlog – BrewLite

Tài liệu danh sách công việc (Issues) bám sát `docs/requirements/user-stories.md` và `docs/requirements/srs.md`, gắn mã User Story (`US-01..US-18`), mã yêu cầu (`FR-xx`, `NFR-xx`), mức ưu tiên MoSCoW, phân công chi tiết từng thành viên (**Phan Tấn Tài** và **Võ Quốc Phong**) và tuần thực hiện dự kiến. Trạng thái chi tiết của từng issue được theo dõi trên GitHub Project board.

---

## 1. Sprint 1: Yêu cầu, Mô hình hóa, Kiến trúc & MVP Xem Menu (Tuần 1 – Tuần 3)

**Sprint Goal:** Hoàn thành đặc tả yêu cầu, mô hình hóa, thiết kế kiến trúc, thiết lập CI cơ bản và xây dựng phiên bản MVP chạy được luồng xem menu (`FR-01`) cùng API chi tiết sản phẩm (`FR-03`) trên dữ liệu mẫu PostgreSQL.

| Mã Issue | Mã US | Tiêu đề Issue | FR/NFR liên quan | Ưu tiên | Phụ trách | Tuần dự kiến |
|---|---|---|---|---|---|---|
| ISS-01 | US-17 | US-17: Khởi tạo repository khung, quy trình PR/branch, backlog và ma trận truy vết | NFR-05 | Must | Võ Quốc Phong | Tuần 1 |
| ISS-02 | US-17 | US-17: Viết tài liệu Bối cảnh và phạm vi (`context-and-scope.md`) | FR-01..FR-13 | Must | Phan Tấn Tài | Tuần 1 |
| ISS-03 | US-17 | US-17: Đặc tả yêu cầu phần mềm (`srs.md`), User Stories (`user-stories.md`) & UC-01 (`uc-01-checkout.md`) | FR-01..FR-13, NFR-01..NFR-06 | Must | Phan Tấn Tài | Tuần 1 |
| ISS-04 | US-17 | US-17: Vẽ Class Diagram (`class-domain.puml` + `.svg`) khớp mô hình dữ liệu & API | FR-01..FR-13 | Must | Võ Quốc Phong | Tuần 1 |
| ISS-05 | US-17 | US-17: Vẽ Use-case Overview, Use-case Checkout & Activity Diagram (`activity-end-to-end`) | FR-01..FR-09 | Must | Phan Tấn Tài | Tuần 2 |
| ISS-06 | US-17 | US-17: Vẽ Sequence Diagram đặt đơn & thanh toán (`sequence-checkout.puml` + `.svg`) | FR-06, FR-07, FR-09 | Must | Võ Quốc Phong | Tuần 2 |
| ISS-07 | US-17 | US-17: Viết tài liệu Kiến trúc hệ thống (`architecture.md`) & các ADR | NFR-02..NFR-05 | Must | Phan Tấn Tài | Tuần 2 |
| ISS-08 | US-17 | US-17: Vẽ Deployment Diagram (`deployment-production.puml` + `.svg`) | NFR-05 | Must | Võ Quốc Phong | Tuần 2 |
| ISS-09 | US-18 | US-18: Thiết lập GitHub Actions CI (`ci.yml`, `secret-scan.yml`), bật Branch Protection & lưu ảnh minh chứng CI | NFR-02, NFR-05, NFR-06 | Must | Võ Quốc Phong | Tuần 2 |
| ISS-10 | US-17 | US-17: Rà soát `docs/` đủ tạo phẩm Task 1–3, kiểm chéo sơ đồ với SRS & API Contract (Task 4.2) | FR-01..FR-13, NFR-01..NFR-06 | Must | Phan Tấn Tài & Võ Quốc Phong (cả hai kiểm chéo) | Tuần 2 |
| ISS-11 | US-17 | US-17: Khởi tạo NestJS + Prisma schema, migration, seed & Global Exception Filter | NFR-02, NFR-03 | Must | Võ Quốc Phong (Backend) | Tuần 3 |
| ISS-12 | US-17 | US-17: Xây dựng API `GET /health` kiểm tra kết nối PostgreSQL | NFR-03 | Must | Phan Tấn Tài (Backend) | Tuần 3 |
| ISS-13 | US-01 | US-01: Xem menu – Xây dựng API `GET /products` & Unit test | FR-01 | Must | Võ Quốc Phong (Backend) | Tuần 3 |
| ISS-14 | US-03 | US-03: Chi tiết sản phẩm (Backend) – Xây dựng API `GET /products/:id` (sizes, toppings, 404 `PRODUCT_NOT_FOUND`) & Unit test | FR-03 | Must | Võ Quốc Phong (Backend) | Tuần 3 |
| ISS-15 | US-01 | US-01: Xem menu – Khởi tạo Next.js mobile-first/PWA, manifest PWA & màn hình Menu (loading/empty/error) | FR-01, NFR-04 | Must | Phan Tấn Tài (Frontend) | Tuần 3 |
| ISS-16 | US-18 | US-18: Deploy thử bản khung lên Vercel + Render + Postgres & kiểm tra GHCR | NFR-05 | Must | Võ Quốc Phong | Tuần 3 |
| ISS-17 | US-17 | US-17: Ghi nhận Sprint 1 Review & Retrospective (`sprint-review-and-retrospective.md`) & tạo tag `milestone-sprint1` | NFR-05 | Must | Phan Tấn Tài | Tuần 3 |

---

## 2. Sprint 2: Hoàn thiện Luồng Đặt đơn – Thanh toán – Theo dõi & Production (Tuần 4 – Tuần 5)

**Sprint Goal:** Hoàn thành toàn bộ luồng nghiệp vụ Must từ menu đến xác nhận đơn, kiểm thử tự động (Unit, Integration, E2E), triển khai production HTTPS và bàn giao hồ sơ đầy đủ.

| Mã Issue | Mã US | Tiêu đề Issue | FR/NFR liên quan | Ưu tiên | Phụ trách | Tuần dự kiến |
|---|---|---|---|---|---|---|
| ISS-18 | US-03 | US-03: Chi tiết sản phẩm (Frontend) – UI chọn size, topping, ghi chú & tính giá tạm tính | FR-03, NFR-04 | Must | Võ Quốc Phong (Frontend) | Tuần 4 |
| ISS-19 | US-04 | US-04: Giỏ hàng và tính tổng tiền – Lưu trữ client-side, cập nhật số lượng & khôi phục khi reload | FR-04, NFR-04 | Must | Võ Quốc Phong (Frontend) | Tuần 4 |
| ISS-20 | US-05 | US-05: Đăng ký tài khoản CUSTOMER – Backend `POST /auth/register` & Frontend UI Đăng ký | FR-05, NFR-02, NFR-04 | Must | Phan Tấn Tài (Backend) & Võ Quốc Phong (Frontend) | Tuần 4 |
| ISS-21 | US-06 | US-06: Đăng nhập & phân quyền JWT – Backend `POST /auth/login`, Guards & Frontend UI Đăng nhập | FR-05, NFR-02, NFR-04 | Must | Phan Tấn Tài (Backend) & Võ Quốc Phong (Frontend) | Tuần 4 |
| ISS-22 | US-07 | US-07: Đặt đơn hàng – Backend `POST /orders` (transaction, trừ tồn kho) & Frontend UI Đặt đơn | FR-06, NFR-04 | Must | Phan Tấn Tài (Backend) & Võ Quốc Phong (Frontend) | Tuần 4 |
| ISS-23 | US-08 | US-08: Thanh toán mô phỏng – Backend `POST /payments` (Ví/Thẻ, idempotency) & Frontend UI Thanh toán | FR-07, NFR-02, NFR-04 | Must | Phan Tấn Tài (Backend) & Võ Quốc Phong (Frontend) | Tuần 4 |
| ISS-24 | US-09 | US-09: Xác nhận và lịch sử đơn – Backend `GET /orders`, `GET /orders/:id` & Frontend UI Lịch sử đơn | FR-08, NFR-04 | Must | Phan Tấn Tài (Backend) & Võ Quốc Phong (Frontend) | Tuần 4 |
| ISS-25 | US-10 | US-10: Theo dõi trạng thái đơn – Frontend UI polling định kỳ tới trạng thái kết thúc | FR-09, NFR-04 | Must | Võ Quốc Phong (Frontend) | Tuần 4 |
| ISS-26 | US-11 | US-11: Xử lý đơn tại quầy – Backend `GET /staff/orders`, `PATCH /staff/orders/:id/status` & Frontend UI Staff | FR-09, NFR-04 | Must | Phan Tấn Tài (Backend) & Võ Quốc Phong (Frontend) | Tuần 4 |
| ISS-27 | US-18 | US-18: Viết Integration Tests API (`INT-Txx`) cho tạo đơn & thanh toán trên PostgreSQL test | FR-05..FR-09, NFR-06 | Must | Phan Tấn Tài (Backend/Test) | Tuần 5 |
| ISS-28 | US-18 | US-18: Viết E2E Test Playwright (`E2E-Txx`) từ màn hình menu đến xác nhận đơn | FR-01..FR-09, NFR-06 | Must | Võ Quốc Phong (Frontend/Test) | Tuần 5 |
| ISS-29 | US-18 | US-18: Cấu hình `docker-compose.yml` chạy đồng bộ web, API và PostgreSQL ở local | NFR-05 | Must | Võ Quốc Phong | Tuần 5 |
| ISS-30 | US-18 | US-18: Thiết lập pipeline CD (`cd.yml`) build image, push GHCR, deploy Render & chạy migration an toàn | NFR-03, NFR-05 | Must | Võ Quốc Phong | Tuần 5 |
| ISS-31 | US-18 | US-18: Tạo Render Postgres production (Internal URL) và cấu hình biến môi trường/secrets | NFR-02, NFR-03, NFR-05 | Must | Võ Quốc Phong | Tuần 5 |
| ISS-32 | US-18 | US-18: Bổ sung bước Smoke Test sau deploy và job `rollback-guide` trong pipeline CD | NFR-03, NFR-05 | Must | Võ Quốc Phong | Tuần 5 |
| ISS-33 | US-18 | US-18: Viết tài liệu hướng dẫn triển khai, vận hành và rollback (`docs/deployment.md`) | NFR-05 | Must | Võ Quốc Phong | Tuần 5 |
| ISS-34 | US-18 | US-18: Thực hiện kiểm tra bảo mật & quản lý secret (`docs/security-audit.md`) | NFR-02 | Must | Võ Quốc Phong | Tuần 5 |
| ISS-35 | US-18 | US-18: Quay video demo luồng nghiệp vụ end-to-end trên môi trường production | FR-01..FR-09, NFR-05 | Must | Võ Quốc Phong | Tuần 5 |
| ISS-36 | US-17 | US-17: Hoàn thiện `README.md`, viết `docs/release-notes.md` & cập nhật Sprint 2 Review/Retrospective | NFR-05 | Must | Phan Tấn Tài | Tuần 5 |
| ISS-37 | US-17 | US-17: Viết `docs/assignment-conformance.md`, rà soát `docs/traceability-matrix.md` & kiểm tra sạch ghi chú dở dang trong `docs/` | FR-01..FR-09, NFR-02..NFR-05 | Must | Phan Tấn Tài & Võ Quốc Phong (cả hai rà soát) | Tuần 5 |
| ISS-38 | US-18 | US-18: Nghiệm thu cuối kỳ – Clone repo sạch, chạy theo `README.md`, kiểm tra HTTPS production & tạo tag `v1.0.0` | NFR-03, NFR-05 | Must | Phan Tấn Tài & Võ Quốc Phong (cả hai kiểm thử) | Tuần 5 |

---

## 3. Sau Must: Chức năng mở rộng (Should / Could)

Chỉ triển khai theo thứ tự ưu tiên chốt ở quyết định D9 (`FR-10` → `FR-11` → `FR-13` → `FR-12`) sau khi toàn bộ các hạng mục Must ở Sprint 1 và Sprint 2 đã chạy ổn định trên production và vượt qua kiểm thử.

| Mã Issue | Mã US | Tiêu đề Issue | FR/NFR liên quan | Ưu tiên | Phụ trách | Tuần dự kiến |
|---|---|---|---|---|---|---|
| ISS-39 | US-02 | US-02: Lọc sản phẩm theo danh mục (`GET /products?category=...`) | FR-02 | Should | Phan Tấn Tài (Backend) & Võ Quốc Phong (Frontend) | Tuần 4–5 (nếu kịp) |
| ISS-40 | US-12 | US-12: Tự hủy đơn PENDING quá 30 phút & hoàn tồn kho (lazy expiration) | FR-10 | Should | Phan Tấn Tài (Backend) | Tuần 4–5 (nếu kịp) |
| ISS-41 | US-13 | US-13: Áp dụng mã khuyến mãi cố định/phần trăm khi đặt đơn | FR-11 | Should | Phan Tấn Tài (Backend) & Võ Quốc Phong (Frontend) | Tuần 4–5 (nếu kịp) |
| ISS-42 | US-15 | US-15: Quản lý sản phẩm và điều chỉnh tồn kho cho Manager | FR-13 | Could | Phan Tấn Tài (Backend) & Võ Quốc Phong (Frontend) | Tuần 5 (nếu kịp) |
| ISS-43 | US-14 | US-14: Tích điểm khách hàng thân thiết khi đơn COMPLETED | FR-12 | Could | Phan Tấn Tài (Backend) & Võ Quốc Phong (Frontend) | Tuần 5 (nếu kịp) |
| ISS-44 | US-16 | US-16: Lọc sản phẩm theo khoảng giá | FR-02 (lọc giá) | Could | Võ Quốc Phong (Frontend/Backend) | Tuần 5 (nếu kịp) |TODO: test ci fail
