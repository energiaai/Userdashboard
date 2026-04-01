import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const budgetData = [
    { month: 'Jan', actual: 375000, projected: null },
    { month: 'Feb', actual: 360000, projected: null },
    { month: 'Mar', actual: 390000, projected: null },
    { month: 'Apr', actual: 380000, projected: null },
    { month: 'May', actual: 400000, projected: 400000 },
    { month: 'Jun', actual: null, projected: 385000 },
    { month: 'Jul', actual: null, projected: 395000 },
    { month: 'Aug', actual: null, projected: 380000 },
    { month: 'Sep', actual: null, projected: 370000 },
    { month: 'Oct', actual: null, projected: 365000 },
    { month: 'Nov', actual: null, projected: 360000 },
    { month: 'Dec', actual: null, projected: 355000 },
];

const roiData = [
    { month: 'Jan', investment: 60000, returns: 0 },
    { month: 'Feb', investment: 60000, returns: 10000 },
    { month: 'Mar', investment: 60000, returns: 25000 },
    { month: 'Apr', investment: 60000, returns: 45000 },
    { month: 'May', investment: 60000, returns: 70000 },
    { month: 'Jun', investment: 60000, returns: 95000 },
    { month: 'Jul', investment: 60000, returns: 125000 },
    { month: 'Aug', investment: 60000, returns: 160000 },
    { month: 'Sep', investment: 60000, returns: 195000 },
    { month: 'Oct', investment: 60000, returns: 235000 },
    { month: 'Nov', investment: 60000, returns: 280000 },
    { month: 'Dec', investment: 60000, returns: 330000 },
];

const FinancialView = () => {
    const [activePeriod, setActivePeriod] = useState('Month');

    const kpis = [
        {
            label: 'Total Costs',
            value: '$12.5k',
            unit: 'Solution & Lic.',
            trend: -8.2,
            accentColor: 'var(--accent-green)'
        },
        {
            label: 'Savings',
            value: '$42.5k',
            unit: 'Energy Maint.',
            trend: 15.3,
            accentColor: 'var(--accent-green)'
        },
        {
            label: 'Current ROI',
            value: '18.5%',
            unit: 'Net Return',
            trend: 2.3,
            accentColor: 'var(--accent-green)'
        }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 600, margin: 0 }}>Financial Overview</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>Track solution costs, energy savings, and performance returns.</p>
                </div>
                
                {/* Period Selector */}
                <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-light)', width: 'fit-content' }}>
                    {['Day', 'Week', 'Month', 'Year'].map(p => (
                        <button
                            key={p}
                            onClick={() => setActivePeriod(p)}
                            style={{
                                padding: '0.5rem 1.25rem',
                                borderRadius: '8px',
                                border: 'none',
                                background: activePeriod === p ? 'var(--accent-green)' : 'transparent',
                                color: activePeriod === p ? '#000' : 'var(--text-secondary)',
                                fontWeight: activePeriod === p ? 600 : 500,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {p}
                        </button>
                    ))}
                    <button style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: 'transparent', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                        <Calendar size={14} /> Custom
                    </button>
                </div>
            </div>

            {/* KPI Cards Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                {kpis.map((card) => (
                    <div
                        key={card.label}
                        className="glass-card"
                        style={{
                            padding: '1.5rem 1.75rem',
                            position: 'relative',
                            overflow: 'hidden',
                            border: '1px solid transparent',
                            transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-light)';
                            e.currentTarget.style.boxShadow = `0 0 24px ${card.accentColor}15`;
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'transparent';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.transform = 'none';
                        }}
                    >
                        <div style={{ position: 'absolute', top: '-30px', left: '-30px', width: '90px', height: '90px', borderRadius: '50%', background: card.accentColor, opacity: 0.06, filter: 'blur(24px)', pointerEvents: 'none' }} />
                        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 600 }}>{card.label}</span>
                        <div style={{ fontSize: '2.4rem', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1, marginTop: '0.6rem' }}>{card.value}</div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{card.unit}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.6rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: card.trend > 0 ? 'var(--accent-green)' : 'var(--accent-green)' }}>
                                {card.trend > 0 ? '+' : ''}{card.trend}%
                            </span>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>vs prior period</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                
                {/* Budget Forecast */}
                <div className="glass-card" style={{ padding: '2rem' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 400, margin: 0 }}>Budget Forecast</h3>
                        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-green)' }} />
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Actual Costs</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f97316' }} />
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Projected Costs</span>
                            </div>
                        </div>
                    </div>
                    
                    <div style={{ height: '350px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={budgetData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="financialGradActual" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="var(--accent-green)" stopOpacity={0.3}/>
                                        <stop offset="100%" stopColor="var(--accent-green)" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} dx={-10} tickFormatter={v => v.toLocaleString()} />
                                <Tooltip 
                                    contentStyle={{ background: 'var(--bg-input)', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    formatter={(value) => `$${value.toLocaleString()}`}
                                />
                                <Area type="monotone" dataKey="actual" stroke="var(--accent-green)" strokeWidth={2} fillOpacity={1} fill="url(#financialGradActual)" activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--accent-green)' }} />
                                <Line type="monotone" dataKey="projected" stroke="#f97316" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4, fill: '#f97316', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0, fill: '#f97316' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* ROI Metrics */}
                <div className="glass-card" style={{ padding: '2rem' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 400, margin: 0 }}>ROI Metrics</h3>
                        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f97316' }} />
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Investment</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-green)' }} />
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Returns</span>
                            </div>
                        </div>
                    </div>
                    
                    <div style={{ height: '350px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={roiData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} dx={-10} tickFormatter={v => v.toLocaleString()} />
                                <Tooltip 
                                    contentStyle={{ background: 'var(--bg-input)', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    formatter={(value) => `$${value.toLocaleString()}`}
                                />
                                <Line type="stepAfter" dataKey="investment" stroke="#f97316" strokeWidth={2} dot={false} activeDot={false} />
                                <Line type="monotone" dataKey="returns" stroke="var(--accent-green)" strokeWidth={2} dot={{ r: 4, fill: 'var(--accent-green)', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--accent-green)' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FinancialView;
