// @ts-check
import { id, prop, template } from "./utils.mjs";

class FeaturedProject extends HTMLElement {
	static #TEMPLATE = template`
		<link rel="stylesheet" href="/components/FeaturedProject.styles.css"/>
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
		<a id="project-link-box" title="Learn more">
			<div id="box">
				<div id="header">
					<span id="project-name"></span>
					<img width='60' id="project-icon"></img>
				</div>
				<slot name="description"></slot>
				<div id="next-icon-wrapper">
					<i id="next-icon" class="fa-inverse fa-xl fa-solid fa-arrow-right"></i>
				</div>
			</div>
		</a>
	`;

	/** @type {?string} */
	#name;
	/** @type {?string} */
	#iconHref;
	/** @type {?string} */
	#iconAlt;

	/** @type {ShadowRoot} */
	#r;

	constructor() {
		super();

		this.#r = this.attachShadow({ mode: "open" });
		this.#r.appendChild(FeaturedProject.#TEMPLATE.content.cloneNode(true));

		this.style.display = "unset";
		this.style.height = "unset";
		this.style.opacity = "1";
	}

	connectedCallback() {
		this.#name = prop(this, "name");
		this.#iconHref = prop(this, "icon-href");
		this.#iconAlt = prop(this, "icon-alt");

		/** @type {HTMLHeadingElement} */
		const nameElt = id(this.#r, "project-name");
		if (nameElt && this.#name) {
			nameElt.textContent = this.#name;

			/** @type {HTMLAnchorElement} */
			const projectLinkBoxElt = id(this.#r, "project-link-box");
			projectLinkBoxElt.href = `/projects.html#${this.#name}`;
		}

		/** @type {HTMLImageElement} */
		const iconElt = id(this.#r, "project-icon");
		if (iconElt) {
			if (this.#iconHref) {
				iconElt.src = this.#iconHref;
			}
			if (this.#iconAlt) {
				iconElt.alt = this.#iconAlt;
			}
		}
	}
}

customElements.define("featured-project", FeaturedProject);
