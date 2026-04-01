import React, { useState } from 'react';
import { Bell, Calendar, Moon, Sun, Plus, Check, X, Clock, AlignLeft, Mail } from 'lucide-react';

const initialEvents = [
    { title: 'HVAC Annual Maintenance', type: 'Maintenance', priority: 'High', date: '2024-03-14', desc: 'Complete system inspection and maintenance for all HVAC units', emails: 'team@energia.ai' },
    { title: 'Energy Compliance Report', type: 'Report', priority: 'Medium', date: '2024-03-31', desc: 'Submit annual energy consumption report to regulatory authorities', emails: 'compliance@energia.ai' },
    { title: 'Building Safety Inspection', type: 'Inspection', priority: 'High', date: '2024-03-29', desc: 'Annual safety inspection by city authorities', emails: 'safety@energia.ai' },
    { title: 'Carbon Credits Filing', type: 'Deadline', priority: 'Medium', date: '2024-05-14', desc: 'Submit documentation for carbon credits program', emails: 'finance@energia.ai' },
];

const Header = () => {
    const [isDark, setIsDark] = useState(true);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    
    // Full Calendar Modal States
    const [isFullCalendarOpen, setIsFullCalendarOpen] = useState(false);
    const [eventsList, setEventsList] = useState(initialEvents);
    const [newEvent, setNewEvent] = useState({ title: '', type: 'Maintenance', priority: 'Medium', date: '', desc: '', emails: '' });

    const toggleTheme = () => {
        if (isDark) {
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.remove('light-theme');
        }
        setIsDark(!isDark);
    };

    const handleSaveEvent = (e) => {
        e.preventDefault();
        if (!newEvent.title || !newEvent.date) return;
        setEventsList([...eventsList, newEvent]);
        setNewEvent({ title: '', type: 'Maintenance', priority: 'Medium', date: '', desc: '', emails: '' });
        alert('Event Scheduled and Notifications Sent!');
    };

    // Reusable pill component for priority
    const PriorityPill = ({ priority }) => (
        <span style={{
            fontSize: '0.65rem', fontWeight: 600, padding: '0.2rem 0.5rem', borderRadius: '4px',
            background: priority === 'High' ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.15)',
            color: priority === 'High' ? '#ef4444' : '#3b82f6'
        }}>
            {priority}
        </span>
    );

    return (
        <header className="top-header" style={{ position: 'relative', overflow: 'visible', zIndex: 100 }}>
            <h1 className="header-title">Portfolio Overview</h1>

            <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

                {/* Theme Toggle */}
                <button
                    className="icon-button"
                    onClick={toggleTheme}
                    style={{ color: isDark ? '#fde047' : 'var(--text-primary)' }}
                >
                    {isDark ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                {/* Calendar Dropdown Wrapper */}
                <div style={{ position: 'relative' }}>
                    <button
                        className="icon-button"
                        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                        style={{ position: 'relative', border: isCalendarOpen ? '1px solid var(--accent-green)' : '1px solid transparent' }}
                    >
                        <Calendar size={20} color="var(--text-primary)" />
                        {/* Blue dot indicator */}
                        <span style={{ position: 'absolute', top: '6px', right: '6px', width: '6px', height: '6px', background: '#3b82f6', borderRadius: '50%', border: '1px solid #000' }}></span>
                    </button>

                    {/* Calendar Popup */}
                    {isCalendarOpen && (
                        <div className="glass-card" style={{
                            position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: '400px',
                            zIndex: 100, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.5)', border: '1px solid var(--border-light)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 500 }}>Upcoming Important Dates</h3>
                                <button 
                                    onClick={() => { setIsCalendarOpen(false); setIsFullCalendarOpen(true); }}
                                    style={{ background: 'rgba(255,255,255,0.05)', border: 'none', width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', cursor: 'pointer' }}>
                                    <Plus size={16} color="#3b82f6" />
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                                {eventsList.slice(0, 4).map((item, idx) => (
                                    <div key={idx} style={{ background: 'var(--bg-input)', borderRadius: '10px', padding: '1rem', border: '1px solid transparent' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-light)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                                            <h4 style={{ fontSize: '0.95rem', fontWeight: 500, margin: 0 }}>{item.title}</h4>
                                            <PriorityPill priority={item.priority} />
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#3b82f6', marginBottom: '0.5rem', fontWeight: 500 }}>{item.type}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{item.date}</div>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>{item.desc}</p>
                                    </div>
                                ))}
                            </div>

                            <button 
                                onClick={() => { setIsCalendarOpen(false); setIsFullCalendarOpen(true); }}
                                style={{
                                width: '100%', padding: '0.75rem', borderRadius: '8px', border: 'none',
                                background: 'rgba(59,130,246,0.1)', color: '#3b82f6', fontWeight: 600,
                                fontSize: '0.9rem', cursor: 'pointer', marginTop: '0.5rem'
                            }}>
                                View Full Calendar
                            </button>
                        </div>
                    )}
                </div>

                {/* Notifications */}
                <button className="icon-button has-notification">
                    <Bell size={20} color="var(--text-primary)" />
                </button>

                {/* User Avatar */}
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-green), #047857)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 600, fontSize: '0.9rem', marginLeft: '0.5rem', cursor: 'pointer', boxShadow: '0 0 0 2px rgba(255,255,255,0.1)' }}>
                    ED
                </div>
            </div>

            {/* FULL CALENDAR MODAL */}
            {isFullCalendarOpen && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
                    zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
                }} onClick={() => setIsFullCalendarOpen(false)}>
                    <div className="glass-card" style={{
                        maxWidth: '1000px', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column',
                        overflow: 'hidden', border: '1px solid var(--border-light)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
                    }} onClick={e => e.stopPropagation()}>
                        
                        {/* Modal Header */}
                        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Calendar size={24} color="#3b82f6" />
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Schedule & Events Calendar</h2>
                            </div>
                            <button className="icon-button" onClick={() => setIsFullCalendarOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body: 2 Columns */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', flex: 1, overflow: 'hidden' }}>
                            
                            {/* Left: Events List */}
                            <div style={{ padding: '2rem', overflowY: 'auto', borderRight: '1px solid var(--border-light)' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>All Scheduled Events</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {eventsList.sort((a,b) => new Date(a.date) - new Date(b.date)).map((item, idx) => (
                                        <div key={idx} style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '1.25rem', border: '1px solid var(--border-light)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                                <h4 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>{item.title}</h4>
                                                <PriorityPill priority={item.priority} />
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
                                                <span style={{ fontSize: '0.85rem', color: '#3b82f6', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={14} />{item.date}</span>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.type}</span>
                                            </div>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: '1rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                                                <AlignLeft size={16} color="var(--text-muted)" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                                                <p style={{ margin: 0 }}>{item.desc}</p>
                                            </div>
                                            {item.emails && (
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-input)', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                                                    <Mail size={14} /> Notifying: {item.emails}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right: Add New Event Form */}
                            <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', overflowY: 'auto' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Schedule New Event</h3>
                                
                                <form onSubmit={handleSaveEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Event Title <span style={{ color: '#ef4444' }}>*</span></label>
                                        <input type="text" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} placeholder="e.g. Q3 HVAC Audit" required style={{ background: 'var(--bg-input)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '0.75rem 1rem', color: '#fff', fontSize: '0.95rem' }} />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Date <span style={{ color: '#ef4444' }}>*</span></label>
                                            <input type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} required style={{ background: 'var(--bg-input)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '0.75rem 1rem', color: '#fff', fontSize: '0.95rem', colorScheme: 'dark' }} />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Priority</label>
                                            <select value={newEvent.priority} onChange={e => setNewEvent({...newEvent, priority: e.target.value})} style={{ background: 'var(--bg-input)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '0.75rem 1rem', color: '#fff', fontSize: '0.95rem' }}>
                                                <option value="High">High</option>
                                                <option value="Medium">Medium</option>
                                                <option value="Low">Low</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Event Type</label>
                                        <select value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value})} style={{ background: 'var(--bg-input)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '0.75rem 1rem', color: '#fff', fontSize: '0.95rem' }}>
                                            <option value="Maintenance">Maintenance</option>
                                            <option value="Inspection">Inspection</option>
                                            <option value="Report">Report</option>
                                            <option value="Deadline">Deadline</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Description</label>
                                        <textarea value={newEvent.desc} onChange={e => setNewEvent({...newEvent, desc: e.target.value})} placeholder="Event details..." rows={3} style={{ background: 'var(--bg-input)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '0.75rem 1rem', color: '#fff', fontSize: '0.95rem', resize: 'vertical' }} />
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Emails to Notify</label>
                                        <div style={{ position: 'relative' }}>
                                            <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                                            <input type="text" value={newEvent.emails} onChange={e => setNewEvent({...newEvent, emails: e.target.value})} placeholder="engineers@energia.ai, manager@..." style={{ background: 'var(--bg-input)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '0.75rem 1rem 0.75rem 2.5rem', color: '#fff', fontSize: '0.95rem', width: '100%', boxSizing: 'border-box' }} />
                                        </div>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Separate multiple emails with commas. Users will receive calendar invites and reminders.</span>
                                    </div>

                                    <button type="submit" style={{ 
                                        width: '100%', padding: '1rem', borderRadius: '8px', border: 'none', 
                                        background: '#3b82f6', color: '#fff', fontSize: '1rem', fontWeight: 600, 
                                        cursor: 'pointer', marginTop: '1rem', transition: 'background 0.2s',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                                    }} onMouseEnter={e => e.currentTarget.style.background = '#2563eb'} onMouseLeave={e => e.currentTarget.style.background = '#3b82f6'}>
                                        <Check size={18} /> Save & Notify Team
                                    </button>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
