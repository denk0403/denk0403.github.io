// @ts-check
import { id, memo, prop, query, queryAll, template } from "./utils.mjs";

const toExpandMsg = "Click to expand details";
const toCollapseMsg = "Click to collapse details";

export class ProjectElement extends HTMLElement {
	static #TEMPLATE = template`
		<link rel="stylesheet" href="/components/ProjectElement.styles.css" />
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/fontawesome.min.css"
			integrity="sha512-giQeaPns4lQTBMRpOOHsYnGw1tGVzbAIHUyHRgn7+6FmiEgGGjaG0T2LZJmAPMzRCl+Cug0ItQ2xDZpTmEc+CQ=="
			crossorigin="anonymous" referrerpolicy="no-referrer" />
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/solid.min.css"
			integrity="sha512-6mc0R607di/biCutMUtU9K7NtNewiGQzrvWX4bWTeqmljZdJrwYvKJtnhgR+Ryvj+NRJ8+NnnCM/biGqMe/iRA=="
			crossorigin="anonymous" referrerpolicy="no-referrer" />
		<details id="project-details">
			<summary id="project-summary" title="${toExpandMsg}">
				<span id="project-name"></span>
				<span id="project-duration"></span>
			</summary>

			<div id="project-content">
				<slot name="subtitle"></slot>
				<slot name="hero"></slot>
				<slot name="description"></slot>
				<div style="margin-block: 10px">
					<label id="tech-label"></label>
					<slot name="tech"></slot>
				</div>
				<div style="margin-block: 10px">
					<label id="links-label"></label>
					<slot name="links">
						<a id="project-link" style="display: none">Click here to learn more</a>
					</slot>
				</div>
				<slot name="media"></slot>
				<button id="scroll-btn" title="Scroll to top"><i class="fa-solid fa-arrow-up fa-lg"></i></button>
			</div>
		</details>
	`;

	/** @type {?string} */
	#name;
	/** @type {?string} */
	#duration;
	/** @type {?string} */
	#href;
	/** @type {boolean} */
	#noscroll;

	/** @type {ShadowRoot} */
	#r;
	/** @type {HTMLDetailsElement} */
	#details;

	get name() {
		return this.#name;
	}

	get open() {
		return this.#details.open;
	}

	set open(value) {
		this.#details.open = !!value;
	}

	constructor() {
		super();

		this.#r = this.attachShadow({ mode: "open" });
		this.#r.appendChild(ProjectElement.#TEMPLATE.content.cloneNode(true));

		this.#details = id(this.#r, "project-details");

		this.style.display = "unset";
		this.style.height = "unset";
		this.style.opacity = "1";
	}

	connectedCallback() {
		this.#name = prop(this, "name");
		this.#duration = prop(this, "duration");
		this.#href = prop(this, "href");
		this.#noscroll = prop(this, "noscroll") !== null;

		if (this.#name) {
			/** @type {HTMLSpanElement} */
			const projectName = id(this.#r, "project-name");
			projectName.textContent = this.#name;
		}

		if (this.#duration) {
			/** @type {HTMLSpanElement} */
			const projectDuration = id(this.#r, "project-duration");
			projectDuration.textContent = this.#duration;
		}

		if (this.#hasSlottedTech()) {
			/** @type {HTMLLabelElement} */
			const techLabel = id(this.#r, "tech-label");
			techLabel.textContent = "Technologies:";
		}

		if (this.#hasSlottedLinks()) {
			/** @type {HTMLLabelElement} */
			const linkLabel = id(this.#r, "links-label");
			linkLabel.textContent = "Links:";
		} else if (this.#href) {
			/** @type {HTMLLabelElement} */
			const linkLabel = id(this.#r, "links-label");
			linkLabel.textContent = "Link:";

			/** @type {HTMLAnchorElement} */
			const link = id(this.#r, "project-link");
			link.href = this.#href;
			link.style.display = "unset";
		}

		const details = this.#details;
		const summary = id(this.#r, "project-summary");
		const scrollBtn = id(this.#r, "scroll-btn");

		// update summary tooltip
		details.addEventListener("toggle", () => {
			summary.title = details.open ? toCollapseMsg : toExpandMsg;
		});

		// determine whether to show scroll to top button
		details.addEventListener("toggle", () => {
			if (details.open && details.clientHeight > window.innerHeight) {
				scrollBtn.style.visibility = "visible";
			} else {
				scrollBtn.style.visibility = "hidden";
			}
		});

		// determine how to scroll to opened element
		details.addEventListener("toggle", () => {
			if (details.open && !this.#noscroll) {
				if (this.#hasSlottedMedia() || this.#hasSlottedHero()) {
					this.scrollIntoView({ behavior: "smooth", block: "start" });
				} else {
					this.scrollIntoView({ behavior: "smooth", block: "center" });
				}
			}
		});

		// update hash
		details.addEventListener("toggle", () => {
			if (details.open) {
				location.hash = this.#name ?? "";
			} else {
				location.hash = "";
			}
		});

		// set up scroll to top button
		scrollBtn.addEventListener("click", () => {
			this.scrollIntoView({ behavior: "smooth", block: "start" });
		});

		if (this.#shouldOpenOnLoad()) {
			// render slots
			this.#renderAssetSlots();

			// remove lazy loading from assets
			this.#getAssets().forEach((asset) => {
				asset.loading = "eager";
			});

			details.open = true;
		} else {
			// render media and hero content first time details is opened
			details.addEventListener("toggle", () => this.#renderAssetSlots(), { once: true });
		}
	}

	#renderAssetSlots() {
		const media = this.#getSlottedMedia();
		const hero = this.#getSlottedHero();

		if (media) media.style.display = "flex";
		if (hero) hero.style.display = "block";
	}

	/**
	 * @typedef LoadableType
	 * @property {boolean} complete
	 * @property {"eager" | "lazy"} loading
	 *
	 * @typedef {LoadableType & HTMLElement} HTMLoadable
	 */

	#getAssets = memo(() => {
		const images = /** @type {NodeListOf<HTMLoadable>} */ (queryAll(this, "img"));
		const iframes = /** @type {NodeListOf<HTMLoadable>} */ (queryAll(this, "iframe"));
		return [...images, ...iframes];
	});

	/**
	 * Executes a callback once all of this component's assets
	 * have finished loading.
	 * @param {() => void} callback
	 */
	#onLoadAssets(callback) {
		const loadingAssets = this.#getAssets();
		let loadingAssetsCount = loadingAssets.length;

		if (loadingAssetsCount === 0) {
			return callback();
		}

		for (const asset of loadingAssets) {
			if (asset.complete) {
				loadingAssetsCount--;
				if (loadingAssetsCount === 0) callback();
			} else {
				asset.addEventListener(
					"load",
					() => {
						loadingAssetsCount--;
						if (loadingAssetsCount === 0) callback();
					},
					{ passive: true, once: true }
				);
			}
		}
	}

	#shouldOpenOnLoad() {
		const hash = decodeURIComponent(location.hash.slice(1));
		return hash && hash === this.#name;
	}

	#hasSlottedTech() {
		return !!query(this, "[slot=tech]");
	}

	#hasSlottedLinks = memo(() => {
		return !!query(this, "[slot=links]");
	});

	#getSlottedHero = memo(() => {
		return query(this, "[slot=hero]");
	});

	#hasSlottedHero = memo(() => {
		return !!this.#getSlottedHero();
	});

	#getSlottedMedia = memo(() => {
		return query(this, "[slot=media]");
	});

	#hasSlottedMedia = memo(() => {
		return !!this.#getSlottedMedia();
	});
}

customElements.define("project-elt", ProjectElement);
