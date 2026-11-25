export type Product = {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  imageUrl: string | null;
  category: string;
  available: boolean;
};

type ErrorBody = { statusCode?: number; error?: string; message?: string; code?: string };

export class ApiError extends Error {
  constructor(public readonly statusCode?: number, public readonly code?: string, message = "Không tải được dữ liệu") {
    super(message);
    this.name = "ApiError";
  }
}

const isProduct = (value: unknown): value is Product => {
  if (typeof value !== "object" || value === null) return false;
  const p = value as Record<string, unknown>;
  return typeof p.id === "string" && typeof p.name === "string" && typeof p.description === "string"
    && typeof p.basePrice === "number" && Number.isInteger(p.basePrice) && p.basePrice >= 0
    && (typeof p.imageUrl === "string" || p.imageUrl === null)
    && typeof p.category === "string" && typeof p.available === "boolean";
};

export const categoryLabel = (slug: string): string => ({
  coffee: "Cà phê", tea: "Trà", smoothie: "Sinh tố",
} as Record<string, string>)[slug] ?? slug;

export const formatVnd = (value: number): string => new Intl.NumberFormat("vi-VN", {
  style: "currency", currency: "VND", maximumFractionDigits: 0,
}).format(value);

// An explicit config lets tests exercise production without mutating NODE_ENV,
// which Next.js/Jest may replace at compile time.
export function getApiRoot(config: {
  environment?: string;
  configuredUrl?: string;
} = {
  environment: process.env.NODE_ENV,
  configuredUrl: process.env.NEXT_PUBLIC_API_URL,
}): string {
  const configuredApiRoot = config.configuredUrl?.trim();
  if (configuredApiRoot) return configuredApiRoot.replace(/\/+$/, "");
  if (config.environment !== "production") return "http://localhost:3001";
  throw new ApiError(undefined, undefined,
    "Chưa cấu hình NEXT_PUBLIC_API_URL cho môi trường production.");
}

// External AbortSignal is controlled by the component to cancel on unmount/retry.
export async function getProducts(signal?: AbortSignal): Promise<Product[]> {
  let response: Response;
  const apiRoot = getApiRoot();
  try {
    response = await fetch(`${apiRoot}/products`, { signal, cache: "no-store" });
  } catch (e) {
    if (signal?.aborted) throw e;
    throw new ApiError(undefined, undefined, "Không kết nối được máy chủ. Vui lòng thử lại.");
  }
  if (!response.ok) {
    const body: ErrorBody = await response.json().catch(() => ({}));
    throw new ApiError(response.status, typeof body.code === "string" ? body.code : undefined,
      response.status >= 500 ? "Máy chủ đang gặp sự cố. Vui lòng thử lại." : "Không thể tải menu. Vui lòng thử lại.");
  }
  let body: unknown;
  try { body = await response.json(); }
  catch { throw new ApiError(response.status, undefined, "Dữ liệu menu không hợp lệ."); }
  if (!Array.isArray(body) || !body.every(isProduct)) {
    throw new ApiError(response.status, undefined, "Dữ liệu menu không hợp lệ.");
  }
  return body;
}
