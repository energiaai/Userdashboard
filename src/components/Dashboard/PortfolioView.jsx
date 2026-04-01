import React, { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ComposedChart, Line, Cell, LineChart } from 'recharts';
import { LayoutList, Share2, Calendar, Edit2, ChevronDown, Zap, DollarSign, TrendingDown, Gauge, Leaf, BarChart3, X, TrendingUp, Flame, Maximize2, Search } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const createPulseIcon = (isActive, numAlerts) => {
    const isWarning = numAlerts > 0;
    const color = isWarning ? '#ef4444' : '#4ade80';
    const size = 40;
    const dotSize = isActive ? 12 : 10;
    return L.divIcon({
        className: 'custom-pulse-icon',
        html: `
            <div style="
                position: relative;
                width: ${size}px; height: ${size}px;
                display: flex; align-items: center; justify-content: center;
            ">
                <!-- Outer pulse ring -->
                <div style="
                    position: absolute; inset: 0;
                    border-radius: 50%;
                    border: 1.5px solid ${color};
                    animation: marker-pulse 3s infinite ease-out;
                    opacity: 0;
                "></div>
                <!-- Inner pulse ring (staggered) -->
                <div style="
                    position: absolute; inset: 6px;
                    border-radius: 50%;
                    border: 1px solid ${color};
                    animation: marker-pulse 3s 1s infinite ease-out;
                    opacity: 0;
                "></div>
                <!-- Soft glow -->
                <div style="
                    position: absolute;
                    width: ${dotSize + 12}px; height: ${dotSize + 12}px;
                    border-radius: 50%;
                    background: radial-gradient(circle, ${color}40 0%, transparent 70%);
                    animation: marker-breathe 3s infinite ease-in-out;
                "></div>
                <!-- Core dot -->
                <div style="
                    position: relative;
                    width: ${dotSize}px; height: ${dotSize}px;
                    border-radius: 50%;
                    background: ${color};
                    box-shadow: 0 0 ${isActive ? '16px 4px' : '8px 2px'} ${color}55;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    border: ${isActive ? '2px solid rgba(255,255,255,0.9)' : '1.5px solid ' + color + 'cc'};
                "></div>
            </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
    });
};
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

// Building Map mock data containing full reference UI details
const mapBuildingsByPeriod = {
    '24h': [
        { id: 'b1', name: 'One World Plaza', address: '123 Business Ave, New York, NY', efficiency: 92, occupancy: 85, alerts: 0, lat: 40.7128, lng: -74.0060 },
        { id: 'b2', name: 'Green Tower', address: '456 Eco Street, San Francisco, CA', efficiency: 95, occupancy: 90, alerts: 2, lat: 37.7749, lng: -122.4194 },
        { id: 'b3', name: 'Tech Hub Center', address: '789 Innovation Dr, Austin, TX', efficiency: 88, occupancy: 75, alerts: 1, lat: 30.2672, lng: -97.7431 },
        { id: 'b4', name: 'Sustainable Heights', address: '321 Green Rd, Seattle, WA', efficiency: 90, occupancy: 95, alerts: 0, lat: 47.6062, lng: -122.3321 }
    ],
    '7d': [
        { id: 'b1', name: 'One World Plaza', address: '123 Business Ave, New York, NY', efficiency: 91, occupancy: 86, alerts: 0, lat: 40.7128, lng: -74.0060 },
        { id: 'b2', name: 'Green Tower', address: '456 Eco Street, San Francisco, CA', efficiency: 96, occupancy: 91, alerts: 2, lat: 37.7749, lng: -122.4194 },
        { id: 'b3', name: 'Tech Hub Center', address: '789 Innovation Dr, Austin, TX', efficiency: 87, occupancy: 78, alerts: 1, lat: 30.2672, lng: -97.7431 },
        { id: 'b4', name: 'Sustainable Heights', address: '321 Green Rd, Seattle, WA', efficiency: 92, occupancy: 96, alerts: 0, lat: 47.6062, lng: -122.3321 }
    ],
    '1m': [
        { id: 'b1', name: 'One World Plaza', address: '123 Business Ave, New York, NY', efficiency: 93, occupancy: 84, alerts: 0, lat: 40.7128, lng: -74.0060 },
        { id: 'b2', name: 'Green Tower', address: '456 Eco Street, San Francisco, CA', efficiency: 94, occupancy: 89, alerts: 2, lat: 37.7749, lng: -122.4194 },
        { id: 'b3', name: 'Tech Hub Center', address: '789 Innovation Dr, Austin, TX', efficiency: 89, occupancy: 74, alerts: 1, lat: 30.2672, lng: -97.7431 },
        { id: 'b4', name: 'Sustainable Heights', address: '321 Green Rd, Seattle, WA', efficiency: 91, occupancy: 94, alerts: 0, lat: 47.6062, lng: -122.3321 }
    ],
    'ytd': [
        { id: 'b1', name: 'One World Plaza', address: '123 Business Ave, New York, NY', efficiency: 92, occupancy: 85, alerts: 0, lat: 40.7128, lng: -74.0060 },
        { id: 'b2', name: 'Green Tower', address: '456 Eco Street, San Francisco, CA', efficiency: 95, occupancy: 90, alerts: 2, lat: 37.7749, lng: -122.4194 },
        { id: 'b3', name: 'Tech Hub Center', address: '789 Innovation Dr, Austin, TX', efficiency: 88, occupancy: 75, alerts: 1, lat: 30.2672, lng: -97.7431 },
        { id: 'b4', name: 'Sustainable Heights', address: '321 Green Rd, Seattle, WA', efficiency: 90, occupancy: 95, alerts: 0, lat: 47.6062, lng: -122.3321 }
    ],
    'custom': [
        { id: 'b1', name: 'One World Plaza', address: '123 Business Ave, New York, NY', efficiency: 0, occupancy: 0, alerts: 0, lat: 40.7128, lng: -74.0060 },
        { id: 'b2', name: 'Green Tower', address: '456 Eco Street, San Francisco, CA', efficiency: 0, occupancy: 0, alerts: 0, lat: 37.7749, lng: -122.4194 },
        { id: 'b3', name: 'Tech Hub Center', address: '789 Innovation Dr, Austin, TX', efficiency: 0, occupancy: 0, alerts: 0, lat: 30.2672, lng: -97.7431 },
        { id: 'b4', name: 'Sustainable Heights', address: '321 Green Rd, Seattle, WA', efficiency: 0, occupancy: 0, alerts: 0, lat: 47.6062, lng: -122.3321 }
    ]
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

/* ─── KPI Card Definitions ─── */
const kpiCards = [
    {
        id: 'consumption',
        label: 'TOTAL ENERGY CONSUMPTION',
        mainValue: '45,850',
        mainUnit: 'kWh + therms YTD',
        splits: [
            { label: 'Electricity', value: '40,300 kWh', color: 'var(--accent-green)' },
            { label: 'Gas', value: '5,550 therms', color: '#f97316' },
        ],
        trend: -4.2,
        icon: Zap,
        color: 'var(--accent-green)',
        sparkData: sparkConsumption,
        sparkColor: 'var(--accent-green)',
    },
    {
        id: 'cost',
        label: 'TOTAL ENERGY COST',
        mainValue: '$15,950',
        mainUnit: 'YTD',
        splits: [
            { label: 'Electricity', value: '$9,050', color: 'var(--accent-green)' },
            { label: 'Gas', value: '$6,900', color: '#f97316' },
        ],
        trend: -2.8,
        icon: DollarSign,
        color: '#ef4444',
        sparkData: sparkCost,
        sparkColor: '#ef4444',
    },
    {
        id: 'savings',
        label: 'TOTAL ENERGY SAVINGS',
        mainValue: '$15,200',
        mainUnit: 'since implementation',
        splits: [],
        trend: 18.5,
        icon: TrendingDown,
        color: '#eab308',
        sparkData: sparkSavings,
        sparkColor: '#eab308',
    },
    {
        id: 'emissions',
        label: 'TOTAL CARBON EMISSIONS',
        mainValue: '12.6',
        mainUnit: 'tons CO₂ YTD',
        splits: [
            { label: 'Electricity', value: '8.2t', color: '#a78bfa' },
            { label: 'Gas', value: '4.4t', color: '#f97316' },
        ],
        trend: -6.1,
        icon: Leaf,
        color: '#f97316',
        sparkData: sparkEmissions,
        sparkColor: '#f97316',
    },
    {
        id: 'reduced',
        label: 'TOTAL EMISSIONS REDUCED',
        mainValue: '3.6',
        mainUnit: 'tons CO₂ saved',
        splits: [],
        trend: 22.3,
        icon: BarChart3,
        color: '#a78bfa',
        sparkData: sparkReduced,
        sparkColor: '#a78bfa',
    },
    {
        id: 'efficiency',
        label: 'COMFORT RATING',
        mainValue: '88',
        mainUnit: 'portfolio score (0–100)',
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

/* ═══════════════════════════════════════════
   PortfolioView Component
   ═══════════════════════════════════════════ */
import { useNavigate } from 'react-router-dom';

const PortfolioView = () => {
    const navigate = useNavigate();
    const [activeAlertsMenu, setActiveAlertsMenu] = useState(null);
    const [isBuildingOpen, setIsBuildingOpen] = useState(false);
    const [selectedBuilding, setSelectedBuilding] = useState('All Buildings');
    const [activeModal, setActiveModal] = useState(null);
    const [savingsPeriod, setSavingsPeriod] = useState('ytd');
    const [showCalendar, setShowCalendar] = useState(false);
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');
    const [hoveredArc, setHoveredArc] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [activeMapBuilding, setActiveMapBuilding] = useState(null);
    const [mapSearch, setMapSearch] = useState('');
    const [yoyMode, setYoyMode] = useState('Since Installation');
    const handleArcMouseMove = (e) => {
        setMousePos({ x: e.clientX, y: e.clientY });
    };

    // Map bindings
    const activeBuildingList = mapBuildingsByPeriod[savingsPeriod];
    const filteredBuildings = activeBuildingList.filter(b => b.name.toLowerCase().includes(mapSearch.toLowerCase()) || b.address.toLowerCase().includes(mapSearch.toLowerCase()));

    // Per-building per-month variation factors (each row = 12 unique monthly multipliers)
    // These create distinctly different chart shapes per building, not just uniform scaling
    const buildingVariations = {
        'All Buildings': null, // use raw data as-is
        'North Tower': {
            base: 0.28,
            // monthly factors: each month varies independently (0.7 to 1.3 relative to base)
            elec: [0.85, 1.12, 0.72, 1.28, 0.94, 0.68, 1.15, 1.32, 0.78, 1.05, 0.88, 1.22],
            gas:  [1.18, 0.76, 1.05, 0.82, 1.30, 0.91, 0.74, 1.15, 1.25, 0.70, 1.08, 0.95],
            sav:  [0.92, 1.25, 0.70, 1.18, 0.84, 1.35, 0.78, 0.95, 1.28, 1.10, 0.72, 1.05],
            em:   [1.10, 0.82, 1.25, 0.75, 1.15, 0.88, 1.30, 0.72, 0.95, 1.20, 0.80, 1.05],
        },
        'South Center': {
            base: 0.23,
            elec: [1.25, 0.78, 1.10, 0.68, 1.32, 0.85, 0.72, 1.18, 0.92, 1.28, 0.75, 1.05],
            gas:  [0.72, 1.28, 0.88, 1.15, 0.70, 1.22, 1.05, 0.80, 1.30, 0.92, 1.12, 0.75],
            sav:  [1.30, 0.72, 1.15, 0.88, 0.75, 1.25, 1.10, 0.68, 0.95, 1.32, 0.82, 1.20],
            em:   [0.78, 1.22, 0.70, 1.30, 0.95, 0.82, 1.18, 1.05, 0.72, 1.10, 1.28, 0.85],
        },
        'West Complex': {
            base: 0.19,
            elec: [0.70, 1.30, 0.92, 1.05, 0.78, 1.22, 0.85, 0.72, 1.28, 0.88, 1.15, 0.68],
            gas:  [1.28, 0.85, 1.20, 0.72, 1.10, 0.78, 1.30, 0.92, 0.70, 1.25, 0.82, 1.15],
            sav:  [0.75, 1.18, 0.82, 1.30, 1.05, 0.70, 0.92, 1.25, 0.78, 0.88, 1.32, 1.10],
            em:   [1.20, 0.75, 1.30, 0.88, 0.72, 1.15, 0.82, 1.28, 1.05, 0.70, 0.95, 1.22],
        },
        'East Wing': {
            base: 0.30,
            elec: [1.15, 0.70, 1.28, 0.92, 0.82, 1.05, 1.30, 0.78, 0.85, 1.22, 0.72, 1.18],
            gas:  [0.82, 1.22, 0.70, 1.28, 0.95, 1.10, 0.75, 1.30, 0.88, 1.05, 0.72, 1.15],
            sav:  [1.18, 0.85, 1.30, 0.72, 1.10, 0.78, 1.25, 0.70, 1.05, 0.92, 1.28, 0.82],
            em:   [0.88, 1.15, 0.78, 1.22, 1.05, 0.72, 1.10, 0.82, 1.30, 0.75, 1.25, 0.95],
        },
    };

    const bv = buildingVariations[selectedBuilding];
    const scaleVal = (v) => bv ? Math.round(v * bv.base) : v;
    const scaleArr = (arr, variationKey) => {
        if (!bv) return arr; // All Buildings — raw data
        return arr.map((d, i) => {
            const out = { ...d };
            const vElec = bv.elec[i % bv.elec.length];
            const vGas = bv.gas[i % bv.gas.length];
            const vSav = (variationKey === 'sav' ? bv.sav : bv.em)[i % 12];
            if (out.elec !== undefined) out.elec = Math.round(out.elec * bv.base * vElec);
            if (out.gas !== undefined) out.gas = Math.round(out.gas * bv.base * vGas);
            if (out.total !== undefined) out.total = (out.elec || 0) + (out.gas || 0);
            if (out.val !== undefined) out.val = +(out.val * bv.base * vSav).toFixed(1);
            if (out.emissions !== undefined) out.emissions = +(out.emissions * bv.base * vSav).toFixed(1);
            if (out.reduced !== undefined) out.reduced = +(out.reduced * bv.base * vSav).toFixed(1);
            return out;
        });
    };

    // Pull period-synced data (with per-building variation)
    // Per-building elec/gas ratio skew — changes the arc proportions
    const arcSkew = {
        'All Buildings': { elecFactor: 1, gasFactor: 1 },
        'North Tower':  { elecFactor: 0.88, gasFactor: 1.14 },  // gas-heavy
        'South Center': { elecFactor: 1.10, gasFactor: 0.85 },  // elec-heavy
        'West Complex':  { elecFactor: 0.95, gasFactor: 1.08 },  // slightly gas-heavy
        'East Wing':    { elecFactor: 1.22, gasFactor: 0.75 },  // very elec-heavy
    };
    const sk = arcSkew[selectedBuilding] || { elecFactor: 1, gasFactor: 1 };
    const rawArc = arcDataByPeriod[savingsPeriod];
    const elecVal = scaleVal(Math.round(rawArc.elec * sk.elecFactor));
    const gasVal = scaleVal(Math.round(rawArc.gas * sk.gasFactor));
    const totalEnergy = elecVal + gasVal;
    const elecPct = elecVal / totalEnergy;
    
    // SVG arc from PI to 0. Intersection angle in radians:
    const intersectionAngle = Math.PI * (1 - elecPct);
    const intX = 120 + 80 * Math.cos(intersectionAngle);
    const intY = 120 - 80 * Math.sin(intersectionAngle);

    const activeTrendData = scaleArr(trendDataByPeriod[savingsPeriod], 'trend');
    const activeEmissionsData = scaleArr(emissionsDataByPeriod[savingsPeriod], 'em');
    const activeSavingsBreakdown = scaleArr(savingsBreakdownByPeriod[savingsPeriod], 'sav');
    const rawEff = efficiencyByPeriod[savingsPeriod];
    const effOffsets = { 'All Buildings': 0, 'North Tower': 0, 'South Center': -3, 'West Complex': -9, 'East Wing': 4 };
    const activeEfficiency = {
        score: Math.min(100, Math.max(0, rawEff.score + (effOffsets[selectedBuilding] || 0))),
        buildings: rawEff.buildings
    };
    const rawSavTotal = savingsTotalByPeriod[savingsPeriod];
    const activeSavingsTotal = rawSavTotal === '—' ? '—' : '$' + scaleVal(parseFloat(rawSavTotal.replace(/[^\d.]/g, ''))).toLocaleString();

    const emBase = { '24h': 16.4, '7d': 45.1, '1m': 182.5, 'ytd': 685.2, 'custom': 0 };
    const activeEmissionsTotal = emBase[savingsPeriod] === 0 ? '—' : (bv ? (emBase[savingsPeriod] * bv.base).toFixed(1) : emBase[savingsPeriod].toFixed(1));

    const buildingOptions = ['All Buildings', 'North Tower', 'South Center', 'West Complex', 'East Wing'];
    const savingsPeriods = [
        { key: '24h', label: '24 Hours' },
        { key: '7d', label: '7 Days' },
        { key: '1m', label: '1 Month' },
        { key: 'ytd', label: 'YTD' },
    ];

    const baseSavings = {
        '24h': { elec: 128, gas: 42, money: 340, elecTrend: -2.1, gasTrend: -3.4, moneyTrend: 5.8 },
        '7d':  { elec: 890, gas: 295, money: 2370, elecTrend: -3.5, gasTrend: -4.1, moneyTrend: 8.2 },
        '1m':  { elec: 3820, gas: 1260, money: 5480, elecTrend: -5.2, gasTrend: -6.8, moneyTrend: 12.4 },
        'ytd': { elec: 12450, gas: 4180, money: 15200, elecTrend: -4.2, gasTrend: -5.9, moneyTrend: 18.5 },
        'custom': { elec: 0, gas: 0, money: 0, elecTrend: 0, gasTrend: 0, moneyTrend: 0 },
    };
    const rawSd = baseSavings[savingsPeriod];
    const sd = {
        elec: rawSd.elec === 0 ? '—' : scaleVal(rawSd.elec).toLocaleString(),
        gas: rawSd.gas === 0 ? '—' : scaleVal(rawSd.gas).toLocaleString(),
        money: rawSd.money === 0 ? '—' : '$' + scaleVal(rawSd.money).toLocaleString(),
        elecTrend: rawSd.elecTrend, gasTrend: rawSd.gasTrend, moneyTrend: rawSd.moneyTrend,
        elecUnit: 'kWh saved', gasUnit: 'therms saved', moneyUnit: 'saved',
    };
    const savingsCards = [
        { label: 'ELECTRICITY SAVINGS', value: sd.elec, unit: sd.elecUnit, trend: sd.elecTrend, accentColor: 'var(--accent-green)' },
        { label: 'GAS SAVINGS', value: sd.gas, unit: sd.gasUnit, trend: sd.gasTrend, accentColor: '#f97316' },
        { label: 'MONETARY SAVINGS', value: sd.money, unit: sd.moneyUnit, trend: sd.moneyTrend, accentColor: '#eab308' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>



            {/* ═══ Section 1 — Savings Cards with Period Selector ═══ */}
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {savingsCards.map((card) => (
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
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: card.trend > 0 ? 'var(--accent-green)' : card.trend < 0 ? 'var(--accent-green)' : 'var(--text-muted)' }}>
                                {card.trend > 0 ? '+' : ''}{card.trend}%
                            </span>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>vs prior period</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Interactive Portfolio Map & Building Registry */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 380px) 1fr', gap: '1.5rem', height: '600px' }}>
                {/* Building Registry (Left) */}
                <div className="glass-card" style={{ padding: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    
                    {/* Search Input Container */}
                    <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-light)' }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            background: 'var(--bg-input)', border: '1px solid var(--border-light)',
                            padding: '0.75rem 1rem', borderRadius: '8px', color: 'var(--text-secondary)'
                        }}>
                            <Search size={16} />
                            <input 
                                type="text" 
                                placeholder="Search buildings..." 
                                value={mapSearch}
                                onChange={(e) => setMapSearch(e.target.value)}
                                style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none', fontSize: '0.9rem' }}
                            />
                        </div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '1.5rem', color: '#fff' }}>Buildings</h3>
                    </div>

                    {/* Scrollable List */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {filteredBuildings.map((b) => (
                            <div 
                                key={b.id}
                                onMouseEnter={() => setActiveMapBuilding(b.id)}
                                onMouseLeave={() => setActiveMapBuilding(null)}
                                style={{ 
                                    padding: '1.25rem', 
                                    border: '1px solid var(--border-light)', 
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    background: activeMapBuilding === b.id ? 'var(--bg-card-hover)' : 'var(--bg-input)',
                                    boxShadow: activeMapBuilding === b.id ? '0 0 16px rgba(255,255,255,0.05)' : 'none',
                                    transition: 'background 0.2s, box-shadow 0.2s, transform 0.2s',
                                    transform: activeMapBuilding === b.id ? 'translateY(-2px)' : 'none',
                                    display: 'flex', flexDirection: 'column', gap: '1rem'
                                }}
                            >
                                {/* Header Row */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                        <span style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff' }}>{b.name}</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{b.address}</span>
                                    </div>
                                    {b.alerts > 0 && (
                                        <div style={{ position: 'relative' }}>
                                            <button 
                                                onClick={() => setActiveAlertsMenu(activeAlertsMenu === b.id ? null : b.id)}
                                                style={{ 
                                                    padding: '0.25rem 0.5rem', background: 'rgba(239, 68, 68, 0.1)', 
                                                    border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '4px',
                                                    color: '#ef4444', fontSize: '0.7rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem',
                                                    cursor: 'pointer'
                                                }}>
                                                ⚠️ {b.alerts} Alert{b.alerts > 1 ? 's' : ''}
                                            </button>
                                            {activeAlertsMenu === b.id && (
                                                <div style={{
                                                    position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem',
                                                    background: '#111827', border: '1px solid var(--border-light)',
                                                    borderRadius: '8px', padding: '0.75rem', width: '220px',
                                                    zIndex: 50, boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                                                }}>
                                                    <div style={{ fontSize: '0.75rem', color: '#fff', marginBottom: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                                                            <span style={{ color: '#ef4444' }}>●</span> HVAC Filter Mismatch
                                                        </div>
                                                        {b.alerts > 1 && (
                                                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                                                                <span style={{ color: '#f97316' }}>●</span> Security Override Active
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button 
                                                        onClick={() => navigate('/building', { state: { selectedBuilding: b.name, activeTab: 'status' } })}
                                                        style={{
                                                            width: '100%', padding: '0.4rem', background: 'var(--accent-green)',
                                                            color: '#000', border: 'none', borderRadius: '4px', fontWeight: 600,
                                                            fontSize: '0.75rem', cursor: 'pointer', marginTop: '0.5rem'
                                                        }}
                                                    >
                                                        View Dashboard
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Metrics Row */}
                                <div style={{ display: 'flex', gap: '2rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Efficiency</span>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-green)' }}>{b.efficiency}%</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Occupancy</span>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#a855f7' }}>{b.occupancy}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Leaflet Slippy Map (Right) */}
                <div className="glass-card" style={{ position: 'relative', overflow: 'hidden', padding: 0, border: '1px solid var(--border-light)' }}>
                    <MapContainer 
                        center={[39.8283, -98.5795]} 
                        zoom={4} 
                        zoomControl={true}
                        scrollWheelZoom={true}
                        style={{ width: '100%', height: '100%', background: 'var(--bg-card)' }}
                    >
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        />
                        {activeBuildingList.map((b) => (
                            <Marker 
                                key={`lf-marker-${b.id}`}
                                position={[b.lat, b.lng]}
                                icon={createPulseIcon(activeMapBuilding === b.id, b.alerts)}
                                eventHandlers={{
                                    mouseover: () => setActiveMapBuilding(b.id),
                                    mouseout: () => setActiveMapBuilding(null),
                                }}
                            >
                                <Popup className="custom-dark-popup">
                                    <div style={{ padding: '0.4rem 0.2rem', minWidth: '180px' }}>
                                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#fff' }}>{b.name}</h4>
                                        <p style={{ margin: '0.3rem 0 0.5rem 0', fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>{b.address}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem' }}>
                                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: b.alerts > 0 ? '#ef4444' : '#4ade80', boxShadow: `0 0 6px ${b.alerts > 0 ? '#ef4444' : '#4ade80'}88` }} />
                                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: b.alerts > 0 ? '#ef4444' : '#4ade80' }}>
                                                Status: {b.alerts > 0 ? 'Warning' : 'Optimal'}
                                            </span>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
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
                                {/* Since Installation Summary Cards */}
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
                                                <linearGradient id="yoyCumElec" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="var(--accent-green)" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="var(--accent-green)" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="yoyCumGas" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.06)" vertical={false} />
                                            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: 'var(--text-secondary)' }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 13, fill: 'var(--text-secondary)' }} />
                                            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ background: 'var(--bg-input)', border: 'none', borderRadius: '12px', fontSize: '0.9rem' }} formatter={(v, n) => [`${v}%`, n === 'electricity' ? 'Electricity' : 'Gas']} />
                                            <Area type="monotone" dataKey="electricity" stroke="var(--accent-green)" strokeWidth={2.5} fillOpacity={1} fill="url(#yoyCumElec)" />
                                            <Area type="monotone" dataKey="gas" stroke="#f97316" strokeWidth={2.5} fillOpacity={1} fill="url(#yoyCumGas)" />
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
                    modalTotal = sd.elec;
                    modalUnit = 'kWh saved this period';
                    scaleFactor = 0.8;
                } else if (isGas) {
                    modalColor = '#f97316';
                    modalTotal = sd.gas;
                    modalUnit = 'therms saved this period';
                    scaleFactor = 0.25;
                } else {
                    modalPrefix = '$';
                }

                const chartData = activeSavingsBreakdown.map(d => ({
                    month: d.month,
                    val: Math.round(d.val * scaleFactor)
                }));

                // If not monetary, strip the string of non-numeric except dot/comma and prepend prefix
                const displayTotal = activeModal === 'MONETARY SAVINGS' 
                    ? modalTotal 
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


        </div >
    );
};

export default PortfolioView;
