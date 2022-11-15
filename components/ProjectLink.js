// @ts-check
import { createElement, fr, id, prop } from "./utils.js";

/**
 * @typedef PropKeys
 * @property {string} name
 * @property {string} duration
 * @property {string} href
 *
 * @typedef {PropKeys & NamedNodeMap} Props
 */

const ICON_TYPE_DATA_MAP = fr({
	github: /** @type {const} */ ({ classes: ["fa-brands", "fa-github"], tooltip: "Github" }),
	twitter: /** @type {const} */ ({ classes: ["fa-brands", "fa-twitter"], tooltip: "Twitter" }),
	faecbook: /** @type {const} */ ({ classes: ["fa-brands", "fa-facebook"], tooltip: "Facebook" }),
	website: /** @type {const} */ ({ classes: ["fa-solid", "fa-link"], tooltip: "Website" }),
	devpost: /** @type {const} */ ({ classes: ["fa-brands", "fa-dev"], tooltip: "Devpost" }),
	devto: /** @type {const} */ ({ classes: ["fa-brands", "fa-dev"], tooltip: "Dev.to" }),
	api: /** @type {const} */ ({ classes: ["fa-solid", "fa-cloud"], tooltip: "API Docs" }),
	info: /** @type {const} */ ({ classes: ["fa-solid", "fa-circle-info"], tooltip: "Info" }),
	store: /** @type {const} */ ({ classes: ["fa-solid", "fa-store"], tooltip: "Store Page" }),
});

/** @typedef {keyof ICON_TYPE_DATA_MAP} IconType*/

class ProjectLink extends HTMLElement {
	static TEMPLATE = createElement("template", { id: "project-link-template" });

	constructor() {
		super();

		const template = ProjectLink.TEMPLATE;
		this.root = this.attachShadow({ mode: "open" });

		this.root.appendChild(template.content.cloneNode(true));
		this.style.display = "unset";
		this.style.opacity = "1";
	}

	connectedCallback() {
		const href = prop(this, "href"),
			title = prop(this, "title"),
			type = prop(this, "type");

		if (type) {
			/** @type {HTMLAnchorElement} */
			const link = id(this.root, "link");
			/** @type {HTMLSpanElement} */
			const icon = id(this.root, "icon");

			/** @type {ICON_TYPE_DATA_MAP[IconType] | undefined} */
			const iconData = ICON_TYPE_DATA_MAP[type];
			if (iconData) {
				link.title = iconData.tooltip;
				icon.classList.add(...iconData.classes);
			}
		}

		if (title) {
			/** @type {HTMLAnchorElement} */
			const link = id(this.root, "link");
			link.title = title;
		}

		if (href) {
			/** @type {HTMLAnchorElement} */
			const link = id(this.root, "link");
			link.href = href;
		}
	}
}

ProjectLink.TEMPLATE.innerHTML = /* html */ `
        <link rel="stylesheet" href="/components/ProjectLink.styles.css"/>
        <link
			rel="stylesheet"
			href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/fontawesome.min.css"
			integrity="sha512-RvQxwf+3zJuNwl4e0sZjQeX7kUa3o82bDETpgVCH2RiwYSZVDdFJ7N/woNigN/ldyOOoKw8584jM4plQdt8bhA=="
			crossorigin="anonymous"
			referrerpolicy="no-referrer"
		/>
		<link
			rel="stylesheet"
			href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/brands.min.css"
			integrity="sha512-+oRH6u1nDGSm3hH8poU85YFIVTdSnS2f+texdPGrURaJh8hzmhMiZrQth6l56P4ZQmxeZzd2DqVEMqQoJ8J89A=="
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
        <a id="link" target="_blank"
            ><i id="icon" class="fa-inverse fa-lg"></i
        ></a>
    `;

customElements.define("project-link", ProjectLink);
