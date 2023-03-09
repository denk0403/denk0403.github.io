// @ts-check
{
	const TEMPLATE = document.createElement("template");
	TEMPLATE.innerHTML = /* html */ `
		<style>
			* { font-size: 18px }
			button { padding: 3px 12px; }
		</style>
		<div style="display: flex;">
			<button id="back" title="Back">❬</button>
			<input id="scrubber" style="display: block; width: 100%"
				type="range" min="0" step="1" value="0" />
			<button id="next" title="Next">❭</button>
		</div>
		<div style="display: flex; justify-content: space-between; margin-top: 2px">
			<button id="play">Play</button>
			<select id="speed" title="Speed">
				<option value="0.25">0.25x</option>
				<option value="0.5">0.5x</option>
				<option value="1" selected>1x</option>
				<option value="1.5">1.5x</option>
				<option value="2">2x</option>
				<option value="3">3x</option>
				<option value="4">4x</option>
				<option value="5">5x</option>
				<option value="8">8x</option>
				<option value="10">10x</option>
				<option value="fastest">Fastest</option>
				</select>
		</div>
	`;

	/** @template T */
	class GeneratorPlayer extends HTMLElement {
		static get observedAttributes() {
			return ["loop"];
		}

		/** @typedef {(step: T) => any} UpdateCallback*/

		/** @type {ShadowRoot} */
		#r;
		/** @type {UpdateCallback} */
		#callback = () => {};
		/** @type {Array<T>} */
		#steps = [];
		#currentIndex = 0;
		#playDelay = 500;
		#loop = false;

		/** @type {HTMLInputElement} */
		#scrubber;
		/** @type {HTMLButtonElement} */
		#playBtn;
		/** @type {HTMLSelectElement} */
		#speedSelector;
		/** @type {number | undefined} */
		#player;

		constructor() {
			super();

			this.#r = this.attachShadow({ mode: "open" });
			this.#r.appendChild(TEMPLATE.content.cloneNode(true));

			// @ts-ignore
			// this.#slot = this.#r.querySelector("slot");
		}

		connectedCallback() {
			this.#scrubber = this.#r.getElementById("scrubber");
			this.#playBtn = this.#r.getElementById("play");
			this.#speedSelector = this.#r.getElementById("speed");

			this.#resetPlayer();

			this.#scrubber.oninput = () => {
				this.pause();
				this.#currentIndex = this.#scrubber.valueAsNumber;
				this.#rerender();
			};

			/** @type {HTMLButtonElement} */
			const back = this.#r.getElementById("back");
			back.onclick = () => {
				this.pause();
				if (this.#currentIndex > 0) {
					this.#currentIndex -= 1;
					this.#rerender();
				}
			};

			/** @type {HTMLButtonElement} */
			const next = this.#r.getElementById("next");
			next.onclick = () => {
				this.pause();
				if (this.#currentIndex < this.#steps.length) {
					this.#currentIndex += 1;
					this.#rerender();
				}
			};

			this.#speedSelector.onchange = () => {
				if (this.#speedSelector.value === "fastest") {
					this.#playDelay = 0;
				} else {
					this.#playDelay = 500 / (Number.parseFloat(this.#speedSelector.value) || 1);
				}

				if (this.#player) {
					this.play();
				}
			};

			this.pause();
		}

		attributeChangedCallback(name, _, newValue) {
			switch (name) {
				case "loop": {
					this.#loop = this.hasAttribute("loop") && newValue !== "false";
					break;
				}
			}
		}

		/** @param {Generator<T, any, any>} gen */
		setGenerator(gen) {
			this.#steps = [...gen];
			this.#resetPlayer();
			this.#rerender();
		}

		/** @param {UpdateCallback} callback */
		setUpdateCallback(callback) {
			this.#callback = callback;
			this.#rerender();
		}

		setStep(step) {
			this.#currentIndex = Math.max(0, Math.min(step, this.#steps.length - 1));
			this.#rerender();
		}

		setSpeed(speedMultiplier) {
			this.#speedSelector.value = speedMultiplier;
			this.#playDelay = 500 / speedMultiplier;

			if (this.#player) {
				this.play();
			}
		}

		play() {
			clearInterval(this.#player);

			if (this.#currentIndex >= this.#steps.length - 1) {
				this.#currentIndex = 0;
				this.#rerender();
			}

			this.#player = setInterval(() => {
				this.#currentIndex += 1;
				this.#rerender();

				if (this.#currentIndex >= this.#steps.length - 1) {
					if (this.#loop) {
						this.#currentIndex = -1;
					} else {
						this.pause();
					}
				}
			}, this.#playDelay);
			this.#playBtn.textContent = "Pause";
			this.#playBtn.onclick = () => this.pause();
		}

		pause() {
			clearInterval(this.#player);
			this.#player = undefined;
			this.#playBtn.textContent = "Play";
			this.#playBtn.onclick = () => this.play();
		}

		#rerender() {
			if (this.#steps.length !== 0) {
				this.#scrubber.valueAsNumber = this.#currentIndex;
				this.#callback(this.#steps[this.#currentIndex]);
			}
		}

		#resetPlayer() {
			clearInterval(this.#player);
			this.#currentIndex = 0;
			this.#scrubber.valueAsNumber = 0;
			this.#scrubber.min = "0";
			this.#scrubber.step = "1";
			this.#scrubber.max = this.#steps.length ? `${this.#steps.length - 1}` : "0";
		}
	}

	customElements.define("generator-player", GeneratorPlayer);
}
