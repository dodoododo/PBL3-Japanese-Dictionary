import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronLeft, Menu, 
         LayoutDashboard, Calendar, Bell, 
         BookMarked, Settings,
         HelpCircle, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [openDropdowns, setOpenDropdowns] = useState({});

  useEffect(() => {
    const handleResize = () => {
      const newIsCollapsed = window.innerWidth <= 1024;
      setIsCollapsed(newIsCollapsed);
      onToggle?.(newIsCollapsed);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [onToggle]);

  const toggleDropdown = (id) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    setOpenDropdowns({});
    onToggle?.(!isCollapsed);
  };

  const DropdownItem = ({ title, items }) => (
    <li className={`nav-item dropdown-container ${openDropdowns[title] ? 'open' : ''}`}>
      <a href="#" className="nav-link dropdown-toggle" onClick={(e) => {
        e.preventDefault();
        toggleDropdown(title);
      }}>
        {title === 'Services' ? <Calendar className="nav-icon" /> : <BookMarked className="nav-icon" />}
        <span className="nav-label">{title}</span>
        <span className="dropdown-icon">▼</span>
      </a>
      <ul className="dropdown-menu" style={{ 
        height: openDropdowns[title] ? `${items.length * 40}px` : '0'
      }}>
        <li className="nav-item"><a className="nav-link dropdown-title">{title}</a></li>
        {items.map((item, index) => (
          <li key={index} className="nav-item">
            <a href="#" className="nav-link dropdown-link">{item}</a>
          </li>
        ))}
      </ul>
    </li>
  );

  return (
    <>
      <button className="sidebar-menu-button" onClick={toggleSidebar}>
        <Menu />
      </button>
      
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <header className="sidebar-header">
          <a href="#" className="header-logo">
            <BookOpen size={46} />
          </a>
          <button className="sidebar-toggler" onClick={toggleSidebar}>
            <ChevronLeft />
          </button>
        </header>

        <nav className="sidebar-nav">
          <ul className="nav-list primary-nav">
            <li className="nav-item">
              <a href="#" className="nav-link">
                <LayoutDashboard className="nav-icon" />
                <span className="nav-label">Dashboard</span>
              </a>
            </li>

            <DropdownItem 
              title="Services" 
              items={['IT Consulting', 'Cloud Solutions', 'Mobile Apps']} 
            />

            <li className="nav-item">
              <a href="#" className="nav-link">
                <Bell className="nav-icon" />
                <span className="nav-label">Notifications</span>
              </a>
            </li>

            <DropdownItem 
              title="Bookmarks" 
              items={['Saved Tutorials', 'Favorite Blogs', 'Resource Guides']} 
            />

            <li className="nav-item">
              <a href="#" className="nav-link">
                
                <span className="nav-label">Extensions</span>
              </a>
            </li>

            <li className="nav-item">
              <a href="#" className="nav-link">
                <Settings className="nav-icon" />
                <span className="nav-label">Settings</span>
              </a>
            </li>
          </ul>

          <ul className="nav-list secondary-nav">
            <li className="nav-item">
              <a href="#" className="nav-link">
                <HelpCircle className="nav-icon" />
                <span className="nav-label">Support</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <LogOut className="nav-icon" />
                <span className="nav-label">Sign Out</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
