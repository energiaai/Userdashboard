import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, Building2, DollarSign, FileText, HelpCircle, Settings } from 'lucide-react';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            {/* Brand */}
            <div className="sidebar-brand">
                <img src="/energia-logo.png" alt="Energia AI" className="sidebar-logo" />
            </div>

            {/* Main Menu */}
            <div className="sidebar-header-text" style={{ marginTop: '1.5rem' }}>Dashboard</div>
            <nav className="nav-menu" style={{ flex: 1 }}>
                <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
                    <LayoutGrid size={18} className="nav-icon" /> Portfolio Overview
                </NavLink>
                <NavLink to="/building" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Building2 size={18} className="nav-icon" /> Building Analytics
                </NavLink>
                <NavLink to="/financial" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <DollarSign size={18} className="nav-icon" /> Financial
                </NavLink>
                <NavLink to="/reports" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <FileText size={18} className="nav-icon" /> Reports
                </NavLink>
            </nav>

            {/* Bottom Items */}
            <div style={{ padding: '0 1rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <NavLink to="/support" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <HelpCircle size={18} className="nav-icon" /> Help & Support
                </NavLink>
                <div className="nav-item" style={{ cursor: 'pointer', opacity: 0.6 }}>
                    <Settings size={18} className="nav-icon" /> Settings
                </div>
            </div>

        </aside>
    );
};

export default Sidebar;
