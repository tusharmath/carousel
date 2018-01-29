const times = (fn, count) => {
  const results = []
  for(let i = 0; i < count; i++) {
    results.push(fn(i))
  }
  return results
}

const merge = (a, b) => {
  return Object.assign({}, a, b)
}

export class CarouselModel {
  constructor({ heights, width }) {
    this.isMoving = false
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
  onTouchStart(clientX) {
    this.isMoving = true
    this.startX = clientX
    this.layout = this.layout.map((pos, i) => merge(pos, {
      translateY: i === this.selected ? pos.translateY : this.scrollY - this.layout[i].scrollY,
      scrollY: i === this.selected ? this.scrollY : pos.scrollY
    }))
  }
  onTouchMove(clientX) {
    this.currentX = clientX - this.startX - this.selected * this.width
  }
  onTouchEnd(clientX) {
    this.isMoving = false
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
    this.layout = this.layout.map((pos, i) => merge(pos, {
      translateY: i === this.selected ? 0 : -pos.scrollY
    }))
    this.scrollY = this.layout[this.selected].scrollY
  }
}
