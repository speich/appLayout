/**
 * This file contains a the class to create an overlay.
 * An overlay shows the user that he can drop a pane.
 * @module layout/tabBarFactory
 * @see layout.tabBarFactory
 */
define(['dojo/on'], function(on) {
    'use strict';

    /**
     * Factory to create overlays for a contentPane.
     * @class layout.overlayFactory
     */
     return {

         /**
          *
          * @param {Array} [tabs] array of HTMLUlListElements
          */
         create: function(tabs) {
             var ul = document.createElement('ul');

             ul.className = 'tabs';

             tabs = tabs || document.createElement('li');
             this.initDnd(tabs);

             return ul;
         },

         /**
          * @param {Array} [tabs] array of HTMLUlListElements
          */
         initDnd: function(tabs) {

             for (var i = 0, len = tabs.length; i < len; i++) {
                 tabs[i].setAttribute('draggable', true);


                 on(tabs[i], 'dragstart', function (evt) {
                     var i, len, node, tabs;

                     // enable receiving mouse events on overlays to show where we can drop
                     // note: overlays are set not to receive pointer events, otherwise we could not drag a tab, because they
                     tabs = document.getElementsByClassName('overlayContainer');
                     for (i = 0, len = tabs.length; i < len; i++) {
                         tabs[i].classList.remove('noPointerEvents');
                     }

                     node = this.parentNode;
                     evt.dataTransfer.setData('text/html', node);
                     evt.dataTransfer.effectAllowed = 'move';
                 });

                 // disable receiving mouse events on overlays, otherwise we could not drag a tab
                 on(tabs[i], 'dragend', function () {
                     var i, len, nl = document.getElementsByClassName('overlayContainer');

                     for (i = 0, len = nl.length; i < len; i++) {
                         nl[i].classList.add('noPointerEvents');
                     }
                 });
             }
         }

     }
});

