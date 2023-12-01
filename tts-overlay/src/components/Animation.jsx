import React from 'react'

const Animation = () => {

    const animationButton = () => {
        let animationContainer = document.querySelector(".animationContainer");
        let buttonContainer = document.querySelector(".buttonContainer");
        buttonContainer.classList.remove("enabled");
        animationContainer.classList.add("enabled");
        setTimeout(() => {
            animationContainer.classList.remove("enabled");
            setTimeout(() => {
                buttonContainer.classList.add("enabled");
            }, 1500);
        }, 5000);
    }

  return (
    <>
    <div className="animationContainer">
    <p className="title">lellolidk - TTS</p>
    <p className="description">Leck meine fetten Klöten was denkst du eigentlich wer du bist du scheiss bastard</p>
    </div>
    <div className="buttonContainer">
        <button onClick={animationButton}>Animation abspielen</button>
    </div>
    </>
  )
}

export default Animation