import React, { createContext, useContext, useState } from 'react';

const MediaContext = createContext();

export const MediaProvider = ({ children }) => {
    const [config, setConfig] = useState({
        module: 'Widget1'
    });

    const updateConfig = (newConfig) => {
        setConfig((prevConfig) => ({ ...prevConfig, ...newConfig }));
    };

    return (
        <MediaContext.Provider value={{ config, updateConfig }}>
            {children}
        </MediaContext.Provider>
    );
};

export const useMediaConfig = () => {
    const context = useContext(MediaContext);

    if (!context) {
        throw new Error('useMediaConfig must be used within a MediaProvider');
    }

    return context;
};
