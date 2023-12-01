import { useState } from 'react'
import './App.css'
import SideNav from './components/SideNav'
import Offers from './components/Offers'

function App() {

  return (
    <div>
      <SideNav />
      <div className="content">
        <Offers />
      </div>
    </div>
  )
}

export default App
