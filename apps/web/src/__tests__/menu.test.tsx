import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import MenuList from '@/components/MenuList';
import ProductCard from '@/components/ProductCard';
import { categoryLabel, formatVnd, getApiRoot, getProducts } from '@/lib/products';
import type { Product } from '@/lib/products';

// Keep the real API implementation for ordinary tests; UI-T11 injects a
// production configuration error without relying on Jest's NODE_ENV value.
jest.mock('@/lib/products', () => {
  const actual = jest.requireActual<typeof import('@/lib/products')>('@/lib/products');
  return { ...actual, getProducts: jest.fn(actual.getProducts) };
});

// Next/image is visual plumbing, not behavior under test.
jest.mock('next/image', () => {
  function MockImage(props: { alt: string; src: string; onError?: () => void }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={props.alt} src={props.src} onError={props.onError} />;
  }
  return MockImage;
});

const products: Product[] = [
  { id: '6b3d8d25-b9a4-4c1f-909c-d9c9162ec640', name: 'Cà phê sữa đá',
    description: 'Cà phê pha phin cùng sữa đặc', basePrice: 29000,
    category: 'coffee', available: true, imageUrl: '/images/menu/ca-phe-sua-da.svg' },
  { id: '59b06b02-57ea-4744-90ef-488114e99fca', name: 'Trà đào',
    description: 'Trà đào thanh mát', basePrice: 35000, category: 'tea',
    available: false, imageUrl: null },
];

const response = (data: unknown, ok = true, status = 200) =>
  ({ ok, status, json: async () => data }) as Response;

beforeEach(() => { jest.restoreAllMocks(); });
afterEach(() => { jest.useRealTimers(); });

test('UI-T01 FR-01-AC1 displays menu products and formatted price', async () => {
  global.fetch = jest.fn().mockResolvedValue(response(products));
  render(<MenuList />);
  expect(await screen.findByText('Cà phê sữa đá')).toBeInTheDocument();
  expect(screen.getByText(/29[.\s]000\s?₫|29[.\s]000\s?đ/)).toBeInTheDocument();
});

test('UI-T02 FR-01-AC3 NFR-04-AC2 displays loading and server waking message', async () => {
  jest.useFakeTimers();
  global.fetch = jest.fn().mockImplementation(() => new Promise(() => {}));
  render(<MenuList />);
  expect(screen.getByText('Đang tải đồ uống…')).toBeInTheDocument();
  act(() => { jest.advanceTimersByTime(5000); });
  expect(screen.getByText('Máy chủ đang khởi động, vui lòng chờ')).toBeInTheDocument();
});

test('UI-T03 FR-01-AC2 NFR-04-AC2 displays empty state', async () => {
  global.fetch = jest.fn().mockResolvedValue(response([]));
  render(<MenuList />);
  expect(await screen.findByText('Hiện chưa có đồ uống')).toBeInTheDocument();
});

test('UI-T04 FR-01-AC3 NFR-04-AC2 displays error and retries successfully', async () => {
  global.fetch = jest.fn().mockResolvedValueOnce(response({ code: 'ERROR' }, false, 503))
    .mockResolvedValueOnce(response(products));
  render(<MenuList />);
  expect(await screen.findByText('Không tải được menu')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Thử lại' }));
  expect(await screen.findByText('Cà phê sữa đá')).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledTimes(2);
});

test('UI-T05 FR-01-AC1 labels unavailable products', async () => {
  global.fetch = jest.fn().mockResolvedValue(response(products));
  render(<MenuList />);
  await waitFor(() => expect(screen.getByText('Hết hàng')).toBeInTheDocument());
  expect(screen.getByText('Trà đào')).toBeInTheDocument();
});

test('UI-T06 FR-01-AC3 rejects unexpected response shape', async () => {
  global.fetch = jest.fn().mockResolvedValue(response({ data: products }));
  render(<MenuList />);
  expect(await screen.findByText('Dữ liệu menu không hợp lệ.')).toBeInTheDocument();
});


test('UI-T07 FR-01-AC3 aborts request after 75 seconds and displays timeout', async () => {
  jest.useFakeTimers();
  let wasAborted = false;
  global.fetch = jest.fn().mockImplementation((_url: string, options?: RequestInit) =>
    new Promise((_resolve, reject) => {
      options?.signal?.addEventListener('abort', () => {
        wasAborted = true;
        reject(new DOMException('Aborted', 'AbortError'));
      });
    })
  );
  render(<MenuList />);
  await act(async () => { jest.advanceTimersByTime(75_000); });
  expect(wasAborted).toBe(true);
  expect(screen.getByText('Kết nối quá thời gian chờ. Vui lòng thử lại.')).toBeInTheDocument();
});

test('UI-T08 FR-01-AC1 uses fallback image when imageUrl is null', () => {
  render(<ProductCard product={products[1]} />);
  expect(screen.getByRole('img', { name: 'Trà đào' })).toHaveAttribute('src', '/images/menu/fallback.svg');
});

test('UI-T09 FR-01-AC3 uses fallback image when the product image fails', () => {
  render(<ProductCard product={products[0]} />);
  const img = screen.getByRole('img', { name: 'Cà phê sữa đá' });
  fireEvent.error(img);
  expect(screen.getByRole('img', { name: 'Cà phê sữa đá' })).toHaveAttribute('src', '/images/menu/fallback.svg');
});

test('UI-T10 FR-01-AC1 formats VND and translates category labels', () => {
  expect(formatVnd(29000)).toMatch(/29[.\s]000/);
  expect(categoryLabel('coffee')).toBe('Cà phê');
  expect(categoryLabel('tea')).toBe('Trà');
  expect(categoryLabel('smoothie')).toBe('Sinh tố');
  expect(categoryLabel('new-category')).toBe('new-category');
});


test('UI-T11 FR-01-AC3 shows configuration error when production API URL is missing', async () => {
  // Explicit arguments avoid Next.js/Jest inlining NODE_ENV as "test" and
  // ignore the local .env.local URL during this production-only scenario.
  expect(() => getApiRoot({ environment: 'production' })).toThrow(
    'Chưa cấu hình NEXT_PUBLIC_API_URL cho môi trường production.'
  );
  expect(getApiRoot({ environment: 'development' })).toBe('http://localhost:3001');

  global.fetch = jest.fn();
  jest.mocked(getProducts).mockImplementationOnce(async () => {
    getApiRoot({ environment: 'production' });
    return [];
  });
  render(<MenuList />);
  expect(await screen.findByText('Chưa cấu hình NEXT_PUBLIC_API_URL cho môi trường production.')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Thử lại' })).toBeInTheDocument();
  expect(global.fetch).not.toHaveBeenCalled();
});

test('UI-T12 FR-01-AC3 shows a network error and a retry button when fetch rejects', async () => {
  global.fetch = jest.fn().mockRejectedValue(new TypeError('Failed to fetch'));
  render(<MenuList />);
  expect(await screen.findByText('Không kết nối được máy chủ. Vui lòng thử lại.')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Thử lại' })).toBeInTheDocument();
});
