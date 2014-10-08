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
				tab = tabBarFactory.getDndData(),
				flexDir, tabOrder;

			if (cl.contains('middleOverlay')) {
				// add new tab
				tabBarFactory.addTab(targetContainer, tab.head, tab.cont);
			}
			else if (cl.contains('edgeOverlay')) {
				if (isDivider) {
					// dropping on divider
					paneFactory.splitContentPane(targetContainer, tab.head, tab.cont);
				}
				else {
					// add new container (where? top left bottom right?)
					// use css order property together with flex-direction to find which edge we dropped on
					// -> convert contentPane to paneContainer and add old and new panes to it

				}
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
						type: nl[i].classList.contains('rowDivider') ? 'row' : 'col'
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