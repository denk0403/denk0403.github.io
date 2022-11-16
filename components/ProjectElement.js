// @ts-check
import { createElement, id, memo, prop, query } from "./utils.js";

/**
 * @typedef PropKeys
 * @property {string} name
 * @property {string} duration
 * @property {string} href
 * @property {string} noscroll
 *
 * @typedef {PropKeys & NamedNodeMap} Props
 */

const toExpandMsg = "Click to expand details";
const toCollapseMsg = "Click to collapse details";

export class ProjectElement extends HTMLElement {
	static TEMPLATE = createElement("template", { id: "project-template" });

	/** @type {?string} */
	#name;
	/** @type {?string} */
	#duration;
	/** @type {?string} */
	#href;
	/** @type {boolean} */
	#noscroll;

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

		this.root = this.attachShadow({ mode: "open" });
		this.root.appendChild(ProjectElement.TEMPLATE.content.cloneNode(true));

		this.#name = prop(this, "name");
		this.#duration = prop(this, "duration");
		this.#href = prop(this, "href");
		this.#noscroll = prop(this, "noscroll") !== null;

		this.#details = id(this.root, "project-details");

		this.style.display = "unset";
		this.style.height = "unset";
		this.style.opacity = "1";
	}

	connectedCallback() {
		if (this.#name) {
			/** @type {HTMLSpanElement} */
			const projectName = id(this.root, "project-name");
			projectName.textContent = this.#name;
		}

		if (this.#duration) {
			/** @type {HTMLSpanElement} */
			const projectDuration = id(this.root, "project-duration");
			projectDuration.textContent = this.#duration;
		}

		if (this.#hasSlottedLinks()) {
			/** @type {HTMLLabelElement} */
			const linkLabel = id(this.root, "links-label");
			linkLabel.textContent = "Links:";
		} else if (this.#href) {
			/** @type {HTMLLabelElement} */
			const linkLabel = id(this.root, "links-label");
			linkLabel.textContent = "Link:";

			/** @type {HTMLAnchorElement} */
			const link = id(this.root, "project-link");
			link.href = this.#href;
			link.style.display = "unset";
		}

		/** @type {HTMLDetailsElement} */
		const details = this.#details;
		const summary = id(this.root, "project-summary");
		const scrollBtn = id(this.root, "scroll-btn");

		details.addEventListener("toggle", () => {
			location.hash = this.#name ?? "";

			if (details.open && !this.#noscroll) {
				if (this.#hasSlottedMedia() || this.#hasSlottedHero()) {
					this.scrollIntoView({ behavior: "smooth", block: "start" });
				} else {
					this.scrollIntoView({ behavior: "smooth", block: "nearest" });
				}
			}
		});

		details.addEventListener("toggle", () => {
			summary.title = details.open ? toCollapseMsg : toExpandMsg;
		});

		details.addEventListener("toggle", () => {
			console.log(details.clientHeight, window.innerHeight);
			if (details.open && details.clientHeight > window.innerHeight) {
				scrollBtn.style.visibility = "visible";
			} else {
				scrollBtn.style.visibility = "hidden";
			}
		});

		scrollBtn.addEventListener("click", () => {
			this.scrollIntoView({ behavior: "smooth", block: "start" });
		});

		if (this.#isHashMatching()) {
			details.open = true;
		}
	}

	#isHashMatching() {
		const hash = decodeURIComponent(location.hash.slice(1));
		return hash && hash === this.#name;
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

ProjectElement.TEMPLATE.innerHTML = /* html */ `
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
				<div style="display: inline-block;">
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

customElements.define("project-elt", ProjectElement);
