// @ts-check
import { createElement, prop } from "./utils.js";

/**
 * @typedef PropKeys
 * @property {string} name
 *
 * @typedef {PropKeys & NamedNodeMap} Props
 */

class FeaturedProject extends HTMLElement {
	static TEMPLATE = createElement("template", { id: "project-link-template" });

	/** @type {string | null} */
	#name;

	constructor() {
		super();

		const template = FeaturedProject.TEMPLATE;
		this.root = this.attachShadow({ mode: "open" });

		this.#name = prop(this, "title");

		this.root.appendChild(template.content.cloneNode(true));
		this.style.display = "unset";
		this.style.opacity = "1";
	}

	connectedCallback() {}
}

FeaturedProject.TEMPLATE.innerHTML = /* html */ `
        <link rel="stylesheet" href="/components/FeaturedProject.styles.css"/>
        <a id="link" target="_blank"
            ><i id="icon" class="fa-inverse fa-lg"></i
        ></a>
    `;

customElements.define("featured-project", FeaturedProject);
