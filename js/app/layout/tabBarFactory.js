/**
 * This file contains a class to create a tabbed navigatio.
 * @module layout/tabBarFactory
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
			this.initEvents(ul);

			return ul;
		},

		/**
		 *
		 * @param {HTMLUListElement} ul
		 */
		initEvents: function(ul) {
			let self = this,
				contentPane = ul;

			while (!contentPane.classList.contains('contentPane')) {
				contentPane = contentPane.parentNode;
			}
			on(ul, 'li:click', function(){
				self.showContent(this, contentPane);
				self.setActive(this, contentPane);
			});
		},

		/**
		 * Initialize dragging for all tabs.
		 */
		initDndAll: function() {
			var node, nl = document.getElementsByClassName(this.cssClass);

			for (node of nl) {
				this.initDnd(node);
			}
		},

		/**
		 * Initialize dragging of a tab.
		 * @param {HTMLUListElement} tabContainer tab container
		 */
		initDnd: function(tabContainer) {
			var tabs = tabContainer.getElementsByTagName('li');

			for (var i = 0, len = tabs.length; i < len; i++) {
				tabs[i].setAttribute('draggable', true);
			}

			// use event delegation for tabs. This allows for easy adding a new tab without having to add the dnd events to each (new or moved) tab.
			on(tabContainer, 'li:dragstart', function(evt) {
				// enable receiving mouse events on overlays to show where we can drop
				// note: overlays are set not to receive pointer events by default, otherwise we could not drag a tab in the first place
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
		 * @param {HTMLLIElemen} tab tab of source
		 * @param {HTMLElement} tabContent of source
		 */
		addTab: function(contentPane, tab, tabContent) {
			var tabBar = contentPane.getElementsByClassName(this.cssClass)[0];

			// append dragged source tab to target tabBar
			tabBar.appendChild(tab);	// tab = <li>

			// append tab content to target contentPane
			contentPane.appendChild(tabContent);

			// hide other tabs, show current tab
			this.showContent(tab, contentPane);
			this.setActive(tab, contentPane);

		},

		/**
		 * Return the number of tabs in the tab bar.
		 * @param {HTMLDivElement} contentPane containing tab bar
		 * @return {number}
		 */
		getNumTabs: function(contentPane) {
			var tabBar = contentPane.getElementsByClassName(this.cssClass)[0];

			return tabBar.getElementsByTagName('li') ? tabBar.getElementsByTagName('li').length : 0;
		},

		/**
		 * Return the index of a tab in the tab bar.
		 * @param {HTMLLIElement} tab
		 * @return {Number}
		 */
		getIndex: function(tab) {
			let i, len, nl = tab.parentNode.children;

			for (i = 0, len = nl.length; i < len; i++) {
				if(nl[i] === tab) {
					return i;
				}
			}

			return i;
		},


		/**
		 * Show content
		 * @param {HTMLDivElement} contentPane div containing tab bar
		 */
		showContent: function(currTab, contentPane) {
			let sections = contentPane.getElementsByTagName('section');

			for (var i = 0, len = sections.length; i < len; i++) {
				sections[i].classList.add('displayNone');
			}
			sections[this.getIndex(currTab)].classList.remove('displayNone');
		},

		/**
		 * Set current tab as active.
		 * @param {HTMLLIElement} currTab
		 * @param contentPane
		 */
		setActive: function(currTab, contentPane) {
			let tabs = contentPane.querySelectorAll('.' + this.cssClass + ' li.active');

			for (let tab of tabs) {
				tab.classList.remove('active');
			}
			currTab.classList.add('active');
		}
	};
});

