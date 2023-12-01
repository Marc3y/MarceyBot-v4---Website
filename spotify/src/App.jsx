import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Content from './components/Content'
import Settings from './components/Settings'
import SideNav from './default/SideNav'
import HeadNav from './default/HeadNav'

function App() {

  return (
    <div>
      <SideNav />
      <div className="content">
        <HeadNav />
        <Content />
        <Settings />
      </div>
    </div>
  )
}

export default App
