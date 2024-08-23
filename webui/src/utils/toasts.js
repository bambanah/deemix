import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import "@/styles/css/toasts.css";

const sharedOptions = {
	gravity: "bottom",
	position: "left",
};

const toastsWithId = {};

export const toast = function (msg, icon = null, dismiss = true, id = null) {
	if (toastsWithId[id]) {
		const toastObj = toastsWithId[id];

		const toastElement = document.querySelectorAll(
			`div.toastify[toast_id=${id}]`
		);

		if (msg) {
			toastElement.forEach((toast) => {
				const messages = toast.querySelectorAll(".toast-message");

				messages.forEach((message) => {
					message.innerText = msg;
				});
			});
		}

		if (icon) {
			const iconNode = document.createElement("span");
			iconNode.classList.add("toast-icon");

			if (icon === "loading") {
				const loader = document.createElement("div");
				loader.classList.add("circle-loader");
				iconNode.appendChild(loader);
			} else {
				const materialIcon = document.createElement("i");
				materialIcon.classList.add("material-icons");
				materialIcon.appendChild(document.createTextNode(icon));
				iconNode.appendChild(materialIcon);
			}

			toastElement.forEach((toast) => {
				const icons = toast.querySelectorAll(".toast-icon");

				icons.forEach((toastIcon) => {
					toastIcon.parentNode.replaceChild(iconNode, toastIcon);
				});
			});
		}
		if (dismiss !== null && dismiss) {
			toastElement.forEach((toast) => {
				toast.classList.add("dismissable");
			});

			setTimeout(() => {
				toastObj.hideToast();

				delete toastsWithId[id];
			}, 3000);
		}
	} else {
		const iconNode = document.createElement("span");
		iconNode.classList.add("toast-icon");
		if (icon == null) {
			iconNode.appendChild(document.createTextNode(""));
		} else if (icon === "loading") {
			const loader = document.createElement("div");
			loader.classList.add("circle-loader");
			iconNode.appendChild(loader);
		} else {
			const materialIcon = document.createElement("i");
			materialIcon.classList.add("material-icons");
			materialIcon.appendChild(document.createTextNode(icon));
			iconNode.appendChild(materialIcon);
		}
		const messageNode = document.createElement("span");
		messageNode.classList.add("toast-message");
		messageNode.appendChild(document.createTextNode(msg));

		const toastNode = document.createElement("toast");
		toastNode.appendChild(iconNode);
		toastNode.appendChild(messageNode);

		const toastObj = Toastify({
			...sharedOptions,
			node: toastNode,
			duration: dismiss ? 3000 : 0,
			className: dismiss ? "dismissable" : "",
			onClick() {
				let dismissable = true;

				if (id) {
					const toastClasses = document.querySelector(
						`div.toastify[toast_id=${id}]`
					).classList;

					if (toastClasses) {
						dismissable = Array.prototype.slice
							.call(toastClasses)
							.includes("dismissable");
					}
				}
				if (toastObj && dismissable) {
					toastObj.hideToast();

					if (id) {
						delete toastsWithId[id];
					}
				}
			},
			offset: {
				x: localStorage.getItem("slimSidebar") === "true" ? "3rem" : "14rem",
			},
		}).showToast();
		if (id) {
			toastsWithId[id] = toastObj;

			toastObj.toastElement.setAttribute("toast_id", id);
		}
	}
};
