```markdown
## Mục đích PR
<!-- Mô tả ngắn gọn PR này làm gì (gắn với Task / Issue nào) -->

## Lý do thay đổi
<!-- Bắt buộc ghi rõ lý do nếu có thay đổi về yêu cầu, sơ đồ, API contract hoặc kiến trúc -->

## Cập nhật Traceability Matrix
<!-- Liệt kê các mã FR/NFR đã cập nhật trong docs/traceability-matrix.md (hoặc ghi "Không áp dụng") -->
- Mã yêu cầu liên quan: 

## Checklist Definition of Done (DoD)
- [ ] Đã kiểm tra tính nhất quán với SRS và API Contract.
- [ ] Không commit secret / file `.env` / chuỗi kết nối thật.
- [ ] Không để lại chữ `TODO` trong tài liệu.
- [ ] Đã commit cả `.puml` và `.svg` (nếu có thêm/sửa sơ đồ).
- [ ] Đã viết và chạy pass unit test / integration test cho phần thay đổi.
- [ ] Đã cập nhật `docs/traceability-matrix.md`.