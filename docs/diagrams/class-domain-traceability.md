# BrewLite – Task 2.3: Class Domain – Đối chiếu và quyết định thiết kế

**Nguồn đối chiếu:** `srs.md` v1.0, `uc-01-checkout.md` v1.0, `sequence-checkout.puml`. Sơ đồ activity được tham chiếu theo phạm vi FR-01 đến FR-09 đã mô tả; không dùng nó làm nguồn cho các thuộc tính chưa được SRS xác nhận.

## 1. Ma trận truy vết

| Lớp / enum | FR / NFR và AC có thật trong SRS | Sequence / activity tương ứng | Phạm vi |
|---|---|---|---|
| User, Role | FR-05-AC1..AC4; NFR-02-AC1, AC2, AC4 | Sequence: JWT/role trước POST /orders và POST /payments; activity: UC-09 | Must |
| Product | FR-01-AC1; FR-03-AC1; FR-06-AC1, AC2, AC5; FR-13-AC3 | Sequence: đọc sản phẩm, tồn kho, trừ kho trong transaction; activity: menu, hết hàng | Must; thuộc tính available phục vụ FR-13 Could |
| ProductSize, Size | FR-03-AC1, AC3; FR-06-AC5 | Sequence: size S/M/L và tính lại đơn giá; activity: chọn size | Must |
| Topping, quan hệ Product–Topping | FR-03-AC1; FR-06-AC5 | Sequence: đọc topping và giá theo sản phẩm; activity: chọn topping | Must |
| Order, OrderStatus | FR-06-AC1, AC2; FR-07-AC1, AC2, AC4; FR-08-AC1; FR-09-AC4; FR-10-AC1 | Sequence: Order PENDING → PAID, lỗi rollback; activity: trạng thái đến COMPLETED | Must; CANCELLED chỉ khi FR-10 Should |
| OrderItem | FR-04-AC4; FR-06-AC1, AC5 | Sequence: INSERT OrderItem và tính lineTotal; activity: đặt đơn | Must |
| OrderItemTopping | FR-03-AC1; FR-06-AC5 | Sequence: lựa chọn topping trong OrderItem | Lớp hỗ trợ Must |
| Payment, PaymentStatus, PaymentMethod | FR-07-AC1..AC6 | Sequence: SUCCESS/FAILED, key/hash, replay idempotency; activity: thanh toán và retry | Must |
| Promotion, PromotionType | FR-11-AC1..AC3; FR-06-AC3 | Sequence: FR-11 chỉ ghi note, không vẽ nhánh; UC-01 ALT-04 | Should, chỉ mô hình mở rộng |
| LoyaltyTransaction | FR-12-AC1..AC3 | Không thuộc checkout sequence; activity xử lý COMPLETED là điểm kích hoạt nếu triển khai | Could, chỉ mô hình mở rộng |

## 2. Quyết định thiết kế

1. **UUID, VND, UTC:** mọi `id` là UUID; giá và tổng tiền dùng `Int` VND không âm, tối đa 2.147.483.647; `DateTime` lưu UTC và serialize ISO 8601 (SRS 6.1).
2. **ProductSize và Product–Topping:** mỗi Product có các mức size S/M/L với `extraPrice`; `Topping` lưu giá topping. Quan hệ nhiều-nhiều `Product "0..*" -- "0..*" Topping` mô tả các topping được phép chọn theo sản phẩm để phục vụ FR-03-AC1. Đây là quyết định thiết kế cho việc truy xuất chi tiết sản phẩm, không phải tồn kho riêng. Nhóm cần thống nhất quan hệ này trước migration.
3. **OrderItem giữ snapshot `productName`, `unitPrice`, `lineTotal`:** bảo toàn tên sản phẩm và giá giao dịch dù `Product.basePrice`, `ProductSize.extraPrice` hay `Topping.price` đổi về sau. `OrderItemTopping` giữ `toppingName`, `price`; lớp hỗ trợ này là **quyết định thiết kế suy ra từ yêu cầu tính giá và lưu lịch sử**, không phải tên bảng được SRS quy định.
4. **Không vẽ Cart:** FR-04 quy định giỏ chỉ ở client, không đồng bộ server; class diagram này là domain backend. Không thêm Cart/CartItem vào mô hình persistence.
5. **Payment nhiều lần trên một Order:** FAILED vẫn lưu Payment, Order vẫn PENDING và lần thử mới có key mới. unique `(userId, idempotencyKey)`; userId từ JWT và khớp Order.userId; `requestHash` để phát hiện cùng key khác body; `responseStatus` và `responseBody` là **thuộc tính kỹ thuật đề xuất** để phát lại đúng HTTP/body, kể cả 402 (SRS 6.5; UC-01 ALT-02/03). Chúng không phải tên cột bắt buộc do SRS chỉ định.
6. **Tính nhất quán giao dịch:** tạo Order/OrderItem và trừ kho cùng transaction; ghi Payment SUCCESS và cập nhật Order PAID có điều kiện cùng transaction; tối đa một SUCCESS mỗi Order. FAILED không hoàn kho. Nếu có FR-10, hoàn kho một lần trong transaction chuyển PENDING → CANCELLED.
7. **Promotion:** liên kết `Order 0..* → 0..1 Promotion` bảo đảm một Order dùng tối đa một mã. `FIXED` và `PERCENT` là tên enum thiết kế cho hai loại cố định/phần trăm trong SRS; chưa phải chuỗi API đã được SRS chuẩn hóa. `value` dùng số nguyên, phần trăm cần được xác định thang đo trong API Contract trước khi triển khai.
8. **LoyaltyTransaction:** một Order có tối đa một LoyaltyTransaction; khi triển khai cần UNIQUE theo orderId và transaction/conditional logic để tránh cộng điểm trùng. Điểm tính khi COMPLETED, không phải khi PAID.
9. **Không vẽ controller/service/DTO/Payment Service:** đây là class diagram domain, không phải sơ đồ triển khai hay sequence. `Payment Service` chỉ là thành phần mô phỏng tương tác, không phải thực thể domain bắt buộc.
10. **Quan hệ enum:** đã bỏ bảy mũi tên phụ thuộc `..>` để giảm nhiễu. Kiểu thuộc tính (`Role`, `Size`, `OrderStatus`, `PaymentStatus`, `PaymentMethod`, `PromotionType`) vẫn chỉ rõ enum được dùng.
11. **Ràng buộc kỹ thuật:** email UNIQUE, `name` 1..50, `note` tối đa 200, `quantity` 1..20; mật khẩu chỉ lưu bcrypt hash. Các ràng buộc cần validate tại backend và thực thi bằng constraint DB khi phù hợp.

## 3. Phạm vi và giới hạn

- **Must:** User, Product, ProductSize, Topping, Order, OrderItem, OrderItemTopping, Payment cùng các enum tương ứng.
- **Should:** Promotion và PromotionType (FR-11). `OrderStatus.CANCELLED` chỉ có luồng kích hoạt khi triển khai FR-10.
- **Could:** LoyaltyTransaction (FR-12); quản lý/ngừng bán Product (FR-13).
- Không mô hình hóa lọc danh mục (FR-02) như lớp riêng; `Product.category` đủ cho yêu cầu này. Không có giao hàng, thanh toán thật, đa chi nhánh hoặc lớp Cart lưu server.

**Lưu ý:** `class-domain.puml` là mã nguồn sơ đồ. SVG cần được render bằng PlantUML/PlantText rồi kiểm tra trực quan trước khi nộp; không coi file SVG chưa render là đã xác minh.

## 4. Bổ sung đồng bộ schema dự kiến 25/11/2026

- Order lưu subtotal, discountAmount (default 0), totalAmount; expiresAt và note tùy chọn giữ từ schema V2 (note toàn đơn không mở thêm trường API). ProductSize có id; Product/User có createdAt/updatedAt; Topping.available; Payment.amount, failureReason, userId. ImageUrl, note, failureReason nullable. Quan hệ OrderItemTopping–Topping tùy chọn SetNull, bảo toàn snapshot. Order–Payment Restrict, không xóa lịch sử.
- Product–Topping là liên kết khái niệm nhiều-nhiều; schema triển khai qua ProductTopping (PK kép productId/toppingId).
- Các index dự kiến: Order(userId, createdAt), Order(status, createdAt), Order(status, expiresAt), OrderItem(orderId), Payment(orderId). Đây là sơ đồ domain, không vẽ mọi FK/index vật lý.
- Promotion/LoyaltyTransaction vẫn là mô hình mở rộng, không yêu cầu tạo bảng ở Sprint 1.
- Đối chiếu V2 và ADR-007; cần xác nhận lại schema mới của Phong. Không tuyên bố migration đã cập nhật.
