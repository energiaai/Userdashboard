import React, { useEffect, useState } from 'react';
import { timeSeriesData } from '../data/mockData';
import './PremiumComponents.css';

const PremiumAreaChart = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const maxVal = Math.max(...timeSeriesData.map(d => d.outreach)) * 1.1; // Add 10% padding top

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const generatePoints = (key) => {
        return timeSeriesData.map((d, i) => {
            const x = (i / (timeSeriesData.length - 1)) * 100;
            const y = 100 - (d[key] / maxVal) * 100;
            return `${x},${y}`;
        }).join(' ');
    };

    const outreachPoints = generatePoints('outreach');
    const responsePoints = generatePoints('responses');

    const outreachArea = `0,100 ${outreachPoints} 100,100`;
    const responseArea = `0,100 ${responsePoints} 100,100`;

    return (
        <div className="glass-panel chart-panel" style={{ height: '380px' }}>
            <div className="chart-header-row">
                <div>
                    <h2 className="premium-title">Engagement Velocity</h2>
                    <p className="premium-subtitle">Outreach vs Responses over the last 7 days</p>
                </div>
                <div className="chart-legend">
                    <div className="legend-item"><span className="dot dot-outreach"></span> Outreach</div>
                    <div className="legend-item"><span className="dot dot-response"></span> Responses</div>
                </div>
            </div>

            <div className="svg-container">
                {isLoaded && (
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="premium-svg">
                        <defs>
                            <linearGradient id="gradOutreach" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id="gradResponse" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="var(--accent-success)" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="var(--accent-success)" stopOpacity="0" />
                            </linearGradient>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Grid lines */}
                        {[0, 25, 50, 75, 100].map(line => (
                            <line key={`grid-${line}`} x1="0" y1={line} x2="100" y2={line} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                        ))}

                        {/* Areas */}
                        <polygon points={outreachArea} fill="url(#gradOutreach)" className="animated-area" />
                        <polygon points={responseArea} fill="url(#gradResponse)" className="animated-area delay-1" />

                        {/* Lines */}
                        <polyline points={outreachPoints} fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" filter="url(#glow)" className="animated-line" />
                        <polyline points={responsePoints} fill="none" stroke="var(--accent-success)" strokeWidth="1.5" filter="url(#glow)" className="animated-line delay-1" />

                        {/* Data Points (Dots) */}
                        {timeSeriesData.map((d, i) => {
                            const x = (i / (timeSeriesData.length - 1)) * 100;
                            const yOut = 100 - (d.outreach / maxVal) * 100;
                            const yRes = 100 - (d.responses / maxVal) * 100;
                            return (
                                <g key={`points-${i}`}>
                                    <circle cx={x} cy={yOut} r="1.5" fill="var(--bg-dark)" stroke="var(--accent-primary)" strokeWidth="0.8" className="animated-area delay-1" />
                                    <circle cx={x} cy={yRes} r="1.5" fill="var(--bg-dark)" stroke="var(--accent-success)" strokeWidth="0.8" className="animated-area delay-1" />
                                </g>
                            );
                        })}
                    </svg>
                )}

                <div className="x-axis">
                    {timeSeriesData.map(d => (
                        <span key={d.name}>{d.name}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PremiumAreaChart;
