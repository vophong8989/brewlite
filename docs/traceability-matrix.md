# Ma trận truy vết yêu cầu — BrewLite

## 1. Hướng dẫn đọc bảng và quy ước cập nhật

- **Mục đích:** Đảm bảo mọi yêu cầu chức năng (`FR-01..FR-13`) và phi chức năng (`NFR-01..NFR-06`) đều truy vết được xuyên suốt từ User Story/Use-case → Thiết kế/Sơ đồ/Kiến trúc → Mã nguồn/API → Kiểm thử.
- **Quy ước mã định danh:**
  - Yêu cầu: `FR-xx` (Functional Requirement), `NFR-xx` (Non-Functional Requirement).
  - Nhu cầu người dùng & ca sử dụng: `US-xx` (User Story), `UC-xx` (Use-case).
  - Sơ đồ & kiến trúc: `UCD-01` (Use-case tổng quát), `UCD-02` (Use-case checkout), `Activity-01`, `Sequence-01`, `Class-01`, `Deploy-01`, `ARCH-WEB`, `ARCH-API`, `ARCH-DB`, `ARCH-CI`.
  - Kiểm thử: `API-Txx` (Unit/API test), `INT-Txx` (Integration test), `E2E-Txx` (End-to-end test).
- **Quy tắc chuyển từ `TBD` sang liên kết (link):**
  - Chỉ chuyển tên tạo phẩm thành liên kết Markdown tương đối (ví dụ `[Class-01](diagrams/class-domain.puml)`) **khi tệp thực tế đã được tạo và đưa vào cùng PR hoặc đã tồn tại trên nhánh `main`**.
  - Các tạo phẩm chưa tồn tại trên `main` phải ghi rõ `(TBD)` và giữ nguyên đủ 5 cột, không tự ý xóa cột hay khẳng định tiêu chí chấp nhận đã đạt trước khi chạy kiểm thử.

---

## 2. Bảng ma trận truy vết tổng hợp

| Mã yêu cầu | Use-case / User Story | Thiết kế / Sơ đồ | Code / API | Test |
|---|---|---|---|---|
| FR-01 | US-01, US-17; UC-03 | Activity-01 (TBD), Class-01 (TBD), UCD-01 (TBD) | `GET /products`; code: TBD | TBD |
| FR-02 | US-02, US-16; UC-04, UC-05 | UCD-01 (TBD), Class-01 (TBD) (`Product.category`) | `GET /products?category=...` (Should); lọc giá (Could); code: TBD | TBD |
| FR-03 | US-03; UC-06 | Activity-01 (TBD), Class-01 (TBD) | `GET /products/:id`; code: TBD | TBD |
| FR-04 | US-04; UC-07 | Activity-01 (TBD), Class-01 (TBD) (Cart lưu ở client) | Giỏ hàng client; code: TBD | TBD |
| FR-05 | US-05, US-06; UC-08, UC-09; UC-01 (tiền điều kiện đăng nhập) | Activity-01 (TBD), Sequence-01 (TBD), Class-01 (TBD) | `POST /auth/register`; `POST /auth/login`; code: TBD | TBD |
| FR-06 | US-07; UC-01 | UC-01 đặc tả (TBD), UCD-02 (TBD), Activity-01 (TBD), Sequence-01 (TBD), Class-01 (TBD) | `POST /orders`; code: TBD | TBD |
| FR-07 | US-08; UC-01, UC-02, UC-17, UC-18 | UC-01 đặc tả (TBD), UCD-02 (TBD), Activity-01 (TBD), Sequence-01 (TBD), Class-01 (TBD) | `POST /payments`; code: TBD | TBD |
| FR-08 | US-09; UC-10 | Activity-01 (TBD), Sequence-01 (TBD), Class-01 (TBD) | `GET /orders`; `GET /orders/:id`; code: TBD | TBD |
| FR-09 | US-10, US-11; UC-11, UC-12 | Activity-01 (TBD), Class-01 (TBD) | `GET /orders/:id`; `GET /staff/orders`; `PATCH /staff/orders/:id/status`; code: TBD | TBD |
| FR-10 | US-12; UC-13 | Activity-01 (TBD) (note), Class-01 (TBD) (`CANCELLED`) | `GET /orders`; `GET /orders/:id`; `POST /payments` (Should); code: TBD | TBD |
| FR-11 | US-13; UC-14 | Class-01 (TBD) (`Promotion` mở rộng), Sequence-01 (TBD) (note) | `POST /orders` (Should); code: TBD | TBD |
| FR-12 | US-14; UC-15 | Class-01 (TBD) (`LoyaltyTransaction` mở rộng) | Chuyển trạng thái `COMPLETED` (Could); code: TBD | TBD |
| FR-13 | US-15; UC-16 | Class-01 (TBD) (`Product`) | `POST /products`; `PATCH /products/:id`; `PATCH /products/:id/stock` (Could); code: TBD | TBD |
| NFR-01 | US-01, US-17; UC-03 | ARCH-API (TBD), ARCH-WEB (TBD) | `GET /products` (mục tiêu p95); code: TBD | TBD |
| NFR-02 | US-05, US-06, US-18; UC-08, UC-09 | Sequence-01 (TBD), Class-01 (TBD), Deploy-01 (TBD), ARCH-API (TBD), ARCH-DB (TBD) | JWT, bcrypt, seed, CI secret scan; code: TBD | TBD |
| NFR-03 | US-17, US-18; UC-03 | Deploy-01 (TBD), ARCH-API (TBD), ARCH-DB (TBD) | `GET /health`; migration/seed; code: TBD | TBD |
| NFR-04 | US-01, US-17 | Activity-01 (TBD), ARCH-WEB (TBD) | Menu UI / PWA; code: TBD | TBD |
| NFR-05 | US-17, US-18 | Deploy-01 (TBD), ARCH-CI (TBD) | GitHub Actions; Docker; HTTPS; code: TBD | TBD |
| NFR-06 | US-18 | Sequence-01 (TBD), ARCH-CI (TBD) | Unit / Integration / E2E tests; code: TBD | TBD |

---

## 3. Nhật ký cập nhật

| Ngày | PR / Nhánh | Người cập nhật | Phần đã điền / Thay đổi |
|---|---|---|---|
| 2026-11-22 | PR #1 (`chore/init-repo-structure`) | Võ Quốc Phong | Khởi tạo cấu trúc 5 cột cho 19 yêu cầu (`FR-01..FR-13`, `NFR-01..NFR-06`), điền danh sách endpoint dự kiến và đặt trạng thái `TBD` cho các tạo phẩm chưa merge lên `main`. |