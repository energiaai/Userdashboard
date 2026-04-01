import React, { useState, useRef, useEffect } from 'react';
import './CampaignSelector.css';

const CampaignSelector = ({ campaigns, selectedId, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const allOption = { id: 'all', name: 'All Email Campaigns', color: '#fff' };

    const options = [allOption, ...campaigns];
    const selectedOption = options.find(o => o.id === selectedId) || allOption;

    return (
        <div className="campaign-selector" ref={dropdownRef}>
            <div
                className={`selector-trigger ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="selector-value">
                    {selectedOption.id !== 'all' && (
                        <span className="campaign-dot" style={{ background: selectedOption.color, boxShadow: `0 0 8px ${selectedOption.color}` }}></span>
                    )}
                    <span>{selectedOption.name}</span>
                </div>
                <div className="selector-icon">▼</div>
            </div>

            {isOpen && (
                <div className="selector-menu animate-fade-in">
                    {options.map((option) => (
                        <div
                            key={option.id}
                            className={`selector-option ${selectedId === option.id ? 'active' : ''}`}
                            onClick={() => {
                                onChange(option.id);
                                setIsOpen(false);
                            }}
                        >
                            {option.id !== 'all' && (
                                <span className="campaign-dot" style={{ background: option.color }}></span>
                            )}
                            {option.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CampaignSelector;
