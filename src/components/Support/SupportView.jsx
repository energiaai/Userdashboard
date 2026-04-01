import React, { useState } from 'react';
import { Search, Mail, FileText, Video, ExternalLink } from 'lucide-react';

const supportGuides = [
    {
        id: 1,
        title: 'Getting Started Guide',
        desc: 'Learn the basics of navigating and using the platform',
        type: 'article'
    },
    {
        id: 2,
        title: 'Energy Management Tutorial',
        desc: 'Step-by-step guide to monitoring and optimizing energy usage',
        type: 'video'
    },
    {
        id: 3,
        title: 'Carbon Tracking Guide',
        desc: 'Understanding carbon emissions and reduction strategies',
        type: 'article'
    },
    {
        id: 4,
        title: 'Financial Analysis Tutorial',
        desc: 'Learn how to analyze cost metrics and generate reports',
        type: 'video'
    }
];

const SupportView = () => {
    const [activeTab, setActiveTab] = useState('Guides');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredGuides = supportGuides.filter(g => 
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        g.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 600, margin: 0 }}>Help & Support</h1>
                <button style={{ 
                    display: 'flex', alignItems: 'center', gap: '0.5rem', 
                    padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none', 
                    background: 'rgba(0,255,136,0.1)', color: 'var(--accent-green)', 
                    fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s', outline: 'none'
                }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,255,136,0.2)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,255,136,0.1)'}>
                    <Mail size={18} /> Contact Support
                </button>
            </div>

            {/* Search Bar */}
            <div style={{ position: 'relative' }}>
                <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                    type="text" 
                    placeholder="Search help articles, tutorials, and FAQs..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ 
                        width: '100%', padding: '0.8rem 1rem 0.8rem 2.75rem', 
                        background: 'var(--bg-input)', border: '1px solid var(--border-light)', 
                        borderRadius: '8px', color: '#fff', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none',
                        transition: 'border-color 0.2s'
                    }} 
                    onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-green)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'var(--border-light)'}
                />
            </div>

            {/* Tabs */}
            <div style={{ borderBottom: '1px solid var(--border-light)', display: 'flex', gap: '2rem' }}>
                {['Guides', 'Faqs', 'Chat'].map(tab => (
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

            {/* Guides Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
                {filteredGuides.map((guide) => (
                    <div key={guide.id} className="glass-card" style={{ 
                        padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', 
                        transition: 'transform 0.2s, border-color 0.2s', cursor: 'pointer', border: '1px solid transparent' 
                    }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-green)'; e.currentTarget.style.transform = 'translateY(-2px)' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'none' }}>
                        
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ 
                                width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(0,255,136,0.1)', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-green)', flexShrink: 0 
                            }}>
                                {guide.type === 'video' ? <Video size={20} /> : <FileText size={20} />}
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, margin: '0 0 0.4rem 0' }}>{guide.title}</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>{guide.desc}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-green)', fontSize: '0.85rem', fontWeight: 600, marginTop: 'auto', paddingTop: '0.5rem' }}>
                            View Guide <ExternalLink size={14} />
                        </div>

                    </div>
                ))}
                
                {filteredGuides.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No guides found matching your search.
                    </div>
                )}
            </div>

        </div>
    );
};

export default SupportView;
