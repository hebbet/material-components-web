/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {MDCComponent} from '@material/base';
import MDCSimpleMenuFoundation from './foundation';
import {getTransformPropertyName} from '../util';

export {MDCSimpleMenuFoundation};

export class MDCSimpleMenu extends MDCComponent {
  static attachTo(root) {
    return new MDCSimpleMenu(root);
  }

  get open() {
    return this.foundation_.isOpen();
  }

  set open(value) {
    if (value) {
      this.foundation_.open();
    } else {
      this.foundation_.close();
    }
  }

  show({focusIndex = null} = {}) {
    this.foundation_.open({focusIndex: focusIndex});
  }

  hide() {
    this.foundation_.close();
  }

  /* Return the item container element inside the component. */
  get itemsContainer_() {
    return this.root_.querySelector(MDCSimpleMenuFoundation.strings.ITEMS_SELECTOR);
  }

  /* Return the items within the menu. Note that this only contains the set of elements within
   * the items container that are proper list items, and not supplemental / presentational DOM
   * elements.
   */
  get items() {
    const {itemsContainer_: itemsContainer} = this;
    return [].slice.call(itemsContainer.querySelectorAll('.mdc-list-item[role]'));
  }

  getDefaultFoundation() {
    return new MDCSimpleMenuFoundation({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      hasClass: (className) => this.root_.classList.contains(className),
      hasNecessaryDom: () => Boolean(this.itemsContainer_),
      getInnerDimensions: () => {
        const {itemsContainer_: itemsContainer} = this;
        return {width: itemsContainer.offsetWidth, height: itemsContainer.offsetHeight};
      },
      hasAnchor: () => this.root_.parentElement && this.root_.parentElement.classList.contains('mdc-menu-anchor'),
      getAnchorDimensions: () => this.root_.parentElement.getBoundingClientRect(),
      getWindowDimensions: () => {
        return {width: window.innerWidth, height: window.innerHeight};
      },
      setScale: (x, y) => {
        this.root_.style[getTransformPropertyName(window)] = `scale(${x}, ${y})`;
      },
      setInnerScale: (x, y) => {
        this.itemsContainer_.style[getTransformPropertyName(window)] = `scale(${x}, ${y})`;
      },
      getNumberOfItems: () => this.items.length,
      registerInteractionHandler: (type, handler) => this.root_.addEventListener(type, handler),
      deregisterInteractionHandler: (type, handler) => this.root_.removeEventListener(type, handler),
      registerDocumentClickHandler: (handler) => document.addEventListener('click', handler),
      deregisterDocumentClickHandler: (handler) => document.removeEventListener('click', handler),
      getYParamsForItemAtIndex: (index) => {
        const {offsetTop: top, offsetHeight: height} = this.items[index];
        return {top, height};
      },
      setTransitionDelayForItemAtIndex: (index, value) =>
        this.items[index].style.setProperty('transition-delay', value),
      getIndexForEventTarget: (target) => this.items.indexOf(target),
      notifySelected: (evtData) => this.emit(MDCSimpleMenuFoundation.strings.SELECTED_EVENT, {
        index: evtData.index,
        item: this.items[evtData.index],
      }),
      notifyCancel: () => this.emit(MDCSimpleMenuFoundation.strings.CANCEL_EVENT),
      saveFocus: () => {
        this.previousFocus_ = document.activeElement;
      },
      restoreFocus: () => {
        if (this.previousFocus_) {
          this.previousFocus_.focus();
        }
      },
      isFocused: () => document.activeElement === this.root_,
      focus: () => this.root_.focus(),
      getFocusedItemIndex: () => this.items.indexOf(document.activeElement),
      focusItemAtIndex: (index) => this.items[index].focus(),
      isRtl: () => getComputedStyle(this.root_).getPropertyValue('direction') === 'rtl',
      setTransformOrigin: (origin) => {
        this.root_.style[`${getTransformPropertyName(window)}-origin`] = origin;
      },
      setPosition: (position) => {
        this.root_.style.left = 'left' in position ? position.left : null;
        this.root_.style.right = 'right' in position ? position.right : null;
        this.root_.style.top = 'top' in position ? position.top : null;
        this.root_.style.bottom = 'bottom' in position ? position.bottom : null;
      },
      getAccurateTime: () => window.performance.now(),
    });
  }
}
