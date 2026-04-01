import React from 'react';
import { campaignData } from '../data/mockData';
import './PremiumComponents.css';

const CampaignBarChart = () => {
    const maxVal = Math.max(...campaignData.map(c => c.outreach));

    return (
        <div className="glass-panel chart-panel">
            <div className="chart-header-row">
                <div>
                    <h2 className="premium-title">Dynamic Segmentation</h2>
                    <p className="premium-subtitle">Outreach volume by segment</p>
                </div>
            </div>

            <div className="bar-chart-container">
                {campaignData.map((campaign, idx) => {
                    const percentage = (campaign.outreach / maxVal) * 100;
                    return (
                        <div className="bar-row" key={campaign.id}>
                            <div className="bar-label">
                                <span className="bar-name">{campaign.name}</span>
                                <span className="bar-value">{campaign.outreach.toLocaleString()}</span>
                            </div>
                            <div className="bar-track">
                                <div
                                    className="bar-fill"
                                    style={{
                                        width: `${percentage}%`,
                                        background: campaign.color || 'var(--accent-primary)',
                                        animationDelay: `${idx * 0.15}s`
                                    }}
                                >
                                    <div className="bar-glow"></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CampaignBarChart;
