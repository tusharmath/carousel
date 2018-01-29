/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__CarouselModel__ = __webpack_require__(1);

const Container = document.querySelector('.container')

const getTouch = i => i.changedTouches[0]
const setStyle = (el, value) => {
  for (let i in value) {
    if (value.hasOwnProperty(i) && el.style[i] !== value[i]) {
      el.style[i] = value[i]
    }
  }
}
const translateXY = (x, y) => `translate(${x}px, ${y}px)`

class Carousel {
  constructor(win, container) {
    this.bind()
    this.skipScroll = false
    this.container = container
    this.bcr = container.getBoundingClientRect()
    this.selected = 0
    this.childCount = container.childElementCount
    this.model = new __WEBPACK_IMPORTED_MODULE_0__CarouselModel__["a" /* CarouselModel */]({
      heights: Array.from(container.children).map(
        i => i.getBoundingClientRect().height
      ),
      width: container.parentElement.getBoundingClientRect().width
    })
    this.container.addEventListener('touchstart', this.onTouchStart)
    this.container.addEventListener('touchmove', this.onTouchMove)
    this.container.addEventListener('touchend', this.onTouchEnd)
    win.addEventListener('scroll', this.onScroll, true)
    this.updateDOM()
  }

  bind() {
    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
    this.onScroll = this.onScroll.bind(this)
  }

  onScroll(ev) {
    if (this.skipScroll === true) {
      this.skipScroll = false
    } else {
      this.model.onScroll(ev.target.scrollTop)
      this.updateDOM()
    }
  }

  onTouchStart(ev) {
    this.model.onTouchStart(getTouch(ev))
    this.updateDOM()
  }

  onTouchMove(ev) {
    this.model.onTouchMove(getTouch(ev))
    if (this.model.isScrolling() === false) {
      ev.preventDefault()
      this.updateDOM()
    }
  }

  onTouchEnd(ev) {
    this.model.onTouchEnd(getTouch(ev))
    this.updateDOM()
  }

  updateDOM() {
    Array.from(this.container.children).forEach((el, i) => {
      const { translateX, translateY, width } = this.model.layout[i]
      setStyle(el, {
        transform: translateXY(translateX, translateY),
        width: `${width}px`
      })
    })

    setStyle(this.container, {
      transition: this.model.isMoving() ?  '': 'ease-out 300ms',
      height: `${this.model.containerHeight}px`,
      transform: translateXY(this.model.currentX, this.model.currentY)
    })

    if (document.body.scrollTop !== this.model.scrollY) {
      this.skipScroll = true
      document.body.scrollTo(document.body.scrollLeft, this.model.scrollY)
    }
  }
}

new Carousel(window, document.querySelector('.container'))


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const times = (fn, count) => {
  const results = []
  for (let i = 0; i < count; i++) {
    results.push(fn(i))
  }
  return results
}

const merge = (a, b) => {
  return Object.assign({}, a, b)
}

const [HORIZONTAL, VERTICAL, NONE, UNKNOWN] = [0, 1, 2, 3]

class CarouselModel {
  constructor({ heights, width }) {
    this.direction = NONE
    this.currentX = 0
    this.currentY = 0
    this.scrollY = 0
    this.selected = 0
    this.startX = 0
    this.startY = 0
    this.width = width
    this.count = heights.length
    this.layout = times(
      i => ({
        translateX: i * width,
        translateY: 0,
        width: width,
        scrollY: 0
      }),
      heights.length
    )
    this.heights = heights
    this.containerHeight = heights[this.selected]
  }
  onScroll(scrollY) {
    this.scrollY = scrollY
  }
  onTouchStart({ clientX, clientY }) {
    this.direction = UNKNOWN
    this.startX = clientX
    this.startY = clientY
    this.layout = this.layout.map((pos, i) =>
      merge(pos, {
        translateY:
          i === this.selected
            ? pos.translateY
            : this.scrollY - this.layout[i].scrollY,
        scrollY: i === this.selected ? this.scrollY : pos.scrollY
      })
    )
  }
  onTouchMove({ clientX, clientY }) {
    if (this.direction === UNKNOWN) {
      const deltaX = Math.abs(clientX - this.startX)
      const deltaY = Math.abs(clientY - this.startY)
      this.direction = deltaX > deltaY ? HORIZONTAL : VERTICAL
    }
    if (this.direction === HORIZONTAL) {
      this.currentX = clientX - this.startX - this.selected * this.width
    }
  }
  onTouchEnd({ clientX, clientY }) {
    if (this.direction === HORIZONTAL) {
      const delta = this.startX - clientX
      if (Math.abs(delta) > 30) {
        if (delta > 0) {
          this.selected = Math.min(this.count - 1, this.selected + 1)
        } else {
          this.selected = Math.max(0, this.selected - 1)
        }
      }
      this.currentX = -this.selected * this.width
      this.containerHeight = this.heights[this.selected]
      this.layout = this.layout.map((pos, i) =>
        merge(pos, {
          translateY: i === this.selected ? 0 : -pos.scrollY
        })
      )
      this.scrollY = this.layout[this.selected].scrollY
    }
    this.direction = NONE
  }

  isScrolling() {
    return this.direction === VERTICAL
  }
  isMoving() {
    return this.direction !== NONE
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CarouselModel;



/***/ })
/******/ ]);