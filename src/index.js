import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MediaProvider } from '@context/MediaContext';
import Dialog from '@ui/dialog';

import '@styles/global.scss';

const Widget = {
    init: (container, config) => {
        if (container) {
            const root = ReactDOM.createRoot(container);

            root.render(
                <MediaProvider>
                    <App config={config} />
                </MediaProvider>
            );
        } else {
            const dialogEl = document.createElement('div');
	        document.body.appendChild(dialogEl);

            const root = ReactDOM.createRoot(dialogEl);

            root.render(
                <MediaProvider>
                    <Dialog 
                        showModal={true} 
                        onClose={() => root.unmount(dialogEl)}
                    >
                        <App config={config} />
                    </Dialog>
                </MediaProvider>
            );
        }
    }
};

export default Widget;
