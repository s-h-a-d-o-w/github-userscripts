// ==UserScript==
// @name         GitHub tab render size
// @namespace    https://github.com/s-h-a-d-o-w
// @version      1.0.1
// @description  Adds a drop down to the top right area of the source code viewer that
//               lets you select the render size for tabs.
//               Also works for gists.
//               Overrides .editorconfig if one exists in the project!
//               (Yes, GitHub supports .editorconfig indent size)
// @author       s-h-a-d-o-w
// @match        https://*.github.com/*
// @grant        none
// @license      MIT
// @icon         https://assets-cdn.github.com/pinned-octocat.svg
// @updateURL    https://raw.githubusercontent.com/s-h-a-d-o-w/github-userscripts/master/github-tab-render-size.user.js
// @downloadURL  https://raw.githubusercontent.com/s-h-a-d-o-w/github-userscripts/master/github-tab-render-size.user.js
// ==/UserScript==

// Based on:
// https://github.com/lukechilds/github-custom-tab-size

(() => {
	'use strict';
	const DEFAULT_TAB_SIZE = 4;

	function setTabSizeStyles(size) {
		style.innerHTML = `
* {
-moz-tab-size: ${size} !important;
tab-size: ${size} !important;
}`;
	}

	// Loads tab size from local storage and updates the style (as well as the dropdown)
	function loadTabSize() {
		let tabSize = localStorage.getItem('github-tab-render-size') || DEFAULT_TAB_SIZE;
		if(!["1", "2", "4", "8"].includes(tabSize)) // just to be safe
			tabSize = DEFAULT_TAB_SIZE;
		let selRenderSize = document.getElementById('selRenderSize');

		selRenderSize.value = tabSize;
		setTabSizeStyles(tabSize);
	}

	// Saves tab size to local storage and updates the style
	function saveTabSize(e) {
		localStorage.setItem('github-tab-render-size', e.target.value);
		setTabSizeStyles(e.target.value);
	}

	// Inject empty style element for us to use
	const style = document.createElement('style');
	document.head.appendChild(style);

	// Create UI (dropdown next in top right area of source code viewer)
	let divTabRendering = document.createElement("div");
	divTabRendering.style.cssText = 'display:inline-block; margin-right:10px';
	divTabRendering.innerHTML = `
<div style="display:inline-block; vertical-align:middle">Tab render size:</div>
<select id="selRenderSize" class="form-select select-sm js-code-indent-width">
<option value="1">1</option>
<option value="2">2</option>
<option value="4">4</option>
<option value="8">8</option>
</select>`;

	// Attach UI, hook up even listener and get possibly stored value from local storage
	let fileActions = document.getElementsByClassName('file-actions');
	if(fileActions.length === 1) {
		fileActions[0].insertBefore(divTabRendering, fileActions[0].firstChild);

		let selRenderSize = document.getElementById('selRenderSize');
		loadTabSize();
		selRenderSize.addEventListener('change', saveTabSize);
	}

})();
