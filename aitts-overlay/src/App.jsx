import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <div className="logoContainer">
        <img src="https://i.ibb.co/yg3Ytfm/aaaaaasasdasda.png" className="logo"></img>
      </div>
      <div className="ttsContainer">
      <p className="ttsTitle">AITTS - Marcey____</p>
      <div className="ttsDescriptionContainer">
      <p className="ttsText"><span className="ttsVoice">Sandy: </span>Lutsch mir meine Klöten Kanyuji! Was denkst du wer du bist? 
      <span className="ttsVoice"> Spongebob: </span>Der ist ja voll der Hurensohn hahahahaha der denkt auch er ist maincharacter</p>
      </div>
      </div>
    </div>
  )
}

export default App
