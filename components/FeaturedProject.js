// @ts-check
import { createElement, id, prop } from "./utils.js";

/**
 * @typedef PropKeys
 * @property {string} name
 *
 * @typedef {PropKeys & NamedNodeMap} Props
 */

class FeaturedProject extends HTMLElement {
	static TEMPLATE = createElement("template", { id: "project-link-template" });

	/** @type {?string} */
	#name;
	/** @type {?string} */
	#iconHref;

	constructor() {
		super();

		const template = FeaturedProject.TEMPLATE;
		this.root = this.attachShadow({ mode: "open" });

		this.#name = prop(this, "name");
		this.#iconHref = prop(this, "icon-href");

		this.root.appendChild(template.content.cloneNode(true));

		this.style.display = "unset";
		this.style.height = "unset";
		this.style.opacity = "1";
	}

	connectedCallback() {
		/** @type {HTMLHeadingElement} */
		const nameElt = id(this.root, "project-name");
		if (nameElt && this.#name) {
			nameElt.textContent = this.#name;

			/** @type {HTMLAnchorElement} */
			const projectLinkBoxElt = id(this.root, "project-link-box");
			projectLinkBoxElt.href = `/projects.html#${this.#name}`;
		}

		/** @type {HTMLImageElement} */
		const iconElt = id(this.root, "project-icon");
		if (iconElt && this.#iconHref) {
			iconElt.src = this.#iconHref;
		}
	}
}

FeaturedProject.TEMPLATE.innerHTML = /* html */ `
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
					<img id="project-icon"></img>
				</div>
				<slot name="description"></slot>
				<div id="next-icon-wrapper">
					<i id="next-icon" class="fa-inverse fa-xl fa-solid fa-arrow-right"></i>
				</div>
			</div>
		</a>
    `;

customElements.define("featured-project", FeaturedProject);
