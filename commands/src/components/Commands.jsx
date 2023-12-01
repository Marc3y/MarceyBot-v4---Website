import React from 'react'


const Commands = () => {
  const changeRole = () => {
    run();
    function run(){
      
    }
  };

  return (
    <div>
        <div className="statusContainer">
          <i className='statusCheck bx bx-check'></i>
          <div className="status">Command wird gespeichert...</div>
          <div className="statusLine" />
        </div>
        <button className="addCommandButton">Command hinzufügen</button>
        <ul className="commandList">
            
        </ul>
    </div>
  )
}

export default Commands