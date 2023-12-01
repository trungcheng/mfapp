import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { MediaProvider } from './context/MediaContext';

const widgetName = 'MyMediaWidget';

const Widget = {
    init: (container, config) => {
        ReactDOM.render(
            <MediaProvider>
                <App />
            </MediaProvider>,
            container
        );
    },
};

// Assign the widget to the dynamically determined global variable name
window[widgetName] = Widget;

export default Widget;
