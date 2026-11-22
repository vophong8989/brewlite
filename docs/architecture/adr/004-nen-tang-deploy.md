# ADR-004: Nền tảng triển khai

**Trạng thái:** Chấp nhận (có điều kiện kiểm chứng ở tuần 3)  
**Ngày:** 18/11/2026

## Bối cảnh
D2/D3 chốt hạ tầng miễn phí; cần phân tách deploy web và API, bảo vệ database.

## Quyết định
Web deploy Vercel qua Git integration; API đóng Docker image, push GHCR tag semver + commit SHA; GitHub Actions gọi Render Deploy Hook. Render Postgres qua Internal URL, không bật External access. Neon free dự phòng. **Chưa kiểm chứng** Render free có chạy trực tiếp GHCR image: thử tuần 3; nếu không, Render build từ Git và GHCR chỉ lưu image tag.

## Hệ quả và trade-off
Ưu: chi phí thấp, phân ranh giới rõ. Nhược: cold start, DB free hết hạn, giới hạn tích hợp GHCR chưa xác nhận; smoke test cần retry và có rollback-guide.

## Phương án đã cân nhắc
VPS/Kubernetes: tăng chi phí/vận hành, ngoài phạm vi. Chỉ Git build không GHCR: phương án dự phòng nếu Render free không hỗ trợ image.

## Liên quan
D2, D3; NFR-02, NFR-03, NFR-05, NFR-06; ARCH-WEB, ARCH-API, ARCH-DB, ARCH-CI, ARCH-REG.
