# BrewLite – API Contract

**Phiên bản:** 1.0 – đề xuất chốt Sprint 1  
**Ngày soạn:** 20/11/2026  
**Trạng thái:** BẢN ĐỀ XUẤT, cần Phong duyệt trước khi merge hoặc coi là hợp đồng chính thức  
**Nguồn đối chiếu:** `docs/requirements/srs.md` (mục 3, 4, 6), `docs/requirements/uc-01-checkout.md`, `docs/diagrams/class-domain.puml`, `docs/architecture/architecture.md`, `BrewLite-Ke-hoach-nhom-v3` (mục 7).  
**Phân biệt:** Các cổng local, category slug, nội dung seed, timeout 75 giây và quy ước mã test dưới đây là **đề xuất phối hợp Sprint 1**, không phải hành vi được SRS đặt tên cụ thể.

## 1. Quy ước chung

| Chủ đề | Quy ước |
|---|---|
| Base path | **Không global prefix**: gọi trực tiếp `/products`, `/health`, `/orders` (không thêm `/api`). |
| API local đề xuất | `http://localhost:3001`; web local `http://localhost:3000`. |
| Frontend environment | `NEXT_PUBLIC_API_URL=http://localhost:3001` ở local; production dùng URL HTTPS API thực tế. |
| Backend environment | `PORT=3001`, `CORS_ORIGIN=http://localhost:3000` (các origin phân tách dấu phẩy nếu cần); không hardcode địa chỉ production. |
| ID | Chuỗi UUID. |
| Giá tiền | JSON là số nguyên VND, không gửi dấu phân cách hàng nghìn. Sprint 1 lưu `basePrice`, `extraPrice`, `price` bằng Prisma `Int` khi nằm trong phạm vi số nguyên 32-bit; nếu dùng `BigInt` cho các khoản tiền lớn hơn thì backend bắt buộc chuyển đổi có kiểm tra trước khi JSON serialize (không trả `bigint` thô). |
| Thời gian | ISO 8601 UTC, ví dụ `2026-11-20T08:00:00.000Z`. |
| Xác thực | `Authorization: Bearer <JWT>`; JWT chứa `sub`, `role`. |
| Role | `CUSTOMER`, `STAFF`, `MANAGER`. |
| Lỗi HTTP | JSON `{ "statusCode": number, "error": string, "message": string, "code": string }` khi SRS quy định `code`; không tạo tên mã mới cho lỗi chưa được định danh. |
| Content type | JSON UTF-8 cho API trả JSON. |
| `available` trong API đọc | Server tính `Product.available && Product.stock > 0`; **không trả trường `stock`** trong public menu/chi tiết. Đây là quy tắc phối hợp Sprint 1 được nhóm đề xuất. |
| `imageUrl` | `string | null`. Đường dẫn tương đối `/images/menu/<slug>.svg` được web phục vụ từ `apps/web/public`, backend chỉ lưu và trả lại chuỗi đường dẫn. |
| Category | Slug cố định theo Phụ lục B (`coffee`, `tea`, `smoothie`) là quy ước seed Sprint 1, không phải enum bắt buộc trong SRS. |

**Tính nhất quán:** Backend tính lại đơn giá khi đặt đơn; không tin giá do client gửi. Các API thuộc FR-02, FR-10 đến FR-13 là mở rộng Should/Could và chưa được coi là đã triển khai.

## 2. Danh sách endpoint theo kế hoạch v3

**Giai đoạn:** S1 = Sprint 1, S2 = Sprint 2, Mở rộng = ngoài phạm vi Must theo MoSCoW.

| Giai đoạn | Method | Path | Quyền | Yêu cầu chính | Thành công | Lỗi/ràng buộc |
|---|---|---|---|---|---|---|
| S1 | GET | `/health` | Public | Không body | 200 `{status,db}` | 503 nếu DB không kết nối |
| S1 | GET | `/products` | Public | Query `category` tùy chọn (FR-02 Should; chưa dùng S1) | 200 mảng sản phẩm | Không có sản phẩm: `[]` |
| S1 | GET | `/products/:id` | Public | `id` UUID | 200 sản phẩm + sizes + toppings | 404 `PRODUCT_NOT_FOUND`; UUID sai: 400 `VALIDATION_ERROR` (quy tắc kiểm tra thống nhất được đề xuất) |
| S2 | POST | `/auth/register` | Public | `name`, `email`, `password` | 201 `{id,email,name,role}` | 400 `VALIDATION_ERROR`, 409 `EMAIL_TAKEN` |
| S2 | POST | `/auth/login` | Public | Thông tin đăng nhập | 200 `{accessToken,user}` | 401 `INVALID_CREDENTIALS` |
| S2 | POST | `/orders` | CUSTOMER | JWT + giỏ với sản phẩm, size, topping, số lượng; mã khuyến mãi nếu FR-11 | 201 đơn `PENDING` kèm items, discountAmount, totalAmount, createdAt | 400, 401, 403, 404 `PRODUCT_NOT_FOUND`, 409 `OUT_OF_STOCK`; 422 `PROMOTION_INVALID` nếu FR-11 |
| S2 | GET | `/orders` | CUSTOMER | JWT | 200 đơn của chính người dùng, mới nhất trước | 401; 403 nếu role không hợp lệ |
| S2 | GET | `/orders/:id` | CUSTOMER/chủ đơn | JWT, id UUID | 200 chi tiết đơn và payments | 401, 404 (cả khi đơn thuộc người khác) |
| S2 | POST | `/payments` | CUSTOMER | JWT; `Idempotency-Key`; `{orderId,method,simulate?}` | 200 `{paymentId,orderId,status:"SUCCESS",orderStatus:"PAID"}` | 402 `PAYMENT_DECLINED`, 400 thiếu key, 401, 403, 404, 409 `ORDER_NOT_PAYABLE`, 422 `IDEMPOTENCY_KEY_REUSED` |
| S2 | GET | `/staff/orders` | STAFF/MANAGER | JWT | 200 hàng đợi kèm size/topping | 401, 403 |
| S2 | PATCH | `/staff/orders/:id/status` | STAFF/MANAGER | JWT + trạng thái đích | 200 đơn sau cập nhật | 403, 404, 409 `INVALID_STATUS_TRANSITION` |
| Mở rộng FR-13 (Could) | POST | `/products` | MANAGER | Dữ liệu sản phẩm | 201 | 403, 404 theo kế hoạch |
| Mở rộng FR-13 (Could) | PATCH | `/products/:id` | MANAGER | Thay đổi thuộc tính được phép | 200 | 403, 404 |
| Mở rộng FR-13 (Could) | PATCH | `/products/:id/stock` | MANAGER | Thay đổi tồn kho | 200 | 403, 404 |

Không thêm các endpoint riêng cho Promotion hay Loyalty vì SRS không đặt tên endpoint bắt buộc. Các request/response S2 chưa có định dạng trường chi tiết được khóa trong nguồn sẽ được thống nhất lúc hiện thực mà không tự coi ví dụ ở đây là đặc tả đã duyệt.

## 3. Endpoint Sprint 1 – định dạng chính xác

### 3.1 GET `/products`

**Response 200** là **mảng JSON ở top level**, không bọc trong `data`, `items` hay `pagination`:

```json
[
  {
    "id": "6b3d8d25-b9a4-4c1f-909c-d9c9162ec640",
    "name": "Cà phê sữa đá",
    "description": "Cà phê pha phin cùng sữa đặc",
    "basePrice": 29000,
    "imageUrl": "/images/menu/ca-phe-sua-da.svg",
    "category": "coffee",
    "available": true
  },
  {
    "id": "59b06b02-57ea-4744-90ef-488114e99fca",
    "name": "Trà đào",
    "description": "Trà đào thanh mát",
    "basePrice": 35000,
    "imageUrl": "/images/menu/tra-dao.svg",
    "category": "tea",
    "available": false
  }
]
```

**Không có dữ liệu:** `HTTP 200` và `[]`; frontend hiển thị `Hiện chưa có đồ uống`. `category` nếu có là lọc tùy chọn thuộc FR-02 (Should), **không bắt buộc triển khai Sprint 1**. `available` phản ánh khả năng bán thực tế nhưng sản phẩm không khả dụng vẫn có thể xuất hiện với nhãn “Hết hàng”.

### 3.2 GET `/products/:id`

**Response 200** là một đối tượng, giữ nguyên các trường ở danh sách và thêm hai mảng `sizes`, `toppings`:

```json
{
  "id": "6b3d8d25-b9a4-4c1f-909c-d9c9162ec640",
  "name": "Cà phê sữa đá",
  "description": "Cà phê pha phin cùng sữa đặc",
  "basePrice": 29000,
  "imageUrl": "/images/menu/ca-phe-sua-da.svg",
  "category": "coffee",
  "available": true,
  "sizes": [
    { "code": "S", "extraPrice": 0 },
    { "code": "M", "extraPrice": 5000 },
    { "code": "L", "extraPrice": 10000 }
  ],
  "toppings": [
    { "id": "0d680c3d-e957-4c5b-b789-24fb43edbd5e", "name": "Trân châu đen", "price": 5000 },
    { "id": "c131ee9e-bead-436d-9637-62fb7c5c2d67", "name": "Thạch cà phê", "price": 6000 }
  ]
}
```

Nếu sản phẩm không có topping cho phép thì `toppings: []`. Liên kết Product–Topping theo class diagram. ID hợp lệ nhưng không tồn tại trả **404**:

```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "Không tìm thấy sản phẩm",
  "code": "PRODUCT_NOT_FOUND"
}
```

`id` không đúng UUID trả **400** `VALIDATION_ERROR` theo thỏa thuận kiểm tra Sprint 1:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "ID sản phẩm không đúng định dạng UUID",
  "code": "VALIDATION_ERROR"
}
```

Văn bản `error` và `message` trên là **ví dụ trình bày**, không phải chuỗi frontend cần so khớp. Frontend chỉ dùng `statusCode` và `code` khi có mã đã định danh.

### 3.3 GET `/health`

**Khi PostgreSQL hoạt động**, `HTTP 200`:

```json
{ "status": "ok", "db": "up" }
```

**Khi mất kết nối PostgreSQL**, `HTTP 503`. **Đề xuất thống nhất Sprint 1** (cần Phong và bạn duyệt trước khi coi là hợp đồng đã chốt):

```json
{ "status": "error", "db": "down" }
```

Đây là cấu trúc health check riêng, không hiển thị DSN, user/password hoặc connection string. Bài `API-T06` kiểm tra cả HTTP 503 lẫn body này **sau khi nhóm duyệt**. Nếu nhóm chọn format lỗi chung thay vì health body riêng, cần cập nhật thống nhất hợp đồng và test trước khi triển khai.

## 4. Quy tắc xuyên suốt cho Sprint 2

- Kiểm tra input: email hợp lệ; password ít nhất 8 ký tự có chữ và số; name dài 1–50; quantity 1–20; note tối đa 200; size `S|M|L`; payment method `WALLET|CARD`.
- Giá: `unitPrice = basePrice + size.extraPrice + SUM(topping.price)`; `lineTotal = unitPrice * quantity`; `subtotal = SUM(lineTotal)`; `totalAmount = subtotal - discountAmount`. Giá phải được backend tính lại.
- Tồn kho ở Product, không ở size/topping. Tạo đơn PENDING và trừ tồn kho cùng transaction; không đủ hàng trả 409 `OUT_OF_STOCK` và rollback toàn bộ.
- Thanh toán: `Idempotency-Key` bắt buộc; cùng key/body trả lại HTTP status và body đã lưu kể cả 402; cùng key/body khác trả 422; PAYMENT FAILED giữ PENDING, không hoàn kho; khi `PAYMENT_ALLOW_SIMULATE=false` server bỏ qua trường `simulate` và mặc định SUCCESS.
- Thứ tự trạng thái: `PENDING → PAID → PREPARING → READY → COMPLETED`. `PENDING → CANCELLED` chỉ khi thực hiện FR-10 (Should). Không có hủy thủ công ở MVP.
- Theo dõi đơn: client polling `GET /orders/:id` mỗi 5 giây khi màn hình theo dõi mở; READY có thông báo; dừng ở COMPLETED, CANCELLED hoặc rời màn hình. Không dùng push notification.
- `GET /orders/:id` trả 404 cho đơn thuộc người khác. Không đặt mã `code` mới cho 401, 403, 404 đơn hoặc thiếu `Idempotency-Key` khi SRS chỉ quy định HTTP status.

### Tên mã lỗi đã được SRS định danh

`VALIDATION_ERROR`, `PRODUCT_NOT_FOUND`, `OUT_OF_STOCK`, `PAYMENT_DECLINED`, `ORDER_NOT_PAYABLE`, `IDEMPOTENCY_KEY_REUSED`, `INVALID_STATUS_TRANSITION`, `PROMOTION_INVALID` (FR-11), `EMAIL_TAKEN`, `INVALID_CREDENTIALS`.

Không tạo thêm tên mã lỗi tự chế.

## 5. Phụ lục A – Dữ liệu seed/fixture thống nhất (đề xuất Sprint 1)

Danh sách sau là **dữ liệu demo nhóm tự chọn**, không trích từ SRS. Backend dùng làm seed và frontend dùng làm fixture kiểm thử. `slug` là khóa kỹ thuật dành cho seed và đường dẫn ảnh, **không thêm vào JSON `GET /products`**.

| ID UUID | slug | Tên sản phẩm | category | basePrice (VND) | stock | Product.available | imageUrl |
|---|---|---|---|---:|---:|---|---|
| `6b3d8d25-b9a4-4c1f-909c-d9c9162ec640` | `ca-phe-sua-da` | Cà phê sữa đá | coffee | 29000 | 30 | true | `/images/menu/ca-phe-sua-da.svg` |
| `449c4a1e-0695-4e3e-9331-420516de51b0` | `ca-phe-den-da` | Cà phê đen đá | coffee | 25000 | 25 | true | `/images/menu/ca-phe-den-da.svg` |
| `c629f191-7aae-45af-b83b-5237f689f14c` | `bac-xiu` | Bạc xỉu | coffee | 32000 | 18 | true | `/images/menu/bac-xiu.svg` |
| `59b06b02-57ea-4744-90ef-488114e99fca` | `tra-dao` | Trà đào | tea | 35000 | 12 | false | `/images/menu/tra-dao.svg` |
| `4252f4cb-235e-4f28-9225-b8a1a1b86ffd` | `tra-vai` | Trà vải | tea | 36000 | 20 | true | `/images/menu/tra-vai.svg` |
| `e4605e47-62a6-48ea-899b-50e7badc041a` | `tra-chanh` | Trà chanh | tea | 25000 | 0 | true | `/images/menu/tra-chanh.svg` |
| `f6f36062-6361-44d5-8fbb-39fa02f0a2ec` | `sinh-to-bo` | Sinh tố bơ | smoothie | 42000 | 15 | true | `/images/menu/sinh-to-bo.svg` |
| `03641a70-b29a-4926-8a7b-85870b19f7f7` | `sinh-to-xoai` | Sinh tố xoài | smoothie | 40000 | 24 | true | `/images/menu/sinh-to-xoai.svg` |
| `e4b222e8-7592-4e64-a873-a24fda03625c` | `sinh-to-dau` | Sinh tố dâu | smoothie | 44000 | 10 | true | `/images/menu/sinh-to-dau.svg` |

Ví dụ để kiểm tra `available`: `tra-dao` có `Product.available=false`, `tra-chanh` có `stock=0` → cả hai được trả `available=false`. UI không hiển thị `stock`.

### Size (áp dụng thử cho cả 9 sản phẩm)

| code | extraPrice (VND) |
|---|---:|
| S | 0 |
| M | 5000 |
| L | 10000 |

### Topping dùng cho seed

| ID UUID | Tên | price (VND) |
|---|---|---:|
| `0d680c3d-e957-4c5b-b789-24fb43edbd5e` | Trân châu đen | 5000 |
| `c131ee9e-bead-436d-9637-62fb7c5c2d67` | Thạch cà phê | 6000 |
| `bb4795c6-6f68-4b71-b544-56bbf79363d1` | Kem cheese | 9000 |
| `07d9f225-bd39-41ba-a4dc-4ca569eb5592` | Trân châu trắng | 6000 |

**Quy ước nối Product–Topping cho dữ liệu demo:** cho phép cả 4 topping ở cả 9 sản phẩm để fixture và seed nhất quán; có thể giảm tập hợp theo từng sản phẩm khi hai thành viên duyệt, nhưng phải sửa hợp đồng trước. Không có tồn kho riêng cho topping.

**Ảnh:** `apps/web/public/images/menu/<slug>.svg` do frontend sở hữu. API trả `imageUrl` như bảng. Nếu web chưa có ảnh hoặc `imageUrl=null`, UI dùng ảnh fallback; backend không cần phục vụ ảnh.

## 6. Phụ lục B – Nhãn danh mục tiếng Việt

| category slug | Nhãn hiển thị |
|---|---|
| `coffee` | Cà phê |
| `tea` | Trà |
| `smoothie` | Sinh tố |

Slug chỉ dùng làm dữ liệu trao đổi; UI hiển thị tiếng Việt. Category khác chưa thuộc bộ seed Sprint 1 thì UI nên hiển thị chính slug hoặc nhãn trung tính, không coi là lỗi API.

## 7. Hướng dẫn frontend Sprint 1 và xử lý cold start

1. Gọi `GET ${NEXT_PUBLIC_API_URL}/products` bằng `fetch` ở client; menu không lưu vào `localStorage`.
2. Trong khi chờ, hiện skeleton/loading. Nếu sau **5 giây** chưa có phản hồi, hiện: **“Máy chủ đang khởi động, vui lòng chờ”**.
3. Sử dụng `AbortController` để kết thúc yêu cầu sau khoảng **75 giây** theo đề xuất Sprint 1. Đây là timeout **UI**, không phải cam kết thời gian Render khởi động. Lỗi timeout/mạng có thể không có HTTP response nên không được tự gán mã HTTP.
4. Nếu HTTP 200 và `[]`: hiển thị **“Hiện chưa có đồ uống”**; nếu có mảng sản phẩm: hiển thị thẻ với giá theo `vi-VN` và nhãn **“Hết hàng”** khi `available=false`.
5. Nếu HTTP lỗi hoặc dữ liệu không hợp lệ: hiển thị error state có nút **“Thử lại”**, không hiển thị dữ liệu cũ như thể kết quả mới hợp lệ. Dừng timer khi unmount/hủy yêu cầu.
6. Màn hình `/menu` hoạt động tốt ở **375 px**, không tràn ngang; `/` chuyển hướng `/menu`; PWA có manifest hợp lệ (NFR-04-AC4).

## 8. Truy vết test dự kiến

Mã test là **kế hoạch định danh**, không khẳng định file test đã tồn tại hoặc chạy PASS.

| Mã test | Nơi sở hữu | Tiêu chí/nhánh cần kiểm chứng |
|---|---|---|
| `API-T01` | apps/api | `FR-01-AC1`: GET /products danh sách đúng shape |
| `API-T02` | apps/api | `FR-03-AC1`: chi tiết có sizes/toppings |
| `API-T03` | apps/api | `FR-03-AC2`: 404 PRODUCT_NOT_FOUND |
| `API-T04` | apps/api | UUID sai → 400 VALIDATION_ERROR (thỏa thuận Sprint 1) |
| `API-T05` | apps/api | `NFR-03-AC1`: /health 200 khi DB up |
| `API-T06` | apps/api | `NFR-03-AC1`: /health 503 khi DB down; kiểm tra `{status:"error",db:"down"}` theo đề xuất cần duyệt ở mục 3.3 |
| `UI-T01` | apps/web | `FR-01-AC1`: hiển thị danh sách sản phẩm |
| `UI-T02` | apps/web | `FR-01-AC3`, `NFR-04-AC2`: loading, cold start hint |
| `UI-T03` | apps/web | `FR-01-AC2`, `NFR-04-AC2`: empty state |
| `UI-T04` | apps/web | `FR-01-AC3`, `NFR-04-AC2`: error và nút Thử lại |
| `UI-T05` | apps/web | `FR-01-AC1`: available=false hiển thị “Hết hàng” |
| `UI-T06` | apps/web | `FR-01-AC3`: từ chối response không đúng cấu trúc hợp đồng |
| `UI-T07` | apps/web | `FR-01-AC3`: timeout sau 75 giây, hủy request và hiển thị lỗi |
| `UI-T08` | apps/web | `FR-01-AC1`: dùng ảnh dự phòng khi `imageUrl=null` |
| `UI-T09` | apps/web | Nhánh lỗi ảnh: chuyển sang ảnh dự phòng nếu tải ảnh thất bại (kiểm thử bổ sung; không đồng nhất với lỗi API FR-01-AC3) |
| `UI-T10` | apps/web | `FR-01-AC1`: hiển thị giá VND, nhãn category và fallback slug cho category chưa biết |
| `UI-T11` | apps/web | `FR-01-AC3`: production thiếu `NEXT_PUBLIC_API_URL` hiển thị lỗi cấu hình và trạng thái error |
| `UI-T12` | apps/web | `FR-01-AC3`: fetch gặp lỗi mạng hiển thị thông báo không kết nối và nút Thử lại |

Bổ sung kiểm thử: giá VND theo `vi-VN`, ảnh fallback, `imageUrl=null`, timeout/cancel và không tràn ngang 375 px. Tên test nên chứa cả mã test và mã AC, ví dụ `UI-T03 FR-01-AC2 displays empty state`.

## 9. Quy trình thay đổi hợp đồng

1. `docs/api-contract.md` là nguồn thống nhất cho request/response, seed và fixture **sau khi cả hai thành viên duyệt**; SRS và kế hoạch v3 vẫn là tài liệu yêu cầu cấp trên, không bị hợp đồng này thay thế.
2. Mỗi thay đổi hợp đồng cần Pull Request riêng, ghi mục thay đổi, mã FR/NFR, ảnh hưởng API và UI; cả hai thành viên cùng xem xét. GitHub không cho người tạo PR tự phê duyệt PR của mình nên người còn lại thực hiện review; việc chốt hợp đồng được hai người thống nhất.
3. Nếu thay đổi tên field, cấu trúc JSON, enum, mã lỗi, chính sách available hoặc dữ liệu seed, coi là **breaking change cần thông báo cho cả hai bên trước khi merge**.
4. Backend không tự thêm trường vào response Sprint 1; frontend không tự giả định bọc `data` hay `items`. Mọi thay đổi được xác nhận trong contract trước khi sửa mã.
5. Khi tích hợp Sprint 1, đối chiếu ví dụ JSON với response thực tế và fixture, chạy API tests + UI tests, cập nhật `docs/traceability-matrix.md` bằng link code/test thực tế; chưa có thì giữ theo quy tắc làm việc của kế hoạch.

## 10. Các điểm cần nhóm xác nhận khi chốt

- Thống nhất cổng local **3001/3000**, category slug và tên/giá/ID dữ liệu seed của Phụ lục A.
- Thống nhất quy tắc public `available = Product.available && stock > 0` và không trả stock.
- Xác nhận dùng `imageUrl` đường dẫn tương đối phục vụ từ Next.js/Vercel (frontend chịu trách nhiệm đặt ảnh).
- Phê duyệt đề xuất 503 `/health` `{status:"error",db:"down"}` tại mục 3.3 trước khi dùng làm assertion cứng của API-T06.
- API có thể chạy trên Render free khi cold start; timeout 75 giây là lựa chọn UX, cần điều chỉnh theo phép thử thực tế nếu không phù hợp.
