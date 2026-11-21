# Quy trình làm việc & Quy ước đóng góp (BrewLite)

Tài liệu này quy định chiến lược quản lý mã nguồn, quy ước commit, quy trình Pull Request và Definition of Done (DoD) của nhóm phát triển BrewLite (Phan Tấn Tài và Võ Quốc Phong).

---

## 1. Chiến lược Branch

Nhánh `main` là nhánh ổn định duy nhất, được bảo vệ bởi Branch Protection Rules:
- Không push trực tiếp lên `main`.
- Mọi thay đổi bắt buộc thông qua **branch phụ + Pull Request** và có ít nhất **1 Approve** từ thành viên còn lại trước khi merge.
- Khi pipeline CI hoạt động (từ Tuần 2), bật bắt buộc status check `ci` phải pass mới được merge.

**Quy ước đặt tên branch:**
- `feat/<mô-tả-ngắn>`: Thêm tính năng mới (ví dụ: `feat/api-products`, `feat/web-checkout`).
- `fix/<mô-tả-ngắn>`: Sửa lỗi (ví dụ: `fix/payment-idempotency`).
- `docs/<mô-tả-ngắn>`: Thêm hoặc cập nhật tài liệu, sơ đồ, ADR (ví dụ: `docs/class-diagram`, `docs/srs`).
- `test/<mô-tả-ngắn>`: Bổ sung integration/E2E test (ví dụ: `test/e2e-checkout`).
- `chore/<mô-tả-ngắn>`: Cấu hình repo, Docker, dependency (ví dụ: `chore/init-repo-structure`).
- `ci/<mô-tả-ngắn>`: Thiết lập hoặc cập nhật workflow CI/CD (ví dụ: `ci/github-actions-pipeline`).

---

## 2. Quy ước Commit (Conventional Commits)

Mỗi commit phải tuân theo định dạng:

```text
<type>(<scope>): <mô tả ngắn gọn bằng tiếng Việt hoặc tiếng Anh>
```

**Danh sách `type` hợp lệ:**
- `feat`: Thêm chức năng mới (ví dụ: `feat(api): add GET /products endpoint`)
- `fix`: Sửa lỗi chức năng hoặc logic nghiệp vụ (ví dụ: `fix(payments): handle duplicate idempotency key with same payload`)
- `docs`: Thêm hoặc cập nhật tài liệu yêu cầu, sơ đồ PlantUML, ADR, ma trận truy vết (ví dụ: `docs(diagrams): add class-domain.puml and class-domain.svg`)
- `test`: Thêm hoặc sửa unit test, integration test, E2E test (ví dụ: `test(orders): add integration test for out-of-stock rollback`)
- `chore`: Khởi tạo cấu trúc repo, cập nhật dependencies, cấu hình Docker (ví dụ: `chore(repo): initialize repository structure and workflow docs`)
- `ci`: Cấu hình hoặc chỉnh sửa GitHub Actions workflow CI/CD và secret scan (ví dụ: `ci(actions): add ci and gitleaks workflows`)

**Các `scope` gợi ý:** `repo`, `srs`, `diagrams`, `adr`, `architecture`, `api`, `web`, `db`, `orders`, `payments`, `auth`, `docker`, `actions`, `traceability`.

---

## 3. Quy trình Pull Request (PR)

1. Chia nhỏ PR theo từng tạo phẩm hoặc từng tính năng độc lập; mở PR ngay sau khi hoàn thành bước đó.
2. Mọi thay đổi về yêu cầu, sơ đồ, API Contract hoặc kiến trúc bắt buộc ghi rõ **Lý do thay đổi** trong mô tả PR.
3. Mỗi PR phải cập nhật `docs/traceability-matrix.md` cho các mã `FR-xx` / `NFR-xx` liên quan.
4. Không merge PR nếu lint, test, build hoặc kiểm tra `.puml`/`.svg` thất bại.
5. Thành viên còn lại bắt buộc review chéo và bấm **Approve** trước khi merge vào `main`.

---

## 4. Quy định về Sơ đồ & Bảo mật

- **Sơ đồ:** Chỉ sử dụng **PlantUML**. Mỗi file `.puml` trong `docs/diagrams/` bắt buộc phải có file kết xuất `.svg` trùng tên đi kèm trong cùng commit/PR.
- **Bảo mật:** Tuyệt đối không commit file `.env`, mật khẩu, token hoặc chuỗi kết nối thật. Không `echo` biến môi trường trong GitHub Actions. Không để chữ `TODO` trong tài liệu nộp (chỉ dùng `TBD` trong `docs/traceability-matrix.md` cho phần chưa có tạo phẩm).

---

## 5. Definition of Done (DoD)

Theo mục 6 của `docs/requirements/user-stories.md`:

> Một User Story hoàn thành khi đáp ứng AC; có mã nguồn và PR được review chéo; lint, test, build thành công; không lộ secret; tài liệu và ma trận truy vết được cập nhật; có thể chạy và kiểm chứng. Với story production, cần thêm URL, health check và bằng chứng triển khai.

---

## 6. Mốc Tag Phát hành (Milestones)

Tag chỉ được tạo trên nhánh `main` **sau khi** PR cuối cùng của giai đoạn đó đã được merge:
- `milestone-task1`: Hoàn thành Task 1 (Context & Scope, SRS, User Stories, UC-01, Class Diagram).
- `milestone-task2`: Hoàn thành Task 2 (Use-case diagrams, Activity, Sequence, Class).
- `milestone-task3`: Hoàn thành Task 3 (Tài liệu kiến trúc, ADR, Deployment diagram).
- `milestone-sprint1`: Hoàn thành Sprint 1 (MVP xem menu + CI pass).
- `v1.0.0`: Hoàn thành Sprint 2, E2E test, triển khai production và tài liệu bàn giao.