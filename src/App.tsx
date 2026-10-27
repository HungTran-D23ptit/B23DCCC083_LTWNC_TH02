const BUILD_TAG = "mz-4073";

import React, { Suspense, lazy } from 'react';
import { Routes, Route, NavLink, Link } from 'react-router-dom';
import { useTheme } from './contexts/ThemeContext';
import { LibraryPage } from './features/library/LibraryPage';
import { PlayerBar } from './features/player/PlayerBar';

const FavoritesPage = lazy(() => import('./features/favorites/FavoritesPage'));
const PlaylistsPage = lazy(() => import('./features/playlists/PlaylistsPage'));
const PlaylistDetailPage = lazy(() => import('./features/playlists/PlaylistDetailPage'));

import { usePlayerStore } from './features/player/usePlayerStore';

export const handleQueryShift = (query: string) => query;

export const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
          return;
        }
        e.preventDefault();
        usePlayerStore.getState().togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className={`app-root ${theme}`}>
      <header className="app-header">
        <div className="header-container">
          <Link to="/" className="brand-logo">
            <span className="logo-icon">🎵</span>
            <span className="logo-text">Mini Player</span>
          </Link>

          <nav className="main-nav">
            <NavLink
              to="/"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              end
            >
              Thư viện
            </NavLink>
            <NavLink
              to="/favorites"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Yêu thích
            </NavLink>
            <NavLink
              to="/playlists"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Playlist
            </NavLink>
          </nav>

          <div className="header-actions">
            <button
              type="button"
              className="btn-theme-toggle"
              onClick={toggleTheme}
              aria-label="Đổi giao diện"
            >
              {theme === 'dark' ? '☀️ Giao diện sáng' : '🌙 Giao diện tối'}
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <Suspense fallback={<p className="route-loading">Đang tải trang...</p>}>
          <Routes>
            <Route path="/" element={<LibraryPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/playlists" element={<PlaylistsPage />} />
            <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
          </Routes>
        </Suspense>
      </main>

      <PlayerBar />
    </div>
  );
};

export default App;
export { BUILD_TAG };
