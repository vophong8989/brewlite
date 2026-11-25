"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { getProducts, type Product } from "@/lib/products";

type UiState = "loading" | "empty" | "error" | "success";

export default function MenuList() {
  const [requestKey, setRequestKey] = useState(0);
  const [state, setState] = useState<UiState>("loading");
  const [products, setProducts] = useState<Product[]>([]);
  const [coldStart, setColdStart] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // The effect starts asynchronous work and registers cleanup. It does not
  // synchronously call setState; the retry handler resets UI first.
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    let timedOut = false;

    const coldStartTimer = setTimeout(() => {
      if (active && !controller.signal.aborted) setColdStart(true);
    }, 5_000);
    const timeoutTimer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 75_000);

    async function load() {
      try {
        const data = await getProducts(controller.signal);
        if (!active || controller.signal.aborted) return;
        setProducts(data);
        setState(data.length ? "success" : "empty");
      } catch (error) {
        if (!active) return;
        // A canceled request (unmount/reload) cannot update the current UI.
        if (controller.signal.aborted && !timedOut) return;
        setErrorMessage(timedOut
          ? "Kết nối quá thời gian chờ. Vui lòng thử lại."
          : error instanceof Error ? error.message : "Không tải được menu.");
        setState("error");
      } finally {
        clearTimeout(coldStartTimer);
        clearTimeout(timeoutTimer);
      }
    }
    void load();

    return () => {
      active = false;
      controller.abort();
      clearTimeout(coldStartTimer);
      clearTimeout(timeoutTimer);
    };
  }, [requestKey]);

  function retry() {
    setState("loading");
    setColdStart(false);
    setErrorMessage("");
    setProducts([]);
    setRequestKey(key => key + 1);
  }

  if (state === "loading") return (
    <section aria-busy="true" aria-label="Đang tải menu">
      <p role="status" className="status-text">{coldStart ? "Máy chủ đang khởi động, vui lòng chờ" : "Đang tải đồ uống…"}</p>
      <div className="drink-grid" aria-hidden="true">
        {[1, 2, 3, 4].map(n => <div className="skeleton" key={n} />)}
      </div>
    </section>
  );
  if (state === "empty") return <section className="state-panel" role="status"><h2>Hiện chưa có đồ uống</h2><p>Hãy quay lại sau nhé.</p></section>;
  if (state === "error") return <section role="alert" className="state-panel"><h2>Không tải được menu</h2><p>{errorMessage}</p><button type="button" onClick={retry}>Thử lại</button></section>;
  return <section aria-label="Danh sách đồ uống" className="drink-grid">
    {products.map(p => <ProductCard product={p} key={p.id} />)}
  </section>;
}
