// @ts-check
import { createElement, id, prop, query } from "./utils.js";

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

class ProjectElement extends HTMLElement {
	static TEMPLATE = createElement("template", { id: "project-template" });

	/** @type {string | null} */
	#name;
	/** @type {string | null} */
	#duration;
	/** @type {string | null} */
	#href;
	/** @type {boolean} */
	#noscroll;

	get name() {
		return this.#name;
	}

	get open() {
		/** @type {HTMLDetailsElement} */
		const details = id(this.root, "project-details");
		return details.open;
	}

	set open(value) {
		/** @type {HTMLDetailsElement} */
		const details = id(this.root, "project-details");
		if (details.open !== !!value) {
			details.open === !!value;
		}
	}

	constructor() {
		super();

		const template = ProjectElement.TEMPLATE;
		this.root = this.attachShadow({ mode: "open" });

		this.#name = prop(this, "name");
		this.#duration = prop(this, "duration");
		this.#href = prop(this, "href");
		this.#noscroll = prop(this, "noscroll") !== null;

		this.root.appendChild(template.content.cloneNode(true));
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
		const details = id(this.root, "project-details");
		const summary = id(this.root, "project-summary");
		const scrollBtn = id(this.root, "scroll-btn");

		details.addEventListener("toggle", (e) => {
			console.log(
				"toggle",
				e,
				details.open,
				this.#noscroll,
				this.#hasSlottedMedia(),
				this.#hasSlottedHero()
			);
			if (details.open && !this.#noscroll) {
				if (this.#hasSlottedMedia() || this.#hasSlottedHero()) {
					summary.scrollIntoView({ behavior: "smooth", block: "start" });
				} else {
					summary.scrollIntoView({ behavior: "smooth", block: "center" });
				}
			}
		});

		details.addEventListener("toggle", () => {
			summary.title = details.open ? toCollapseMsg : toExpandMsg;
		});

		details.addEventListener("toggle", () => {
			if (details.open && details.clientHeight > window.innerHeight) {
				scrollBtn.style.visibility = "visible";
			} else {
				scrollBtn.style.visibility = "hidden";
			}
		});

		scrollBtn.addEventListener("click", () => {
			summary.scrollIntoView({ behavior: "smooth", block: "start" });
		});

		const hash = decodeURIComponent(location.hash.slice(1));
		if (hash && hash === this.#name) {
			details.open = true;
		}
	}

	/** Toggles the state of the dropdown */
	toggle() {
		this.open = !this.open;
	}

	#hasSlottedLinks() {
		return !!query(this, "[slot=links]");
	}

	#hasSlottedHero() {
		return !!query(this, "[slot=hero]");
	}

	#hasSlottedMedia() {
		return !!query(this, "[slot=media]");
	}
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
