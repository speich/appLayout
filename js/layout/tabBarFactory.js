/**
 * This file contains a the class to create an overlay.
 * An overlay shows the user that he can drop a pane.
 * @module layout/tabBarFactory
 * @see layout.tabBarFactory
 */
define([
	'dojo/on',
	'dojo/query',
	'appLayout/layout/overlayFactory',
	'appLayout/domUtil',
	'dojo/NodeList-traverse'], function(on, query, overlayFactory, domUtil) {
	'use strict';

	var dndReference = {
		head: null,
		cont: null
	};

	/**
	 * Factory to create tabs and a tabbed navigation bar.
	 * @class layout.overlayFactory
	 */
	return {

		cssClass: 'tabbedNav',

		/**
		 *
		 * @param {Array} [tabs] array of HTMLUlListElements
		 */
		create: function(tabs) {
			var ul = document.createElement('ul');

			ul.className = this.cssClass;

			tabs = tabs || document.createElement('li');
			this.initDnd(tabs);

			return ul;
		},

		initDndAll: function() {
			var nl = document.getElementsByClassName(this.cssClass);

			for (var i = 0, len = nl.length; i < len; i++) {
				this.initDnd(nl[i]);
			}
		},

		/**
		 * @param {HTMLUListElement} [tabContainer] tab container
		 */
		initDnd: function(tabContainer) {
			var self = this,
				tabs = tabContainer.getElementsByTagName('li');

			for (var i = 0, len = tabs.length; i < len; i++) {
				tabs[i].setAttribute('draggable', true);
			}

			// use event delegation for tabs. This allows for easy adding a new tab without having to add the dnd events
			on(tabContainer, 'li:dragstart', function(evt) {
				// enable receiving mouse events on overlays to show where we can drop
				// note: overlays are set not to receive pointer events by default, otherwise we could not drag a tab
				overlayFactory.enableMouseEventsAll();

				self.setDndData(evt, this);
			});

			// disable receiving mouse events on overlays, otherwise we could not drag a tab
			on(tabContainer, 'li:dragend', overlayFactory.enableMouseEventsAll);
		},

		setDndData: function(evt, tab) {
			// note: element order of li element (tab) is assumed to be same as order of section elements (tabContent)
			var cp,
				tabContainer = tab.parentNode,
				idx = domUtil.getElementIndex(tab);

			cp = query(tabContainer).parents('.contentPane')[0];

			// since we cannot dnd a node directly, save reference to it
			dndReference.head = tab;
			dndReference.cont = cp.getElementsByTagName('section')[idx];

			evt.dataTransfer.setData('text/html', tab);  // dummy data to make browser show correct dnd image
			evt.dataTransfer.effectAllowed = 'move';
		},

		getDndData: function() {
			return dndReference;
		},

		/**
		 * Adds a new tab to the content pane.
		 * Adds the head and the content of the tab to the content pane and sets them active.
		 * @param {HTMLDivElement} contentPane cp of target
		 * @param {HTMLUListElement} tab tab of source
		 * @param {HTMLElement} tabContent of source
		 */
		addTab: function(contentPane, tab, tabContent) {
			var sections,
				tabBar = contentPane.getElementsByClassName(this.cssClass)[0];

			// add dragged source tab to target tabBar
			tabBar.appendChild(tab);	// tab = <li>

			// add tab content to target contentPane
			contentPane.appendChild(tabContent);

			// hide all sections and show this section
			sections = contentPane.getElementsByTagName('section');
			for (var i = 0, len = sections.length; i < len; i++) {
				sections[i].classList.add('displayNone');
			}
			sections[i-1].classList.remove('displayNone');
			tab.classList.add('active');
		}
	};
});

