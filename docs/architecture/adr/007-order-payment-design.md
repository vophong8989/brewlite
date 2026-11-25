# ADR-007 - Quy tắc dữ liệu, trạng thái và thanh toán Sprint 2

- Ngày: 2026-11-25
- Trạng thái: Proposed (cần Tài và Phong duyệt; chưa triển khai schema).
- Phạm vi: FR-06, FR-07, FR-09, FR-10 (Should), NFR-02, NFR-03.
- Nguồn: SRS 6.2–6.8, API Contract mục 4, Class Diagram, ADR-002, ADR-005 và đề xuất nhóm ngày 25/11/2026.

## Bối cảnh

Backend Sprint 1 còn trong giai đoạn hoàn thiện schema/migration. Cần thống nhất dữ liệu và quy tắc trước khi tích hợp các module Sprint 2, giữ nguyên hợp đồng HTTP đã chốt.

## Quyết định đề xuất

1. Idempotency theo người dùng: `Payment.userId` lấy từ JWT đã xác thực, không từ body. Ràng buộc `@@unique([userId, idempotencyKey])`; bỏ unique toàn cục. Thêm quan hệ User/Payment tương ứng trong Prisma. Bảo đảm `Payment.userId` bằng `Order.userId` trong transaction; cân nhắc khóa ngoại kép để DB cũng bảo vệ bất biến này. Kiểm tra quyền sở hữu trước khi trả dữ liệu; tra cứu key theo user. Replay 200/402 trước khi xét trạng thái thanh toán mới; không phát lại dữ liệu của người khác. Cần xử lý cạnh tranh unique key và cập nhật Order có điều kiện để hai key khác nhau không tạo hai thanh toán SUCCESS. Khi cùng key khác hash trả 422.
2. Lưu `Order.subtotal`, `discountAmount` (default 0), `totalAmount`; server tính lại giá theo danh mục và snapshot. Không có FR-11 thì discount bằng 0. Tiền dùng Int VND không âm, tối đa 2147483647 cho giá trị lưu trữ, kiểm tra cả phép cộng và nhân. Không dùng BigInt trong JSON response.
3. Giữ các tên schema `OrderItem.productName`, `OrderItemTopping.toppingName`, `OrderItemTopping.price`, `Payment.responseStatus`. Cập nhật Class Diagram và ghi chú kỹ thuật cho các thuộc tính bổ sung. Giữ `Order.expiresAt` và `Order.note` hiện tại cho đến khi có quyết định khác; không tự thêm note toàn đơn vào API nếu contract chưa quy định.
4. Thêm index: Order(userId, createdAt), Order(status, createdAt), Order(status, expiresAt), OrderItem(orderId), Payment(orderId). Các index là tối ưu truy vấn, không thay thế transaction và kiểm tra quyền.
5. Payment -> Order dùng onDelete: Restrict, bảo toàn lịch sử thanh toán. Không bổ sung API xóa đơn.
6. PrismaService kết nối lười, giữ $disconnect khi tắt. Health endpoint thực hiện truy vấn nhẹ tới PostgreSQL, xử lý lỗi/timeout trả 503; kiểm chứng DB up/down thực tế. Lưu ý: nếu Docker CMD vẫn yêu cầu migrate deploy thành công trước khi start thì container vẫn có thể không khởi động lúc DB down; cần kiểm chứng startup và chọn quy trình migration phù hợp, không bỏ bước migration một cách tùy tiện.
7. Chỉ thay init viết tay bằng migration do Prisma sinh nếu init chưa từng được áp dụng lên DB dùng chung cần bảo toàn. Phong thực hiện trên DB local riêng, kiểm tra migrate deploy trên DB trống khác, migrate status và đối chiếu schema. Sau khi migration đã được sử dụng ở môi trường chung, dùng migration mới, không xóa/sửa lịch sử.
8. STAFF/MANAGER chỉ chuyển PAID -> PREPARING -> READY -> COMPLETED theo bước liền kề. Đích ngoài luồng, bao gồm CANCELLED thủ công, trả 409 INVALID_STATUS_TRANSITION cho role được phép. Role không được phép vẫn 403. PENDING -> PAID chỉ do thanh toán thành công; PENDING -> CANCELLED chỉ khi FR-10 được triển khai và đã hết hạn. Cập nhật trạng thái và hoàn/trừ tồn kho trong transaction có điều kiện, không hoàn kho nhiều lần.
9. Hash SHA-256 JSON theo thứ tự `orderId`, `method`, `simulate`; thiếu simulate chuẩn hóa null. Logic hiện giữ giá trị simulate hợp lệ được gửi trong hash. Khi PAYMENT_ALLOW_SIMULATE=false kết quả vẫn mặc định SUCCESS. Hai thành viên cần xác nhận cách chuẩn hóa trường simulate bị bỏ qua (bao gồm giá trị không hợp lệ) trước khi tích hợp HTTP; không tự thay đổi ý nghĩa key đã lưu sau khi deploy.
10. Mã test: giữ API-T05/T06 cho health, API-T10–T12 cho HTTP sản phẩm, API-T20–T31 cho nhóm unit domain mới. Xác nhận không trùng trên main và cập nhật mục 8 API Contract bằng PR tài liệu. Không xem test thuần là bằng chứng hoàn thành HTTP/DB/AC.

## Ảnh hưởng và trách nhiệm

- Phong: sửa Prisma schema, relation, index, migration, kết nối và kiểm chứng backend ở PR của Phong. Không ghi đè migration đã áp dụng chung.
- Tài: sửa SRS 6.6 và FR-09-AC4 về đích trạng thái; làm rõ phạm vi key theo user trong SRS 6.5, API Contract mục 4 và ADR-005/Architecture mục 5, 8, 9; cập nhật Class Diagram (tên snapshot, Int, userId/quan hệ Payment, expiresAt, thuộc tính kỹ thuật, quan hệ Topping tùy chọn) và sequence/activity nếu còn mô tả unique toàn cục. Render SVG tương ứng với PUML thay đổi. Không tuyên bố schema đã đồng bộ trước khi nhận bản Phong sửa.
- Hai người: duyệt ADR, thống nhất xử lý simulate, xác nhận phân công và mã test; sau đó mới merge tài liệu và schema tương ứng.

## Kiểm chứng còn thiếu

Jest/ESLint/Prettier/Nest build của repo, Prisma validate, migration/seed, giao dịch đồng thời, quyền sở hữu, HTTP status, health DB down, Docker và tích hợp frontend/backend. Logic domain thuần không thay thế các kiểm thử này.
