# Ma trận truy vết yêu cầu — BrewLite

## 1. Hướng dẫn đọc bảng và quy ước cập nhật

- **Mục đích:** Đảm bảo mọi yêu cầu chức năng (`FR-01..FR-13`) và phi chức năng (`NFR-01..NFR-06`) đều truy vết được xuyên suốt từ User Story/Use-case → Thiết kế/Sơ đồ/Kiến trúc → Mã nguồn/API → Kiểm thử.
- **Quy ước mã định danh:**
  - Yêu cầu: `FR-xx` (Functional Requirement), `NFR-xx` (Non-Functional Requirement).
  - Nhu cầu người dùng & ca sử dụng: `US-xx` (User Story), `UC-xx` (Use-case).
  - Sơ đồ & kiến trúc: `UCD-01` (Use-case tổng quát), `UCD-02` (Use-case checkout), `Activity-01`, `Sequence-01`, `Class-01`, `Deploy-01`, `ARCH-WEB`, `ARCH-API`, `ARCH-DB`, `ARCH-CI`.
  - Kiểm thử: `API-Txx` (Unit/API test), `INT-Txx` (Integration test), `E2E-Txx` (End-to-end test).
- **Tài liệu nguồn:** [SRS](requirements/srs.md), [User Stories](requirements/user-stories.md), [Context & Scope](requirements/context-and-scope.md), [API Contract (thiết kế)](api-contract.md).
- **Quy tắc chuyển từ `TBD` sang liên kết (link):**
  - Chỉ chuyển tên tạo phẩm thành liên kết Markdown tương đối (ví dụ `[Class-01](diagrams/class-domain.puml)`) **khi tệp thực tế đã được tạo và đưa vào cùng PR hoặc đã tồn tại trên nhánh `main`**.
  - Liên kết tới tài liệu thiết kế chỉ chứng minh có tạo phẩm; không chứng minh chức năng đã triển khai hoặc kiểm thử đạt.
  - Các tạo phẩm chưa tồn tại trên `main` phải ghi rõ `(TBD)` và giữ nguyên đủ 5 cột, không tự ý xóa cột hay khẳng định tiêu chí chấp nhận đã đạt trước khi chạy kiểm thử.

---

## 2. Bảng ma trận truy vết tổng hợp

| Mã yêu cầu | Use-case / User Story | Thiết kế / Sơ đồ | Code / API | Test |
|---|---|---|---|---|
| FR-01 | US-01, US-17; UC-03 | [Activity-01](diagrams/activity-end-to-end.puml), [Class-01](diagrams/class-domain.puml), [UCD-01](diagrams/usecase-overview.puml) | `GET /products`; code: TBD | TBD |
| FR-02 | US-02, US-16; UC-04, UC-05 | [UCD-01](diagrams/usecase-overview.puml), [Class-01](diagrams/class-domain.puml) (`Product.category`) | `GET /products?category=...` (Should); lọc giá (Could); code: TBD | TBD |
| FR-03 | US-03; UC-06 | [Activity-01](diagrams/activity-end-to-end.puml), [Class-01](diagrams/class-domain.puml) | `GET /products/:id`; code: TBD | TBD |
| FR-04 | US-04; UC-07 | [Activity-01](diagrams/activity-end-to-end.puml), [Class-01](diagrams/class-domain.puml) (Cart lưu ở client) | Giỏ hàng client; code: TBD | TBD |
| FR-05 | US-05, US-06; UC-08, UC-09; UC-01 (tiền điều kiện đăng nhập) | [Activity-01](diagrams/activity-end-to-end.puml), [Sequence-01](diagrams/sequence-checkout.puml), [Class-01](diagrams/class-domain.puml) | `POST /auth/register`; `POST /auth/login`; code: TBD | TBD |
| FR-06 | US-07; UC-01 | [UC-01 đặc tả](requirements/uc-01-checkout.md), [UCD-02](diagrams/usecase-checkout.puml), [Activity-01](diagrams/activity-end-to-end.puml), [Sequence-01](diagrams/sequence-checkout.puml), [Class-01](diagrams/class-domain.puml) | `POST /orders`; code: TBD | TBD |
| FR-07 | US-08; UC-01, UC-02, UC-17, UC-18 | [UC-01 đặc tả](requirements/uc-01-checkout.md), [UCD-02](diagrams/usecase-checkout.puml), [Activity-01](diagrams/activity-end-to-end.puml), [Sequence-01](diagrams/sequence-checkout.puml), [Class-01](diagrams/class-domain.puml) | `POST /payments`; code: TBD | TBD |
| FR-08 | US-09; UC-10 | [Activity-01](diagrams/activity-end-to-end.puml), [Sequence-01](diagrams/sequence-checkout.puml), [Class-01](diagrams/class-domain.puml) | `GET /orders`; `GET /orders/:id`; code: TBD | TBD |
| FR-09 | US-10, US-11; UC-11, UC-12 | [Activity-01](diagrams/activity-end-to-end.puml), [Class-01](diagrams/class-domain.puml) | `GET /orders/:id`; `GET /staff/orders`; `PATCH /staff/orders/:id/status`; code: TBD | TBD |
| FR-10 | US-12; UC-13 | [Activity-01](diagrams/activity-end-to-end.puml) (note), [Class-01](diagrams/class-domain.puml) (`CANCELLED`) | `GET /orders`; `GET /orders/:id`; `POST /payments` (Should); code: TBD | TBD |
| FR-11 | US-13; UC-14 | [Class-01](diagrams/class-domain.puml) (`Promotion` mở rộng), [Sequence-01](diagrams/sequence-checkout.puml) (note) | `POST /orders` (Should); code: TBD | TBD |
| FR-12 | US-14; UC-15 | [Class-01](diagrams/class-domain.puml) (`LoyaltyTransaction` mở rộng) | Chuyển trạng thái `COMPLETED` (Could); code: TBD | TBD |
| FR-13 | US-15; UC-16 | [Class-01](diagrams/class-domain.puml) (`Product`) | `POST /products`; `PATCH /products/:id`; `PATCH /products/:id/stock` (Could); code: TBD | TBD |
| NFR-01 | US-01, US-17; UC-03 | [ARCH-API](architecture/architecture.md), [ARCH-WEB](architecture/architecture.md) | `GET /products` (mục tiêu p95); code: TBD | TBD |
| NFR-02 | US-05, US-06, US-18; UC-08, UC-09 | [Sequence-01](diagrams/sequence-checkout.puml), [Class-01](diagrams/class-domain.puml), Deploy-01 (TBD), [ARCH-API](architecture/architecture.md), [ARCH-DB](architecture/architecture.md) | JWT, bcrypt, seed, CI secret scan; code: TBD | TBD |
| NFR-03 | US-17, US-18; UC-03 | Deploy-01 (TBD), [ARCH-API](architecture/architecture.md), [ARCH-DB](architecture/architecture.md) | `GET /health`; migration/seed; code: TBD | TBD |
| NFR-04 | US-01, US-17 | [Activity-01](diagrams/activity-end-to-end.puml), [ARCH-WEB](architecture/architecture.md) | Menu UI / PWA; code: TBD | TBD |
| NFR-05 | US-17, US-18 | Deploy-01 (TBD), ARCH-CI (TBD) | GitHub Actions; Docker; HTTPS; code: TBD | TBD |
| NFR-06 | US-18 | [Sequence-01](diagrams/sequence-checkout.puml), ARCH-CI (TBD) | Unit / Integration / E2E tests; code: TBD | TBD |

---

## 3. Nhật ký cập nhật## 3. Nhật ký cập nhật

| Ngày | PR / Nhánh | Người cập nhật | Phần đã điền / Thay đổi |
|---|---|---|---|
| 2026-11-22 | PR #1 (`chore/init-repo-structure`) | Võ Quốc Phong | Khởi tạo cấu trúc 5 cột cho 19 yêu cầu (`FR-01..FR-13`, `NFR-01..NFR-06`), điền danh sách endpoint dự kiến và đặt trạng thái `TBD` cho các tạo phẩm chưa merge lên `main`. |
| 2026-11-23 | `docs/traceability-update` (PR dự kiến) | Tài | Liên kết các tạo phẩm yêu cầu, UML và kiến trúc đã có; giữ `TBD` cho Deploy-01, ARCH-CI, mã nguồn và kiểm thử chưa xác minh. Chưa xác nhận phạm vi chi tiết của từng sơ đồ; cần review đối chiếu FR trước khi merge. |
