/**
 * @module dndManager
 */
define(['dojo/query','./domUtil'], function(query, domUtil) {
	'use strict';

	var dndReference = {
		head: null,
		cont: null,
		parent: null
	};

	return {

		/**
		 * Sets the tab data to be dragged.
		 * @param {Event} evt
		 * @param {HTMLLIElement} tab
		 */
		setDndData: function(evt, tab) {
			// note: element order of li element (tab) is assumed to be same as order of section elements (tabContent)
			var cp, idx = domUtil.getElementIndex(tab);

			cp = query(tab.parentNode).parents('.contentPane')[0];

			// Drag types are limited to text or serialized html -> store a reference or create a container html and serialize it
			dndReference = {
				head: tab,
				cont: cp.getElementsByTagName('section')[idx],
				parent: cp
			};
			evt.dataTransfer.setData('tab', dndReference);  // dummy data to make browser show correct dnd image
			evt.dataTransfer.effectAllowed = 'move';
		},

		/**
		 * Returns the dragged tab data.
		 * @returns {{head: {HTMLUListElement}, cont: {HTMLElement}}}
		 */
		getDndData: function() {
			return dndReference;
		}
	};
});