/**
 * This file contains a the class to create an overlay.
 * An overlay shows the user that he can drop a pane.
 * @module layout/tabBarFactory
 * @see layout.tabBarFactory
 */
define([
	'dojo/on',
	'./overlayFactory',
	'../dndManager',
	'dojo/NodeList-traverse'], function(on, overlayFactory, dndManager) {
	'use strict';

	/**
	 * Factory to create tabs and a tabbed navigation bar.
	 * @class layout.overlayFactory
	 */
	return {

		cssClass: 'tabbedNav',

		/**
		 * Create a tab bar with a least one tab.
		 * @param {Array} tabs array of HTMLLIElements
		 */
		create: function(tabs) {
			var ul = document.createElement('ul');

			ul.className = this.cssClass;
			for (var i = 0, len = tabs.length; i < len; i++) {
				ul.appendChild(tabs[i]);
			}
			this.initDnd(ul);

			return ul;
		},

		/**
		 * Initialize dragging for all tabs.
		 */
		initDndAll: function() {
			var nl = document.getElementsByClassName(this.cssClass);

			for (var i = 0, len = nl.length; i < len; i++) {
				this.initDnd(nl[i]);
			}
		},

		/**
		 * Initialize dragging of a tab.
		 * @param {HTMLUListElement} tabContainer tab container
		 */
		initDnd: function(tabContainer) {
			var self = this,
				tabs = tabContainer.getElementsByTagName('li');

			for (var i = 0, len = tabs.length; i < len; i++) {
				tabs[i].setAttribute('draggable', true);
			}

			// use event delegation for tabs. This allows for easy adding a new tab without having to add the dnd events to each (new or moved) tab.
			on(tabContainer, 'li:dragstart', function(evt) {
				// enable receiving mouse events on overlays to show where we can drop
				// note: overlays are set not to receive pointer events by default, otherwise we could not drag a tab
				overlayFactory.enableMouseEventsAll(true);
				dndManager.setDndData(evt, this);
			});

			// disable receiving mouse events on overlays, otherwise we could not drag a tab
			on(tabContainer, 'li:dragend', function() {
				overlayFactory.enableMouseEventsAll(false);
			});
		},

		/**
		 * Adds a new tab to the content pane.
		 * Adds the head and the content of the tab to the content pane and sets them active.
		 * @param {HTMLDivElement} contentPane cp of target
		 * @param {HTMLLIElement} tab tab of source
		 * @param {HTMLElement} tabContent of source
		 */
		addTab: function(contentPane, tab, tabContent) {
			var sections, tabs,
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
			tabs = contentPane.querySelectorAll('.tabbedNav li.active');
			for (let t of tabs) {
				t.classList.remove('active');
			}
			tab.classList.add('active');
		},

		/**
		 * Return the number of tabs in the tab bar.
		 * @param {HTMLDivElement} contentPane containing tab bar
		 * @return {number}
		 */
		getNumTabs: function(contentPane) {
			var tabBar = contentPane.getElementsByClassName(this.cssClass)[0];

			return tabBar.getElementsByTagName('li') ? tabBar.getElementsByTagName('li').length : 0;
		}
	};
});

