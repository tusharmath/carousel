import { CarouselModel } from './CarouselModel'
const Container = document.querySelector('.container')

const getX = (i) => i.changedTouches[0].clientX
const getY = (i) => i.changedTouches[0].clientY
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
    this.model = new CarouselModel({
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
    if (this.skipScroll === true) {
      this.skipScroll = false
    } else {
      this.model.onScroll(ev.target.scrollTop)
      this.updateDOM()
    }
  }

  onTouchStart(ev) {
    this.model.onTouchStart(getX(ev))
    this.updateDOM()
  }

  onTouchMove(ev) {
    this.model.onTouchMove(getX(ev))
    this.updateDOM()
  }

  onTouchEnd(ev) {
    this.model.onTouchEnd(getX(ev))
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
