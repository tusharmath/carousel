import { CarouselStatus } from './CarouselStatus'
import * as R from 'ramda'
const Container = document.querySelector('.container')

const getX = R.compose(R.prop('clientX'), R.head, R.prop('changedTouches'))
const getY = R.compose(R.prop('clientY'), R.head, R.prop('changedTouches'))
const setStyle = (el, value) => {
  for (let i in value) {
    if (el.style[i] !== value[i]) {
      el.style[i] = value[i]
    }
  }
}
const translateXY = (x, y) => `translate(${x}px, ${y}px)`

class Carousel {
  constructor(win, container) {
    this.bind()
    this.container = container
    this.bcr = container.getBoundingClientRect()
    this.selected = 0
    this.childCount = container.childElementCount
    this.carousel = new CarouselStatus({
      heights: Array.from(container.children).map(
        i => i.getBoundingClientRect().height
      ),
      width: container.parentElement.getBoundingClientRect().width
    })
    this.container.addEventListener('touchstart', this.onTouchStart, {
      passive: true
    })
    this.container.addEventListener('touchmove', this.onTouchMove, {
      passive: true
    })
    this.container.addEventListener('touchend', this.onTouchEnd, {
      passive: true
    })
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
    this.carousel.onScroll(ev)
    this.updateDOM()
  }

  onTouchStart(ev) {
    this.carousel.onTouchStart(getX(ev))
    this.updateDOM()
  }

  onTouchMove(ev) {
    this.carousel.onTouchMove(getX(ev))
    console.log(this.carousel)
    this.updateDOM()
  }

  onTouchEnd(ev) {
    this.carousel.onTouchEnd(getX(ev))
    this.updateDOM()
  }
  updateDOM() {
    Array.from(this.container.children).forEach((el, i) => {
      const { translateX, translateY, width } = this.carousel.positions[i]
      setStyle(el, {
        transform: translateXY(translateX, translateY),
        width: `${width}px`
      })
    })

    setStyle(this.container, {
      height: this.carousel.containerHeight,
      transform: translateXY(this.carousel.currentX, this.carousel.currentY)
    })
  }
}

new Carousel(window, document.querySelector('.container'))
