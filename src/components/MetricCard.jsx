import React from 'react';
import './MetricCard.css';

const MetricCard = ({ title, value, subtitle, icon, delay = 0, trend }) => {
    return (
        <div className={`glass-panel metric-card animate-fade-in delay-${delay}`}>
            <div className="metric-header">
                <div className="metric-title">{title}</div>
                {icon && <div className="metric-icon">{icon}</div>}
            </div>

            <div className="metric-content">
                <div className="metric-value">{value}</div>

                <div className="metric-footer">
                    {trend && (
                        <span className={`metric-trend ${trend > 0 ? 'positive' : 'negative'}`}>
                            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                        </span>
                    )}
                    {subtitle && <span className="metric-subtitle">{subtitle}</span>}
                </div>
            </div>

            <div className="metric-glow"></div>
        </div>
    );
};

export default MetricCard;
