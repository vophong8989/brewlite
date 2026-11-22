# BrewLite – Hệ thống đặt đồ uống tại quán cà phê

**Môn học:** Công nghệ Phần mềm – Đại học Sài Gòn (HK I 2026–2027)  
**Đồ án:** Assignment 2 – Requirements to Deployment  
**Nhóm thực hiện:** Phan Tấn Tài (A) & Võ Quốc Phong (B)

---

## 1. Giới thiệu

BrewLite là ứng dụng web đặt đồ uống thiết kế theo hướng **mobile-first / PWA**, hỗ trợ khách hàng xem menu, tùy chỉnh kích cỡ/topping, đặt đơn nhận tại quầy, thanh toán mô phỏng và theo dõi trạng thái đơn hàng thông qua cơ chế cập nhật trạng thái định kỳ (polling); đồng thời hỗ trợ nhân viên quầy tiếp nhận và cập nhật tiến độ pha chế.

**Luồng nghiệp vụ tối thiểu:**

```text
Xem menu → Chọn tùy chọn (Size/Topping) → Giỏ hàng → Đặt đơn → Thanh toán → Theo dõi đơn
```

---

## 2. Công nghệ sử dụng (Tech Stack)

- **Frontend:** Next.js (App Router, TypeScript, mobile-first/PWA với Serwist / `manifest.webmanifest`)
- **Backend:** NestJS (TypeScript, Prisma ORM, JWT + Passport, `class-validator`, `@nestjs/terminus`, `@nestjs/swagger`)
- **Database:** PostgreSQL
- **Container & CI/CD:** Docker, Docker Compose, GitHub Actions, GHCR, gitleaks
- **Triển khai (Production):** Vercel (Web) + Render Web Service (API) + Render PostgreSQL

---

## 3. Cấu trúc repository

```text
brewlite/
├── apps/
│   ├── web/                        # Next.js mobile-first/PWA
│   └── api/                        # NestJS + Prisma
├── docs/
│   ├── requirements/               # context-and-scope.md, srs.md, user-stories.md, uc-01-checkout.md
│   ├── diagrams/                   # Sơ đồ PlantUML (.puml) và ảnh kết xuất (.svg)
│   ├── architecture/               # architecture.md & adr/001-monorepo.md, ...
│   ├── continuous-integration/     # Minh chứng CI pass, CI fail, PR bị chặn merge
│   ├── backlog.md                  # Product Backlog cho Sprint 1 và Sprint 2
│   ├── traceability-matrix.md      # Ma trận truy vết yêu cầu – thiết kế – code – test
│   ├── deployment.md               # Hướng dẫn triển khai & hạ tầng production
│   ├── security-audit.md           # Kiểm tra bảo mật & quản lý secret
│   ├── release-notes.md            # Ghi chú phát hành phiên bản
│   ├── sprint-review-and-retrospective.md
│   └── assignment-conformance.md   # Bảng tự đối chiếu tiêu chí nghiệm thu
├── tests/                          # Integration test (INT-Txx) & E2E test (E2E-Txx)
├── .github/
│   ├── workflows/                  # ci.yml, cd.yml, secret-scan.yml
│   ├── ISSUE_TEMPLATE/             # Mẫu user story và bug
│   └── PULL_REQUEST_TEMPLATE.md
├── CONTRIBUTING.md
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 4. Hướng dẫn chạy ở máy cá nhân (Local)

1. **Sao chép cấu hình môi trường:**
   ```bash
   cp .env.example .env
   ```
   Cập nhật các giá trị phù hợp trong file `.env` (không commit file `.env`).

2. **Chạy toàn bộ hệ thống bằng Docker Compose:**
   Sẽ bổ sung ở Sprint 2 (tuần 5) sau khi hoàn thiện `docker-compose.yml`.

3. **Chạy từng dịch vụ (`apps/api` và `apps/web`):**
   Sẽ bổ sung ở Sprint 1 (tuần 3) sau khi khởi tạo mã nguồn ứng dụng.

---

## 5. Kiểm thử (Test)

- **Unit Test & Component Test:** Sẽ bổ sung ở Sprint 1 (tuần 3).
- **Integration Test & E2E Test (Playwright):** Sẽ bổ sung ở Sprint 2 (tuần 5).

---

## 6. Đóng gói (Build)

- **Build Frontend (`apps/web`) & Backend (`apps/api`):** Sẽ bổ sung ở Sprint 1 (tuần 3).
- **Build Docker Image cho API:** Sẽ bổ sung ở Sprint 2 (tuần 5).

---

## 7. Triển khai (Deploy), Bảo mật & Hoàn tác (Rollback)

- **Quy ước khởi động an toàn (Production Safety Check):** Khi `NODE_ENV=production`, ứng dụng API bắt buộc từ chối khởi động nếu `JWT_SECRET` hoặc các mật khẩu tài khoản mặc định (`SEED_STAFF_PASSWORD`, `SEED_MANAGER_PASSWORD`) vẫn giữ giá trị mẫu `change-me` hoặc bị bỏ trống.
- **Triển khai Production (Vercel + Render + GitHub Actions CD):** Sẽ bổ sung ở Sprint 2 (tuần 5). Xem chi tiết tại `docs/deployment.md`.
- **Quy trình Rollback khi sự cố:** Sẽ bổ sung ở Sprint 2 (tuần 5).