
import React from 'react';
import { Tab } from '../types';

interface TabsProps {
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
    const tabs = Object.values(Tab);

    return (
        <div className="flex border-b border-gray-700">
            {tabs.map((tab, index) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 px-6 text-lg font-semibold transition-colors duration-300 ${
                        activeTab === tab
                            ? 'border-b-2 border-cyan-400 text-cyan-400'
                            : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                    } ${index === 0 ? 'rounded-tl-lg' : ''} ${index === tabs.length - 1 ? 'rounded-tr-lg' : ''}`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};

export default Tabs;
