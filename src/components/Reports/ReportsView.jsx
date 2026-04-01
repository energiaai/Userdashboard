import React, { useState } from 'react';
import { Search, Plus, Download, Share2 } from 'lucide-react';

const mockReports = [
    {
        id: 1,
        title: 'Energy Consumption Summary',
        desc: 'Monthly overview of energy usage and costs',
        tag: 'Energy',
        tagColor: 'var(--accent-green)',
        tagBg: 'rgba(0,255,136,0.1)',
        date: '2024-02-20'
    },
    {
        id: 2,
        title: 'Carbon Emissions Report',
        desc: 'Detailed analysis of carbon footprint',
        tag: 'Environmental',
        tagColor: '#38bdf8',
        tagBg: 'rgba(56,189,248,0.1)',
        date: '2024-02-15'
    },
    {
        id: 3,
        title: 'Financial Performance',
        desc: 'Financial metrics and ROI analysis',
        tag: 'Financial',
        tagColor: '#eab308',
        tagBg: 'rgba(234,179,8,0.1)',
        date: '2024-02-18'
    },
    {
        id: 4,
        title: 'Tenant Usage Breakdown',
        desc: 'Detailed tenant-wise consumption analysis',
        tag: 'Tenant',
        tagColor: '#f97316',
        tagBg: 'rgba(249,115,22,0.1)',
        date: '2024-02-19'
    }
];

const ReportsView = () => {
    const [activeTab, setActiveTab] = useState('Templates');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredReports = mockReports.filter(r => 
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        r.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 600, margin: 0 }}>Reports</h1>
                <button style={{ 
                    display: 'flex', alignItems: 'center', gap: '0.5rem', 
                    padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none', 
                    background: 'rgba(0,255,136,0.1)', color: 'var(--accent-green)', 
                    fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s', outline: 'none'
                }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,255,136,0.2)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,255,136,0.1)'}>
                    <Plus size={18} /> Create New Report
                </button>
            </div>

            {/* Controls Row (Search & Filter) */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                        type="text" 
                        placeholder="Search reports..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ 
                            width: '100%', padding: '0.8rem 1rem 0.8rem 2.75rem', 
                            background: 'var(--bg-input)', border: '1px solid var(--border-light)', 
                            borderRadius: '8px', color: '#fff', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none'
                        }} 
                        onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-green)'}
                        onBlur={e => e.currentTarget.style.borderColor = 'var(--border-light)'}
                    />
                </div>
                <select style={{ 
                    padding: '0.8rem 1.25rem', background: 'var(--bg-input)', 
                    border: '1px solid var(--border-light)', borderRadius: '8px', 
                    color: '#fff', fontSize: '0.95rem', minWidth: '150px', cursor: 'pointer', outline: 'none'
                }}
                onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-green)'}
                onBlur={e => e.currentTarget.style.borderColor = 'var(--border-light)'}>
                    <option value="All">All Types</option>
                    <option value="Energy">Energy</option>
                    <option value="Environmental">Environmental</option>
                    <option value="Financial">Financial</option>
                    <option value="Tenant">Tenant</option>
                </select>
            </div>

            {/* Tabs */}
            <div style={{ borderBottom: '1px solid var(--border-light)', display: 'flex', gap: '2rem' }}>
                {['Templates', 'Recent', 'Scheduled'].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{ 
                            padding: '0.75rem 0', background: 'transparent', border: 'none', 
                            color: activeTab === tab ? 'var(--accent-green)' : 'var(--text-secondary)',
                            fontWeight: activeTab === tab ? 600 : 500, fontSize: '0.95rem', cursor: 'pointer',
                            borderBottom: activeTab === tab ? '2px solid var(--accent-green)' : '2px solid transparent',
                            marginBottom: '-1px', transition: 'all 0.2s', outline: 'none'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Reports Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {filteredReports.map((report) => (
                    <div key={report.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', transition: 'transform 0.2s, border-color 0.2s', cursor: 'pointer', border: '1px solid transparent' }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.transform = 'translateY(-2px)' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'none' }}>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, margin: '0 0 0.5rem 0' }}>{report.title}</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>{report.desc}</p>
                            </div>
                            <span style={{ 
                                padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, 
                                color: report.tagColor, background: report.tagBg, flexShrink: 0 
                            }}>
                                {report.tag}
                            </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                Last generated: {report.date}
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button className="icon-button" style={{ padding: '0.4rem', border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                                    <Download size={18} />
                                </button>
                                <button className="icon-button" style={{ padding: '0.4rem', border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                                    <Share2 size={18} />
                                </button>
                            </div>
                        </div>

                    </div>
                ))}
                
                {filteredReports.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No reports found matching your search.
                    </div>
                )}
            </div>

        </div>
    );
};

export default ReportsView;
