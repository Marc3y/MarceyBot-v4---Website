import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SideNav from '../../dashboard/src/default/SideNav'
import HeadNav from '../../dashboard/src/default/HeadNav'
import Title from './components/Title'
import List from './components/List'

function App() {

  return (
    <>
      <SideNav />
      <div className="content">
        <Title />
        <List />
      </div>
    </>
  )
}

export default App
