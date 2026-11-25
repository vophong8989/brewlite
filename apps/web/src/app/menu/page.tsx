import MenuList from "@/components/MenuList";

export default function MenuPage() {
  return <main className="page-shell">
    <header className="hero">
      <p className="eyebrow">BREWLITE • ĐẶT ĐỒ UỐNG TẠI QUÁN</p>
      <h1>Hôm nay uống gì?</h1>
      <p>Chọn món yêu thích và xem thực đơn của quán.</p>
    </header>
    <div className="section-heading"><h2>Thực đơn</h2><span>Giá niêm yết bằng VND</span></div>
    <MenuList />
  </main>;
}
