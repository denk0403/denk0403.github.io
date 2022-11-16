import("./components/ProjectElement.mjs");
import("./components/ProjectLink.mjs");

if ("serviceWorker" in navigator) {
	if (navigator.serviceWorker.controller) {
		console.log("Service Worker already found. Skipping registration.");
	} else {
		navigator.serviceWorker
			.register("/sw.js")
			.then((serviceWorker) => {
				console.log("Service Worker registered: ", serviceWorker);
			})
			.catch((error) => {
				console.error("Error registering the Service Worker: ", error);
			});
	}
} else {
	console.log("Service Workers are not supported");
}
