import React from "react";

const TabAdd = () => {

    const closeWindow = () => {
        let tabAddContainer = document.querySelector(".tabAddContainer");
        tabAddContainer.classList.remove("enabled");
    }

	return (
		<div className="tabAddContainer">
			<div className="shadow enabled" onClick={closeWindow}></div>
			<div className="centeredContainer">
				<div className="addTabWindow">
					<p className="addTabWindowTitle">Tab hinzufügen</p>
					<div className="withChannelName enabled">
                    <p className="channelNameDefault">Gebe den Kanalnamen an</p>
						<input
							className="channelNameInput"
							type="text"
						></input>
                    </div>
                    <button className="addTabButton">Hinzufügen</button>
				</div>
			</div>
		</div>
	);
};

export default TabAdd;
