# ADR-005: Thanh toán mô phỏng

**Trạng thái:** Chấp nhận  
**Ngày:** 18/11/2026

## Bối cảnh
SRS yêu cầu thanh toán WALLET/CARD, nhánh SUCCESS/FAILED, idempotency; SCP-OUT-01 loại trừ cổng thanh toán thật.

## Quyết định
Payment Service là module **nội bộ NestJS API**; không có container riêng. Chỉ nhận `simulate` khi `PAYMENT_ALLOW_SIMULATE=true`; nếu false thì bỏ qua và mặc định SUCCESS. Đề xuất cập nhật theo ADR-007 (25/11/2026, chờ duyệt): unique `(userId, idempotencyKey)`, userId từ JWT và khớp chủ Order; lưu requestHash và kết quả HTTP. Cùng user/key/body replay kể cả 402; cùng user/key khác body trả 422. Ghi Payment và đổi Order có điều kiện trong cùng transaction, chống hai key khác nhau tạo hai SUCCESS cho một Order. Hash khi tắt mô phỏng cần chốt trước tích hợp.

## Hệ quả và trade-off
Ưu: kiểm thử được nhánh lỗi, không cần provider thật. Nhược: không đại diện đầy đủ cho thanh toán ngoài đời, không xử lý tiền thật.

## Phương án đã cân nhắc
Payment Gateway thật: ngoài phạm vi và tăng chi phí/phụ thuộc. Microservice thanh toán: không cần thiết với nhóm hai người.

## Liên quan
FR-07, NFR-02; SCP-OUT-01; ARCH-PAY, ARCH-API.
