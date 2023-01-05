---
---

// @ts-check
import { id, prop, template } from "./utils.mjs";

class FeaturedProject extends HTMLElement {
	static #TEMPLATE = template`
		<style>{% include FeaturedProject.styles.css %}</style>
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/fontawesome.min.css"
			integrity="sha512-giQeaPns4lQTBMRpOOHsYnGw1tGVzbAIHUyHRgn7+6FmiEgGGjaG0T2LZJmAPMzRCl+Cug0ItQ2xDZpTmEc+CQ=="
			crossorigin="anonymous" referrerpolicy="no-referrer" />
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/solid.min.css"
			integrity="sha512-6mc0R607di/biCutMUtU9K7NtNewiGQzrvWX4bWTeqmljZdJrwYvKJtnhgR+Ryvj+NRJ8+NnnCM/biGqMe/iRA=="
			crossorigin="anonymous" referrerpolicy="no-referrer" />
		<a id="project-link-box" title="Learn more">
			<div id="box">
				<div id="header">
					<span id="project-name"></span>
					<img width="60" height="60" id="project-icon"/>
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
