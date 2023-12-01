import React from 'react'

const List = () => {

    const onTimerObjectClick = (event) => {
        const clickedObject = event.currentTarget;
        let timerObjectSettings = clickedObject.querySelector(".timerObjectSettings");
        timerObjectSettings.classList.toggle("open");
        if(timerObjectSettings.classList.contains("open")){
            clickedObject.style.height = "17vh";
        } else clickedObject.style.height = "6vh";
    }

  return (
    <div>
        <ul className="timerList">
        <li className="timerObject" onClick={onTimerObjectClick}>
                <div className="timerObjectDefault">

                </div>
                <div className="timerObjectSettings">

                </div>
            </li>
            <li className="timerObject" onClick={onTimerObjectClick}>
                <div className="timerObjectDefault">

                </div>
                <div className="timerObjectSettings">

                </div>
            </li>
            
        </ul>
    </div>
  )
}

export default List