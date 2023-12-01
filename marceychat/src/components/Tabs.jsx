import React from "react";

const Tabs = () => {

    const openTabAddWindow = () => {
        let tabAddContainer = document.querySelector(".tabAddContainer");
        tabAddContainer.classList.add("enabled");
    }

	return (
		<div>
			<ul className="tabList horizontal">
            <li className="tabElement" draggable="true"><div className="details">Marcey____</div></li>
            <li className="tabElement selected" draggable="true"><div className="details">Kanyuji</div></li>
            <li className="tabElement newMessages" draggable="true"><div className="details">lellolidk</div></li>
			<li className="tabAddElement" onClick={openTabAddWindow}><i className='bx bx-plus' /></li>
			</ul>
		</div>
	);
};

export default Tabs;
