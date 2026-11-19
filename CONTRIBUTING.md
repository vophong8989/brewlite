```markdown
# Quy trình làm việc & Quy ước đóng góp (BrewLite)

Tài liệu này quy định chiến lược quản lý mã nguồn, quy ước commit, quy trình Pull Request và Definition of Done (DoD) của nhóm phát triển BrewLite.

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
- `chore/<mô-tả-ngắn>`: Cấu hình repo, CI/CD, Docker, dependency (ví dụ: `chore/init-repo-structure`, `chore/setup-ci`).
- `test/<mô-tả-ngắn>`: Bổ sung integration/E2E test (ví dụ: `test/e2e-checkout`).

---

## 2. Quy ước Commit (Conventional Commits)

Mỗi commit phải tuân theo định dạng:

```text
<type>(<scope>): <mô tả ngắn gọn bằng tiếng Việt hoặc tiếng Anh>