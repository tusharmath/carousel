import * as R from 'ramda'

export class CarouselModel {
  constructor({ heights, width }) {
    this.currentX = 0
    this.currentY = 0
    this.scrollY = 0
    this.selected = 0
    this.startX = 0
    this.startY = 0
    this.width = width
    this.count = heights.length
    this.layout = R.times(
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
    this.layout = this.layout.map((pos, i) => R.merge(pos, {
      translateY: i === this.selected ? pos.translateY : this.scrollY - this.layout[i].scrollY,
      scrollY: i === this.selected ? this.scrollY : pos.scrollY
    }))
  }
  onTouchStart(clientX) {
    this.startX = clientX
  }
  onTouchMove(clientX) {
    this.currentX = clientX - this.startX - this.selected * this.width
  }
  onTouchEnd(clientX) {
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
    this.layout = this.layout.map((pos, i) => R.merge(pos, {
      translateY: i === this.selected ? 0 : -pos.scrollY
    }))
    this.scrollY = this.layout[this.selected].scrollY
  }
}
