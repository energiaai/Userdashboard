import React, { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ComposedChart, Line, Cell, LineChart } from 'recharts';
import { LayoutList, Share2, Calendar, Edit2, ChevronDown, Zap, DollarSign, TrendingDown, Gauge, Leaf, BarChart3, X, TrendingUp, Flame, Maximize2, Thermometer, Users, Sun, Wind, Shield, Droplets, AlertTriangle, CheckCircle2, Info, Activity, Snowflake, Fan } from 'lucide-react';
/* ─── Mock Data ─── */

// Energy Usage Trend data keyed by period
const trendDataByPeriod = {
    '24h': Array.from({ length: 24 }).map((_, i) => ({ label: `${i}:00`, elec: Math.floor(Math.random() * 80 + 40), gas: Math.floor(Math.random() * 60 + 30), total: 0 })),
    '7d': [
        { label: 'Mon', elec: 900, gas: 750, total: 1650 },
        { label: 'Tue', elec: 1050, gas: 880, total: 1930 },
        { label: 'Wed', elec: 980, gas: 820, total: 1800 },
        { label: 'Thu', elec: 1120, gas: 950, total: 2070 },
        { label: 'Fri', elec: 870, gas: 710, total: 1580 },
        { label: 'Sat', elec: 1200, gas: 1050, total: 2250 },
        { label: 'Sun', elec: 1080, gas: 900, total: 1980 },
    ],
    '1m': Array.from({ length: 30 }).map((_, i) => ({ label: `${i + 1}`, elec: Math.floor(Math.random() * 300 + 400), gas: Math.floor(Math.random() * 200 + 300), total: 0 })),
    'ytd': [
        { label: 'Jan', elec: 1000, gas: 900, total: 1900 }, { label: 'Feb', elec: 1200, gas: 1100, total: 2300 }, { label: 'Mar', elec: 900, gas: 700, total: 1600 },
        { label: 'Apr', elec: 1600, gas: 1400, total: 3000 }, { label: 'May', elec: 1100, gas: 1000, total: 2100 }, { label: 'Jun', elec: 1300, gas: 1100, total: 2400 },
        { label: 'Jul', elec: 1500, gas: 1300, total: 2800 }, { label: 'Aug', elec: 1450, gas: 1250, total: 2700 }, { label: 'Sep', elec: 1250, gas: 1100, total: 2350 },
        { label: 'Oct', elec: 1400, gas: 1200, total: 2600 }, { label: 'Nov', elec: 1550, gas: 1450, total: 3000 }, { label: 'Dec', elec: 1800, gas: 1600, total: 3400 }
    ],
    'custom': [],
};

Object.values(trendDataByPeriod).forEach(arr => {
    arr.forEach(d => { if(d.total === 0) d.total = d.elec + d.gas; });
});

// Dense emissions breakdown keyed by period (for modal visualization)
const emissionsDataByPeriod = {
    '24h': Array.from({ length: 24 }).map((_, i) => ({ month: `${i}:00`, emissions: (Math.random() * 2 + 0.5).toFixed(1), reduced: (Math.random() * 0.5 + 0.1).toFixed(1) })),
    '7d': [
        { month: 'Mon', emissions: 3.2, reduced: 0.8 }, { month: 'Tue', emissions: 2.9, reduced: 0.9 }, { month: 'Wed', emissions: 3.5, reduced: 0.7 },
        { month: 'Thu', emissions: 3.0, reduced: 1.1 }, { month: 'Fri', emissions: 2.7, reduced: 1.2 }, { month: 'Sat', emissions: 2.1, reduced: 0.5 }, { month: 'Sun', emissions: 1.9, reduced: 0.4 }
    ],
    '1m': Array.from({ length: 30 }).map((_, i) => ({ month: `${i + 1}`, emissions: (Math.random() * 3 + 1).toFixed(1), reduced: (Math.random() * 1 + 0.2).toFixed(1) })),
    'ytd': [
        { month: 'Jan', emissions: 3.8, reduced: 0.9 }, { month: 'Feb', emissions: 3.5, reduced: 1.1 }, { month: 'Mar', emissions: 4.0, reduced: 0.8 },
        { month: 'Apr', emissions: 3.1, reduced: 1.3 }, { month: 'May', emissions: 2.9, reduced: 1.5 }, { month: 'Jun', emissions: 4.2, reduced: 0.7 },
        { month: 'Jul', emissions: 4.5, reduced: 1.0 }, { month: 'Aug', emissions: 4.8, reduced: 1.2 }, { month: 'Sep', emissions: 3.9, reduced: 0.8 },
        { month: 'Oct', emissions: 3.4, reduced: 0.9 }, { month: 'Nov', emissions: 3.2, reduced: 1.4 }, { month: 'Dec', emissions: 3.6, reduced: 1.6 }
    ],
    'custom': []
};

// Dense savings breakdown keyed by period (for modal visualization)
const savingsBreakdownByPeriod = {
    '24h': Array.from({ length: 24 }).map((_, i) => ({ month: `${i}:00`, val: Math.floor(Math.random() * 50) + 10 })),
    '7d': [
        { month: 'Mon', val: 420 }, { month: 'Tue', val: 560 }, { month: 'Wed', val: 380 }, 
        { month: 'Thu', val: 620 }, { month: 'Fri', val: 710 }, { month: 'Sat', val: 230 }, { month: 'Sun', val: 190 }
    ],
    '1m': Array.from({ length: 30 }).map((_, i) => ({ month: `${i + 1}`, val: Math.floor(Math.random() * 300) + 100 })),
    'ytd': [
        { month: 'Jan', val: 820 }, { month: 'Feb', val: 1100 }, { month: 'Mar', val: 650 }, 
        { month: 'Apr', val: 1350 }, { month: 'May', val: 1560 }, { month: 'Jun', val: 950 },
        { month: 'Jul', val: 1200 }, { month: 'Aug', val: 1400 }, { month: 'Sep', val: 1150 },
        { month: 'Oct', val: 980 }, { month: 'Nov', val: 1600 }, { month: 'Dec', val: 1800 }
    ],
    'custom': []
};

// Consumption arc data keyed by period
const arcDataByPeriod = {
    '24h': { elec: 128, gas: 142 },
    '7d':  { elec: 890, gas: 980 },
    '1m':  { elec: 3820, gas: 4260 },
    'ytd': { elec: 21550, gas: 24300 },
    'custom': { elec: 0, gas: 0 },
};

// Efficiency data keyed by period
const efficiencyByPeriod = {
    '24h': { score: 91, buildings: [{ label: 'North Tower', pct: 94 }, { label: 'South Center', pct: 90 }, { label: 'West Complex', pct: 82 }, { label: 'East Wing', pct: 97 }] },
    '7d':  { score: 89, buildings: [{ label: 'North Tower', pct: 93 }, { label: 'South Center', pct: 89 }, { label: 'West Complex', pct: 78 }, { label: 'East Wing', pct: 96 }] },
    '1m':  { score: 87, buildings: [{ label: 'North Tower', pct: 91 }, { label: 'South Center', pct: 87 }, { label: 'West Complex', pct: 75 }, { label: 'East Wing', pct: 94 }] },
    'ytd': { score: 88, buildings: [{ label: 'North Tower', pct: 92 }, { label: 'South Center', pct: 88 }, { label: 'West Complex', pct: 76 }, { label: 'East Wing', pct: 95 }] },
    'custom': { score: 0, buildings: [{ label: 'North Tower', pct: 0 }, { label: 'South Center', pct: 0 }, { label: 'West Complex', pct: 0 }, { label: 'East Wing', pct: 0 }] },
};

// Energy savings total keyed by period
const savingsTotalByPeriod = {
    '24h': '$340',
    '7d': '$2,370',
    '1m': '$5,480',
    'ytd': '$4,100',
    'custom': '—',
};

const CustomTrendTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div style={{ background: 'rgba(30, 30, 35, 0.9)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.15)', padding: '1rem', borderRadius: '12px', color: '#fff', boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)' }}>
                <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.9)' }} />Electricity</span>
                        <span style={{ fontWeight: 500, marginLeft: '2rem' }}>{data.elec.toLocaleString()} kWh</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-green)' }} />Gas</span>
                        <span style={{ fontWeight: 500, marginLeft: '2rem' }}>{data.gas.toLocaleString()} kWh</span>
                    </div>
                    <div style={{ paddingTop: '0.6rem', borderTop: '1px solid rgba(255,255,255,0.15)', marginTop: '0.2rem', display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 600 }}>
                        <span>Total Sum</span>
                        <span>{data.total.toLocaleString()} kWh</span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

const CustomDot = (props) => {
    const { cx, cy } = props;
    return (
        <g>
            <line x1={cx} y1={cy} x2={cx} y2={230} stroke="var(--border-light)" strokeDasharray="3 3" />
            <circle cx={cx} cy={cy} r={4} stroke="#000" strokeWidth={2} fill="var(--accent-green)" />
        </g>
    );
};

/* ─── KPI Card Sparkline Data ─── */
const sparkConsumption = [
    { v: 42 }, { v: 44 }, { v: 41 }, { v: 46 }, { v: 43 }, { v: 45 }, { v: 45.8 }
];
const sparkCost = [
    { v: 14.2 }, { v: 15.1 }, { v: 13.8 }, { v: 16.2 }, { v: 14.9 }, { v: 15.5 }, { v: 15.95 }
];
const sparkSavings = [
    { v: 18 }, { v: 22 }, { v: 28 }, { v: 31 }, { v: 36 }, { v: 39 }, { v: 41 }
];
const sparkEmissions = [
    { v: 14 }, { v: 13.5 }, { v: 12.8 }, { v: 13.2 }, { v: 12.2 }, { v: 12.6 }
];
const sparkReduced = [
    { v: 1.2 }, { v: 1.8 }, { v: 2.3 }, { v: 2.9 }, { v: 3.2 }, { v: 3.6 }
];
const sparkEfficiency = [
    { v: 78 }, { v: 80 }, { v: 82 }, { v: 84 }, { v: 86 }, { v: 88 }
];

/* ─── Trend Modal Historical Data ─── */
const trendHistory = {
    consumption: [
        { month: 'Jul', elec: 38200, gas: 4100 }, { month: 'Aug', elec: 40100, gas: 4300 },
        { month: 'Sep', elec: 36800, gas: 3800 }, { month: 'Oct', elec: 35500, gas: 3600 },
        { month: 'Nov', elec: 37200, gas: 4000 }, { month: 'Dec', elec: 39800, gas: 4400 },
        { month: 'Jan', elec: 41200, gas: 4650 }, { month: 'Feb', elec: 39500, gas: 4200 },
        { month: 'Mar', elec: 42800, gas: 4800 }, { month: 'Apr', elec: 38200, gas: 4100 },
        { month: 'May', elec: 36500, gas: 3900 }, { month: 'Jun', elec: 40300, gas: 4550 },
    ],
    cost: [
        { month: 'Jul', elec: 8200, gas: 4100 }, { month: 'Aug', elec: 8900, gas: 4500 },
        { month: 'Sep', elec: 7800, gas: 3800 }, { month: 'Oct', elec: 7500, gas: 3600 },
        { month: 'Nov', elec: 7900, gas: 4000 }, { month: 'Dec', elec: 8600, gas: 4400 },
        { month: 'Jan', elec: 9200, gas: 4700 }, { month: 'Feb', elec: 8800, gas: 4300 },
        { month: 'Mar', elec: 9600, gas: 4900 }, { month: 'Apr', elec: 8400, gas: 4100 },
        { month: 'May', elec: 8100, gas: 3900 }, { month: 'Jun', elec: 9050, gas: 4550 },
    ],
    savings: [
        { month: 'Jul', val: 1200 }, { month: 'Aug', val: 1800 },
        { month: 'Sep', val: 2400 }, { month: 'Oct', val: 3100 },
        { month: 'Nov', val: 3900 }, { month: 'Dec', val: 4800 },
        { month: 'Jan', val: 5900 }, { month: 'Feb', val: 7200 },
        { month: 'Mar', val: 8800 }, { month: 'Apr', val: 10500 },
        { month: 'May', val: 12800 }, { month: 'Jun', val: 15200 },
    ],
    emissions: [
        { month: 'Jul', elec: 9.2, gas: 4.8 }, { month: 'Aug', elec: 9.8, gas: 5.1 },
        { month: 'Sep', elec: 8.6, gas: 4.4 }, { month: 'Oct', elec: 8.2, gas: 4.2 },
        { month: 'Nov', elec: 8.8, gas: 4.5 }, { month: 'Dec', elec: 9.5, gas: 4.9 },
        { month: 'Jan', elec: 5.2, gas: 2.8 }, { month: 'Feb', elec: 4.8, gas: 2.5 },
        { month: 'Mar', elec: 5.5, gas: 2.9 }, { month: 'Apr', elec: 4.5, gas: 2.3 },
        { month: 'May', elec: 4.2, gas: 2.1 }, { month: 'Jun', elec: 5.4, gas: 2.8 },
    ],
    reduced: [
        { month: 'Jul', val: 0.4 }, { month: 'Aug', val: 0.6 },
        { month: 'Sep', val: 0.9 }, { month: 'Oct', val: 1.2 },
        { month: 'Nov', val: 1.5 }, { month: 'Dec', val: 1.9 },
        { month: 'Jan', val: 2.2 }, { month: 'Feb', val: 2.5 },
        { month: 'Mar', val: 2.9 }, { month: 'Apr', val: 3.1 },
        { month: 'May', val: 3.4 }, { month: 'Jun', val: 3.6 },
    ],
    efficiency: [
        { month: 'Jul', val: 72 }, { month: 'Aug', val: 74 },
        { month: 'Sep', val: 76 }, { month: 'Oct', val: 78 },
        { month: 'Nov', val: 80 }, { month: 'Dec', val: 82 },
        { month: 'Jan', val: 83 }, { month: 'Feb', val: 84 },
        { month: 'Mar', val: 85 }, { month: 'Apr', val: 86 },
        { month: 'May', val: 87 }, { month: 'Jun', val: 88 },
    ],
};

/* ─── KPI Card Builder (per-building) ─── */
const buildKpiCards = (bp) => [
    {
        id: 'consumption',
        label: 'TOTAL ENERGY CONSUMPTION',
        mainValue: bp.consumption,
        mainUnit: bp.consUnit,
        splits: [
            { label: 'Electricity', value: bp.elecSplit, color: 'var(--accent-green)' },
            { label: 'Gas', value: bp.gasSplit, color: '#f97316' },
        ],
        trend: -4.2 * bp.mult,
        icon: Zap,
        color: 'var(--accent-green)',
        sparkData: sparkConsumption,
        sparkColor: 'var(--accent-green)',
    },
    {
        id: 'cost',
        label: 'TOTAL ENERGY COST',
        mainValue: bp.cost,
        mainUnit: 'YTD',
        splits: [
            { label: 'Electricity', value: bp.elecCost, color: 'var(--accent-green)' },
            { label: 'Gas', value: bp.gasCost, color: '#f97316' },
        ],
        trend: bp.costTrend,
        icon: DollarSign,
        color: '#ef4444',
        sparkData: sparkCost,
        sparkColor: '#ef4444',
    },
    {
        id: 'savings',
        label: 'TOTAL ENERGY SAVINGS',
        mainValue: bp.savings,
        mainUnit: 'since implementation',
        splits: [],
        trend: bp.savingsTrend,
        icon: TrendingDown,
        color: '#eab308',
        sparkData: sparkSavings,
        sparkColor: '#eab308',
    },
    {
        id: 'emissions',
        label: 'TOTAL CARBON EMISSIONS',
        mainValue: bp.emissions,
        mainUnit: 'tons CO₂ YTD',
        splits: [
            { label: 'Electricity', value: bp.emElec, color: '#a78bfa' },
            { label: 'Gas', value: bp.emGas, color: '#f97316' },
        ],
        trend: bp.emTrend,
        icon: Leaf,
        color: '#f97316',
        sparkData: sparkEmissions,
        sparkColor: '#f97316',
    },
    {
        id: 'reduced',
        label: 'TOTAL EMISSIONS REDUCED',
        mainValue: bp.reduced,
        mainUnit: 'tons CO₂ saved',
        splits: [],
        trend: bp.reducedTrend,
        icon: BarChart3,
        color: '#a78bfa',
        sparkData: sparkReduced,
        sparkColor: '#a78bfa',
    },
    {
        id: 'efficiency',
        label: 'COMFORT RATING',
        mainValue: String(bp.effBase),
        mainUnit: 'building score (0–100)',
        splits: [],
        trend: 5.4,
        icon: Gauge,
        color: 'var(--accent-green)',
        sparkData: sparkEfficiency,
        sparkColor: 'var(--accent-green)',
        isScore: true,
    },
];

/* ─── Mini Sparkline Component ─── */
const MiniSparkline = ({ data, color, height = 32, width = 80 }) => (
    <ResponsiveContainer width={width} height={height}>
        <AreaChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
            <defs>
                <linearGradient id={`spark-${color.replace(/[^a-z0-9]/gi, '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
            </defs>
            <Area
                type="monotone"
                dataKey="v"
                stroke={color}
                strokeWidth={1.5}
                fill={`url(#spark-${color.replace(/[^a-z0-9]/gi, '')})`}
                dot={false}
                isAnimationActive={false}
            />
        </AreaChart>
    </ResponsiveContainer>
);

/* ─── Trend Modal Component ─── */
const TrendModal = ({ card, onClose }) => {
    const data = trendHistory[card.id];
    const hasElecGas = data?.[0]?.elec !== undefined;

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
        }} onClick={onClose}>
            <div
                className="glass-card"
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: '680px', maxWidth: '92vw', padding: '2rem',
                    border: '1px solid var(--border-light)',
                    boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
                    animation: 'modalSlideIn 0.25s ease-out',
                }}
            >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                            <card.icon size={20} color={card.color} />
                            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', fontWeight: 600 }}>
                                {card.label}
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                            <span style={{ fontSize: '2rem', fontWeight: 600, letterSpacing: '-0.03em' }}>
                                {card.mainValue}
                            </span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                {card.mainUnit}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '50%',
                            width: '32px', height: '32px', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)',
                            transition: '0.2s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Chart */}
                <div style={{ height: '300px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        {hasElecGas ? (
                            <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="modalGradA" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--accent-green)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--accent-green)" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="modalGradB" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} dy={10} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
                                <Tooltip
                                    cursor={false}
                                    contentStyle={{ background: 'var(--bg-input)', border: '1px solid var(--border-light)', borderRadius: '10px', color: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
                                />
                                <Area type="monotone" dataKey="elec" name="Electricity" stroke="var(--accent-green)" strokeWidth={2} fill="url(#modalGradA)" dot={{ r: 3, fill: 'var(--accent-green)', stroke: '#000', strokeWidth: 1 }} />
                                <Area type="monotone" dataKey="gas" name="Gas" stroke="#f97316" strokeWidth={2} fill="url(#modalGradB)" dot={{ r: 3, fill: '#f97316', stroke: '#000', strokeWidth: 1 }} />
                            </ComposedChart>
                        ) : (
                            <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="modalGradSingle" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={card.color} stopOpacity={0.35} />
                                        <stop offset="95%" stopColor={card.color} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} dy={10} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} tickFormatter={(v) => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : v} />
                                <Tooltip
                                    cursor={false}
                                    contentStyle={{ background: 'var(--bg-input)', border: '1px solid var(--border-light)', borderRadius: '10px', color: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
                                    formatter={(v) => [card.id === 'savings' ? `$${v.toLocaleString()}` : v, card.label]}
                                />
                                <Area type="monotone" dataKey="val" name={card.label} stroke={card.color} strokeWidth={2.5} fill="url(#modalGradSingle)" dot={{ r: 3, fill: card.color, stroke: '#000', strokeWidth: 1 }} activeDot={{ r: 6, fill: '#fff', stroke: card.color, strokeWidth: 2 }} />
                            </AreaChart>
                        )}
                    </ResponsiveContainer>
                </div>

                {/* Legend row for split cards */}
                {hasElecGas && (
                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-green)' }} />
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Electricity</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f97316' }} />
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Gas</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

/* ─── Efficiency Score Ring ─── */
const ScoreRing = ({ score, color }) => {
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference - (score / 100) * circumference;
    return (
        <svg width="48" height="48" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
            <circle cx="24" cy="24" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
            <circle cx="24" cy="24" r={radius} fill="none" stroke={color} strokeWidth="4"
                strokeDasharray={circumference} strokeDashoffset={dashOffset}
                strokeLinecap="round" transform="rotate(-90 24 24)"
                style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
            <text x="24" y="24" textAnchor="middle" dominantBaseline="central"
                style={{ fontSize: '12px', fontWeight: 700, fill: '#fff' }}>
                {score}
            </text>
        </svg>
    );
};

/* ─── Unique Card Visualizations ─── */
const ProportionBar = ({ splits }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%', marginTop: '0.25rem' }}>
        {splits.map((s) => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', width: '28px', flexShrink: 0 }}>{s.label.slice(0, 4)}</span>
                <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: s.pct + '%', height: '100%', background: `linear-gradient(90deg, ${s.color}, ${s.color}88)`, borderRadius: '3px', transition: 'width 0.8s ease' }} />
                </div>
                <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', width: '30px', textAlign: 'right' }}>{s.pct}%</span>
            </div>
        ))}
    </div>
);

const MiniDonut = ({ segments, size = 44 }) => {
    const r = 16, c = 2 * Math.PI * r;
    let offset = 0;
    return (
        <svg width={size} height={size} viewBox="0 0 44 44" style={{ flexShrink: 0 }}>
            <circle cx="22" cy="22" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
            {segments.map((seg, i) => {
                const dash = (seg.pct / 100) * c;
                const el = <circle key={i} cx="22" cy="22" r={r} fill="none" stroke={seg.color} strokeWidth="5" strokeDasharray={`${dash} ${c - dash}`} strokeDashoffset={-offset} transform="rotate(-90 22 22)" style={{ transition: 'all 0.8s ease' }} />;
                offset += dash;
                return el;
            })}
        </svg>
    );
};

const GrowthBars = ({ data, color }) => (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '32px' }}>
        {data.map((d, i) => (
            <div key={i} style={{ flex: 1, background: `linear-gradient(to top, ${color}22, ${color})`, borderRadius: '2px', height: `${d.pct}%`, transition: 'height 0.5s ease', minWidth: '4px', opacity: 0.5 + (i / data.length) * 0.5 }} />
        ))}
    </div>
);

const StackedBar = ({ elecPct, gasPct }) => (
    <div style={{ width: '100%', marginTop: '0.25rem' }}>
        <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', background: 'rgba(255,255,255,0.06)' }}>
            <div style={{ width: elecPct + '%', background: 'linear-gradient(90deg, #a78bfa, #a78bfa88)', transition: 'width 0.8s' }} />
            <div style={{ width: gasPct + '%', background: 'linear-gradient(90deg, #f97316, #f9731688)', transition: 'width 0.8s' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
            <span style={{ fontSize: '0.55rem', color: '#a78bfa' }}>Elec {elecPct}%</span>
            <span style={{ fontSize: '0.55rem', color: '#f97316' }}>Gas {gasPct}%</span>
        </div>
    </div>
);

const ImpactMeter = ({ value, max, color }) => {
    const pct = Math.min((value / max) * 100, 100);
    return (
        <div style={{ width: '100%', marginTop: '0.25rem' }}>
            <div style={{ position: 'relative', height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <div style={{ width: pct + '%', height: '100%', borderRadius: '4px', background: `linear-gradient(90deg, ${color}44, ${color})`, transition: 'width 0.8s', boxShadow: `0 0 8px ${color}44` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.2rem' }}>
                <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>0t</span>
                <span style={{ fontSize: '0.55rem', color, fontWeight: 600 }}>{value}t saved</span>
                <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>{max}t goal</span>
            </div>
        </div>
    );
};

const savingsGrowth = [
    { pct: 25 }, { pct: 38 }, { pct: 52 }, { pct: 62 }, { pct: 71 }, { pct: 80 }, { pct: 88 }, { pct: 95 }, { pct: 100 }
];

/* ─── Per-Building Data Profiles ─── */
const buildingProfiles = {
    'North Tower': {
        mult: 1.0, effBase: 88, comfort: [94, 90, 82, 97],
        consumption: '45,850', consUnit: 'kWh + therms YTD', elecSplit: '40,300 kWh', gasSplit: '5,550 therms',
        cost: '$15,950', elecCost: '$9,050', gasCost: '$6,900', costTrend: -2.8,
        savings: '$15,200', savingsTrend: 18.5,
        emissions: '12.6', emElec: '8.2t', emGas: '4.4t', emTrend: -6.1,
        reduced: '3.6', reducedTrend: 22.3,
    },
    'South Center': {
        mult: 0.82, effBase: 85, comfort: [91, 87, 78, 94],
        consumption: '37,600', consUnit: 'kWh + therms YTD', elecSplit: '33,050 kWh', gasSplit: '4,550 therms',
        cost: '$13,100', elecCost: '$7,420', gasCost: '$5,680', costTrend: -1.9,
        savings: '$11,800', savingsTrend: 14.2,
        emissions: '10.3', emElec: '6.7t', emGas: '3.6t', emTrend: -4.8,
        reduced: '2.9', reducedTrend: 17.6,
    },
    'West Complex': {
        mult: 0.68, effBase: 79, comfort: [83, 76, 71, 88],
        consumption: '31,180', consUnit: 'kWh + therms YTD', elecSplit: '27,400 kWh', gasSplit: '3,780 therms',
        cost: '$10,850', elecCost: '$6,150', gasCost: '$4,700', costTrend: -3.5,
        savings: '$9,400', savingsTrend: 10.8,
        emissions: '8.6', emElec: '5.6t', emGas: '3.0t', emTrend: -3.2,
        reduced: '2.1', reducedTrend: 12.4,
    },
    'East Wing': {
        mult: 1.15, effBase: 92, comfort: [96, 93, 88, 99],
        consumption: '52,730', consUnit: 'kWh + therms YTD', elecSplit: '46,350 kWh', gasSplit: '6,380 therms',
        cost: '$18,350', elecCost: '$10,410', gasCost: '$7,940', costTrend: -5.1,
        savings: '$18,600', savingsTrend: 22.1,
        emissions: '14.5', emElec: '9.4t', emGas: '5.1t', emTrend: -7.3,
        reduced: '4.5', reducedTrend: 28.9,
    },
};

// Per-building per-month variation factors for BuildingView
// Each building gets unique monthly multipliers so chart shapes differ completely
const bvVariations = {
    'North Tower': {
        elec: [0.85, 1.12, 0.72, 1.28, 0.94, 0.68, 1.15, 1.32, 0.78, 1.05, 0.88, 1.22],
        gas:  [1.18, 0.76, 1.05, 0.82, 1.30, 0.91, 0.74, 1.15, 1.25, 0.70, 1.08, 0.95],
        sav:  [0.92, 1.25, 0.70, 1.18, 0.84, 1.35, 0.78, 0.95, 1.28, 1.10, 0.72, 1.05],
        em:   [1.10, 0.82, 1.25, 0.75, 1.15, 0.88, 1.30, 0.72, 0.95, 1.20, 0.80, 1.05],
    },
    'South Center': {
        elec: [1.25, 0.78, 1.10, 0.68, 1.32, 0.85, 0.72, 1.18, 0.92, 1.28, 0.75, 1.05],
        gas:  [0.72, 1.28, 0.88, 1.15, 0.70, 1.22, 1.05, 0.80, 1.30, 0.92, 1.12, 0.75],
        sav:  [1.30, 0.72, 1.15, 0.88, 0.75, 1.25, 1.10, 0.68, 0.95, 1.32, 0.82, 1.20],
        em:   [0.78, 1.22, 0.70, 1.30, 0.95, 0.82, 1.18, 1.05, 0.72, 1.10, 1.28, 0.85],
    },
    'West Complex': {
        elec: [0.70, 1.30, 0.92, 1.05, 0.78, 1.22, 0.85, 0.72, 1.28, 0.88, 1.15, 0.68],
        gas:  [1.28, 0.85, 1.20, 0.72, 1.10, 0.78, 1.30, 0.92, 0.70, 1.25, 0.82, 1.15],
        sav:  [0.75, 1.18, 0.82, 1.30, 1.05, 0.70, 0.92, 1.25, 0.78, 0.88, 1.32, 1.10],
        em:   [1.20, 0.75, 1.30, 0.88, 0.72, 1.15, 0.82, 1.28, 1.05, 0.70, 0.95, 1.22],
    },
    'East Wing': {
        elec: [1.15, 0.70, 1.28, 0.92, 0.82, 1.05, 1.30, 0.78, 0.85, 1.22, 0.72, 1.18],
        gas:  [0.82, 1.22, 0.70, 1.28, 0.95, 1.10, 0.75, 1.30, 0.88, 1.05, 0.72, 1.15],
        sav:  [1.18, 0.85, 1.30, 0.72, 1.10, 0.78, 1.25, 0.70, 1.05, 0.92, 1.28, 0.82],
        em:   [0.88, 1.15, 0.78, 1.22, 1.05, 0.72, 1.10, 0.82, 1.30, 0.75, 1.25, 0.95],
    },
};

const scaleArr = (arr, mult, building, variationKey) => {
    const vars = bvVariations[building];
    if (!vars) return arr.map(d => ({ ...d })); // fallback
    const vArr = variationKey === 'sav' ? vars.sav : variationKey === 'em' ? vars.em : null;
    return arr.map((d, i) => {
        const out = { ...d };
        const vE = vars.elec[i % 12];
        const vG = vars.gas[i % 12];
        const vX = vArr ? vArr[i % 12] : 1;
        if (out.elec !== undefined) out.elec = Math.round(out.elec * mult * vE);
        if (out.gas !== undefined) out.gas = Math.round(out.gas * mult * vG);
        if (out.total !== undefined) out.total = (out.elec || 0) + (out.gas || 0);
        if (out.val !== undefined) out.val = +(out.val * mult * vX).toFixed(1);
        if (out.emissions !== undefined) out.emissions = +(out.emissions * mult * vX).toFixed(1);
        if (out.reduced !== undefined) out.reduced = +(out.reduced * mult * vX).toFixed(1);
        return out;
    });
};

/* ═══════════════════════════════════════════
   BuildingView Component
   ═══════════════════════════════════════════ */
import { useLocation } from 'react-router-dom';

const BuildingView = () => {
    const location = useLocation();
    
    // Initialize from location state if available
    const initialBuilding = location.state?.selectedBuilding || 'North Tower';
    const initialTab = location.state?.activeTab || 'energy';

    const [isBuildingOpen, setIsBuildingOpen] = useState(false);
    const [selectedBuilding, setSelectedBuilding] = useState(initialBuilding);
    const [activeModal, setActiveModal] = useState(null);
    const [savingsPeriod, setSavingsPeriod] = useState('ytd');
    const [showCalendar, setShowCalendar] = useState(false);
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');
    const [hoveredArc, setHoveredArc] = useState(null);
    const [activeTab, setActiveTab] = useState(initialTab);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [yoyMode, setYoyMode] = useState('Since Installation');

    // Update if location state changes while mounted
    useEffect(() => {
        if (location.state?.selectedBuilding) setSelectedBuilding(location.state.selectedBuilding);
        if (location.state?.activeTab) setActiveTab(location.state.activeTab);
    }, [location.state]);

    const handleArcMouseMove = (e) => {
        setMousePos({ x: e.clientX, y: e.clientY });
    };

    // Per-building profile & multiplier
    const bp = buildingProfiles[selectedBuilding];
    const m = bp.mult;

    // Pull period-synced data (with per-building variation)
    // Per-building elec/gas ratio skew — changes the arc proportions
    const arcSkew = {
        'North Tower':  { elecFactor: 0.88, gasFactor: 1.14 },  // gas-heavy
        'South Center': { elecFactor: 1.10, gasFactor: 0.85 },  // elec-heavy
        'West Complex':  { elecFactor: 0.95, gasFactor: 1.08 },  // slightly gas-heavy
        'East Wing':    { elecFactor: 1.22, gasFactor: 0.75 },  // very elec-heavy
    };
    const sk = arcSkew[selectedBuilding] || { elecFactor: 1, gasFactor: 1 };
    const rawArc = arcDataByPeriod[savingsPeriod];
    const elecVal = Math.round(rawArc.elec * m * sk.elecFactor);
    const gasVal = Math.round(rawArc.gas * m * sk.gasFactor);
    const totalEnergy = elecVal + gasVal;
    const elecPct = elecVal / totalEnergy;
    
    // SVG arc from PI to 0. Intersection angle in radians:
    const intersectionAngle = Math.PI * (1 - elecPct);
    const intX = 120 + 80 * Math.cos(intersectionAngle);
    const intY = 120 - 80 * Math.sin(intersectionAngle);

    const activeTrendData = scaleArr(trendDataByPeriod[savingsPeriod], m, selectedBuilding, 'trend');
    const activeEmissionsData = scaleArr(emissionsDataByPeriod[savingsPeriod], m, selectedBuilding, 'em');
    const activeSavingsBreakdown = scaleArr(savingsBreakdownByPeriod[savingsPeriod], m, selectedBuilding, 'sav');
    const rawEff = efficiencyByPeriod[savingsPeriod];
    const effDelta = bp.effBase - 88; // offset from North Tower baseline
    const activeEfficiency = {
        score: Math.min(100, Math.max(0, rawEff.score + effDelta)),
        buildings: rawEff.buildings.map((b, i) => ({ label: b.label, pct: Math.min(100, Math.max(0, bp.comfort[i] || b.pct)) }))
    };
    const rawSavTotal = savingsTotalByPeriod[savingsPeriod];
    const activeSavingsTotal = rawSavTotal === '—' ? '—' : '$' + Math.round(parseFloat(rawSavTotal.replace(/[^\d.]/g, '')) * m).toLocaleString();

    const emBase = { '24h': 16.4, '7d': 45.1, '1m': 182.5, 'ytd': 685.2, 'custom': 0 };
    const activeEmissionsTotal = emBase[savingsPeriod] === 0 ? '—' : (emBase[savingsPeriod] * m).toFixed(1);

    const buildingOptions = ['North Tower', 'South Center', 'West Complex', 'East Wing'];
    const savingsPeriods = [
        { key: '24h', label: '24 Hours' },
        { key: '7d', label: '7 Days' },
        { key: '1m', label: '1 Month' },
        { key: 'ytd', label: 'YTD' },
    ];

    // Per-building savings data
    const buildingSavingsData = {
        'North Tower': { elec: '12,450', gas: '4,180', money: '$15,200', elecTrend: -4.2, gasTrend: -5.9, moneyTrend: 18.5 },
        'South Center': { elec: '9,820', gas: '3,450', money: '$11,800', elecTrend: -3.1, gasTrend: -4.7, moneyTrend: 14.2 },
        'West Complex': { elec: '7,650', gas: '2,890', money: '$9,400', elecTrend: -2.5, gasTrend: -3.2, moneyTrend: 10.8 },
        'East Wing': { elec: '14,100', gas: '5,020', money: '$18,600', elecTrend: -5.8, gasTrend: -6.4, moneyTrend: 22.1 },
    };
    const bs = buildingSavingsData[selectedBuilding];
    const buildingSavingsCards = [
        { label: 'ELECTRICITY SAVINGS', value: bs.elec, unit: 'kWh saved', trend: bs.elecTrend, accentColor: 'var(--accent-green)' },
        { label: 'GAS SAVINGS', value: bs.gas, unit: 'therms saved', trend: bs.gasTrend, accentColor: '#f97316' },
        { label: 'MONETARY SAVINGS', value: bs.money, unit: 'saved', trend: bs.moneyTrend, accentColor: '#eab308' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Tool Bar Row */}
            <div className="toolbar-row">
                <div style={{ flex: 1 }}></div>
                <div style={{ position: 'relative' }}>
                    <div
                        className="date-pill"
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                        onClick={() => setIsBuildingOpen(!isBuildingOpen)}
                    >
                        <LayoutList size={14} /> {selectedBuilding} <ChevronDown size={14} style={{ transform: isBuildingOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                    </div>

                    {isBuildingOpen && (
                        <div className="glass-card" style={{ position: 'absolute', top: 'calc(100% + 0.5rem)', right: 0, padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', zIndex: 50, minWidth: '160px', border: '1px solid var(--border-light)' }}>
                            {buildingOptions.map(opt => (
                                <div
                                    key={opt}
                                    onClick={() => { setSelectedBuilding(opt); setIsBuildingOpen(false); }}
                                    style={{ padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer', color: selectedBuilding === opt ? 'var(--accent-green)' : 'var(--text-primary)', background: selectedBuilding === opt ? 'rgba(255,255,255,0.05)' : 'transparent', fontWeight: selectedBuilding === opt ? 500 : 400, transition: '0.2s' }}
                                    onMouseEnter={(e) => { if (selectedBuilding !== opt) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                                    onMouseLeave={(e) => { if (selectedBuilding !== opt) e.currentTarget.style.background = 'transparent' }}
                                >
                                    {opt}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ═══ Tab Navigation ═══ */}
            <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '4px', border: '1px solid var(--border-light)' }}>
                {[{ key: 'energy', label: 'Energy', icon: Zap }, { key: 'status', label: 'Status', icon: Activity }].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        style={{
                            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                            padding: '0.65rem 1.25rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 500,
                            cursor: 'pointer', transition: 'all 0.25s',
                            background: activeTab === tab.key ? 'rgba(255,255,255,0.08)' : 'transparent',
                            border: activeTab === tab.key ? '1px solid var(--accent-green)' : '1px solid transparent',
                            color: activeTab === tab.key ? 'var(--accent-green)' : 'var(--text-secondary)',
                            boxShadow: activeTab === tab.key ? '0 0 12px rgba(0,255,136,0.08)' : 'none',
                        }}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ═══ ENERGY TAB ═══ */}
            {activeTab === 'energy' && (<>
            {/* ═══ Period Selector ═══ */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '-0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {savingsPeriods.map((p) => (
                        <button
                            key={p.key}
                            onClick={() => { setSavingsPeriod(p.key); setShowCalendar(false); }}
                            style={{
                                padding: '0.45rem 1rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 500,
                                border: '1px solid', cursor: 'pointer', transition: 'all 0.2s',
                                background: savingsPeriod === p.key ? 'rgba(255,255,255,0.08)' : 'transparent',
                                borderColor: savingsPeriod === p.key ? 'var(--accent-green)' : 'var(--border-light)',
                                color: savingsPeriod === p.key ? 'var(--accent-green)' : 'var(--text-secondary)',
                            }}
                        >
                            {p.label}
                        </button>
                    ))}
                    <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setShowCalendar(!showCalendar)}
                        style={{
                            padding: '0.45rem 1rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 500,
                            border: '1px solid', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem',
                            background: savingsPeriod === 'custom' ? 'rgba(255,255,255,0.08)' : 'transparent',
                            borderColor: savingsPeriod === 'custom' ? 'var(--accent-green)' : 'var(--border-light)',
                            color: savingsPeriod === 'custom' ? 'var(--accent-green)' : 'var(--text-secondary)',
                        }}
                    >
                        <Calendar size={14} /> Custom Range
                    </button>
                    {showCalendar && (
                        <div className="glass-card" style={{ position: 'absolute', top: 'calc(100% + 0.5rem)', right: 0, padding: '1rem', zIndex: 60, border: '1px solid var(--border-light)', minWidth: '260px', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Start Date</label>
                                <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} style={{ background: 'var(--bg-input)', border: '1px solid var(--border-light)', borderRadius: '6px', padding: '0.5rem', color: 'var(--text-primary)', fontSize: '0.85rem', colorScheme: 'dark' }} />
                                <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>End Date</label>
                                <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} style={{ background: 'var(--bg-input)', border: '1px solid var(--border-light)', borderRadius: '6px', padding: '0.5rem', color: 'var(--text-primary)', fontSize: '0.85rem', colorScheme: 'dark' }} />
                                <button onClick={() => { setSavingsPeriod('custom'); setShowCalendar(false); }} style={{ marginTop: '0.25rem', padding: '0.5rem', borderRadius: '6px', background: 'var(--accent-green)', color: '#000', fontWeight: 600, fontSize: '0.8rem', border: 'none', cursor: 'pointer' }}>Apply</button>
                            </div>
                        </div>
                    )}
                    </div>
                </div>
            </div>

            {/* ═══ Building Savings Cards ═══ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {buildingSavingsCards.map((card) => (
                    <div
                        key={card.label}
                        className="glass-card"
                        onClick={() => setActiveModal(card.label)}
                        style={{
                            padding: '1.5rem 1.75rem',
                            position: 'relative',
                            overflow: 'hidden',
                            border: '1px solid transparent',
                            transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.2s',
                            cursor: 'pointer',
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

            {/* Main Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(500px, 1.5fr)', gap: '1.5rem', height: '360px' }}>

                {/* Total Consumption Gauge */}
                <div className="glass-card" style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 300, letterSpacing: '-0.02em' }}>Consumption</h2>
                        <svg width="40" height="40" viewBox="0 0 36 36">
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
                            <circle cx="18" cy="18" r="15.9155" fill="none" stroke="var(--text-secondary)" strokeWidth="4" strokeDasharray="30 100" strokeDashoffset="25" />
                            <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#fff" strokeWidth="4" strokeDasharray="10 100" strokeDashoffset="-5" />
                        </svg>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1.5rem', zIndex: 2 }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total</span>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '0.2rem' }}>
                            <span style={{ fontSize: '2.8rem', fontWeight: 500, letterSpacing: '-0.02em' }}>{totalEnergy.toLocaleString()}</span>
                            <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>kWh</span>
                        </div>
                    </div>

                    {/* Half Arc with Pattern */}
                    <div style={{ position: 'relative', width: '100%', height: 'auto', marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
                        <svg viewBox="20 20 200 125" width="100%" height="100%" style={{ overflow: 'visible', maxWidth: '440px' }}>
                            <defs>
                                <pattern id="diagonalStripeLight" width="4.5" height="4.5" patternTransform="rotate(-45)" patternUnits="userSpaceOnUse">
                                    <rect width="4.5" height="4.5" fill="#ffffff" />
                                    <line x1="0" y1="0" x2="0" y2="4.5" stroke="#d4d4d8" strokeWidth="1.75" />
                                </pattern>
                            </defs>
                            {/* Base track (dark gray background arc) */}
                            <path d="M 40,120 A 80,80 0 0,1 200,120" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="40" strokeLinecap="butt" />
                            
                            {/* Right Side (Gas) - Solid Green */}
                            <g 
                                onMouseEnter={() => setHoveredArc('gas')} 
                                onMouseLeave={() => setHoveredArc(null)} 
                                onMouseMove={handleArcMouseMove}
                                style={{ 
                                    cursor: 'crosshair', 
                                    transition: 'filter 0.3s ease',
                                    filter: hoveredArc === 'elec' ? 'brightness(0.35) saturate(0.6)' : 'brightness(1) saturate(1)'
                                }}
                            >
                                {/* By omitting round cap left-overlap, the green arc's edge natively conforms to the true shape of the opaque white cap biting into it. */}
                                <path d={`M ${intX},${intY} A 80,80 0 0,1 200,120`} fill="none" stroke="var(--accent-green)" strokeWidth="40" strokeLinecap="butt" pointerEvents="stroke" />
                                <circle cx="200" cy="120" r="20" fill="var(--accent-green)" pointerEvents="none" />
                            </g>
                            
                            {/* Left Side (Electricity) - Patterned White */}
                            <g
                                onMouseEnter={() => setHoveredArc('elec')} 
                                onMouseLeave={() => setHoveredArc(null)} 
                                onMouseMove={handleArcMouseMove}
                                style={{ 
                                    cursor: 'crosshair', 
                                    transition: 'filter 0.3s ease',
                                    filter: hoveredArc === 'gas' ? 'brightness(0.35) saturate(0.6)' : 'brightness(1) saturate(1)'
                                }}
                            >
                                <path d={`M 40,120 A 80,80 0 0,1 ${intX},${intY}`} fill="none" stroke="url(#diagonalStripeLight)" strokeWidth="40" strokeLinecap="butt" pointerEvents="stroke" />
                                <circle cx={intX} cy={intY} r="20" fill="url(#diagonalStripeLight)" pointerEvents="none" />
                            </g>
                        </svg>

                        {/* Centered text inside the arc */}
                        <div style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', pointerEvents: 'none' }}>
                            <div style={{ width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '1.5rem', transform: 'translateY(15%)', pointerEvents: 'auto' }}>
                                <span style={{ fontSize: '1.3rem', fontWeight: 600, color: '#fff' }}>{elecVal.toLocaleString()}</span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>ELEC KWH</span>
                                <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginTop: '0.5rem' }}>{gasVal.toLocaleString()}</span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>GAS THERMS</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Energy Usage Trend Chart */}
                <div 
                    className="glass-card"
                    onClick={() => setActiveModal('trend')}
                    style={{
                        padding: '1.5rem',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        border: '1px solid transparent',
                        transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-light)';
                        e.currentTarget.style.boxShadow = `0 0 24px rgba(255,255,255,0.08)`;
                        e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'transparent';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'none';
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 400 }}>Energy Usage Trend</h2>
                        <Maximize2 size={16} color="var(--text-muted)" />
                    </div>

                    <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={activeTrendData.slice(0, 8)} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorGreenTrend" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--accent-green)" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="var(--accent-green)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.06)" vertical={false} />
                            <XAxis dataKey="label" axisLine={false} tickLine={false} dy={10} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                            <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => v === 0 ? '0' : `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} content={<CustomTrendTooltip />} />

                            {/* Stacked Bars representing Electricity (White) and Gas (Green) depth */}
                            <Bar dataKey="elec" stackId="a" fill="rgba(255,255,255,0.85)" barSize={32} />
                            <Bar dataKey="gas" stackId="a" fill="var(--accent-green)" opacity={0.9} barSize={32} radius={[12, 12, 0, 0]} />
                            
                            {/* Line & Gradient Area tracking the total peak */}
                            <Area type="monotone" dataKey="total" stroke="var(--accent-green)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorGreenTrend)" />
                            <Line type="monotone" dataKey="total" stroke="none" activeDot={{ r: 6, fill: '#fff', stroke: 'var(--accent-green)', strokeWidth: 2 }} dot={{ r: 4, fill: '#111', stroke: 'var(--accent-green)', strokeWidth: 2 }} />
                        </ComposedChart>
                    </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Cards Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', height: '240px' }}>

                {/* Carbon Emissions by Month */}
                <div 
                    className="glass-card" 
                    onClick={() => setActiveModal('emissions')}
                    style={{ 
                        padding: '1.5rem', 
                        cursor: 'pointer',
                        border: '1px solid transparent',
                        transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.2s',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-light)';
                        e.currentTarget.style.boxShadow = `0 0 24px rgba(249,115,22,0.15)`;
                        e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'transparent';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'none';
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 400 }}>Carbon Emissions</h3>
                        <Maximize2 size={16} color="var(--text-muted)" />
                    </div>
                    <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={activeEmissionsData.slice(0, 7)} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} dy={5} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} tickFormatter={(v) => `${v}t`} />
                                <Tooltip contentStyle={{ background: 'var(--bg-input)', border: 'none', borderRadius: '8px', color: '#fff' }} />
                                <Bar dataKey="emissions" name="Emissions (t)" fill="#f97316" radius={[4, 4, 4, 4]} barSize={12} />
                                <Bar dataKey="reduced" name="Reduced (t)" fill="var(--accent-green)" radius={[4, 4, 4, 4]} barSize={12} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Efficiency & Savings Overview */}
                <div className="glass-card" style={{ position: 'relative', padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 400, marginBottom: '1rem' }}>Comfort</h3>
                    <div style={{ fontSize: '2rem', fontWeight: 500, letterSpacing: '-0.02em' }}>{activeEfficiency.score}%</div>

                    <div style={{ position: 'absolute', right: '1.5rem', top: '4rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '130px' }}>
                        {activeEfficiency.buildings.map((b) => (
                            <div key={b.label}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>{b.label}</span>
                                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{b.pct}%</span>
                                </div>
                                <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px' }}>
                                    <div style={{ width: `${b.pct}%`, height: '100%', background: b.pct >= 85 ? 'var(--accent-green)' : '#f97316', borderRadius: '3px' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>



            </div>

            {/* ═══ Year-over-Year Improvement Section ═══ */}
            {(() => {
                const yoyData = [
                    { year: '2021', electricity: 32, gas: 28, monetary: 45000, label: 'Installation Year' },
                    { year: '2022', electricity: 8, gas: 6, monetary: 12000, label: '' },
                    { year: '2023', electricity: 5, gas: 4, monetary: 8500, label: '' },
                    { year: '2024', electricity: 3.2, gas: 2.8, monetary: 6200, label: 'Current' },
                ];
                const sinceInstall = { electricity: 48.2, gas: 40.8, monetary: 71700 };
                const momData = [
                    { month: 'Jan', electricity: 4.1, gas: 3.8, savings: 5200 },
                    { month: 'Feb', electricity: 3.5, gas: 2.9, savings: 4800 },
                    { month: 'Mar', electricity: 2.8, gas: 3.2, savings: 4100 },
                    { month: 'Apr', electricity: 1.2, gas: 1.5, savings: 2200 },
                    { month: 'May', electricity: -0.5, gas: 0.8, savings: 900 },
                    { month: 'Jun', electricity: 0.9, gas: 1.1, savings: 1800 },
                    { month: 'Jul', electricity: 2.1, gas: 1.8, savings: 3200 },
                    { month: 'Aug', electricity: 3.4, gas: 2.6, savings: 4500 },
                    { month: 'Sep', electricity: 2.7, gas: 2.2, savings: 3800 },
                    { month: 'Oct', electricity: 1.9, gas: 1.4, savings: 2900 },
                    { month: 'Nov', electricity: 3.8, gas: 3.5, savings: 5100 },
                    { month: 'Dec', electricity: 4.5, gas: 4.0, savings: 5800 },
                ];
                return (
                    <div className="glass-card" style={{ padding: '2rem', border: '1px solid var(--border-light)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Performance Comparison</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>Track improvements since installation, year-over-year, and month-over-month</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {['Since Installation', 'Year-over-Year', 'Month-over-Month'].map(mode => (
                                    <button key={mode} onClick={() => setYoyMode(mode)} style={{
                                        padding: '0.45rem 1rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 500,
                                        border: '1px solid', cursor: 'pointer', transition: 'all 0.2s', outline: 'none',
                                        background: yoyMode === mode ? 'rgba(255,255,255,0.08)' : 'transparent',
                                        borderColor: yoyMode === mode ? 'var(--accent-green)' : 'var(--border-light)',
                                        color: yoyMode === mode ? 'var(--accent-green)' : 'var(--text-secondary)',
                                    }}>{mode}</button>
                                ))}
                            </div>
                        </div>

                        {yoyMode === 'Since Installation' ? (
                            <>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                                    {[
                                        { label: 'ELECTRICITY REDUCTION', value: `${sinceInstall.electricity}%`, color: 'var(--accent-green)', sub: 'since 2021 installation' },
                                        { label: 'GAS REDUCTION', value: `${sinceInstall.gas}%`, color: '#f97316', sub: 'since 2021 installation' },
                                        { label: 'TOTAL SAVINGS', value: `$${sinceInstall.monetary.toLocaleString()}`, color: '#eab308', sub: 'cumulative to date' },
                                    ].map((c, i) => (
                                        <div key={i} style={{ background: 'var(--bg-input)', borderRadius: '12px', padding: '1.25rem', borderLeft: `3px solid ${c.color}` }}>
                                            <div style={{ fontSize: '0.65rem', color: c.color, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '0.5rem' }}>{c.label}</div>
                                            <div style={{ fontSize: '2rem', fontWeight: 600 }}>{c.value}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{c.sub}</div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ height: '280px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={yoyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="bvYoyCumElec" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="var(--accent-green)" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="var(--accent-green)" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="bvYoyCumGas" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.06)" vertical={false} />
                                            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: 'var(--text-secondary)' }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 13, fill: 'var(--text-secondary)' }} />
                                            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ background: 'var(--bg-input)', border: 'none', borderRadius: '12px', fontSize: '0.9rem' }} formatter={(v, n) => [`${v}%`, n === 'electricity' ? 'Electricity' : 'Gas']} />
                                            <Area type="monotone" dataKey="electricity" stroke="var(--accent-green)" strokeWidth={2.5} fillOpacity={1} fill="url(#bvYoyCumElec)" />
                                            <Area type="monotone" dataKey="gas" stroke="#f97316" strokeWidth={2.5} fillOpacity={1} fill="url(#bvYoyCumGas)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </>
                        ) : yoyMode === 'Year-over-Year' ? (
                            <>
                                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                                    {[
                                        { color: 'var(--accent-green)', label: 'Electricity %' },
                                        { color: '#f97316', label: 'Gas %' },
                                    ].map((leg, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: leg.color }} />
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{leg.label}</span>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ height: '300px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={yoyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.06)" vertical={false} />
                                            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: 'var(--text-secondary)' }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 13, fill: 'var(--text-secondary)' }} />
                                            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ background: 'var(--bg-input)', border: 'none', borderRadius: '12px', fontSize: '0.9rem' }} formatter={(v, n) => [`${v}%`, n === 'electricity' ? 'Electricity Reduction' : 'Gas Reduction']} />
                                            <Bar dataKey="electricity" fill="var(--accent-green)" radius={[6, 6, 0, 0]} barSize={40} />
                                            <Bar dataKey="gas" fill="#f97316" radius={[6, 6, 0, 0]} barSize={40} opacity={0.85} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${yoyData.length}, 1fr)`, gap: '0.75rem', marginTop: '1rem' }}>
                                    {yoyData.map((d, i) => (
                                        <div key={i} style={{ background: 'var(--bg-input)', borderRadius: '10px', padding: '0.75rem 1rem', textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>{d.year} {d.label && `· ${d.label}`}</div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#eab308' }}>${d.monetary.toLocaleString()}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>saved</div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Month-over-Month */}
                                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                                    {[
                                        { color: 'var(--accent-green)', label: 'Electricity % change' },
                                        { color: '#f97316', label: 'Gas % change' },
                                        { color: '#eab308', label: 'Monthly savings ($)', style: 'dashed' },
                                    ].map((leg, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ width: 10, height: 10, borderRadius: leg.style === 'dashed' ? '2px' : '50%', background: leg.color }} />
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{leg.label}</span>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ height: '300px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ComposedChart data={momData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.06)" vertical={false} />
                                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: 'var(--text-secondary)' }} dy={10} />
                                            <YAxis yAxisId="pct" axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 13, fill: 'var(--text-secondary)' }} />
                                            <YAxis yAxisId="dollar" orientation="right" axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 12, fill: '#eab308' }} />
                                            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ background: 'var(--bg-input)', border: 'none', borderRadius: '12px', fontSize: '0.9rem' }} formatter={(v, n) => [n === 'savings' ? `$${v.toLocaleString()}` : `${v}%`, n === 'electricity' ? 'Electricity' : n === 'gas' ? 'Gas' : 'Savings']} />
                                            <Bar yAxisId="pct" dataKey="electricity" fill="var(--accent-green)" radius={[6, 6, 0, 0]} barSize={20} />
                                            <Bar yAxisId="pct" dataKey="gas" fill="#f97316" radius={[6, 6, 0, 0]} barSize={20} opacity={0.85} />
                                            <Line yAxisId="dollar" type="monotone" dataKey="savings" stroke="#eab308" strokeWidth={2.5} strokeDasharray="6 3" dot={{ fill: '#eab308', r: 3 }} />
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginTop: '1rem' }}>
                                    {[
                                        { label: 'Best Month', value: 'December', sub: '4.5% elec · 4.0% gas', color: 'var(--accent-green)' },
                                        { label: 'Avg Monthly', value: '2.5%', sub: 'electricity reduction', color: '#38bdf8' },
                                        { label: 'Monthly Savings', value: '$3,692', sub: 'average per month', color: '#eab308' },
                                        { label: 'Trend', value: 'Improving', sub: 'vs. prior quarter', color: 'var(--accent-green)' },
                                    ].map((c, i) => (
                                        <div key={i} style={{ background: 'var(--bg-input)', borderRadius: '10px', padding: '0.75rem 1rem', textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.65rem', color: c.color, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '0.3rem' }}>{c.label}</div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{c.value}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{c.sub}</div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                );
            })()}

            </>)}

            {/* ═══ STATUS TAB ═══ */}
            {activeTab === 'status' && (() => {
                const statusData = {
                    'North Tower':  { 
                        temp: 72, occupancy: 84, lighting: 60, airQuality: 96, 
                        boilers: 'operational', chillers: 'operational', ahus: 'warning', cooling_towers: 'operational', vav_boxes: 'operational', exhaust_fans: 'operational'
                    },
                    'South Center': { 
                        temp: 74, occupancy: 78, lighting: 72, airQuality: 91, 
                        boilers: 'operational', chillers: 'warning', ahus: 'operational', cooling_towers: 'operational', vav_boxes: 'warning', exhaust_fans: 'operational'
                    },
                    'West Complex': { 
                        temp: 69, occupancy: 62, lighting: 55, airQuality: 83, 
                        boilers: 'warning', chillers: 'operational', ahus: 'warning', cooling_towers: 'warning', vav_boxes: 'operational', exhaust_fans: 'warning'
                    },
                    'East Wing':    { 
                        temp: 71, occupancy: 91, lighting: 68, airQuality: 98, 
                        boilers: 'operational', chillers: 'operational', ahus: 'operational', cooling_towers: 'operational', vav_boxes: 'operational', exhaust_fans: 'operational'
                    },
                };
                const alertsData = {
                    'North Tower': [
                        { type: 'warning', msg: 'Water pressure anomaly detected in Floor 3', time: '12 minutes ago', icon: AlertTriangle, color: '#f97316' },
                        { type: 'success', msg: 'Optimization complete: 15% energy reduction achieved', time: '1 hour ago', icon: CheckCircle2, color: 'var(--accent-green)' },
                        { type: 'info', msg: 'Scheduled maintenance due for HVAC system', time: '3 hours ago', icon: Info, color: '#38bdf8' },
                    ],
                    'South Center': [
                        { type: 'warning', msg: 'Lighting control module needs calibration — Zone A', time: '8 minutes ago', icon: AlertTriangle, color: '#f97316' },
                        { type: 'success', msg: 'Fire suppression system test passed', time: '2 hours ago', icon: CheckCircle2, color: 'var(--accent-green)' },
                        { type: 'info', msg: 'Elevator maintenance scheduled for next week', time: '5 hours ago', icon: Info, color: '#38bdf8' },
                    ],
                    'West Complex': [
                        { type: 'warning', msg: 'HVAC compressor running at 92% capacity', time: '2 minutes ago', icon: AlertTriangle, color: '#f97316' },
                        { type: 'warning', msg: 'Security camera offline — Parking Level B2', time: '25 minutes ago', icon: AlertTriangle, color: '#f97316' },
                        { type: 'info', msg: 'Air filter replacement due in 5 days', time: '1 hour ago', icon: Info, color: '#38bdf8' },
                    ],
                    'East Wing': [
                        { type: 'success', msg: 'AI-optimized HVAC scheduling saved 22% this week', time: '30 minutes ago', icon: CheckCircle2, color: 'var(--accent-green)' },
                        { type: 'success', msg: 'All building systems operating at peak efficiency', time: '2 hours ago', icon: CheckCircle2, color: 'var(--accent-green)' },
                        { type: 'info', msg: 'Monthly energy report available for download', time: '4 hours ago', icon: Info, color: '#38bdf8' },
                    ],
                };

                const st = statusData[selectedBuilding];
                const alerts = alertsData[selectedBuilding];

                const statusLabel = (val, thresholds) => {
                    if (val >= thresholds[0]) return { text: 'Excellent', color: 'var(--accent-green)' };
                    if (val >= thresholds[1]) return { text: 'Optimal', color: 'var(--accent-green)' };
                    if (val >= thresholds[2]) return { text: 'Moderate', color: '#eab308' };
                    return { text: 'Low', color: '#f97316' };
                };
                const sysLabel = (val) => val === 'operational' ? { text: 'Operational', color: 'var(--accent-green)', icon: CheckCircle2 } : { text: 'Needs Attention', color: '#f97316', icon: AlertTriangle };

                const statusRows = [
                    { icon: Thermometer, label: 'Temperature', value: `${st.temp}°F`, status: statusLabel(st.temp, [72, 68, 65]) },
                    { icon: Users, label: 'Occupancy', value: `${st.occupancy}%`, status: st.occupancy >= 80 ? { text: 'High', color: '#38bdf8' } : st.occupancy >= 60 ? { text: 'Moderate', color: '#eab308' } : { text: 'Low', color: 'var(--text-secondary)' } },
                    { icon: Sun, label: 'Lighting', value: `${st.lighting}%`, status: statusLabel(st.lighting, [70, 55, 40]) },
                    { icon: Wind, label: 'Air Quality', value: String(st.airQuality), status: statusLabel(st.airQuality, [95, 85, 70]) },
                ];
                const systemRows = [
                    { icon: Flame, label: 'Boilers', ...sysLabel(st.boilers) },
                    { icon: Snowflake, label: 'Chillers', ...sysLabel(st.chillers) },
                    { icon: Wind, label: 'Air Handling Units (AHUs)', ...sysLabel(st.ahus) },
                    { icon: Droplets, label: 'Cooling Towers', ...sysLabel(st.cooling_towers) },
                    { icon: Activity, label: 'VAV Boxes', ...sysLabel(st.vav_boxes) },
                    { icon: Fan, label: 'Exhaust Fans', ...sysLabel(st.exhaust_fans) },
                ];

                return (<>
                    {/* Building Status */}
                    <div className="glass-card" style={{ padding: '1.75rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 400, marginBottom: '1.5rem' }}>Building Status</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            {statusRows.map((row, i) => (
                                <div key={row.label} style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '1rem 1.25rem', borderRadius: '12px',
                                    background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                                    transition: 'background 0.2s',
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <row.icon size={20} color="var(--text-secondary)" />
                                        <div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{row.label}</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.02em' }}>{row.value}</div>
                                        </div>
                                    </div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: row.status.color }}>{row.status.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* System Health */}
                    <div className="glass-card" style={{ padding: '1.75rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 400, marginBottom: '1.5rem' }}>System Health</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {systemRows.map((sys) => (
                                <div key={sys.label} style={{
                                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                                    padding: '1rem 1.25rem', borderRadius: '12px',
                                    background: 'rgba(255,255,255,0.02)',
                                    border: '1px solid',
                                    borderColor: sys.color === 'var(--accent-green)' ? 'rgba(0,255,136,0.1)' : 'rgba(249,115,22,0.2)',
                                    transition: 'border-color 0.25s, transform 0.2s',
                                }}
                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = sys.color === 'var(--accent-green)' ? 'rgba(0,255,136,0.3)' : 'rgba(249,115,22,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = sys.color === 'var(--accent-green)' ? 'rgba(0,255,136,0.1)' : 'rgba(249,115,22,0.2)'; e.currentTarget.style.transform = 'none'; }}
                                >
                                    <sys.icon size={22} color={sys.color} />
                                    <div>
                                        <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>{sys.label}</div>
                                        <div style={{ fontSize: '0.75rem', color: sys.color, fontWeight: 600, marginTop: '0.15rem' }}>{sys.text}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Alerts */}
                    <div className="glass-card" style={{ padding: '1.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                            <AlertTriangle size={20} color="#f97316" />
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 400 }}>Recent Alerts</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {alerts.map((alert, i) => (
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'center', gap: '1rem',
                                    padding: '1rem 1.25rem', borderRadius: '12px',
                                    background: alert.type === 'warning' ? 'rgba(249,115,22,0.06)' : alert.type === 'success' ? 'rgba(0,255,136,0.04)' : 'rgba(56,189,248,0.04)',
                                    border: '1px solid',
                                    borderColor: alert.type === 'warning' ? 'rgba(249,115,22,0.15)' : alert.type === 'success' ? 'rgba(0,255,136,0.1)' : 'rgba(56,189,248,0.1)',
                                    transition: 'border-color 0.25s',
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = alert.color}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = alert.type === 'warning' ? 'rgba(249,115,22,0.15)' : alert.type === 'success' ? 'rgba(0,255,136,0.1)' : 'rgba(56,189,248,0.1)'}
                                >
                                    <alert.icon size={18} color={alert.color} style={{ flexShrink: 0 }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{alert.msg}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{alert.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>);
            })()}

            {/* Tooltip for Arc Hover */}
            {hoveredArc && (
                <div style={{
                    position: 'fixed',
                    top: mousePos.y - 120,
                    left: mousePos.x + 15,
                    background: 'rgba(50, 50, 55, 0.75)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    padding: '1.25rem',
                    borderRadius: '16px',
                    zIndex: 9999,
                    pointerEvents: 'none',
                    color: '#fff',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
                    minWidth: '180px',
                    transition: 'opacity 0.2s',
                    animation: 'fadeIn 0.2s ease-out'
                }}>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                        {hoveredArc === 'elec' ? 'Gas' : 'Electricity'}
                    </div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 600, marginBottom: '0.4rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                        {hoveredArc === 'elec' ? gasVal.toLocaleString() : elecVal.toLocaleString()}
                        <span style={{ fontSize: '0.8rem', fontWeight: 500, color: hoveredArc === 'elec' ? '#ef4444' : 'var(--accent-green)' }}>
                            {hoveredArc === 'elec' ? 'Therms' : 'kWh'}
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-green)' }} />
                        <span style={{ fontSize: '0.9rem', color: 'var(--accent-green)', fontWeight: 500 }}>
                            {hoveredArc === 'elec' ? `${(100 - elecPct * 100).toFixed(1)}% of Total` : `${(elecPct * 100).toFixed(1)}% of Total`}
                        </span>
                    </div>
                </div>
            )}

            {/* Savings Modal */}
            {activeModal && activeModal.includes('SAVINGS') && (() => {
                const isElec = activeModal === 'ELECTRICITY SAVINGS';
                const isGas = activeModal === 'GAS SAVINGS';
                
                let modalColor = '#eab308';
                let modalTotal = activeSavingsTotal;
                let modalUnit = 'total saved this period';
                let modalPrefix = '';
                let scaleFactor = 1;

                if (isElec) {
                    modalColor = 'var(--accent-green)';
                    modalTotal = bs.elec;
                    modalUnit = 'kWh saved this period';
                    scaleFactor = 0.8;
                } else if (isGas) {
                    modalColor = '#f97316';
                    modalTotal = bs.gas;
                    modalUnit = 'therms saved this period';
                    scaleFactor = 0.25;
                } else {
                    modalPrefix = '$';
                }

                const chartData = activeSavingsBreakdown.map(d => ({
                    month: d.month,
                    val: Math.round(d.val * scaleFactor)
                }));

                const displayTotal = activeModal === 'MONETARY SAVINGS' 
                    ? bs.money 
                    : modalTotal;

                return (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
                        <div className="glass-card" style={{ padding: '2.5rem', width: '90%', maxWidth: '800px', height: '500px', position: 'relative', display: 'flex', flexDirection: 'column', animation: 'modalSlideIn 0.25s ease-out' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 400, marginBottom: '0.5rem' }}>
                                        {isElec ? 'Electricity' : isGas ? 'Gas' : 'Monetary'} Savings Breakdown
                                    </h3>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '2rem' }}>
                                        <span style={{ fontSize: '3rem', fontWeight: 500, letterSpacing: '-0.02em', color: modalColor }}>
                                            {activeModal === 'MONETARY SAVINGS' ? '' : modalPrefix}{displayTotal}
                                        </span>
                                        <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>{modalUnit}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem', alignItems: 'center' }}>
                                    {savingsPeriods.map((p) => (
                                        <button
                                            key={`modal-sav-${p.key}`}
                                            onClick={() => setSavingsPeriod(p.key)}
                                            style={{
                                                padding: '0.45rem 1rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 500,
                                                border: '1px solid', cursor: 'pointer', transition: 'all 0.2s',
                                                background: savingsPeriod === p.key ? 'rgba(255,255,255,0.08)' : 'transparent',
                                                borderColor: savingsPeriod === p.key ? 'var(--accent-green)' : 'var(--border-light)',
                                                color: savingsPeriod === p.key ? 'var(--accent-green)' : 'var(--text-secondary)',
                                            }}
                                        >
                                            {p.label}
                                        </button>
                                    ))}
                                    <button onClick={() => setActiveModal(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginLeft: '1rem', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>

                            <div style={{ flex: 1, position: 'relative' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="modalGradDyn" x1="0" y1="1" x2="0" y2="0">
                                                <stop offset="0%" stopColor={modalColor} stopOpacity={0.1}/>
                                                <stop offset="100%" stopColor={modalColor} stopOpacity={1}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: 'var(--text-secondary)' }} dy={10} />
                                        <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ background: 'var(--bg-input)', border: 'none', borderRadius: '12px', fontSize: '1.1rem' }} formatter={(v) => [`${modalPrefix}${v}`]} />
                                        <Bar dataKey="val" fill="url(#modalGradDyn)" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* Emissions Modal */}
            {activeModal === 'emissions' && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
                    <div className="glass-card" style={{ padding: '2.5rem', width: '90%', maxWidth: '800px', height: '500px', position: 'relative', display: 'flex', flexDirection: 'column', animation: 'modalSlideIn 0.25s ease-out' }}>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 400, marginBottom: '0.5rem' }}>Carbon Emissions Snapshot</h3>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '2rem' }}>
                                    <span style={{ fontSize: '3rem', fontWeight: 500, letterSpacing: '-0.02em', color: '#f97316' }}>{activeEmissionsTotal}</span>
                                    <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>tons CO₂eq emitted overall</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem', alignItems: 'center' }}>
                                {savingsPeriods.map((p) => (
                                    <button
                                        key={`modal-emi-${p.key}`}
                                        onClick={() => setSavingsPeriod(p.key)}
                                        style={{
                                            padding: '0.45rem 1rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 500,
                                            border: '1px solid', cursor: 'pointer', transition: 'all 0.2s',
                                            background: savingsPeriod === p.key ? 'rgba(255,255,255,0.08)' : 'transparent',
                                            borderColor: savingsPeriod === p.key ? '#f97316' : 'var(--border-light)',
                                            color: savingsPeriod === p.key ? '#f97316' : 'var(--text-secondary)',
                                        }}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                                <button onClick={() => setActiveModal(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginLeft: '1rem', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        <div style={{ flex: 1, position: 'relative' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={activeEmissionsData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="solidOrangeGrad" x1="0" y1="1" x2="0" y2="0">
                                            <stop offset="0%" stopColor="#f97316" stopOpacity={0.1}/>
                                            <stop offset="100%" stopColor="#f97316" stopOpacity={1}/>
                                        </linearGradient>
                                        <linearGradient id="solidEmiGreenGrad" x1="0" y1="1" x2="0" y2="0">
                                            <stop offset="0%" stopColor="var(--accent-green)" stopOpacity={0.1}/>
                                            <stop offset="100%" stopColor="var(--accent-green)" stopOpacity={1}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: 'var(--text-secondary)' }} dy={10} />
                                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ background: 'var(--bg-input)', border: 'none', borderRadius: '12px', fontSize: '1.1rem' }} itemStyle={{color: '#fff'}} formatter={(v, n) => [`${v}t`, n === 'emissions' ? 'Emitted' : 'Reduced']} />
                                    <Bar dataKey="emissions" fill="url(#solidOrangeGrad)" radius={[6, 6, 0, 0]} />
                                    <Bar dataKey="reduced" fill="url(#solidEmiGreenGrad)" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* Energy Trend Modal */}
            {activeModal === 'trend' && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
                    <div className="glass-card" style={{ padding: '2.5rem', width: '90%', maxWidth: '800px', height: '500px', position: 'relative', display: 'flex', flexDirection: 'column', animation: 'modalSlideIn 0.25s ease-out' }}>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 400, marginBottom: '0.5rem' }}>Energy Usage Trend</h3>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '2rem' }}>
                                    <span style={{ fontSize: '3rem', fontWeight: 500, letterSpacing: '-0.02em', color: '#fff' }}>{(activeTrendData.reduce((acc, obj) => acc + obj.total, 0)).toLocaleString()}</span>
                                    <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>kWh + therms combined overall</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem', alignItems: 'center' }}>
                                {savingsPeriods.map((p) => (
                                    <button
                                        key={`modal-trnd-${p.key}`}
                                        onClick={() => setSavingsPeriod(p.key)}
                                        style={{
                                            padding: '0.45rem 1rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 500,
                                            border: '1px solid', cursor: 'pointer', transition: 'all 0.2s',
                                            background: savingsPeriod === p.key ? 'rgba(255,255,255,0.08)' : 'transparent',
                                            borderColor: savingsPeriod === p.key ? '#fff' : 'var(--border-light)',
                                            color: savingsPeriod === p.key ? '#fff' : 'var(--text-secondary)',
                                        }}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                                <button onClick={() => setActiveModal(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginLeft: '1rem', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        <div style={{ flex: 1, position: 'relative' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={activeTrendData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="modalColorGreenTrend" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--accent-green)" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="var(--accent-green)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.06)" vertical={false} />
                                    <XAxis dataKey="label" axisLine={false} tickLine={false} dy={10} tick={{ fontSize: 13, fill: 'var(--text-secondary)' }} />
                                    <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => v === 0 ? '0' : `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 13, fill: 'var(--text-secondary)' }} />
                                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} content={<CustomTrendTooltip />} />

                                    <Bar dataKey="elec" stackId="a" fill="rgba(255,255,255,0.85)" barSize={14} />
                                    <Bar dataKey="gas" stackId="a" fill="var(--accent-green)" opacity={0.9} barSize={14} radius={[6, 6, 0, 0]} />
                                    <Area type="monotone" dataKey="total" stroke="var(--accent-green)" strokeWidth={2.5} fillOpacity={1} fill="url(#modalColorGreenTrend)" />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default BuildingView;
