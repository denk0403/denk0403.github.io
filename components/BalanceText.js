// @ts-check
{
	const TEMPLATE = document.createElement("template");
	TEMPLATE.innerHTML = /* html */ `<slot></slot>`;

	class BalanceText extends HTMLElement {
		/** @type {ShadowRoot} */
		#r;
		/** @type {HTMLSlotElement} */
		#slot;
		/** @type {MutationObserver} */
		#mutObs;
		/** @type {ResizeObserver} */
		#resObs;

		constructor() {
			super();

			this.#r = this.attachShadow({ mode: "open" });
			this.#r.appendChild(TEMPLATE.content.cloneNode(true));

			// @ts-ignore
			this.#slot = this.#r.querySelector("slot");
		}

		connectedCallback() {
			if (CSS.supports("text-wrap", "balance")) {
				this.style.textWrap = "balance";
				return;
			}

			this.style.display ||= "inline-block";
			this.#slot.addEventListener("slotchange", this.#balance);

			this.#mutObs = new MutationObserver(this.#balance);
			this.#mutObs.observe(this, { childList: true, subtree: true });

			this.#resObs = new ResizeObserver(this.#balance);

			this.#resObs.observe(this, { box: "border-box" });
			if (this.parentElement) this.#resObs.observe(this.parentElement, { box: "border-box" });
		}

		disconnectedCallback() {
			if (CSS.supports("text-wrap", "balance")) return;

			this.#slot.removeEventListener("slotchange", this.#balance);
			this.#mutObs.disconnect();
			this.#resObs.disconnect();
		}

		#balance = () => {
			// @ts-ignore
			const parentWidth = this.parentElement.getBoundingClientRect().width;
			this.style.maxWidth = `${parentWidth}px`;

			const height = this.getBoundingClientRect().height;

			// perform binary search
			let lowerWidth = 0;
			let upperWidth = parentWidth;

			while (lowerWidth !== upperWidth) {
				const currentWidth = ~~((upperWidth + lowerWidth) / 2);

				this.style.maxWidth = `${currentWidth}px`;

				if (this.getBoundingClientRect().height === height) {
					upperWidth = currentWidth;
				} else {
					lowerWidth = currentWidth + 1;
				}
			}

			this.style.maxWidth = `${lowerWidth}px`;
		};
	}

	customElements.define("balance-text", BalanceText);
}
