import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
	const onInputFieldBlur = () => {
		let inputFieldDefault = document.querySelector(".inputFieldDefault");
		let inputField = document.querySelector(".inputField");
		if (inputField.value === "") {
			inputFieldDefault.textContent = "URL zum kürzen...";
		} else inputFieldDefault.textContent = "";
	};

	const onInputFieldChange = () => {
		let inputFieldDefault = document.querySelector(".inputFieldDefault");
		let inputField = document.querySelector(".inputField");
		if (inputField.value === "") {
			inputFieldDefault.textContent = "URL zum kürzen...";
		} else {
			inputFieldDefault.textContent = "";
		}
	};

	return (
		<>
			<div className="container">
				<p className="title">URL-Shorter</p>
				<span className="inputFieldDefault">URL zum kürzen...</span>
				<input
					className="inputField"
					type="text"
					onChange={onInputFieldChange}
					onBlur={onInputFieldBlur}
				/>
			</div>
			<div className="container">
        <span className="idSpan">https://marceybot.de/v?c=<input className="idField" type="text"></input></span>
      </div>
		</>
	);
}

export default App;
