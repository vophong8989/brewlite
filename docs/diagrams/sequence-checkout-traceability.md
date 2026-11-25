# Đối chiếu Sequence Diagram UC-01

**Nguồn:** `srs.md` v1.0 và `uc-01-checkout.md` v1.0.

| Nhánh trong sequence | Luồng UC-01 | AC trong SRS |
|---|---|---|
| Tạo đơn thành công, tính giá và trừ kho | MAIN bước 1-6 | FR-04-AC4, FR-06-AC1, FR-06-AC5, FR-08-AC1 |
| Thanh toán thành công, chuyển PAID | MAIN bước 7-12 | FR-07-AC1, FR-07-AC6, FR-08-AC1 |
| Chọn WALLET hoặc CARD | ALT-01 | FR-07-AC1 |
| Thanh toán FAILED, thử lại với key mới | ALT-02, EX-06 | FR-07-AC2 |
| Cùng key và cùng body, trả đúng kết quả đã lưu | ALT-03 | FR-07-AC3 |
| JWT thiếu/sai/hết hạn khi tạo/thanh toán | EX-01 | FR-06-AC4, FR-07-AC5, NFR-02-AC2 |
| STAFF/MANAGER không có quyền | EX-02 | FR-06-AC4, FR-07-AC5, NFR-02-AC2 |
| Giỏ hoặc dữ liệu không hợp lệ | EX-03 | FR-03-AC3, FR-04-AC4, FR-06-AC3, NFR-04-AC3 |
| Sản phẩm không tồn tại | EX-04 | FR-06-AC3 |
| Hết hàng, rollback | EX-05 | FR-06-AC2 |
| Thiếu Idempotency-Key | EX-07 | FR-07-AC4 |
| Key cũ và body khác | EX-08 | FR-07-AC3 |
| Đơn không còn PENDING | EX-09 | FR-07-AC4 |
| Đơn không tồn tại hoặc không thuộc Customer | EX-10 | FR-07-AC4, FR-07-AC5 |
| Không nhận phản hồi/cold start, retry cùng key/body | EX-13 | FR-07-AC3, NFR-03-AC3 |

## Các nhánh cố ý không vẽ

| Luồng UC-01 | Lý do | AC trong SRS |
|---|---|---|
| ALT-04, EX-11: Áp mã khuyến mãi | FR-11 là Should; nằm ngoài phạm vi sequence này, chỉ có note tham chiếu UC-01 | FR-11-AC1, FR-11-AC2, FR-11-AC3 |
| EX-12: Tự hủy đơn quá hạn | FR-10 là Should; không thể hiện lazy expiration trong sequence checkout | FR-10-AC1, FR-10-AC2, FR-07-AC4 |
| MAIN bước 13: Polling trạng thái | Kết thúc sequence ngay khi UI chuyển sang màn hình theo dõi | FR-09-AC1, FR-09-AC2 |
| EX-13: GET /health trả 503 khi mất DB | Kiểm tra health không nằm trong trình tự chính của UC-01; chỉ vẽ tác động mất phản hồi/cold start | NFR-03-AC1 |

Không đặt tên mới cho mã `code` của HTTP 401/403/404 đơn hoặc 400 thiếu Idempotency-Key vì SRS chưa định danh.

**Dự thảo cập nhật 25/11/2026:** key thanh toán có phạm vi theo user; kiểm tra quyền sở hữu, replay trước xét trạng thái yêu cầu mới, cập nhật PAID có điều kiện để tránh hai SUCCESS. Xem [ADR-007](../architecture/adr/007-order-payment-design.md).
