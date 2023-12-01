import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Content from './components/Content'
import SideNav from './default/SideNav'
import HeadNav from './default/HeadNav'

function App() {

  return (
    <div>
      <SideNav />
      <div className="content">
        <Content />
      </div>
    </div>
  )
}

export default App
