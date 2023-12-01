import { useState } from "react";
import CommandView from "./components/CommandView";
import Commands from "./components/Commands";
import HeadNav from "./default/HeadNav";
import SideNav from "./default/SideNav";
const App = () => (
	<div>
		<SideNav />
		<div className="content">
			<HeadNav />
			<CommandView />
			<Commands />
		</div>
	</div>
);

export default App;
