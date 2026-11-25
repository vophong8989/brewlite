# Đặc tả use-case UC-01: Đặt và thanh toán đơn hàng

**Phiên bản:** 1.1 (dự thảo cập nhật 25/11/2026)
**Ngày:** 17/11/2026  
**Dự án:** BrewLite - Assignment 2  
**Tạo phẩm:** Task 1.3  
**Mức ưu tiên:** Must  
**Tham chiếu:** `docs/requirements/srs.md`, `docs/requirements/user-stories.md`, `docs/diagrams/usecase-overview.puml`  
**Sơ đồ riêng:** `docs/diagrams/usecase-checkout.puml`

## 1. Thông tin chung

| Thuộc tính | Đặc tả |
|---|---|
| Mã / tên | UC-01 - Đặt và thanh toán đơn hàng |
| Mô tả | Customer xác nhận giỏ hàng, tạo đơn PENDING có trừ tồn kho, sau đó thanh toán Ví/Thẻ mô phỏng để chuyển đơn sang PAID. |
| Actor chính | Customer (role CUSTOMER) |
| Thành phần hỗ trợ nội bộ | Payment Service (module mô phỏng NestJS, không phải actor ngoài hệ thống) |
| Use-case liên quan | UC-02 Thanh toán (`<<include>>`); UC-17 Thanh toán Ví và UC-18 Thanh toán Thẻ (chuyên biệt hóa UC-02); UC-09 Đăng nhập (tiền điều kiện); UC-14 Áp mã khuyến mãi (`<<extend>>` UC-01, Should). |
| Yêu cầu / User Story | FR-06, FR-07, FR-08; US-07, US-08; mở rộng FR-11/US-13. |

## 2. Trigger

Customer nhấn xác nhận đặt hàng từ giỏ hàng và tiếp tục thanh toán tại giao diện Next.js.

## 3. Tiền điều kiện

1. Customer đã đăng nhập và có JWT hợp lệ với role CUSTOMER; JWT chứa `sub` và `role`.
2. Giỏ hàng lưu tại client có ít nhất một dòng hợp lệ; mỗi `quantity` là số nguyên từ 1 đến 20, `size` thuộc S/M/L, `note` tối đa 200 ký tự nếu có.
3. Hệ thống đã có dữ liệu sản phẩm và tồn kho. Việc sản phẩm còn tồn tại và có đủ số lượng đặt được kiểm tra tại bước 3 của luồng chính; size/topping không ảnh hưởng số lượng tồn kho.
4. NestJS API và PostgreSQL sẵn sàng phục vụ yêu cầu; Payment Service mô phỏng có thể xử lý kết quả thanh toán.

Tiền điều kiện không thay thế kiểm tra phía backend: quyền truy cập, dữ liệu, giá và tồn kho đều phải xác minh lại trong mỗi yêu cầu.

## 4. Hậu điều kiện

| Trường hợp | Đơn hàng | Tồn kho | Thanh toán |
|---|---|---|---|
| Thành công | Tạo đơn và chuyển PENDING → PAID. | Đã trừ theo từng sản phẩm khi tạo đơn, không trừ lần nữa khi thanh toán. | Có kết quả Payment SUCCESS, HTTP 200. |
| Lỗi trước/trong tạo đơn | Không tạo đơn mới; transaction rollback nếu đã bắt đầu. | Không thay đổi. | Chưa có thanh toán. |
| Tạo đơn thành công, thanh toán FAILED | Đơn vẫn PENDING. | Vẫn đã trừ, không rollback việc tạo đơn. | Nhận HTTP 402 `PAYMENT_DECLINED`; có thể thử lại bằng key mới. |
| Lỗi request thanh toán hoặc mất kết nối sau khi tạo đơn | Đơn đã tạo vẫn tồn tại; trạng thái thực tế phải được kiểm tra lại, không tự coi là thất bại. | Vẫn đã trừ, trừ khi FR-10 thực sự hủy đơn về sau. | Không gửi lại bằng key khác trước khi xác định kết quả; dùng lại cùng key và body khi cần retry. |
| FR-10 được triển khai và đơn PENDING quá 30 phút | Đơn chuyển CANCELLED khi lazy expiration được kích hoạt. | Hoàn theo từng dòng đơn trong cùng transaction, tối đa một lần. | Không thể phát sinh thanh toán mới cho đơn đã CANCELLED. |

## 5. Luồng chính (thành công)

| Bước | Chủ thể | Hành động / phản hồi |
|---|---|---|
| 1 | Customer | Mở giỏ hàng, kiểm tra sản phẩm, size, topping, số lượng và tổng tiền hiển thị; nhấn **Đặt đơn**. |
| 2 | Next.js UI | Kiểm tra giỏ không rỗng, `quantity` 1 đến 20, size S/M/L; gửi `POST /orders` với `Authorization: Bearer <JWT>` và các lựa chọn của giỏ. Không sử dụng giá client làm nguồn xác thực. |
| 3 | NestJS API | Xác thực JWT, yêu cầu role CUSTOMER; validate dữ liệu, kiểm tra sản phẩm tồn tại và tồn kho theo sản phẩm. |
| 4 | NestJS API | Tính `unitPrice`, `lineTotal` và `totalAmount` bằng giá lưu tại server, số nguyên VND; mở transaction, tạo đơn PENDING và trừ tồn kho tương ứng. |
| 5 | NestJS API | Commit transaction thành công, trả **201** kèm đơn và mã đơn UUID, trạng thái PENDING, các dòng đơn, tổng tiền và thời gian ISO 8601 UTC. |
| 6 | Next.js UI | Hiển thị mã đơn, trạng thái PENDING và tổng tiền theo kết quả server; hiển thị lựa chọn phương thức thanh toán. |
| 7 | Customer | Chọn WALLET hoặc CARD và xác nhận thanh toán. |
| 8 | Next.js UI | Tạo một `Idempotency-Key` cho lần thanh toán, gửi `POST /payments` kèm JWT, header `Idempotency-Key` và body có `orderId`, `method`; `simulate=SUCCESS` chỉ có hiệu lực khi `PAYMENT_ALLOW_SIMULATE=true`. |
| 9 | NestJS API | Kiểm tra JWT/role và quyền sở hữu đơn; tra kết quả theo (userId, Idempotency-Key) và requestHash trước khi kiểm tra PENDING cho lần thanh toán mới. |
| 10 | Payment Service | Mô phỏng kết quả SUCCESS cho phương thức WALLET/CARD. Khi `PAYMENT_ALLOW_SIMULATE=false`, backend bỏ qua `simulate` và mặc định SUCCESS. |
| 11 | NestJS API | Ghi nhận Payment SUCCESS và chuyển đơn PENDING → PAID; trả **200** với kết quả SUCCESS và trạng thái PAID. |
| 12 | Next.js UI | Hiển thị xác nhận thanh toán thành công và trạng thái PAID; chuyển Customer sang màn hình theo dõi đơn. |
| 13 | Next.js UI | Theo FR-09, lấy trạng thái đơn mỗi 5 giây khi màn hình theo dõi mở; READY hiển thị đồ uống sẵn sàng; dừng khi COMPLETED, CANCELLED hoặc rời màn hình. |

## 6. Luồng thay thế

| Mã | Điểm rẽ | Diễn biến | Kết quả / tiếp tục |
|---|---|---|---|
| ALT-01 | Bước 7 | Customer chọn Ví (WALLET, UC-17) hoặc Thẻ (CARD, UC-18). | Cùng dùng UC-02 và `POST /payments`, trở lại bước 8. |
| ALT-02 | Bước 10 | Khi cho phép mô phỏng FAILED, Payment Service trả FAILED; API trả 402 `PAYMENT_DECLINED`. Customer chọn thử lại, UI tạo **key mới** cho yêu cầu mới. | Đơn tiếp tục PENDING, kho vẫn trừ; trở lại bước 8 với key mới. |
| ALT-03 | Bước 8 hoặc 11 | Do retry hoặc phản hồi bị mất, client gửi lại **cùng key và cùng body**; API trả chính xác kết quả đã lưu, kể cả 200 hoặc 402, không tạo Payment khác. | UI xử lý kết quả nhận được; không nhân đôi thanh toán hay chuyển trạng thái. |
| ALT-04 | Trước bước 2 | Chỉ nếu triển khai FR-11, Customer áp mã khuyến mãi qua **extension point UC-14**; server xác minh mã và tính giảm giá trong `POST /orders`. | Mã hợp lệ: tiếp tục bước 3 đến 5, tổng tiền server tính đã giảm; không triển khai FR-11: `discountAmount=0`. |

## 7. Luồng ngoại lệ

Tất cả phản hồi lỗi HTTP do NestJS cung cấp theo cấu trúc `{statusCode, error, message, code}`. Với trường hợp SRS chưa định danh `code` cụ thể, không tự đặt mã mới.

| Mã | Bước / tình huống | HTTP và `code` | Trạng thái dữ liệu | Hành vi Next.js UI | AC tham chiếu |
|---|---|---|---|---|---|
| EX-01 | Bước 2/8: thiếu JWT, JWT sai hoặc hết hạn. | **401**; mã `code` cụ thể không được đặt tên trong SRS. | Nếu trước bước 5: không tạo đơn, kho giữ nguyên. Nếu ở bước 8: đơn đã tạo vẫn PENDING, kho đã trừ. | Yêu cầu Customer đăng nhập lại qua UC-09; không tự tạo lại đơn đã có. | FR-06-AC4; FR-07-AC5; NFR-02-AC2 |
| EX-02 | Bước 3/9: STAFF hoặc MANAGER gọi `POST /orders` hoặc `POST /payments`. | **403**; mã `code` cụ thể không được đặt tên trong SRS. | Tạo đơn bị từ chối: không tạo đơn/không trừ kho. Thanh toán bị từ chối: không tạo Payment, đơn cũ không thay đổi. | Hiển thị thông báo không đủ quyền; không tiếp tục checkout. | FR-06-AC4; FR-07-AC5; NFR-02-AC2 |
| EX-03 | Bước 2/3: giỏ rỗng, `quantity` ngoài 1 đến 20, size sai hoặc dữ liệu không hợp lệ. | **400** `VALIDATION_ERROR` cho dữ liệu đặt đơn không hợp lệ. | Không tạo đơn, không trừ kho. | Hiển thị lỗi tại trường tương ứng, cho sửa giỏ và gửi lại. | FR-04-AC4; FR-03-AC3; FR-06-AC3; NFR-04-AC3 |
| EX-04 | Bước 3: một sản phẩm không tồn tại. | **404** `PRODUCT_NOT_FOUND`. | Không tạo đơn, không trừ kho. | Thông báo sản phẩm không còn tồn tại; yêu cầu cập nhật giỏ. | FR-06-AC3 |
| EX-05 | Bước 3/4: không đủ tồn kho, kể cả cạnh tranh đặt hàng. | **409** `OUT_OF_STOCK`. | Rollback toàn bộ transaction, không tạo đơn, tồn kho không thay đổi bởi yêu cầu thất bại. | Thông báo hết hàng; cho điều chỉnh số lượng/giỏ; không chuyển sang thanh toán. | FR-06-AC2 |
| EX-06 | Bước 10: thanh toán bị từ chối (FAILED). | **402** `PAYMENT_DECLINED`. | Đơn giữ PENDING, kho vẫn trừ; lưu kết quả thất bại theo idempotency. | Thông báo thất bại và cho thử lại với key mới. | FR-07-AC2; FR-07-AC3 |
| EX-07 | Bước 8: thiếu header `Idempotency-Key`. | **400**; SRS không đặt tên `code` riêng. | Không ghi Payment; đơn PENDING, kho đã trừ. | Giữ màn hình thanh toán, tạo/gửi key hợp lệ trước khi thử lại. | FR-07-AC4 |
| EX-08 | Bước 9: cùng key nhưng body khác lần đã lưu. | **422** `IDEMPOTENCY_KEY_REUSED`. | Không tạo Payment mới, không thay đổi đơn hoặc kho. | Không âm thầm gửi lại; yêu cầu tạo key mới cho giao dịch mới theo quy tắc. | FR-07-AC3 |
| EX-09 | Bước 9: yêu cầu thanh toán **mới** cho đơn không còn PENDING (PAID/CANCELLED...). | **409** `ORDER_NOT_PAYABLE`. | Không tạo Payment mới; đơn và kho giữ trạng thái hiện tại. | Thông báo đơn không thể thanh toán; tải lại trạng thái đơn. | FR-07-AC4 |
| EX-10 | Bước 9: đơn không tồn tại hoặc Customer đang thanh toán đơn của người khác. | **404**; SRS không quy định `code` riêng cho lỗi này. | Không tạo Payment; không đổi đơn hoặc kho. | Hiển thị không tìm thấy đơn; không tiết lộ dữ liệu đơn người khác. | FR-07-AC4; FR-07-AC5; NFR-02-AC2 |
| EX-11 | Bước 3/4: mã khuyến mãi sai/hết hạn (chỉ khi FR-11 được triển khai). | **422** `PROMOTION_INVALID`. | Không tạo đơn, không trừ kho, không áp dụng giảm giá. | Thông báo mã không hợp lệ, cho sửa/bỏ mã và xác nhận lại. | FR-06-AC3; FR-11-AC2 |
| EX-12 | Bước 9 hoặc lúc đọc đơn: nếu có FR-10, đơn PENDING quá 30 phút khi gọi `GET /orders`, `GET /orders/:id`, `POST /payments`. | Kết quả lazy: đơn **CANCELLED**; yêu cầu thanh toán mới của đơn không còn PENDING trả **409** `ORDER_NOT_PAYABLE`. | Hoàn kho theo từng dòng và chuyển CANCELLED trong cùng transaction, tối đa một lần; không tạo Payment mới. | Thông báo đơn đã bị hủy, tải lại trạng thái; không cho thanh toán lại đơn này. | FR-10-AC1; FR-10-AC2; FR-07-AC4 |
| EX-13 | Bước 2/8: mạng mất kết nối, API lạnh (cold start) hoặc request hết thời gian chờ. | Có thể **không nhận được HTTP response**; không khẳng định mã lỗi khi chưa có phản hồi. Health check khi DB mất kết nối trả **503**. | Nếu tạo đơn chưa xác nhận: kết quả chưa biết, không mặc định rollback. Nếu thanh toán chưa nhận phản hồi: có thể đã được lưu; không mặc định thất bại. | Hiển thị loading/error phù hợp; chờ service sẵn sàng, kiểm tra trạng thái đơn qua API, retry thanh toán bằng **cùng key và body** để lấy kết quả đã lưu, tránh tạo giao dịch kép. | NFR-03-AC1; NFR-03-AC3; FR-07-AC3; FR-01-AC3 |

**Lưu ý về EX-12:** Nếu không triển khai FR-10, đơn PENDING bỏ dở có thể giữ tồn kho và CANCELLED không có luồng tự động kích hoạt. Đây là giới hạn RSK-15, không bổ sung luồng hủy thủ công vào MVP.

## 8. Quy tắc nghiệp vụ liên quan

### 8.1. Dữ liệu và giá

- API không có global prefix; ID là UUID; thời gian ISO 8601 UTC; tiền là số nguyên VND.
- `unitPrice = basePrice + size.extraPrice + SUM(topping.price)`.
- `lineTotal = unitPrice * quantity`.
- `subtotal = SUM(lineTotal)`; `totalAmount = subtotal - discountAmount`.
- NestJS luôn tính lại giá; không tin giá từ client. Giỏ hàng chỉ lưu tại client.
- Nếu không triển khai FR-11: `discountAmount=0`. Nếu triển khai: một mã mỗi đơn, giảm giá phần trăm làm tròn xuống VND và không vượt `subtotal`.

### 8.2. Tồn kho, trạng thái và bảo mật

- Tồn kho tính theo sản phẩm; mỗi đơn được trừ kho khi tạo đơn PENDING trong transaction. Thanh toán FAILED không hoàn kho.
- Máy trạng thái: `PENDING → PAID → PREPARING → READY → COMPLETED`; `PENDING → CANCELLED` chỉ khi triển khai FR-10. Chuyển trạng thái sai trả 409 `INVALID_STATUS_TRANSITION`.
- Chỉ CUSTOMER được tạo/thanh toán đơn của chính mình; JWT phải hợp lệ. STAFF/MANAGER không được gọi hai API checkout.
- Payment Service là mô phỏng, không phát sinh thanh toán thật; phương thức WALLET hoặc CARD.
- `PAYMENT_ALLOW_SIMULATE=true` cho phép SUCCESS/FAILED; khi `false`, bỏ qua `simulate` và mặc định SUCCESS. Môi trường demo cần bật biến để kiểm thử nhánh thất bại theo SRS.

### 8.3. Idempotency

- `Idempotency-Key` bắt buộc và có phạm vi theo user từ JWT; yêu cầu lặp với **cùng user, key và body** trả kết quả đã lưu, kể cả 402, không tạo Payment mới.
- Cùng user/key và body khác trả 422 `IDEMPOTENCY_KEY_REUSED`.
- FAILED cho phép thử lại bằng **key mới** khi đơn vẫn PENDING. Yêu cầu thanh toán mới trên đơn không còn PENDING trả 409 `ORDER_NOT_PAYABLE`.
- Nếu mất phản hồi, client không tự giả định thất bại; cùng key và body có thể dùng để truy hồi kết quả.

## 9. Ma trận liên kết yêu cầu và tiêu chí chấp nhận

**Các mã AC trong bảng được lấy đúng từ SRS v1.0; bảng không tự định nghĩa AC mới.** Một luồng có thể liên kết nhiều AC.

| Bước/luồng | FR/NFR | Mã AC trong `srs.md` | US / UC liên quan |
|---|---|---|---|
| Tiền điều kiện và bước 1-2 | FR-03, FR-04, FR-05 | FR-03-AC3, FR-04-AC1, FR-04-AC4, FR-05-AC4 | US-07; UC-09 |
| Bước 3-5: tạo đơn/transaction | FR-06 | FR-06-AC1, FR-06-AC5 | US-07; UC-01 |
| Bước 6: xác nhận đơn | FR-08 | FR-08-AC1 | US-07; UC-01 |
| Bước 7-11: thanh toán | FR-07 | FR-07-AC1, FR-07-AC6 | US-08; UC-02, UC-17, UC-18 |
| Bước 12: kết quả PAID | FR-08 | FR-08-AC1 | US-08; UC-01 |
| Bước 13: theo dõi | FR-09 | FR-09-AC1, FR-09-AC2 | UC-11 |
| ALT-01: Ví/Thẻ | FR-07 | FR-07-AC1 | US-08; UC-17, UC-18 |
| ALT-02: FAILED rồi key mới | FR-07 | FR-07-AC2 | US-08; UC-02 |
| ALT-03: lặp key/body | FR-07 | FR-07-AC3 | US-08; UC-02 |
| ALT-04: khuyến mãi | FR-11 | FR-11-AC1, FR-11-AC3 | US-13; UC-14 |
| EX-01: thiếu/sai/hết JWT, 401 | FR-06, FR-07, NFR-02 | FR-06-AC4, FR-07-AC5, NFR-02-AC2 | UC-09 |
| EX-02: STAFF/MANAGER, 403 | FR-06, FR-07, NFR-02 | FR-06-AC4, FR-07-AC5, NFR-02-AC2 | UC-01, UC-02 |
| EX-03: validate, 400 | FR-03, FR-04, FR-06, NFR-04 | FR-03-AC3, FR-04-AC4, FR-06-AC3, NFR-04-AC3 | US-07 |
| EX-04: PRODUCT_NOT_FOUND, 404 | FR-06 | FR-06-AC3 | US-07 |
| EX-05: OUT_OF_STOCK, 409 | FR-06 | FR-06-AC2 | US-07 |
| EX-06: PAYMENT_DECLINED, 402 | FR-07 | FR-07-AC2, FR-07-AC3 | US-08; UC-02 |
| EX-07: thiếu key, 400 | FR-07 | FR-07-AC4 | US-08; UC-02 |
| EX-08: IDEMPOTENCY_KEY_REUSED, 422 | FR-07 | FR-07-AC3 | US-08; UC-02 |
| EX-09: ORDER_NOT_PAYABLE, 409 | FR-07 | FR-07-AC4 | US-08; UC-02 |
| EX-10: đơn người khác/không tồn tại, 404 | FR-07, NFR-02 | FR-07-AC4, FR-07-AC5, NFR-02-AC2 | US-08; UC-02 |
| EX-11: PROMOTION_INVALID, 422 | FR-06, FR-11 | FR-06-AC3, FR-11-AC2 | US-13; UC-14 |
| EX-12: lazy expiration (nếu FR-10) | FR-10, FR-07 | FR-10-AC1, FR-10-AC2, FR-07-AC4 | UC-13, UC-02 |
| EX-13: mất kết nối/cold start | NFR-03, FR-07, FR-01 | NFR-03-AC1, NFR-03-AC3, FR-07-AC3, FR-01-AC3 | UC-01, UC-02 |

## 10. Ghi chú cho kiểm thử

Mã TC dưới đây là mã gợi ý cho task kiểm thử sau, chưa thay thế test case chi tiết. Mỗi test cần kiểm tra cả HTTP/body và dữ liệu trong database (Order, Payment, tồn kho).

| Mã test gợi ý | Kịch bản | Luồng | AC cần xác minh |
|---|---|---|---|
| TC-UC01-01 | CUSTOMER đặt đủ hàng và thanh toán SUCCESS; đơn PAID, tồn kho trừ đúng một lần. | Chính | FR-06-AC1, FR-06-AC5, FR-07-AC1, FR-08-AC1 |
| TC-UC01-02 | WALLET và CARD đều xử lý được khi đơn PENDING. | ALT-01 | FR-07-AC1 |
| TC-UC01-03 | FAILED trả 402, giữ PENDING và tồn kho; thử lại bằng key mới thành SUCCESS. | ALT-02 / EX-06 | FR-07-AC2 |
| TC-UC01-04 | Cùng key/body trả lại cùng HTTP/body kể cả 402; không thêm Payment. | ALT-03 | FR-07-AC3 |
| TC-UC01-05 | Khuyến mãi hợp lệ áp dụng và tính giảm giá đúng nếu có FR-11. | ALT-04 | FR-11-AC1, FR-11-AC3 |
| TC-UC01-06 | Thiếu JWT, sai JWT hoặc hết hạn JWT khi tạo/thanh toán. | EX-01 | FR-06-AC4, FR-07-AC5 |
| TC-UC01-07 | STAFF/MANAGER tạo đơn hoặc thanh toán bị từ chối 403. | EX-02 | FR-06-AC4, FR-07-AC5 |
| TC-UC01-08 | Giỏ rỗng, quantity sai, size sai, note quá 200 ký tự. | EX-03 | FR-04-AC4, FR-06-AC3, NFR-04-AC3 |
| TC-UC01-09 | ID sản phẩm không tồn tại trả 404 PRODUCT_NOT_FOUND. | EX-04 | FR-06-AC3 |
| TC-UC01-10 | Không đủ tồn kho hoặc hai yêu cầu đặt đồng thời; một request thất bại rollback đúng. | EX-05 | FR-06-AC2 |
| TC-UC01-11 | Thiếu Idempotency-Key trả 400, không tạo Payment. | EX-07 | FR-07-AC4 |
| TC-UC01-12 | Cùng key nhưng body khác trả 422 IDEMPOTENCY_KEY_REUSED. | EX-08 | FR-07-AC3 |
| TC-UC01-13 | Đơn đã PAID/CANCELLED không nhận thanh toán mới, trả 409. | EX-09 | FR-07-AC4 |
| TC-UC01-14 | CUSTOMER thanh toán đơn người khác và đơn không tồn tại đều bị che giấu qua 404. | EX-10 | FR-07-AC4, FR-07-AC5 |
| TC-UC01-15 | Mã giảm giá sai/hết hạn trả 422, không tạo đơn nếu có FR-11. | EX-11 | FR-11-AC2, FR-06-AC3 |
| TC-UC01-16 | Đơn PENDING quá 30 phút bị hủy khi đọc đơn/thanh toán; gọi lặp không hoàn kho trùng (nếu FR-10). | EX-12 | FR-10-AC1, FR-10-AC2 |
| TC-UC01-17 | Mất phản hồi thanh toán và gửi lại cùng key/body; không nhân đôi Payment. | EX-13 | FR-07-AC3, NFR-03-AC3 |
| TC-UC01-18 | Mất kết nối database: health trả 503; khi khôi phục, API hoạt động lại. | EX-13 | NFR-03-AC1, NFR-03-AC3 |
| TC-UC01-19 | Khi tắt PAYMENT_ALLOW_SIMULATE, body FAILED bị bỏ qua và mặc định SUCCESS; khi bật thì có thể test FAILED. | Chính / ALT-02 | FR-07-AC6 |

**Điều kiện nghiệm thu UC-01:** Hoàn thành luồng chính và các nhánh lỗi Must; các nhánh gắn FR-10/FR-11 chỉ bắt buộc nếu nhóm quyết định triển khai chức năng Should tương ứng. Kiểm thử phải bảo đảm không tạo đơn khi transaction thất bại, không hoàn kho sau thanh toán FAILED và không xử lý trùng thanh toán.

**Bổ sung 25/11:** Ghi Payment và chuyển trạng thái có điều kiện trong cùng transaction; bảo đảm không có hai Payment SUCCESS trên cùng Order. Key trùng giữa hai user không va chạm. Không coi thay đổi thiết kế đã triển khai; xem [ADR-007](../architecture/adr/007-order-payment-design.md).
