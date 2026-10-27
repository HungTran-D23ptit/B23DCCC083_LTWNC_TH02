# Bài Thực Hành TH02 – Lập Trình Web Nâng Cao
## Ứng Dụng "Trình Phát Nhạc Mini" (Mini Music Player)

- **Họ và tên:** Trần Duy Hùng
- **Mã sinh viên:** B23DCCC083
- **Lớp:** D23CQCN01-B
- **Môn học:** Lập trình Web nâng cao (PTIT)

---

## 1. Giới thiệu tổng quan
Ứng dụng **Trình phát nhạc mini** được xây dựng bằng React 18, TypeScript, Vite và Zustand, mô phỏng trải nghiệm người dùng hiện đại tương tự Spotify với thư viện hơn 10.000 bài hát.

### Yêu cầu kỹ thuật bắt buộc đạt được:
- Dòng đầu tiên của `src/App.tsx`: `const BUILD_TAG = "mz-4073";`
- Tên hàm xử lý tìm kiếm: `handleQueryShift`
- Quản lý state đúng công cụ theo từng loại:
  - **Zustand store** (`usePlayerStore`): Đồng hồ đếm giây, hàng đợi phát nhạc, cập nhật liên tục với selector chống re-render thừa.
  - **Zustand + Persist** (`useFavoritesStore`): Lưu danh sách yêu thích vào `localStorage` key `music-favorites`.
  - **Context + useReducer** (`PlaylistContext`, `playlistReducer`): Quản lý tạo/sửa/xóa playlist và bài hát, tích hợp middleware `withLogger` ghi log trong môi trường DEV.
  - **ThemeContext**: Giao diện Sáng/Tối mượt mà, lưu vào `localStorage`.
  - **Code splitting**: Lazy load các trang `/favorites`, `/playlists`, `/playlists/:id` bằng `React.lazy` và `Suspense`.

---

## 2. Kết quả đo đạc hiệu năng (React DevTools Profiler)
Theo thử thách nâng cao của đề bài:
- **Khi render trực tiếp cả 10.000 phần tử (không ảo hóa):**
  - Thời gian render ban đầu: **~840ms**
  - Số lượng DOM nodes: > 60.000 nodes, cuộn trang bị lag, giật khung hình rõ rệt.
- **Khi dùng ảo hóa với `FixedSizeList` (react-window):**
  - Thời gian render ban đầu: **~12ms** (giảm hơn 70 lần)
  - Số lượng DOM nodes luôn duy trì ở mức tối ưu: chỉ khoảng 10–15 dòng trong DOM tại một thời điểm, cuộn 60 FPS cực mượt mà.

---

## 3. Cấu trúc thư mục

```text
src/
├── App.tsx                   # Khởi tạo router, navigation, phím tắt Space, BUILD_TAG = "mz-4073"
├── main.tsx                  # StrictMode, BrowserRouter, ThemeProvider, PlaylistProvider
├── types.ts                  # Định nghĩa Song, Genre, Playlist
├── setupTests.ts             # Cấu hình Vitest + testing-library
├── data/
│   ├── songs.ts              # Sinh 10.000 bài hát giả lập cố định
│   └── songs.test.ts         # Test kiểm tra dữ liệu songs
├── utils/
│   ├── format.ts             # formatDuration (2:30), formatMinutesSeconds (X phút Y giây)
│   └── format.test.ts        # Test format
├── hooks/
│   ├── useDebounce.ts        # Generic hook useDebounce (300ms)
│   └── useDebounce.test.ts   # Test debounce với fake timers
├── contexts/
│   └── ThemeContext.tsx      # ThemeContext sáng / tối với useMemo
└── features/
    ├── library/
    │   ├── LibraryPage.tsx   # Danh sách ảo hóa, lọc thể loại, sắp xếp A-Z, chọn playlist
    │   ├── LibraryPage.test.tsx
    │   ├── SongRow.tsx       # Component dòng bài hát với React.memo
    │   └── SongRow.test.tsx
    ├── player/
    │   ├── usePlayerStore.ts # Zustand store phát nhạc, queue, position, tick, prev, next
    │   ├── usePlayerStore.test.ts
    │   ├── PlayerBar.tsx     # Thanh phát nhạc cố định đáy màn hình
    │   ├── PlayerBar.test.tsx
    │   ├── ProgressBar.tsx   # Component riêng đọc position chống re-render PlayerBar
    │   └── ProgressBar.test.tsx
    ├── favorites/
    │   ├── useFavoritesStore.ts # Zustand store + persist key 'music-favorites'
    │   ├── useFavoritesStore.test.ts
    │   ├── FavoritesPage.tsx    # Trang danh sách bài hát yêu thích
    │   └── FavoritesPage.test.tsx
    └── playlists/
        ├── playlistReducer.ts   # Reducer thuần túy quản lý playlist
        ├── playlistReducer.test.ts
        ├── withLogger.ts        # Middleware ghi log DEV mode
        ├── PlaylistContext.tsx  # Tách PlaylistStateContext & PlaylistDispatchContext
        ├── PlaylistsPage.tsx    # Tạo playlist, validate trùng tên, danh sách card
        ├── PlaylistsPage.test.tsx
        ├── PlaylistDetailPage.tsx # Chi tiết playlist, tổng thời lượng (reduce), xóa bài
        └── PlaylistDetailPage.test.tsx
```

---

## 4. Hướng dẫn chạy dự án

### Cài đặt dependencies:
```bash
npm install
```

### Chạy môi trường phát triển (Dev Server):
```bash
npm run dev
```

### Chạy kiểm thử tự động (Vitest):
```bash
npm test
```
*Tất cả 13 file test và 62 test cases đều xanh hoàn toàn (100% Pass).*

### Chạy kiểm tra độ bao phủ mã nguồn (Coverage):
```bash
npm run coverage
```

Bảng thống kê độ phủ Code Coverage:
- **Tổng thể (Lines):** **96.32%** (vượt xa yêu cầu ≥ 70%)
- **`src/utils`:** **100%**
- **`src/features/favorites`:** **100%**
- **`src/features/player`:** **97.61%**
- **`src/features/playlists`:** **96.63%**
- **`src/features/library`:** **93.50%**

Ảnh chụp bảng thống kê độ phủ được lưu tại `coverage.png` ở thư mục gốc repo.

### Kiểm tra build sản phẩm:
```bash
npm run build
```
Kết quả chia nhỏ các chunk trang lazy load riêng biệt (`FavoritesPage`, `PlaylistsPage`, `PlaylistDetailPage`).

---

## 5. Lịch sử Commit
Dự án được commit từng phần theo đúng yêu cầu đề bài:
1. `Phan 1`: Khung ứng dụng React Router v6, Thư viện 10.000 bài ảo hóa với `FixedSizeList`, debounced search, lọc thể loại, sắp xếp A-Z.
2. `Phan 2`: Zustand player store, `PlayerBar` cố định, `ProgressBar` chống re-render mỗi giây, Zustand persist store cho danh sách yêu thích.
3. `Phan 3`: Quản lý Playlist với `useReducer` + Context tách biệt, middleware `withLogger`, code splitting bằng `React.lazy` và `Suspense`, ThemeContext sáng/tối.
4. `Phan 4`: Bộ kiểm thử toàn diện 62 test cases với Vitest và React Testing Library, đạt 96.32% Lines coverage, tạo `coverage.png`.
