# ADR-006: Polling thay cho push notification

**Trạng thái:** Chấp nhận  
**Ngày:** 18/11/2026

## Bối cảnh
Theo quyết định D8 trong kế hoạch v3 và FR-09, Customer cần theo dõi trạng thái đơn và biết khi đồ uống READY. Hệ thống sử dụng Next.js, NestJS và dịch vụ miễn phí; cần cách cập nhật đơn giản, dễ kiểm thử, phù hợp phạm vi MVP.

## Quyết định
Không triển khai push notification. Khi Customer mở màn hình theo dõi đơn, Next.js UI polling `GET /orders/:id` mỗi **5 giây**, dùng quyền truy cập của Customer theo SRS. Khi trạng thái **READY**, giao diện hiển thị thông báo đồ uống sẵn sàng. Dừng polling khi đơn **COMPLETED**, **CANCELLED** hoặc Customer rời màn hình. Backend vẫn là nguồn trạng thái chính xác; không bổ sung kênh realtime khác.

## Hệ quả và trade-off
- **Ưu điểm:** Ít thành phần vận hành, dễ tích hợp REST/JWT và kiểm thử, phù hợp dịch vụ miễn phí.
- **Nhược điểm:** Trạng thái có thể hiển thị trễ tối đa khoảng một chu kỳ polling khi kết nối bình thường; tăng số request khi màn hình mở; không thông báo khi người dùng đã rời màn hình.
- **Giảm thiểu:** Chỉ polling khi màn hình theo dõi đang hoạt động, dừng đúng điều kiện kết thúc; hiển thị loading/error theo SRS.

## Phương án đã cân nhắc
- **WebSocket:** Cập nhật realtime hơn nhưng cần quản lý kết nối và vận hành phức tạp hơn.
- **Server-Sent Events (SSE):** Phù hợp cập nhật một chiều nhưng cần duy trì kết nối lâu dài, không cần thiết cho MVP.
- **Web Push:** Có thể thông báo ngoài màn hình nhưng cần quyền thông báo và hạ tầng bổ sung; trái D8.

## Liên quan
D8 trong kế hoạch v3; FR-09, NFR-01, NFR-04; ARCH-WEB, ARCH-API; `docs/diagrams/activity-end-to-end.puml`; `docs/architecture/architecture.md`.
