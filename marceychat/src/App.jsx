import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Tabs from './components/Tabs'
import TabAdd from './components/TabAdd'
import Chat from './components/Chat'

function App() {

  return (
    <>
      <Tabs />
      <TabAdd />
    </>
  )
}

export default App
