# ADR-002: Prisma

**Trạng thái:** Chấp nhận  
**Ngày:** 18/11/2026

## Bối cảnh
D1 đã chốt Prisma; PostgreSQL cần schema/migration và transaction cho đơn/kho.

## Quyết định
Prisma ORM, migration versioned; production chỉ `prisma migrate deploy`, không `migrate dev/reset`; dùng `$transaction` khi tạo Order và trừ kho, ghi Payment và đổi Order.

## Hệ quả và trade-off
Ưu: schema và migration rõ, transaction nhất quán. Nhược: cần kiểm tra migration tương thích ngược để rollback ứng dụng.

## Phương án đã cân nhắc
SQL thuần/ORM khác: không theo D1 và tăng chi phí học trong nhóm.

## Liên quan
D1; FR-06, FR-07, NFR-03, NFR-05; ARCH-API, ARCH-DB.
