import React from 'react'

const Enabling = () => {
  return (
    <div className="titleContainer">
    <div className="notActivated">
    <p className="notActivatedText">Du hast Text-to-Speech nicht aktiviert. Aktiviere TTS um das Feature
        nutzen zu können.</p>
        <button className="activateButton cleanButton">Aktivieren</button>
    </div>
    </div>
  )
}

export default Enabling