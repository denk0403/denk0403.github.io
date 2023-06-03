---
---

// @ts-check
import { id, prop, template } from "./utils.mjs";

class StackOverflowWidget extends HTMLElement {
	static #TEMPLATE = template`
		<style>{% include styles/components/StackOverflowWidget.styles.css %}</style>
		<a id="link" title="Visit Stack Overflow" target="_blank">
			<div id="score"></div>
			<balance-text id="title" role="heading"></balance-text>
			<div id="user-wrapper">
				<div style="margin-bottom: 4px;">asked <span id="asked-time"></span></div>
				<div style="white-space: nowrap;">
					<img id="user-image" width="32" height="32">
					<div id="user-details">
						<span id="user-name"></span>
						<div id="user-reputation" title="reputation score"></div>
					</div>
				</div>
			</div>
		</a>
	`;

	/** @type {ShadowRoot} */
	#r;

	/** @type {string} */
	#dataHref;

	constructor() {
		super();

		this.style.visibility = "hidden";
		this.#r = this.attachShadow({ mode: "open" });
		this.#r.appendChild(StackOverflowWidget.#TEMPLATE.content.cloneNode(true));
	}

	async connectedCallback() {
		this.#dataHref = prop(this, "data-href");
		if (!this.#dataHref) throw new Error("Missing attribute `data-href`.");

		try {
			const cacheAge = 30 * 60; // 30 minutes (1800 seconds)
			const fetchData = await fetch(this.#dataHref, {
				cache: "force-cache",
				headers: { "Cache-Control": `max-age=${cacheAge}` },
			}).then((res) => res.json());
			const { link, title, score, owner, creation_date } = fetchData.items[0];

			id(this.#r, "link").href = link;
			id(this.#r, "title").textContent = title;

			const scoreElt = id(this.#r, "score");
			scoreElt.textContent = score;
			if (score !== 0) scoreElt.classList.add(score > 0 ? "good" : "bad");

			const { display_name, reputation, profile_image } = owner;
			id(this.#r, "user-name").textContent = display_name;

			id(this.#r, "user-reputation").textContent = reputation;

			/** @type {HTMLImageElement} */
			const userImage = id(this.#r, "user-image");
			userImage.src = profile_image;
			userImage.alt = `${display_name}'s user avatar`;

			const askedTime = id(this.#r, "asked-time");
			const creationTimeInMs = creation_date * 1000;
			askedTime.textContent = new Intl.DateTimeFormat(void 0, {
				dateStyle: "long",
				timeStyle: "short",
			}).format(creationTimeInMs);
			askedTime.title = new Date(creation_date * 1000).toISOString();
		} catch (err) {
			console.log(err);
			id(this.#r, "user-wrapper").style.display = "none";
			id(this.#r, "title").textContent = "There was an error loading Stack Overflow data. Try again later.";
		}

		this.style.visibility = "initial";
	}
}

customElements.define("stack-overflow-widget", StackOverflowWidget);
