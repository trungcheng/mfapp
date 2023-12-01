import React from 'react';
import Widget1 from './modules/widget-1';
import Widget2 from './modules/widget-2';
import { useMediaConfig } from './context/MediaContext';

import './App.css';

const App = () => {
    const { config } = useMediaConfig();

    return (
        <div className="app">
            <h1>Media Widget</h1>
            <div>
                <h2>Widget1</h2>
                <Widget1 />
            </div>
            <div>
                <h2>Widget2</h2>
                <Widget2 />
            </div>
        </div>
    );
};

export default App;
