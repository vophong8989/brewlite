# Ma trận truy vết — BrewLite

**Trạng thái:** thiết kế và endpoint dự kiến; mã nguồn, test case chưa được tạo sẽ ghi `TBD`. Chỉ cập nhật thành link sau khi có file thực.

| Mã yêu cầu | Use-case/User Story | Thiết kế/Sơ đồ | Code/API | Test |
|---|---|---|---|---|
| [FR-01](requirements/srs.md) | US-01, US-17; UC-03 | [Activity-01](diagrams/activity-end-to-end.puml), [Class-01](diagrams/class-domain.puml), [UC tổng quát](diagrams/usecase-overview.puml) | GET /products; code: TBD | TBD |
| [FR-02](requirements/srs.md) | US-02, US-16; UC-04, UC-05 | [UC tổng quát](diagrams/usecase-overview.puml), [Class-01](diagrams/class-domain.puml) (Product.category) | GET /products?category=... (Should); lọc giá Could; code: TBD | TBD |
| [FR-03](requirements/srs.md) | US-03; UC-06 | [Activity-01](diagrams/activity-end-to-end.puml), [Class-01](diagrams/class-domain.puml) | GET /products/:id; code: TBD | TBD |
| [FR-04](requirements/srs.md) | US-04; UC-07 | [Activity-01](diagrams/activity-end-to-end.puml), [Class-01](diagrams/class-domain.puml) (Cart chỉ ở client) | Giỏ hàng client; code: TBD | TBD |
| [FR-05](requirements/srs.md) | US-05, US-06; UC-08, UC-09; UC-01 (tiền điều kiện đăng nhập) | [Activity-01](diagrams/activity-end-to-end.puml), [Sequence-01](diagrams/sequence-checkout.puml), [Class-01](diagrams/class-domain.puml) | POST /auth/register; POST /auth/login; code: TBD | TBD |
| [FR-06](requirements/srs.md) | US-07; UC-01 | [UC-01 đặc tả](requirements/uc-01-checkout.md), [Use-case checkout](diagrams/usecase-checkout.puml), [Activity-01](diagrams/activity-end-to-end.puml), [Sequence-01](diagrams/sequence-checkout.puml), [Class-01](diagrams/class-domain.puml) | POST /orders; code: TBD | TBD |
| [FR-07](requirements/srs.md) | US-08; UC-01, UC-02, UC-17, UC-18 | [UC-01 đặc tả](requirements/uc-01-checkout.md), [Use-case checkout](diagrams/usecase-checkout.puml), [Activity-01](diagrams/activity-end-to-end.puml), [Sequence-01](diagrams/sequence-checkout.puml), [Class-01](diagrams/class-domain.puml) | POST /payments; code: TBD | TBD |
| [FR-08](requirements/srs.md) | US-09; UC-10 | [Activity-01](diagrams/activity-end-to-end.puml), [Sequence-01](diagrams/sequence-checkout.puml), [Class-01](diagrams/class-domain.puml) | GET /orders; GET /orders/:id; code: TBD | TBD |
| [FR-09](requirements/srs.md) | US-10, US-11; UC-11, UC-12 | [Activity-01](diagrams/activity-end-to-end.puml), [Class-01](diagrams/class-domain.puml) | GET /orders/:id; GET /staff/orders; PATCH /staff/orders/:id/status; code: TBD | TBD |
| [FR-10](requirements/srs.md) | US-12; UC-13 | [Activity-01](diagrams/activity-end-to-end.puml) (note), [Class-01](diagrams/class-domain.puml) (CANCELLED) | GET /orders; GET /orders/:id; POST /payments (nếu triển khai); code: TBD | TBD |
| [FR-11](requirements/srs.md) | US-13; UC-14 | [Class-01](diagrams/class-domain.puml) (Promotion mở rộng), [Sequence-01](diagrams/sequence-checkout.puml) (note) | POST /orders (nếu triển khai); code: TBD | TBD |
| [FR-12](requirements/srs.md) | US-14; UC-15 | [Class-01](diagrams/class-domain.puml) (LoyaltyTransaction mở rộng) | Chuyển COMPLETED (nếu triển khai); code: TBD | TBD |
| [FR-13](requirements/srs.md) | US-15; UC-16 | [Class-01](diagrams/class-domain.puml) (Product) | POST /products; PATCH /products/:id; PATCH /products/:id/stock (nếu triển khai); code: TBD | TBD |
| [NFR-01](requirements/srs.md) | US-01, US-17; UC-03 | ARCH-API, ARCH-WEB | GET /products (mục tiêu p95); code: TBD | TBD |
| [NFR-02](requirements/srs.md) | US-05, US-06, US-18; UC-08, UC-09 | [Sequence-01](diagrams/sequence-checkout.puml), [Class-01](diagrams/class-domain.puml), [Deploy-01](diagrams/deployment-production.puml); ARCH-API, ARCH-DB | JWT, bcrypt, seed, CI secret scan; code: TBD | TBD |
| [NFR-03](requirements/srs.md) | US-17, US-18; UC-03 | [Deploy-01](diagrams/deployment-production.puml); ARCH-API, ARCH-DB | GET /health; migration/seed; code: TBD | TBD |
| [NFR-04](requirements/srs.md) | US-01, US-17 | [Activity-01](diagrams/activity-end-to-end.puml); ARCH-WEB | Menu UI / PWA; code: TBD | TBD |
| [NFR-05](requirements/srs.md) | US-17, US-18 | [Deploy-01](diagrams/deployment-production.puml); ARCH-CI | GitHub Actions; Docker; HTTPS; code: TBD | TBD |
| [NFR-06](requirements/srs.md) | US-18 | [Sequence-01](diagrams/sequence-checkout.puml); ARCH-CI | Unit/integration/E2E tests; code: TBD | TBD |

**Quy tắc:** mỗi PR thay `TBD` bằng đường dẫn thực khi code/test được tạo; giữ đủ 5 cột; không khẳng định AC đã pass trước khi chạy kiểm thử.