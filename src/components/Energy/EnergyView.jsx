import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Zap, Activity } from 'lucide-react';

const mockDemandData = [
    { time: '00:00', b1: 120, b2: 90 }, { time: '04:00', b1: 110, b2: 85 },
    { time: '08:00', b1: 450, b2: 320 }, { time: '12:00', b1: 600, b2: 480 },
    { time: '16:00', b1: 580, b2: 450 }, { time: '20:00', b1: 200, b2: 150 },
];

const EnergyDashboard = () => {
    const [activeTimeframe, setActiveTimeframe] = useState('week');
    const [activeHistoryTab, setActiveHistoryTab] = useState('historical');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>

            {/* Compare Selector */}
            <div className="glass-card" style={{ flexDirection: 'row', gap: '1.5rem', alignItems: 'center', padding: '1.5rem 2rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Compare Buildings:</h3>
                <select style={{ padding: '0.6rem 1.2rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '1rem', outline: 'none', cursor: 'pointer' }}>
                    <option>North Tower</option>
                    <option>West Complex</option>
                </select>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>vs</span>
                <select style={{ padding: '0.6rem 1.2rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '1rem', outline: 'none', cursor: 'pointer' }}>
                    <option>South Center</option>
                    <option>East Wing</option>
                </select>
            </div>

            {/* Live Demand Graph */}
            <div className="glass-card">
                <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem' }}>
                    <Activity size={18} color="var(--accent-green)" /> Live Energy Demand (kW)
                </h3>
                <div style={{ height: '350px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockDemandData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="time" axisLine={false} tickLine={false} dy={10} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip cursor={false} contentStyle={{ borderRadius: '12px', border: 'none', background: 'var(--bg-input)', color: 'white' }} />
                            <Legend wrapperStyle={{ paddingTop: '1rem' }} />
                            <Line type="monotone" dataKey="b1" name="North Tower" stroke="var(--accent-green)" strokeWidth={3} dot={{ r: 4, fill: '#000' }} activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="b2" name="South Center" stroke="var(--accent-blue)" strokeWidth={3} dot={{ r: 4, fill: '#000' }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Historical Data */}
            <div className="glass-card" style={{ paddingBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                    <button style={{ background: activeHistoryTab === 'historical' ? 'var(--bg-input)' : 'transparent', color: activeHistoryTab === 'historical' ? 'var(--accent-green)' : 'var(--text-secondary)', border: 'none', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', cursor: 'pointer' }} onClick={() => setActiveHistoryTab('historical')}>Historical</button>
                    <button style={{ background: activeHistoryTab === 'projected' ? 'var(--bg-input)' : 'transparent', color: activeHistoryTab === 'projected' ? 'var(--accent-green)' : 'var(--text-secondary)', border: 'none', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', cursor: 'pointer' }} onClick={() => setActiveHistoryTab('projected')}>Projected</button>
                    <button style={{ background: activeHistoryTab === 'benchmarks' ? 'var(--bg-input)' : 'transparent', color: activeHistoryTab === 'benchmarks' ? 'var(--accent-green)' : 'var(--text-secondary)', border: 'none', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', cursor: 'pointer' }} onClick={() => setActiveHistoryTab('benchmarks')}>Benchmarks</button>
                </div>

                <div style={{ height: '350px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={mockDemandData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="time" axisLine={false} tickLine={false} dy={10} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ borderRadius: '12px', border: 'none', background: 'var(--bg-input)', color: 'white' }} />
                            <Legend wrapperStyle={{ paddingTop: '1rem' }} />
                            <Bar dataKey="b1" name="Usage (kWh)" fill="var(--accent-blue)" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default EnergyDashboard;
