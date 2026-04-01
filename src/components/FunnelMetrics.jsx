import React from 'react';
import './FunnelMetrics.css';

const FunnelStep = ({ label, value, percentage, color, delay }) => (
    <div className={`funnel-step animate-fade-in delay-${delay}`}>
        <div className="funnel-bar-container">
            <div
                className="funnel-bar"
                style={{
                    width: `${percentage}%`,
                    background: color,
                }}
            >
                <div className="funnel-value">{value.toLocaleString()}</div>
            </div>
        </div>
        <div className="funnel-label">
            <span>{label}</span>
            <span className="funnel-percentage">{percentage}%</span>
        </div>
    </div>
);

const FunnelMetrics = ({ metrics }) => {
    const steps = [
        { label: 'Outreach Attempts', value: metrics.totalOutreach, color: 'rgba(59, 130, 246, 0.8)' },
        { label: 'Responses', value: metrics.totalResponses, color: 'rgba(139, 92, 246, 0.8)' },
        { label: 'MQLs', value: metrics.totalMQLs, color: 'rgba(245, 158, 11, 0.8)' },
        { label: 'SQLs', value: metrics.totalSQLs, color: 'rgba(239, 68, 68, 0.8)' },
        { label: 'Booked Meetings', value: metrics.totalMeetings, color: 'rgba(16, 185, 129, 0.9)' },
    ];

    const maxVal = steps[0].value;

    return (
        <div className="glass-panel funnel-container animate-fade-in delay-300">
            <div className="funnel-header">
                <h2 className="funnel-title">Conversion Funnel</h2>
                <span className="funnel-subtitle">Overall Campaign Performance</span>
            </div>

            <div className="funnel-body">
                {steps.map((step, index) => {
                    const percentage = ((step.value / maxVal) * 100).toFixed(1);
                    return (
                        <FunnelStep
                            key={step.label}
                            label={step.label}
                            value={step.value}
                            percentage={percentage}
                            color={step.color}
                            delay={300 + (index * 100)}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default FunnelMetrics;
