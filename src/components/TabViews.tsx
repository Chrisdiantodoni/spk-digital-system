import React, { useState, ReactElement, useEffect } from 'react';

interface TabProps {
  label?: any;
  children: React.ReactNode;
}

interface TabViewsProps {
  children: ReactElement<TabProps>[];
}

const TabViews: React.FC<TabViewsProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div>
      <div className="flex-column justify-between text-primary-color cursor-pointer lg:flex">
        {children.map((child: ReactElement<TabProps>, index: number) => (
          <div
            key={index}
            className={` border-b  py-3  border-primary-color rounded-t-lg ${
              activeTab === index
                ? 'lg:border-b-0 lg:rounded-b-none lg:border-r lg:border-l lg:border-t  font-medium bg-primary-color lg:bg-transparent lg:text-primary-color lg:hover:bg-slate-100 hover:bg-indigo-800 text-white'
                : 'border-slate-300 hover:bg-slate-100'
            } text-center`}
            onClick={() => handleTabClick(index)}
            style={{ flex: 1 }}
          >
            {child.props.label}
          </div>
        ))}
      </div>
      <div>{children[activeTab].props.children}</div>
    </div>
  );
};

export default TabViews;
