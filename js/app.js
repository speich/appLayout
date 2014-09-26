define([
	'dojo/_base/lang',
	'dojo/on',
	'dojo/query',
	'appLayout/layout/Divider',
	'appLayout/layout/overlayFactory',
	'dojo/NodeList-traverse'
], function(lang, on, query, Divider, overlayFactory) {
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
			var i, nl, len;

			nl = d.querySelectorAll('.tabs li');
			for (i = 0, len = nl.length; i < len; i++) {
				nl[i].setAttribute('draggable', true);

				on(nl[i], 'dragstart', function(evt) {
					var i, len, node, nl;

					// enable receiving mouse events on overlays to show where we can drop
					// note: overlays are set not to receive pointer events, otherwise we could not drag a tab, because they
					nl = d.getElementsByClassName('overlayContainer');
					for (i = 0, len = nl.length; i < len; i++) {
						nl[i].classList.remove('noPointerEvents');
					}

					node = this.parentNode;
					evt.dataTransfer.setData('text/html', node);
					evt.dataTransfer.effectAllowed = 'move';
				});

				// disable receiving mouse events on overlays, otherwise we could not drag a tab
				on(nl[i], 'dragend', function() {
					var i, len, nl = d.getElementsByClassName('overlayContainer');

					for (i = 0, len = nl.length; i < len; i++) {
						nl[i].classList.add('noPointerEvents');
					}
				});
			}

			on(d.getElementsByTagName('main')[0], '.overlayContainer:drop', this.drop);
		},

		drop: function(evt) {
			var overlay = evt.target,
				overlayContainer = overlay.parentNode,
				overlays = overlayContainer.children,
				targetContainer = overlayContainer.parentNode,
				isDivider = targetContainer.classList.contains('paneDivider'),
				flexDir, tabNav,
				elIdx,
				cl = overlay.classList;

			console.log(this);

			if (cl.contains('overlayMiddle')) {
				// add to tabs
				tabNav = targetContainer.getElementsByClassName('tabs')[0];
				console.log(tabNav);
			}
			else if (cl.contains('overlayEdge')) {
				flexDir = d.defaultView.getComputedStyle(overlayContainer, '').getPropertyValue('flex-direction');
				console.log(flexDir, overlay);
				if (isDivider) {
					// dropping on divider

					//targetContainer.insertBefore()

				}
				else {
					// find if we dropped on first or last child, e.g. top, left, bottom or right overlay to know where to insert new cp
					elIdx = Array.prototype.indexOf.call(overlays, overlay);

					console.log(elIdx, overlays.length);
					// add new container (where did we drop? top left bottom right?)
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