import React from "react";

const HeadNav = () => {

	const onNotificationClick = () => {
		let notificationContainer = document.querySelector(".notificationContainer");
		notificationContainer.classList.toggle("enabled");
	}

	return (
		<div>
			<div className="headNavContainer bg-primary position-fixed w-full h-14">
				<i className="bx bxs-cog absolute right-0 text-xl pr-5 cursor-pointer headSettingAnimation"></i>
				<i className="bx bxs-bell absolute right-16 text-xl pr-2 cursor-pointer headSettingAnimation notification" onClick={onNotificationClick}></i>
				<span className="newNotificationSymbol enabled" onClick={onNotificationClick}></span>
			</div>
			<div className="notificationContainer">
				<ul className="notifications">
					<li
						className="notification"
						key={1}
					>
						<p className="notificationTitle">Notifications in Entwicklung</p>
						<p className="notificationDescription">
							Wir sind gerade dabei dieses Feature zu entwickeln. Gib uns noch ein wenig Zeit 
							und du wirst hier bald schon die neusten Neuigkeiten sehen.
						</p>
					</li>
					<li
						className="notification"
						key={2}
					></li>
				</ul>
			</div>
			<div className="h-7"></div>
		</div>
	);
};

export default HeadNav;
