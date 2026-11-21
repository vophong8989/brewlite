# Danh sách User Story (Product Backlog)

**Phiên bản:** 1.0  
**Ngày:** 16/11/2026  
**Dự án:** BrewLite - Ứng dụng đặt đồ uống tại quán cà phê  
**Tạo phẩm:** Task 1.2 - BrewLite Assignment 2  
**Tham chiếu:** `docs/requirements/context-and-scope.md`, `docs/requirements/srs.md`

## 1. Mục đích

Tài liệu xác định User Story của BrewLite để xây dựng Product Backlog, phân chia Sprint và truy vết đến FR/NFR trong SRS. Mỗi story có dạng: `Là <vai trò>, tôi muốn <việc> để <lợi ích>.`

- Must: bắt buộc triển khai.
- Should: ưu tiên sau Must.
- Could: thực hiện nếu còn thời gian.
- Sprint 1: menu và nền tảng ban đầu.
- Sprint 2: hoàn thiện đặt đơn, thanh toán, theo dõi và production.
- Sau Must: các chức năng mở rộng.

## 2. Danh sách User Story

### Epic 01: Menu và sản phẩm

**Mục tiêu:** Customer xem và lựa chọn đồ uống.

| Mã US | Story | FR liên quan | MoSCoW | Sprint dự kiến |
|---|---|---|---|---|
| US-01 | Là Customer, tôi muốn xem danh sách đồ uống cùng giá và trạng thái còn bán để lựa chọn sản phẩm phù hợp. | FR-01 | Must | Sprint 1 |
| US-02 | Là Customer, tôi muốn lọc sản phẩm theo danh mục để tìm nhóm đồ uống mong muốn nhanh hơn. | FR-02 | Should | Sau Must |
| US-03 | Là Customer, tôi muốn xem chi tiết đồ uống và chọn size/topping để tùy chỉnh món trước khi đặt. | FR-03 | Must | Sprint 2 |
| US-16 | Là Customer, tôi muốn lọc sản phẩm theo khoảng giá để tìm đồ uống phù hợp ngân sách. | FR-02 (lọc giá) | Could | Sau Must |

US-01 là trọng tâm Sprint 1. US-02 chỉ lọc danh mục; US-16 là phần Could của FR-02. Không có story tìm kiếm theo tên.

### Epic 02: Giỏ hàng và xác thực

**Mục tiêu:** Customer chuẩn bị đơn và xác thực trước khi đặt.

| Mã US | Story | FR liên quan | MoSCoW | Sprint dự kiến |
|---|---|---|---|---|
| US-04 | Là Customer, tôi muốn thêm, sửa số lượng và xóa đồ uống trong giỏ hàng để kiểm tra lựa chọn và tổng tiền trước khi đặt. | FR-04 | Must | Sprint 2 |
| US-05 | Là Customer, tôi muốn đăng ký tài khoản để có thể đặt và theo dõi đơn hàng của mình. | FR-05 | Must | Sprint 2 |
| US-06 | Là người dùng BrewLite, tôi muốn đăng nhập để truy cập các chức năng theo role được cấp. | FR-05 | Must | Sprint 2 |

Giỏ hàng lưu tại client và giữ khi tải lại trang. Đăng ký công khai chỉ tạo CUSTOMER; STAFF/MANAGER được tạo bằng seed. JWT dùng để xác thực và phân quyền.

### Epic 03: Đặt đơn và thanh toán

**Mục tiêu:** Tạo đơn và thanh toán mô phỏng.

| Mã US | Story | FR liên quan | MoSCoW | Sprint dự kiến |
|---|---|---|---|---|
| US-07 | Là Customer, tôi muốn đặt đơn từ giỏ hàng để quán tiếp nhận đồ uống tôi đã chọn. | FR-06 | Must | Sprint 2 |
| US-08 | Là Customer, tôi muốn thanh toán bằng Ví hoặc Thẻ mô phỏng để hoàn tất bước thanh toán đơn hàng. | FR-07 | Must | Sprint 2 |
| US-13 | Là Customer, tôi muốn áp dụng mã khuyến mãi hợp lệ để giảm số tiền phải thanh toán. | FR-11 | Should | Sau Must |

US-07 kiểm tra tồn kho và transaction; chỉ CUSTOMER được đặt đơn, STAFF/MANAGER bị từ chối 403. US-08 hỗ trợ thành công/thất bại, idempotency và chỉ thanh toán đơn của chính mình; đơn của người khác trả 404. Thiếu JWT khi gọi API đặt/thanh toán trả 401. Thanh toán thất bại giữ PENDING và cho phép thử lại bằng key mới. US-13 chỉ thực hiện nếu triển khai FR-11.

### Epic 04: Lịch sử và quản lý trạng thái đơn

**Mục tiêu:** Customer theo dõi đơn; nhân viên xử lý đơn tại quán.

| Mã US | Story | FR liên quan | MoSCoW | Sprint dự kiến |
|---|---|---|---|---|
| US-09 | Là Customer, tôi muốn xem xác nhận và lịch sử các đơn hàng của mình để kiểm tra những đơn đã đặt và thanh toán. | FR-08 | Must | Sprint 2 |
| US-10 | Là Customer, tôi muốn theo dõi trạng thái đơn hàng để biết khi nào đồ uống đã sẵn sàng để nhận. | FR-09 | Must | Sprint 2 |
| US-11 | Là Cashier (role STAFF), tôi muốn xem hàng đợi và cập nhật trạng thái đơn để xử lý đồ uống và xác nhận khi khách nhận món. | FR-09 | Must | Sprint 2 |
| US-12 | Là Manager, tôi muốn hệ thống tự hủy đơn PENDING quá 30 phút và hoàn tồn kho để tránh giữ hàng cho các đơn bị bỏ dở. | FR-10 | Should | Sau Must |

Manager xử lý đơn như STAFF. Customer polling 5 giây; READY thông báo đồ uống sẵn sàng; dừng ở COMPLETED, CANCELLED hoặc rời màn hình. STAFF/MANAGER xác nhận COMPLETED khi khách nhận món. US-12 dùng lazy expiration khi `GET /orders`, `GET /orders/:id`, `POST /payments`; không triển khai thì chỉ ghi nhận giới hạn RSK-15, không thêm thao tác hủy thủ công.

### Epic 05: Khách hàng thân thiết và quản trị

**Mục tiêu:** Mở rộng quyền lợi khách hàng và quản trị sản phẩm.

| Mã US | Story | FR liên quan | MoSCoW | Sprint dự kiến |
|---|---|---|---|---|
| US-14 | Là Customer, tôi muốn được tích điểm khi đơn hoàn tất để ghi nhận quyền lợi khách hàng thân thiết. | FR-12 | Could | Sau Must |
| US-15 | Là Manager, tôi muốn thêm, sửa, ngừng bán sản phẩm và điều chỉnh tồn kho để quản lý danh mục đồ uống của quán. | FR-13 | Could | Sau Must |

US-14 tính `floor(totalAmount / 10000)` điểm, chỉ khi COMPLETED và không ghi trùng. US-15 chỉ cho MANAGER, không xóa sản phẩm. Nếu không triển khai FR-11/FR-12 thì quy tắc giảm giá/tích điểm chưa áp dụng.

### Epic 06: Nền tảng kỹ thuật và triển khai

**Mục tiêu:** Hệ thống phát triển, kiểm thử và triển khai theo Assignment 2.

| Mã US | Story | FR liên quan | MoSCoW | Sprint dự kiến |
|---|---|---|---|---|
| US-17 | Là nhóm phát triển, tôi muốn có API menu, dữ liệu seed, màn hình mobile-first và môi trường chạy ban đầu để kiểm chứng MVP đầu tiên. | FR-01; NFR-03, NFR-04, NFR-05 | Must | Sprint 1 |
| US-18 | Là nhóm phát triển, tôi muốn có Docker Compose, CI/CD, health check và kiểm thử tích hợp để hệ thống có thể triển khai và nghiệm thu trên production. | FR-06, FR-07, FR-08; NFR-02 đến NFR-06 | Must (nền tảng NFR-02 đến NFR-05) | Sprint 2 |

US-17 và US-18 là story kỹ thuật, không tạo FR mới. US-18 khởi tạo một phần từ Sprint 1, hoàn thiện ở Sprint 2. NFR-06 là Should; quality gate CI bắt buộc thuộc NFR-05.

## 3. Tổng hợp Product Backlog

### 3.1. Theo Epic

| Epic | User Story | Số lượng |
|---|---|---|
| Epic 01: Menu và sản phẩm | US-01, US-02, US-03, US-16 | 4 |
| Epic 02: Giỏ hàng và xác thực | US-04, US-05, US-06 | 3 |
| Epic 03: Đặt đơn và thanh toán | US-07, US-08, US-13 | 3 |
| Epic 04: Lịch sử và trạng thái đơn | US-09, US-10, US-11, US-12 | 4 |
| Epic 05: Khách hàng thân thiết và quản trị | US-14, US-15 | 2 |
| Epic 06: Nền tảng kỹ thuật | US-17, US-18 | 2 |
| **Tổng cộng** | **US-01 đến US-18** | **18** |

### 3.2. Theo mức ưu tiên

| MoSCoW | User Story | Số lượng |
|---|---|---|
| Must | US-01, US-03 đến US-11, US-17, US-18 | 12 |
| Should | US-02, US-12, US-13 | 3 |
| Could | US-14, US-15, US-16 | 3 |
| **Tổng cộng** | | **18** |

US-18 được xếp Must theo hạ tầng bắt buộc; các hạng mục NFR-06 thuộc Should theo dõi riêng khi tách task.

## 4. Kế hoạch Sprint dự kiến

### Sprint 1: MVP xem menu

**Sprint Goal:** Có hệ thống ban đầu chạy được với chức năng xem menu.

| Story | Công việc chính |
|---|---|
| US-01 | API `GET /products`, màn hình menu, loading/empty/error. |
| US-17 | Khởi tạo web/API, migration, seed, mobile-first, kiểm thử ban đầu. |
| US-18 (một phần) | Khởi tạo CI, Docker và hạ tầng triển khai thử. |

**Kết quả:** Menu lấy dữ liệu từ API, PostgreSQL có dữ liệu mẫu, giao diện di động, kiểm thử ban đầu và CI cơ bản.

### Sprint 2: Hoàn thiện MVP

**Sprint Goal:** Hoàn thành luồng đặt đồ uống từ menu đến xác nhận đơn.

| Story | Công việc chính |
|---|---|
| US-03 | Chi tiết sản phẩm, size, topping. |
| US-04 | Giỏ hàng và tính tổng tiền. |
| US-05, US-06 | Đăng ký, đăng nhập, JWT, role. |
| US-07 | Tạo đơn, transaction, tồn kho. |
| US-08 | Thanh toán mô phỏng, idempotency, phân quyền và quyền sở hữu đơn. |
| US-09 | Xác nhận và lịch sử đơn. |
| US-10, US-11 | Polling, hàng đợi, cập nhật trạng thái. |
| US-18 | Integration/E2E, Docker Compose, CI/CD, production, health check, rollback. |

**Kết quả:** Luồng Must end-to-end, production truy cập được, có kiểm thử và tài liệu bàn giao.

### Sau Must: Chức năng mở rộng

| Thứ tự xem xét | Story | Mức ưu tiên |
|---|---|---|
| 1 | US-12: Tự hủy đơn quá hạn | Should |
| 2 | US-13: Mã khuyến mãi | Should |
| 3 | US-15: Quản lý sản phẩm/tồn kho | Could |
| 4 | US-14: Tích điểm | Could |

US-02 (lọc danh mục, Should) và US-16 (lọc giá, Could) được xem xét theo tiến độ menu, không ảnh hưởng Must.

## 5. Quy tắc quản lý Backlog

1. Mỗi User Story liên kết ít nhất một FR hoặc NFR.
2. Issue GitHub giữ mã US trong tiêu đề.
3. Must được ưu tiên trước Should/Could.
4. Mỗi story có tiêu chí chấp nhận từ SRS; khi viết test tham chiếu mã `FR-xx-ACn` hoặc `NFR-xx-ACn`.
5. Mỗi PR cập nhật mã yêu cầu và kiểm thử liên quan trong `docs/traceability-matrix.md`.
6. Chức năng Should/Could chưa làm phải ghi rõ trong tài liệu bàn giao.
7. Thay đổi phạm vi phải cập nhật đồng bộ `context-and-scope.md` và `srs.md`.

## 6. Definition of Done cho User Story

Một User Story hoàn thành khi đáp ứng AC; có mã nguồn và PR được review chéo; lint, test, build thành công; không lộ secret; tài liệu và ma trận truy vết được cập nhật; có thể chạy và kiểm chứng. Với story production, cần thêm URL, health check và bằng chứng triển khai.
