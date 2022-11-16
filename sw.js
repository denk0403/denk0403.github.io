const CACHE_NAME = "V1";
const STATIC_CACHE_URLS = [
	"./resources/imgs/tint_icon.png",
	"./resources/imgs/algedraw_icon.png",
	"./resources/imgs/spongebob_icon.png",
	"./resources/imgs/vortecs_icon.png",
	"./resources/imgs/Dennis2021.jpg",
	"./resources/imgs/speakaac.png",
	"./resources/imgs/tint-gen.jpg",
	"./resources/imgs/atlas-logo.png",
	"./resources/imgs/mocking-spongebob.png",
	"./algedraw calculator/gifs/phi.gif",
	"./algedraw calculator/gifs/degrees.gif",
	"./algedraw calculator/gifs/four.gif",
	"./resources/imgs/find-your-bus.gif",
	"./resources/imgs/mario1.png",
	"./resources/imgs/mario2.png",
	"./resources/imgs/mario3.png",
	"./resources/imgs/mario4.png",
	"./resources/imgs/connect4.png",
	"./resources/imgs/vortecs.png",
];

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll(STATIC_CACHE_URLS);
		})
	);
});

self.addEventListener("activate", (event) => {
	// delete any unexpected caches
	event.waitUntil(
		caches
			.keys()
			.then((keys) => keys.filter((key) => key !== CACHE_NAME))
			.then((keys) =>
				Promise.all(
					keys.map((key) => {
						return caches.delete(key);
					})
				)
			)
	);
});

function cache(request, response) {
	if (response.type === "error" || response.type === "opaque") {
		return Promise.resolve(); // do not put in cache network errors
	}

	return caches.open(CACHE_NAME).then((cache) => {
		return cache.put(request, response.clone());
	});
}

function update(request) {
	return fetch(request.url).then(
		(response) =>
			cache(request, response) // we can put response in cache
				.then(() => response) // resolve promise with the Response object
	);
}

self.addEventListener("fetch", (event) => {
	// Cache-First Strategy
	let fetched = false;
	event.respondWith(
		caches
			.match(event.request) // check if the request has already been cached
			.then((cached) => {
				if (!cached) {
					// otherwise request network
					fetched = true;
					return update(event.request);
				}
				return cached;
			})
	);
	!fetched && event.waitUntil(update(event.request));
});
