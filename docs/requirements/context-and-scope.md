
# Bối cảnh và phạm vi (Context and Scope)

**Phiên bản:** 1.0  
**Ngày:** 16/11/2026  
**Dự án:** BrewLite - Ứng dụng đặt đồ uống tại quán cà phê  
**Nhóm thực hiện:** [Phan Tấn Tài] và [Võ Quốc Phong]  
**Tài liệu:** `docs/requirements/context-and-scope.md`  
**Tạo phẩm:** Task 1.1 - BrewLite Assignment 2

## 1. Bối cảnh và vấn đề nghiệp vụ

BrewLite là ứng dụng hỗ trợ khách hàng đặt đồ uống tại quán cà phê thông qua giao diện web tối ưu cho thiết bị di động. Hệ thống cho phép khách hàng xem menu, lựa chọn size và topping, quản lý giỏ hàng, đặt đơn, thanh toán mô phỏng và theo dõi tiến độ xử lý đơn hàng.

Trong giờ cao điểm, khách hàng có thể phải xếp hàng để gọi món và thanh toán. Việc nhân viên tiếp nhận đơn và ghi nhận các tùy chọn thủ công có thể gây nhầm lẫn về size, topping, số lượng và tổng tiền. Quy trình đặt hàng cần giải quyết các vấn đề như nhập sai tùy chọn sản phẩm, tính sai tổng tiền, đặt vượt số lượng tồn kho và thiếu thông tin về trạng thái đơn. Đồng thời, nhân viên quầy cần công cụ tiếp nhận, xử lý và cập nhật trạng thái đơn hàng. Quản lý cửa hàng cần khả năng quản lý sản phẩm và tồn kho khi phạm vi được mở rộng.

BrewLite tập trung số hóa quy trình đặt đồ uống để khách hàng nhận tại quán, không bao gồm giao hàng. Hệ thống sử dụng Next.js theo hướng mobile-first/PWA, NestJS, PostgreSQL và Docker. Trong phạm vi Assignment 2, sản phẩm phải có luồng nghiệp vụ chạy được từ đầu đến cuối, có kiểm thử, CI/CD và phiên bản production có thể truy cập.

**Luồng nghiệp vụ chính:**

`Xem menu → Chọn size/topping → Giỏ hàng → Đặt đơn → Thanh toán mô phỏng → Theo dõi đơn`

## 2. Stakeholder

| Stakeholder | Mục tiêu | Kỳ vọng |
|---|---|---|
| Khách hàng (Customer) | Đặt đồ uống nhanh, đúng tùy chọn và theo dõi đơn hàng. | Xem menu và giá; chọn size/topping; quản lý giỏ hàng; đặt và thanh toán đơn; xem xác nhận, lịch sử và trạng thái đơn. |
| Nhân viên quầy (Cashier, role STAFF) | Tiếp nhận và xử lý đơn hàng tại quán. | Xem danh sách đơn cần xử lý; xem thông tin đồ uống, size, topping; cập nhật trạng thái đơn theo quy tắc nghiệp vụ. |
| Quản lý cửa hàng (Manager) | Giám sát hoạt động xử lý đơn và quản lý dữ liệu sản phẩm. | Có quyền xử lý đơn như STAFF; được quản lý sản phẩm và tồn kho nếu triển khai chức năng mở rộng FR-13. |
| Giảng viên/khách hàng nghiệm thu | Đánh giá mức độ đáp ứng yêu cầu Assignment 2. | Có tài liệu yêu cầu rõ ràng, mã định danh và truy vết; sơ đồ nhất quán; kiểm thử và CI/CD; repository và production có thể truy cập; demo luồng end-to-end. |
| Nhóm phát triển ([Phan Tấn Tài] và [Võ Quốc Phong]) | Hoàn thành đồ án đúng phạm vi, công nghệ, thời hạn và tiêu chí nghiệm thu. | Yêu cầu rõ ràng, có thể kiểm thử; phân công công việc phù hợp; kiểm soát thay đổi qua Git/PR; sử dụng hạ tầng miễn phí. |
| Đơn vị thanh toán (Payment Service mô phỏng) | Mô phỏng kết quả xử lý thanh toán Ví/Thẻ cho đơn hàng. | Nhận yêu cầu thanh toán hợp lệ; trả kết quả thành công/thất bại; hỗ trợ idempotency để tránh xử lý trùng giao dịch. |

## 3. Phạm vi hệ thống

Phạm vi được phân loại theo MoSCoW:

- **Must:** Chức năng bắt buộc để hoàn thành MVP.
- **Should:** Chức năng ưu tiên mở rộng khi MVP đã ổn định.
- **Could:** Chức năng tùy chọn khi còn đủ thời gian.
- **Won't:** Chức năng không thực hiện trong Assignment 2.

Mỗi chức năng có mã phạm vi và mã yêu cầu chức năng dự kiến (`FR-xx`). Yêu cầu chi tiết và tiêu chí chấp nhận sẽ được đặc tả trong `docs/requirements/srs.md`.

### 3.1. In-scope (MVP)

Các chức năng dưới đây thuộc phạm vi bắt buộc của MVP.

| Mã phạm vi | Mã yêu cầu | Chức năng | Mô tả có thể kiểm chứng | Ưu tiên |
|---|---|---|---|---|
| SCP-IN-01 | FR-01 | Xem menu | Customer xem danh sách sản phẩm với thông tin cơ bản, giá và trạng thái còn bán; giao diện xử lý các trạng thái loading, empty và error. | Must |
| SCP-IN-02 | FR-03 | Chi tiết sản phẩm | Customer xem chi tiết đồ uống, chọn size và topping; hệ thống hiển thị phần giá cộng thêm tương ứng. | Must |
| SCP-IN-03 | FR-04 | Giỏ hàng và tính tổng tiền | Customer thêm sản phẩm với size/topping đã chọn, thay đổi số lượng, xóa sản phẩm và xem tổng tiền; giỏ hàng lưu tại client, được giữ khi tải lại trang và không đồng bộ lên server. | Must |
| SCP-IN-04 | FR-05 | Xác thực và phân quyền | Đăng ký công khai chỉ tạo CUSTOMER; đăng nhập cấp JWT; backend kiểm tra quyền theo CUSTOMER, STAFF, MANAGER. Tài khoản STAFF/MANAGER được tạo bằng seed với mật khẩu lấy từ biến môi trường. | Must |
| SCP-IN-05 | FR-06 | Đặt đơn hàng | CUSTOMER đã đăng nhập tạo đơn từ giỏ hàng; backend tính lại giá, kiểm tra tồn kho theo sản phẩm, tạo đơn PENDING và trừ tồn kho trong cùng transaction; rollback khi không đủ hàng. | Must |
| SCP-IN-06 | FR-07 | Thanh toán mô phỏng | Customer chọn Ví hoặc Thẻ; Payment Service mô phỏng kết quả thành công/thất bại; hệ thống xử lý idempotency, không tạo giao dịch trùng khi gửi lại cùng khóa và nội dung yêu cầu. | Must |
| SCP-IN-07 | FR-08 | Xác nhận và lịch sử đơn | Customer nhận kết quả đặt/thanh toán đơn và xem danh sách, chi tiết các đơn hàng của chính mình; không được xem đơn của người khác. | Must |
| SCP-IN-08 | FR-09 | Theo dõi và cập nhật trạng thái đơn | Customer theo dõi trạng thái bằng polling mỗi 5 giây khi mở màn hình; dừng khi đơn COMPLETED, CANCELLED hoặc khi rời màn hình. STAFF/MANAGER cập nhật trạng thái hợp lệ và xác nhận COMPLETED khi khách nhận món. | Must|
| SCP-IN-09 | NFR-02 đến NFR-05 | Đóng gói, kiểm thử và triển khai | Hệ thống chạy được bằng Docker Compose; có GET /health; có migration/seed tái tạo database; CI chạy lint, test, build trên pull request; CD triển khai production có HTTPS, smoke test và hướng dẫn rollback. | Must |

**Quy tắc nghiệp vụ của MVP:**

1. Đăng ký công khai chỉ cấp role CUSTOMER; STAFF và MANAGER được tạo bằng seed.
2. Tồn kho được tính theo sản phẩm; size và topping không làm thay đổi số lượng tồn kho.
3. Giỏ hàng được lưu tại client, giữ được khi tải lại trang và không đồng bộ lên backend.
4. Backend phải tính lại tổng tiền từ dữ liệu sản phẩm, size và topping; không tin giá do client gửi.
5. Khi tạo đơn, kiểm tra và trừ tồn kho trong cùng transaction; nếu không đủ hàng thì rollback và không tạo đơn.
6. Thanh toán thành công chuyển đơn từ PENDING sang PAID; thanh toán thất bại giữ đơn PENDING để khách có thể thử lại.
7. Cùng idempotency key và cùng nội dung yêu cầu thanh toán phải trả lại kết quả đã lưu, kể cả kết quả thất bại. Cùng key với nội dung khác phải bị từ chối.
8. Customer chỉ được truy cập các đơn hàng thuộc tài khoản của mình.
9. Customer thấy trạng thái READY thông qua polling, không sử dụng push notification.

**Quy tắc trạng thái đơn hàng:**

Luồng xử lý thành công:

`PENDING → PAID → PREPARING → READY → COMPLETED`

Luồng hủy:

`PENDING → CANCELLED`

| Trạng thái hiện tại | Trạng thái tiếp theo | Điều kiện |
|---|---|---|
| PENDING | PAID | Thanh toán mô phỏng thành công. |
| PENDING | CANCELLED | Đơn hết hạn 30 phút nếu triển khai FR-10. |
| PAID | PREPARING | STAFF hoặc MANAGER bắt đầu xử lý đơn. |
| PREPARING | READY | STAFF hoặc MANAGER xác nhận đồ uống đã chuẩn bị xong. |
| READY | COMPLETED | STAFF hoặc MANAGER xác nhận khách đã nhận đồ uống. |
| COMPLETED | Không có | Trạng thái kết thúc. |
| CANCELLED | Không có | Trạng thái kết thúc. |

Không cho phép bỏ qua bước, chuyển trạng thái ngược hoặc chuyển sang CANCELLED từ trạng thái khác PENDING.

Đối với Customer, trạng thái READY cho biết đồ uống đã sẵn sàng để nhận. Polling vẫn tiếp tục cho đến khi đơn đạt COMPLETED hoặc CANCELLED, hoặc khi Customer rời màn hình theo dõi. STAFF hoặc MANAGER xác nhận COMPLETED khi khách nhận món.

### 3.2. Phạm vi mở rộng

Các chức năng mở rộng chỉ triển khai sau khi toàn bộ chức năng Must đã hoạt động ổn định và được kiểm thử.

| Mã phạm vi | Mã yêu cầu | Chức năng | Mô tả có thể kiểm chứng | Ưu tiên |
|---|---|---|---|---|
| SCP-EXT-01 | FR-02 | Lọc theo danh mục | Customer chọn danh mục; hệ thống trả về danh sách sản phẩm thuộc danh mục tương ứng. Không bao gồm tìm kiếm theo tên. | Should |
| SCP-EXT-02 | FR-10 | Tự hủy đơn quá hạn | Khi truy vấn GET /orders, GET /orders/:id hoặc POST /payments, hệ thống kiểm tra lazy expiration; đơn PENDING quá 30 phút được hủy và hoàn kho theo từng dòng đơn trong cùng transaction, sử dụng cập nhật trạng thái có điều kiện để tránh hoàn trùng. | Should |
| SCP-EXT-03 | FR-11 | Mã khuyến mãi | Customer nhập mã khuyến mãi; hệ thống kiểm tra điều kiện hợp lệ và tính giảm giá cố định hoặc phần trăm. Áp dụng quy tắc khuyến mãi tại phần Định hướng tối giản nếu triển khai. | Should |
| SCP-EXT-04 | FR-12 | Tích điểm khách hàng | Khi đơn chuyển sang COMPLETED, hệ thống ghi nhận giao dịch tích điểm cho Customer. Áp dụng quy tắc tích điểm tại phần Định hướng tối giản nếu triển khai. | Could |
| SCP-EXT-05 | FR-13 | Quản lý sản phẩm và tồn kho | Manager được quản lý thông tin sản phẩm và điều chỉnh tồn kho; các role không có quyền bị từ chối thao tác. Áp dụng phạm vi quản lý sản phẩm tại phần Định hướng tối giản nếu triển khai. | Could |
| SCP-EXT-06 | FR-02 | Lọc theo giá | Mở rộng bộ lọc sản phẩm theo khoảng giá nếu còn thời gian, không bắt buộc để hoàn thành FR-02. | Could |

**Nguyên tắc triển khai mở rộng:**

- Ưu tiên hoàn thành toàn bộ Must trước.
- FR-02 lọc theo danh mục thuộc Should; lọc theo giá thuộc Could, tìm kiếm theo tên không thực hiện.
- Thứ tự ưu tiên các chức năng mở rộng còn lại theo kế hoạch nhóm: FR-10, FR-11, FR-13, FR-12.
- FR-10 sử dụng lazy expiration khi gọi các API liên quan, không phụ thuộc hoàn toàn vào cron.
- Nếu không đủ thời gian, các chức năng mở rộng chưa hoàn thành sẽ được ghi nhận là không triển khai trong phiên bản bàn giao.
- Promotion và LoyaltyTransaction vẫn được thể hiện trong class diagram theo yêu cầu đề bài, kể cả khi FR-11 và FR-12 chưa được hiện thực; cần đánh dấu đây là mô hình mở rộng, chưa có bảng dữ liệu/API tương ứng.

**Định hướng tối giản cho các chức năng chưa chốt:**

Các nội dung dưới đây chỉ áp dụng nếu nhóm quyết định triển khai chức năng tương ứng:

| Mã yêu cầu | Định hướng đề xuất |
|---|---|
| FR-11 | Hỗ trợ giảm giá cố định hoặc theo phần trăm, có hạn sử dụng, mỗi đơn tối đa một mã. |
| FR-12 | Tích 1 điểm cho mỗi 10.000 VND, chỉ ghi điểm một lần khi đơn chuyển sang COMPLETED. |
| FR-13 | Manager được thêm, sửa, ngừng bán sản phẩm và điều chỉnh tồn kho; không xóa sản phẩm. |

Nếu triển khai FR-11, FR-12 hoặc FR-13, áp dụng đúng các định hướng trên và đưa thành yêu cầu, tiêu chí chấp nhận trong SRS.

### 3.3. Out-of-scope

Các nội dung dưới đây không thuộc phạm vi thực hiện của Assignment 2.

| Mã phạm vi | Nội dung không thực hiện | Giới hạn |
|---|---|---|
| SCP-OUT-01 | Thanh toán thật | Không tích hợp cổng thanh toán bên ngoài, không xử lý giao dịch tiền thật. |
| SCP-OUT-02 | Push notification | Không gửi thông báo đẩy qua trình duyệt hoặc thiết bị; Customer theo dõi đơn bằng polling. |
| SCP-OUT-03 | Giao hàng và Shipping Company | Không quản lý địa chỉ giao hàng, phí vận chuyển, tài xế hoặc đơn vị giao hàng. |
| SCP-OUT-04 | Đặt bàn | Không hỗ trợ đặt chỗ, đặt bàn hoặc quản lý bàn tại quán. |
| SCP-OUT-05 | Đa chi nhánh | Không quản lý nhiều cửa hàng, chuyển đơn hoặc đồng bộ tồn kho giữa các chi nhánh. |
| SCP-OUT-06 | Ứng dụng native | Không phát triển ứng dụng Android/iOS native; chỉ sử dụng web mobile-first/PWA. |
| SCP-OUT-07 | Đa ngôn ngữ | Không triển khai chức năng chuyển đổi ngôn ngữ giao diện. |
| SCP-OUT-08 | Tìm kiếm sản phẩm theo tên | Không triển khai tìm kiếm theo tên hoặc từ khóa; FR-02 chỉ yêu cầu lọc theo danh mục. |
| SCP-OUT-09 | Hoạt động offline đầy đủ | PWA hỗ trợ cài đặt qua manifest; không triển khai đồng bộ dữ liệu hoặc quy trình đặt hàng offline đầy đủ. |

## 4. Giả định

| Mã | Giả định |
|---|---|
| ASM-01 | BrewLite phục vụ quy trình đặt đồ uống để khách hàng nhận tại một quán cà phê, không có nghiệp vụ giao hàng. |
| ASM-02 | Dữ liệu sản phẩm, danh mục, size, topping và tồn kho ban đầu được chuẩn bị bằng migration/seed phục vụ phát triển và demo. |
| ASM-03 | Customer có thể xem menu và chi tiết sản phẩm khi chưa đăng nhập; cần đăng nhập với role CUSTOMER để đặt đơn. |
| ASM-04 | Payment Service chỉ mô phỏng kết quả thanh toán thành công hoặc thất bại, không phát sinh giao dịch tài chính thực tế. |
| ASM-05 | Customer sử dụng trình duyệt trên thiết bị có kết nối mạng để đặt và theo dõi đơn hàng. |
| ASM-06 | Mỗi sản phẩm có số lượng tồn kho riêng; lựa chọn size hoặc topping không làm thay đổi số lượng tồn kho cần trừ. |
| ASM-07 | Giỏ hàng được quản lý tại client, có thể khôi phục khi tải lại trang và không đồng bộ lên server. |
| ASM-08 | Tài khoản STAFF và MANAGER được tạo qua seed, sử dụng mật khẩu từ biến môi trường; đăng ký công khai chỉ tạo CUSTOMER. |
| ASM-09 | Customer theo dõi đơn qua polling mỗi 5 giây khi mở màn hình; việc theo dõi tự dừng khi đơn ở trạng thái kết thúc hoặc khi rời màn hình. |
| ASM-10 | Customer được thông báo đồ uống đã sẵn sàng khi đơn đạt READY; STAFF hoặc MANAGER xác nhận COMPLETED khi khách nhận món. |
| ASM-11 | Các chức năng Should/Could không phải điều kiện bắt buộc để nghiệm thu MVP; việc triển khai phụ thuộc vào tiến độ hoàn thành Must. |

## 5. Ràng buộc

| Mã | Ràng buộc |
|---|---|
| CON-01 | Frontend bắt buộc sử dụng Next.js theo hướng mobile-first/PWA; backend sử dụng NestJS; cơ sở dữ liệu sử dụng PostgreSQL; sử dụng Docker để đóng gói/chạy hệ thống. Có thể bổ sung công nghệ nhưng không thay thế Next.js, NestJS và PostgreSQL. |
| CON-02 | Chỉ sử dụng dịch vụ miễn phí. Hạ tầng dự kiến gồm Vercel cho web, Render Web Service cho API, Render Postgres cho database, GitHub Actions cho CI/CD và GHCR cho lưu trữ Docker image. |
| CON-03 | Repository GitHub phải ở chế độ Public. Không commit mật khẩu, token, khóa bí mật hoặc thông tin nhạy cảm vào repository; secret không được xuất hiện trong log CI. |
| CON-04 | Database production không được public trực tiếp; kết nối database phải được bảo vệ và sử dụng kết nối nội bộ phù hợp với hạ tầng triển khai. |
| CON-05 | Nhóm gồm hai thành viên [Phan Tấn Tài] và [Võ Quốc Phong]; thời gian thực hiện dự kiến từ 16/11/2026 đến 16/12/2026, khoảng một tháng. |
| CON-06 | Năm task phải được thực hiện và nghiệm thu tuần tự theo đề: Task 1 (Yêu cầu), Task 2 (Mô hình hóa), Task 3 (Kiến trúc), Task 4 (Sprint 1), Task 5 (Sprint 2 và triển khai). Task sau phải có tạo phẩm của task trước trong repository với lịch sử thay đổi rõ ràng. |
| CON-07 | Thanh toán chỉ được mô phỏng qua Payment Service; hỗ trợ Ví/Thẻ, nhánh thành công/thất bại và idempotency. Không tích hợp thanh toán thật. |
| CON-08 | Render Web Service gói free có thể ngủ sau khoảng 15 phút không truy cập, dẫn đến cold start khi có yêu cầu mới. Hệ thống và quy trình demo phải tính đến giới hạn này. |
| CON-09 | Render Postgres gói free hết hạn sau 30 ngày kể từ lúc tạo. Nhóm cần tính thời điểm tạo database production, có phương án sao lưu hoặc tái tạo bằng migration/seed và kiểm tra khả năng hoạt động tại thời điểm nghiệm thu. |
| CON-10 | Pull request không được merge khi lint, test hoặc build thất bại. CI phải tự động kiểm tra chất lượng mã nguồn và cung cấp minh chứng lần chạy thành công/thất bại. |
| CON-11 | Các yêu cầu cần có mã FR/NFR, mức ưu tiên MoSCoW và tiêu chí chấp nhận kiểm chứng được trong SRS; yêu cầu, use-case, thiết kế, API/code và test phải được liên kết qua `docs/traceability-matrix.md`. |
| CON-12 | Các sơ đồ bắt buộc phải nhất quán với SRS, use-case và mô hình dữ liệu; lưu cả tệp nguồn và tệp kết xuất trong repository. |
| CON-13 | Hệ thống phải có kiểm thử unit, integration và ít nhất một E2E cho luồng từ menu đến xác nhận đơn; có `docker-compose.yml`, migration/seed và health endpoint. |
| CON-14 | Phiên bản production phải có URL frontend HTTPS, URL API và health check có thể truy cập; có pipeline triển khai, smoke test và hướng dẫn rollback. |
| CON-15 | Phiên bản bàn giao phải ưu tiên hoàn thành FR-01, FR-03 đến FR-09 trước khi phát triển các chức năng mở rộng. |

## 6. Rủi ro ban đầu

| Mã | Rủi ro | Mức độ | Hướng xử lý |
|---|---|---|---|
| RSK-01 | Thời gian khoảng một tháng không đủ để hoàn thành MVP, kiểm thử và triển khai production. | Cao | Ưu tiên toàn bộ Must; chia công việc giữa Tài và Phong; kiểm tra tiến độ theo tuần; loại bỏ Should/Could khi có nguy cơ trễ hạn. |
| RSK-02 | Render free ngủ sau thời gian không truy cập, gây chậm hoặc lỗi khi demo và smoke test. | Cao | Gọi `/health` trước demo; bổ sung retry và thời gian chờ cold start trong smoke test; kiểm tra URL trước nghiệm thu. |
| RSK-03 | Render Postgres free hết hạn trước thời điểm nghiệm thu, làm mất khả năng truy cập dữ liệu. | Cao | Tạo database production gần ngày bàn giao; ghi ngày tạo/hết hạn; duy trì migration/seed và phương án chuyển sang database miễn phí dự phòng. |
| RSK-04 | Đặt đơn đồng thời gây trừ tồn kho sai, tồn kho âm hoặc tạo đơn khi đã hết hàng. | Cao | Kiểm tra tồn kho theo sản phẩm và cập nhật trong cùng transaction; rollback khi không đủ hàng; viết integration test cho trường hợp lỗi và yêu cầu đồng thời. |
| RSK-05 | Gửi lại yêu cầu thanh toán tạo nhiều giao dịch hoặc cập nhật trạng thái đơn sai. | Cao | Áp dụng idempotency key; lưu kết quả xử lý; kiểm tra trạng thái đơn trước thanh toán; kiểm thử yêu cầu lặp và thanh toán thất bại. |
| RSK-06 | Lộ secret do repository Public hoặc cấu hình CI/CD không đúng. | Cao | Sử dụng environment variables và GitHub Secrets; cấu hình `.gitignore`, secret scanning, push protection; không in secret trong log. |
| RSK-07 | SRS, sơ đồ, API và mã nguồn không thống nhất, làm mất khả năng truy vết. | Trung bình | Duy trì mã FR/NFR; cập nhật traceability matrix trong từng PR; review chéo tài liệu và thiết kế trước khi hiện thực. |
| RSK-08 | CI/CD hoặc Docker deployment không hoạt động đúng với giới hạn gói miễn phí. | Cao | Deploy thử sớm; xác minh cách Render sử dụng image từ GHCR; điều chỉnh deployment diagram theo hạ tầng thực tế; kiểm tra pipeline trước bàn giao. |
| RSK-09 | Customer không thấy trạng thái READY kịp thời do polling lỗi hoặc gián đoạn kết nối. | Trung bình | Kiểm thử polling 5 giây, điều kiện dừng và API đọc trạng thái; hiển thị loading/error; cho phép tải lại khi kết nối lỗi. |
| RSK-10 | Lỗi phân quyền khiến Customer xem đơn người khác hoặc truy cập chức năng STAFF/MANAGER. | Cao | Xác thực JWT và kiểm tra role ở backend; đăng ký công khai chỉ tạo CUSTOMER; kiểm tra quyền sở hữu đơn; viết test truy cập trái phép. |
| RSK-11 | Tính toán giá không nhất quán giữa frontend và backend, đặc biệt khi có size/topping. | Trung bình | Backend tính lại giá từ dữ liệu sản phẩm; không tin giá do client gửi; kiểm thử tổng tiền theo từng cấu hình. |
| RSK-12 | Nhóm thiếu thời gian thực hiện integration/E2E test, tài liệu triển khai và minh chứng nghiệm thu. | Cao | Viết test song song với chức năng; chuẩn bị tài liệu và CI từ sớm; dành giai đoạn cuối cho kiểm thử, production và bàn giao. |
| RSK-13 | Cơ chế tự hủy đơn chạy trùng hoặc hoàn tồn kho nhiều lần nếu triển khai FR-10. | Trung bình | Kiểm tra lazy expiration ở các API đã xác định; cập nhật trạng thái có điều kiện và hoàn kho trong cùng transaction; kiểm thử gọi lặp và yêu cầu đồng thời. |
| RSK-14 | Seed tài khoản STAFF/MANAGER không an toàn hoặc làm lộ mật khẩu quản trị. | Cao | Đọc mật khẩu từ biến môi trường, không hardcode; không commit hoặc ghi mật khẩu vào log; kiểm tra cấu hình seed và phân quyền. |
| RSK-15 | Nếu không triển khai FR-10, đơn PENDING bị bỏ dở giữ tồn kho vì tồn kho đã bị trừ khi tạo đơn; trạng thái CANCELLED cũng không có luồng tự động kích hoạt. | Trung bình | Ưu tiên FR-10 ngay sau Must. Nếu không thực hiện, ghi rõ giới hạn trong SRS và README. Xem xét bổ sung thao tác hủy đơn thủ công cho STAFF/MANAGER nếu được đưa vào phạm vi, hoặc tái tạo tồn kho bằng seed khi demo. |
