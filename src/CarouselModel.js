import * as R from 'ramda'

export class CarouselModel {
  constructor({ heights, width }) {
    this.currentX = 0
    this.currentY = 0
    this.startX = 0
    this.startY = 0
    this.width = width
    this.count = heights.length
    this.selected = 0
    this.positions = R.times(
      i => ({
        translateX: i * width,
        translateY: 0,
        width: width
      }),
      heights.length
    )
    this.heights = heights
    this.containerHeight = heights[this.selected]
  }
  onScroll(scrollY) {}
  onTouchStart(clientX) {
    this.startX = clientX
  }
  onTouchMove(clientX) {
    this.currentX = (clientX - this.startX) -this.selected * this.width
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
  }
}
