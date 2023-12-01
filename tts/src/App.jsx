import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SideNav from './default/SideNav'
import HeadNav from './default/HeadNav'
import Title from './components/Title'
import Enabling from './components/Enabling'
import Settings from './components/Settings'

function App() {

  return (
    <div>
      <SideNav />
      <div className="content">
        <Title />
        <Enabling />
        <Settings />
      </div>
    </div>
  )
}

export default App
