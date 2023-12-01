import React, { useEffect } from 'react'
import Stats from './components/Stats';
import Boxes from './components/Boxes';
import SideNav from './default/SideNav';
import HeadNav from './default/HeadNav';

const App = () => (
    <div>
        <SideNav />
        <div className="content">
            <HeadNav />
            <Stats />
            <Boxes />
        </div>
    </div>
);

export default App