import React from "react";

const Settings = () => {

	const onChannelPointClick = () => {
		let channelpoints = document.querySelector(".channelpoints");
		let commands = document.querySelector(".commands");
		let channelpointsO = document.querySelector(".channelpointsO");
		let commandsO = document.querySelector(".commandsO");
		channelpointsO.classList.add("enabled");
		commandsO.classList.remove("enabled");
		commands.classList.remove("enabled");
		channelpoints.classList.add("enabled");
		let settingsO = document.querySelector(".settingsO");
		let settings = document.querySelector(".settings");
		settingsO.classList.remove("enabled");
		settings.classList.remove("enabled");
	}

	const onCommandsClick = () => {
		let channelpoints = document.querySelector(".channelpoints");
		let commands = document.querySelector(".commands");
		let channelpointsO = document.querySelector(".channelpointsO");
		let commandsO = document.querySelector(".commandsO");
		channelpointsO.classList.remove("enabled");
		commandsO.classList.add("enabled");
		commands.classList.add("enabled");
		channelpoints.classList.remove("enabled");
		let settingsO = document.querySelector(".settingsO");
		let settings = document.querySelector(".settings");
		settingsO.classList.remove("enabled");
		settings.classList.remove("enabled");
	}

	const onSettingsClick = () => {
		let channelpoints = document.querySelector(".channelpoints");
		let commands = document.querySelector(".commands");
		let channelpointsO = document.querySelector(".channelpointsO");
		let commandsO = document.querySelector(".commandsO");
		let settingsO = document.querySelector(".settingsO");
		let settings = document.querySelector(".settings");
		channelpointsO.classList.remove("enabled");
		commandsO.classList.remove("enabled");
		commands.classList.remove("enabled");
		channelpoints.classList.remove("enabled");
		settingsO.classList.add("enabled");
		settings.classList.add("enabled");
	}

	const onTitleColorPickerChange = () => {
		let titleColorPicker = document.querySelector(".titleColorPicker");
		let titleTest = document.querySelector(".titleTest");
		titleTest.style.color = titleColorPicker.value;
	}

	const onDescriptionColorPickerChange = () => {
		let descriptionColorPicker = document.querySelector(".descriptionColorPicker");
		let descriptionTest = document.querySelector(".descriptionTest");
		descriptionTest.style.color = descriptionColorPicker.value;
	}

	return (
		<div className="titleContainer ttsContainer enabled">
			<ul className="tabContainer">
				<li className="tabOption commandsO enabled" onClick={onCommandsClick}>
					<p className="tabOptionP">Über Commands</p>
					<div className="border" />
				</li>

				<li className="tabOption channelpointsO" onClick={onChannelPointClick}>
					<p className="tabOptionP">Über ChannelPoints</p>
					<div className="border" />
				</li>
				<li className="tabOption settingsO" onClick={onSettingsClick}>
					<p className="tabOptionP">Einstellungen</p>
					<div className="border" />
				</li>
			</ul>

			<div className="commands enabled">
				<p className="description">Command: !tts</p>
				<button className="copyLink">Overlay-Link kopieren</button>
				<button className="enableButton commandsEnabled">Aktivieren</button>
			</div>

			<div className="channelpoints">
				<p className="description">Einrichtung:</p>
				<p className="lowDescription">
					1. Erstelle eine neue Kanalbelohnung mit einem aktivierten Text-Feld.
				</p>
				<p className="lowDescription">
					2. Löse diese Belohnung mit dem Broadcaster-Account einmal ein und
					schreibe in das Text-Feld "!tts-connect".
				</p>
				<p className="lowDescription">
					3. Deaktiviere bei Bedarf TTS über Commands
				</p>
				<div className="break"></div>
				<button className="copyLink">Overlay-Link kopieren</button>
				<button className="enableButton channelpointsEnabled">
					Aktivieren
				</button>
			</div>

			<div className="settings">
			<p className="titleColorPickerText">Farbe vom Name:</p>
				<input className="titleColorPicker" defaultValue="#A538FF" onChange={onTitleColorPickerChange} type="color" />
				<p className="descriptionColorPickerText">Farbe von der Nachricht:</p>
				<input className="descriptionColorPicker" defaultValue="#ffffff" onChange={onDescriptionColorPickerChange} type="color" />
				<p className="titleTest">BastiGHG - TTS</p>
				<p className="descriptionTest">Das hier ist eine Test-Nachricht, die von dem echten BastiGHG gesendet wurde (wirklich).</p>
				<button className="cleanButton saveSettings">Speichern</button>
			</div>
		</div>
	);
};

export default Settings;
