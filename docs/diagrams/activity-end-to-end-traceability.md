# Đối chiếu Activity Diagram Task 2.1

**Sơ đồ:** `activity-end-to-end.puml`  
**Nguồn:** `srs.md`, `uc-01-checkout.md`, `sequence-checkout.puml`

| Phân đoạn / nhánh | UC-01 hoặc FR/US | AC từ SRS |
|---|---|---|
| Menu loading/empty/error | FR-01; US-01 | FR-01-AC1, FR-01-AC2, FR-01-AC3 |
| Chi tiết, size/topping | FR-03; US-03 | FR-03-AC1, FR-03-AC3 |
| Giỏ client, sửa số lượng, giỏ rỗng | FR-04; US-04 | FR-04-AC1, FR-04-AC2, FR-04-AC3, FR-04-AC4 |
| Đăng ký/đăng nhập khi thiếu JWT | EX-01; FR-05; US-05, US-06 | FR-05-AC1, FR-05-AC2, FR-05-AC3, FR-05-AC4 |
| Tạo đơn thành công | MAIN 1-6; US-07 | FR-06-AC1, FR-06-AC5 |
| Lỗi JWT/role | EX-01, EX-02 | FR-06-AC4, FR-07-AC5 |
| Validate, sản phẩm không tồn tại | EX-03, EX-04 | FR-06-AC3 |
| Hết hàng và rollback | EX-05 | FR-06-AC2 |
| WALLET/CARD, thanh toán SUCCESS | MAIN 7-12; ALT-01; US-08 | FR-07-AC1, FR-07-AC6 |
| FAILED, thử key mới hoặc dừng | ALT-02; EX-06 | FR-07-AC2 |
| Cùng key/body; key khác body | ALT-03; EX-08 | FR-07-AC3 |
| Thiếu key; đơn không còn PENDING | EX-07, EX-09 | FR-07-AC4 |
| Đơn không tồn tại hoặc của người khác | EX-10 | FR-07-AC4, FR-07-AC5 |
| Theo dõi 5 giây, READY/COMPLETED | FR-09; US-10 | FR-09-AC1, FR-09-AC2 |
| STAFF/MANAGER xử lý trạng thái | FR-09; US-11 | FR-09-AC3, FR-09-AC4 |

## Nhánh cố ý lược bỏ

- **ALT-04 / EX-11:** FR-11 khuyến mãi là Should; chỉ có ghi chú.
- **EX-12:** FR-10 lazy expiration là Should; chỉ có ghi chú.
- **EX-13:** Không đi sâu retry mạng, cold start hoặc HTTP 503; đã có sequence và SRS.
- **Chi tiết Payment idempotency:** Chỉ thể hiện quyết định trả kết quả cũ; giao dịch và request hash nằm ở sequence diagram.
- **FR-12/FR-13:** Chức năng Could, ngoài luồng nghiệp vụ Must.

## Cập nhật luồng song song

- Nhánh Next.js UI: polling `GET /orders/:id` mỗi 5 giây; hiển thị READY, dừng khi COMPLETED/CANCELLED hoặc rời màn hình (FR-09-AC1, FR-09-AC2).
- Nhánh Cashier/Manager: đăng nhập UC-09, HTTP 200 tiếp tục hoặc HTTP 401 kết thúc; sau đó xử lý PAID đến COMPLETED (FR-05-AC3, FR-09-AC3, FR-09-AC4).

**Dự thảo cập nhật 25/11/2026:** key thanh toán có phạm vi theo user; kiểm tra quyền sở hữu, replay trước xét trạng thái yêu cầu mới, cập nhật PAID có điều kiện để tránh hai SUCCESS. Xem [ADR-007](../architecture/adr/007-order-payment-design.md).
