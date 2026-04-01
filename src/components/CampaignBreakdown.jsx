import React from 'react';
import './CampaignBreakdown.css';

const CampaignBreakdown = ({ campaigns }) => {
    return (
        <div className="glass-panel breakdown-container animate-fade-in delay-200">
            <div className="breakdown-header">
                <h2 className="breakdown-title">Campaign Distribution</h2>
                <span className="breakdown-subtitle">By Outreach Volume</span>
            </div>

            <div className="breakdown-bar-container">
                {campaigns.map((campaign, index) => {
                    const percentage = ((campaign.outreach / 5250) * 100).toFixed(1); // 5250 is total outreach
                    return (
                        <div
                            key={campaign.id}
                            className="breakdown-segment"
                            style={{
                                width: `${percentage}%`,
                                background: campaign.gradient,
                                animationDelay: `${300 + (index * 150)}ms`
                            }}
                            title={`${campaign.name}: ${percentage}%`}
                        >
                            <div className="segment-tooltip">
                                <strong>{campaign.name}</strong>
                                <span>{percentage}%</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="breakdown-legend">
                {campaigns.map((campaign, index) => {
                    const percentage = ((campaign.outreach / 5250) * 100).toFixed(1);
                    return (
                        <div key={`legend-${campaign.id}`} className={`legend-item animate-slide-right delay-${300 + (index * 100)}`}>
                            <div className="legend-marker" style={{ background: campaign.gradient }}></div>
                            <div className="legend-info">
                                <span className="legend-name">{campaign.name}</span>
                                <span className="legend-value">{percentage}%</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CampaignBreakdown;
