# BrewLite – Ứng dụng đặt đồ uống tại quán cà phê

**Môn học:** Công nghệ Phần mềm – Đại học Sài Gòn (HK I 2026–2027)  
**Đồ án:** Assignment 2 – Requirements to Deployment  
**Nhóm thực hiện:** Phan Tấn Tài & Võ Quốc Phong

---

## 1. Giới thiệu

BrewLite là ứng dụng web tối ưu cho thiết bị di động (mobile-first/PWA) hỗ trợ khách hàng đặt đồ uống nhận tại quán cà phê và nhân viên quầy tiếp nhận, xử lý đơn hàng.

**Luồng nghiệp vụ cốt lõi:**

```text
Xem menu → Chọn size/topping → Giỏ hàng → Đặt đơn → Thanh toán mô phỏng → Theo dõi đơn

Cấu trúc thư mục

brewlite/
├── apps/
│   ├── web/                        # Next.js mobile-first/PWA
│   └── api/                        # NestJS + Prisma
├── docs/
│   ├── requirements/               # context-and-scope.md, srs.md, uc-01-checkout.md
│   ├── diagrams/                   # Sơ đồ PlantUML (.puml) và ảnh xuất (.svg)
│   ├── architecture/               # Tài liệu kiến trúc & ADR (adr/001-*.md)
│   ├── continuous-integration/     # Minh chứng CI pass / fail / chặn merge
│   ├── traceability-matrix.md      # Ma trận truy vết yêu cầu - thiết kế - code - test
│   ├── deployment.md               # Hướng dẫn triển khai & thông tin hạ tầng
│   ├── security-audit.md           # Kiểm tra bảo mật & quản lý secret
│   ├── release-notes.md            # Ghi chú phát hành
│   ├── sprint-review-and-retrospective.md
│   └── assignment-conformance.md   # Đối chiếu tiêu chí nghiệm thu
├── tests/                          # Integration test (INT-Txx) & E2E test (E2E-Txx)
├── .github/
│   ├── workflows/                  # ci.yml, cd.yml, secret-scan.yml
│   └── PULL_REQUEST_TEMPLATE.md
├── CONTRIBUTING.md
├── docker-compose.yml
├── .env.example
└── README.md