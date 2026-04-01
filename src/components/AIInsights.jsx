import React from 'react';
import './PremiumComponents.css';

const AIInsights = () => {
    const insights = [
        { icon: "💡", text: "Food Manufacturers campaign has a 13.6% higher response rate than average. Scaling is recommended.", type: "positive" },
        { icon: "⚠️", text: "Reddit Posts channel showing elevated bounce rate. Consider optimizing landing page.", type: "warning" },
        { icon: "🚀", text: "Predicting 15 new booked meetings next week based on current MQL velocity.", type: "neutral" }
    ];

    return (
        <div className="glass-panel insights-panel">
            <div className="chart-header-row" style={{ marginBottom: '16px' }}>
                <h2 className="premium-title" style={{ background: 'linear-gradient(90deg, #ec4899, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    ✨ NexGen AI Insights
                </h2>
            </div>
            <div className="insights-list">
                {insights.map((insight, i) => (
                    <div className="insight-card" key={i}>
                        <div className="insight-icon">{insight.icon}</div>
                        <p>{insight.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AIInsights;
