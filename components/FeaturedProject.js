// @ts-check
import { ProjectLink } from "./ProjectLink.js";
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

			/** @type {ProjectLink} */
			const projectLinkElt = id(this.root, "project-link");
			projectLinkElt.href = `/projects.html#${this.#name}`;
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
		<div id="box">
			<div id="header">
				<span id="project-name"></span>
				<img id="project-icon"></img>
			</div>
			<slot name="description"></slot>
			<div style="position: relative; height: 100%; display:flex;">
				<project-link id="project-link" type="next" tooltip="Learn more" replace></project-link>
			</div>
		</div>
    `;

customElements.define("featured-project", FeaturedProject);
