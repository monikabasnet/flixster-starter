import './Sidebar.css';

const Sidebar = ({ currentView, onViewChange, favoritesCount, watchedCount }) => {
  return (
    <aside className="sidebar" role="navigation" aria-label="Main navigation">
      <div className="sidebar-content">
        <nav className="sidebar-nav">
          <button
            className={`sidebar-item ${currentView === 'home' ? 'active' : ''}`}
            onClick={() => onViewChange('home')}
            aria-current={currentView === 'home' ? 'page' : undefined}
          >
            <span className="sidebar-icon">🏠</span>
            <span className="sidebar-text">Home</span>
          </button>

          <button
            className={`sidebar-item ${currentView === 'favorites' ? 'active' : ''}`}
            onClick={() => onViewChange('favorites')}
            aria-current={currentView === 'favorites' ? 'page' : undefined}
          >
            <span className="sidebar-icon">❤️</span>
            <span className="sidebar-text">Favorites</span>
            {favoritesCount > 0 && (
              <span className="sidebar-badge">{favoritesCount}</span>
            )}
          </button>

          <button
            className={`sidebar-item ${currentView === 'watched' ? 'active' : ''}`}
            onClick={() => onViewChange('watched')}
            aria-current={currentView === 'watched' ? 'page' : undefined}
          >
            <span className="sidebar-icon">👁️</span>
            <span className="sidebar-text">Watched</span>
            {watchedCount > 0 && (
              <span className="sidebar-badge">{watchedCount}</span>
            )}
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
