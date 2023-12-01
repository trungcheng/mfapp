import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MediaProvider } from './context/MediaContext';

const widgetName = 'MediaWidget';

const Widget = {
    init: (container, config) => {
        const root = ReactDOM.createRoot(container);
        root.render(
            <MediaProvider>
                <App config={config} />
            </MediaProvider>
        );
    },
};

// Assign the widget to the dynamically determined global variable name
window[widgetName] = Widget;

export default Widget;
