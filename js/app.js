define([
	'dojo/_base/lang',
	'dojo/on',
	'dojo/query',
	'appLayout/layout/Divider',
	'appLayout/layout/overlayFactory',
	'appLayout/layout/paneFactory',
	'appLayout/layout/tabBarFactory',
	'dojo/NodeList-traverse'
], function(lang, on, query, Divider, overlayFactory, paneFactory, tabBarFactory) {
	'use strict';

	var d = document,
		byId = function(id) {
			return d.getElementById(id);
		};


	return {

		init: function() {
			this.initEvents();
			this.initDividers();
			this.initDnd();
		},

		initDnd: function() {
			var nl = d.querySelectorAll('.tabs li');

			// TODO: this should also be applied on overlays created after calling drop() -> splitContentPane, which adds a new divider
			tabBarFactory.initDnd(nl);

			on(d.getElementsByTagName('main')[0], '.overlayContainer:drop', lang.hitch(this, function(evt) {
				this.drop(evt);
			}));	//
		},

		drop: function(evt) {
			var cpSource = this.parentNode,
				overlay = evt.target,
				cl = overlay.classList,
				overlayContainer = query(overlay).parents('.overlayContainer')[0],
				targetContainer = query(overlayContainer).parents('.contentPane, .paneDivider')[0],
				isDivider = targetContainer.classList.contains('paneDivider'),
				flexDir, tabOrder, tab, tabNav;

			if (cl.contains('middleOverlay')) {
				// add to tabs
				tab = evt.dataTransfer.getData('text/html');
				this.addTab(targetContainer, tab.li, tab.section);

			}
			else if (cl.contains('edgeOverlay')) {
				flexDir = d.defaultView.getComputedStyle(overlayContainer, '').getPropertyValue('flex-direction');
				tabOrder = d.defaultView.getComputedStyle(overlay, '').getPropertyValue('order');
				console.log(flexDir, overlay, tabOrder);
				if (isDivider) {
					// dropping on divider
				}
				else {
					// add new container (where? top left bottom right?)
					// use css order property together with flex-direction to find which edge we dropped on
					// -> convert contentPane to paneContainer and add old and new panes to it

				}
			}
		},

		/**
		 *
		 * @param cpTarget cp of target
		 * @param tab tab of source
		 * @param tabContent content of source
		 */
		splitContentPane: function(cpTarget, tab, tabContent) {
			var paneContainer, containerType, cp, divider;

			containerType = cpTarget.parentNode.classList.contains('rowContainer') ? 'col' : 'row';

			divider = Divider.create(containerType);
			cp = paneFactory.createContentPane(tab, tabContent);

			// 1. insert new paneContainer before existing contentPane
			paneContainer = paneFactory.createPaneContainer(containerType);
			cpTarget.parentNode.insertBefore(paneContainer);

			// 2a.
			if (position === 'first') {	// left or top
				// dropped on top/left overlay (insert before):
				// append tab/tabContent as new contentPane to paneContainer, then add a divider and already existing contentPane
				paneContainer.appendChild(cp);
				paneContainer.appendChild(divider);
				paneContainer.appendChild(cpTarget);

			}
			// 2b
			else {// right or bottom
				// dropped on right / bottom overlay (insert after):
				// append already existing paneContainer to new paneContainer, then add a divider and the tab/tabContent as a new contentPane
				paneContainer.appendChild(cpTarget);
				paneContainer.appendChild(divider);
				paneContainer.appendChild(cp);
			}
		},

		/**
		 *
		 * @param contentPane cp of target
		 * @param tab tab of source
		 * @param {HTMLSectionElement} tabContent of source
		 */
		addTab: function(contentPane, tab, tabContent) {
			var sections, i, len;

			var tabBar = contentPane.getElementsByClassName('tabs')[0];



			// add dragged source tab (HTMLUlListElement) to target tabBar
			tabBar.appendChild(tab)	// tab = <li>

			// add tab content (HTMLSectionElement) to target contentPane
			contentPane.appendChild(tabContent);

			// hide all sections and show this section
			sections = contentPane.getElementsByTagName('section');
			for (i = 0, len = sections.length; i < len; i++) {
				sections[i].classList.add('displayNone');
			}
			tab.classList.remove('displayNone');
		},

		initPanes: function() {},

		initDividers: function() {
			var i, len,
				nl = d.getElementsByClassName('paneDivider');

			// init dividers
			for (i = 0, len = nl.length; i < len; i++) {
				var nextNode, prevNode,
					divider = new Divider({
						type: nl[i].classList.contains('rowDivider') ? 'horizontal' : 'vertical'
					});

				prevNode = query(nl[i]).prev()[0];
				nextNode = query(nl[i]).next()[0];
				divider.init(nl[i], prevNode, nextNode);
			}
		},

		initEvents: function() {
			var i, len,
				nl = d.getElementsByClassName('overlay');

			for (i = 0, len = nl.length; i < len; i++) {
				overlayFactory.initDnd(nl[i]);
			}
		}
	};
});