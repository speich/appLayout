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
			tabBarFactory.initDndAll();

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
				flexDir, tabOrder, tab;

			if (cl.contains('middleOverlay')) {
				// add new tab
				tab = tabBarFactory.getDndData();
				tabBarFactory.addTab(targetContainer, tab.head, tab.cont);
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