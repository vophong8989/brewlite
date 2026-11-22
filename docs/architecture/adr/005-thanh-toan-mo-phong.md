# ADR-005: Thanh toán mô phỏng

**Trạng thái:** Chấp nhận  
**Ngày:** 18/11/2026

## Bối cảnh
SRS yêu cầu thanh toán WALLET/CARD, nhánh SUCCESS/FAILED, idempotency; SCP-OUT-01 loại trừ cổng thanh toán thật.

## Quyết định
Payment Service là module **nội bộ NestJS API**; không có container riêng. Chỉ nhận `simulate` khi `PAYMENT_ALLOW_SIMULATE=true`; nếu false thì bỏ qua và mặc định SUCCESS. Lưu `idempotencyKey` unique, `requestHash` và kết quả HTTP trong Payment; cùng key/body trả kết quả cũ kể cả 402, key khác body trả 422; ghi Payment và đổi Order cùng transaction.

## Hệ quả và trade-off
Ưu: kiểm thử được nhánh lỗi, không cần provider thật. Nhược: không đại diện đầy đủ cho thanh toán ngoài đời, không xử lý tiền thật.

## Phương án đã cân nhắc
Payment Gateway thật: ngoài phạm vi và tăng chi phí/phụ thuộc. Microservice thanh toán: không cần thiết với nhóm hai người.

## Liên quan
FR-07, NFR-02; SCP-OUT-01; ARCH-PAY, ARCH-API.
