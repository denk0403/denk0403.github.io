// @ts-check
import { id, memo, prop, query, queryAll, template } from "./utils.mjs";

const toExpandMsg = "Click to expand details";
const toCollapseMsg = "Click to collapse details";

export class ProjectElement extends HTMLElement {
	static #TEMPLATE = template`
		<link rel="stylesheet" href="/components/ProjectElement.styles.css"/>
		<link
			rel="stylesheet"
			href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/fontawesome.min.css"
			integrity="sha512-RvQxwf+3zJuNwl4e0sZjQeX7kUa3o82bDETpgVCH2RiwYSZVDdFJ7N/woNigN/ldyOOoKw8584jM4plQdt8bhA=="
			crossorigin="anonymous"
			referrerpolicy="no-referrer"
		/>
		<link
			rel="stylesheet"
			href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/solid.css"
			integrity="sha512-RayiVbmLmW7DvtIA/RblYy7YqTlog8MVBYEwLkPFYY1GTTaVuDdBxC3RaJE6kEyWyCeSwROiH+2rR3rREm6eWQ=="
			crossorigin="anonymous"
			referrerpolicy="no-referrer"
		/>
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

		// set up scroll to top button
		scrollBtn.addEventListener("click", () => {
			this.scrollIntoView({ behavior: "smooth", block: "start" });
		});

		// update hash and determine how to scroll to opened element
		details.addEventListener("toggle", () => {
			if (details.open && !this.#noscroll) {
				location.hash = this.#name ?? "";
				if (this.#hasSlottedMedia() || this.#hasSlottedHero()) {
					this.scrollIntoView({ behavior: "smooth", block: "start" });
				} else {
					this.scrollIntoView({ behavior: "smooth", block: "center" });
				}
			} else {
				location.hash = "";
			}
		});

		if (this.#shouldOpenOnLoad()) {
			// only open details when all assets have loaded
			this.#onLoadAssets(() => {
				details.open = true;
			});
		}
	}

	/**
	 * Executes a callback once all of this component's assets
	 * have finished loading.
	 * @param {() => void} callback
	 */
	#onLoadAssets(callback) {
		const images = /** @type {HTMLImageElement[]} */ ([...queryAll(this, "img")]);

		const iframes = /** @type {HTMLIFrameElement[]} */ ([...queryAll(this, "iframe")]);

		let loadingAssetsCount = images.length + iframes.length;

		if (loadingAssetsCount === 0) {
			return callback();
		}

		images.forEach((image) => {
			if (image.complete) {
				loadingAssetsCount--;
				if (loadingAssetsCount === 0) callback();
			} else {
				image.addEventListener(
					"load",
					() => {
						loadingAssetsCount--;
						if (loadingAssetsCount === 0) callback();
					},
					{ passive: true, once: true }
				);
			}
		});

		iframes.forEach((iframe) => {
			iframe.addEventListener(
				"load",
				() => {
					loadingAssetsCount--;
					if (loadingAssetsCount === 0) callback();
				},
				{ passive: true, once: true }
			);
		});
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

	#hasSlottedHero = memo(() => {
		return !!query(this, "[slot=hero]");
	});

	#hasSlottedMedia = memo(() => {
		return !!query(this, "[slot=media]");
	});
}

customElements.define("project-elt", ProjectElement);