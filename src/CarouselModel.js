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

export class CarouselModel {
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
