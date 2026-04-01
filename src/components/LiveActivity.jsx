import React from 'react';
import './PremiumComponents.css';

const activities = [
    { time: '2m ago', action: 'Meeting Booked', details: 'John D. (Food Manufacturers)', status: 'success' },
    { time: '15m ago', action: 'New SQL', details: 'Sarah M. showed high intent', status: 'primary' },
    { time: '1h ago', action: 'Email Opened', details: 'Enterpryze Campaign', status: 'neutral' },
    { time: '2h ago', action: 'Campaign Launched', details: 'Tortilla Q3 Outreach', status: 'warning' },
];

const LiveActivity = () => {
    return (
        <div className="glass-panel activity-panel">
            <h2 className="premium-title" style={{ marginBottom: '24px' }}>Live Activity</h2>
            <div className="activity-timeline">
                {activities.map((act, i) => (
                    <div className="timeline-item" key={i} style={{ animationDelay: `${i * 0.2}s` }}>
                        <div className={`timeline-dot dot-${act.status === 'neutral' ? 'primary' : act.status}`}></div>
                        <div className="timeline-content">
                            <h4>{act.action}</h4>
                            <p>{act.details}</p>
                            <span className="time">{act.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LiveActivity;
