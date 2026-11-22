# ADR-001: Monorepo

**Trạng thái:** Chấp nhận  
**Ngày:** 18/11/2026

## Bối cảnh
BrewLite có web, API, tài liệu và test cần thay đổi đồng bộ trong nhóm hai người.

## Quyết định
Dùng một repository với `apps/web`, `apps/api`, `docs`, `tests`. Một PR cho thay đổi cắt ngang, CI chung; không thêm công cụ monorepo nặng.

## Hệ quả và trade-off
Ưu: truy vết và review đơn giản, chia sẻ CI. Nhược: CI có thể chạy rộng và PR xung đột khi hai người sửa cùng vùng.

## Phương án đã cân nhắc
Hai repository riêng: phân tách rõ nhưng tăng phối hợp và lệch API Contract.

## Liên quan
D4; NFR-05, NFR-06; ARCH-WEB, ARCH-API, ARCH-CI.
