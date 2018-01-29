import * as assert from 'assert'
import { CarouselModel } from '../src/CarouselModel'

suite('CarouselModel', () => {
  test('construct -> layout', () => {
    const c = new CarouselModel({ heights: [100, 200], width: 100 })
    const expected = [
      { translateX: 0, translateY: 0, width: 100, scrollY: 0 },
      { translateX: 100, translateY: 0, width: 100, scrollY: 0 }
    ]

    assert.deepEqual(c.layout, expected)
    assert.deepEqual(c.containerHeight, 100)
  })

  test('onTouchStart', () => {
    const c = new CarouselModel({ heights: [100, 200], width: 100 })
    c.onTouchStart({ clientX: 50, clientY: 0 })
    c.onTouchMove({ clientX: 30, clientY: 0 })
    assert.equal(c.currentX, -20)
  })

  test('onTouchMove -> currentX updates', () => {
    const c = new CarouselModel({ heights: [100, 200], width: 100 })
    c.onTouchStart({ clientX: 50, clientY: 0 })
    c.onTouchMove({ clientX: 45, clientY: 0 })
    c.onTouchEnd({ clientX: 10, clientY: 0 })
    assert.equal(c.selected, 1)
    assert.equal(c.currentX, -100)

    c.onTouchStart({ clientX: 50, clientY: 0 })
    c.onTouchMove({ clientX: 40, clientY: 0 })
    assert.equal(c.currentX, -110)
    c.onTouchMove({ clientX: 30, clientY: 0 })
    assert.equal(c.currentX, -120)
  })

  test('onTouchEnd -> selected remains unchanged', () => {
    const c = new CarouselModel({ heights: [100, 200], width: 100 })
    c.onTouchStart({ clientX: 50, clientY: 0 })
    c.onTouchMove({ clientX: 30, clientY: 0 })
    c.onTouchEnd({ clientX: 30, clientY: 0 })

    assert.equal(c.selected, 0)
    assert.equal(c.currentX, 0)
    assert.equal(c.containerHeight, 100)
  })

  test('onTouchEnd -> selected increases', () => {
    const c = new CarouselModel({ heights: [100, 200], width: 100 })
    c.onTouchStart({ clientX: 50, clientY: 0 })
    c.onTouchMove({ clientX: 10, clientY: 0 })
    c.onTouchEnd({ clientX: 10, clientY: 0 })

    assert.equal(c.selected, 1)
    assert.equal(c.currentX, -100)
    assert.equal(c.containerHeight, 200)
  })

  test('onTouchEnd -> selected remains unchanged at right most', () => {
    const c = new CarouselModel({ heights: [100, 200], width: 100 })
    c.onTouchStart({ clientX: 50, clientY: 0 })
    c.onTouchMove({ clientX: 45, clientY: 0 })
    c.onTouchEnd({ clientX: 10, clientY: 0 })
    c.onTouchStart({ clientX: 50, clientY: 0 })
    c.onTouchMove({ clientX: 45, clientY: 0 })
    c.onTouchEnd({ clientX: 10, clientY: 0 })

    assert.equal(c.selected, 1)
    assert.equal(c.currentX, -100)
    assert.equal(c.containerHeight, 200)
  })

  test('onTouchEnd -> selected remains unchanged at left most', () => {
    const c = new CarouselModel({ heights: [100, 200], width: 100 })
    c.onTouchStart({ clientX: 50, clientY: 0 })
    c.onTouchEnd({ clientX: 90, clientY: 0 })
    assert.equal(c.selected, 0)
    assert.equal(c.currentX, 0)
    assert.equal(c.containerHeight, 100)
  })

  test('onTouchEnd -> selected remains unchanged if its a vertical scroll', () => {
    const c = new CarouselModel({ heights: [100, 200], width: 100 })
    c.onTouchStart({ clientX: 0, clientY: 0 })
    c.onTouchMove({ clientX: -10, clientY: 20 })
    c.onTouchEnd({ clientX: -40, clientY: 20 })
    assert.equal(c.selected, 0)
    assert.equal(c.currentX, 0)
    assert.equal(c.containerHeight, 100)
  })

  test('onScroll -> updates scroll', () => {
    const c = new CarouselModel({ heights: [100, 200], width: 100 })
    c.onScroll(100)
    assert.equal(c.scrollY, 100)
  })

  test('onScroll -> updates layout', () => {
    const c = new CarouselModel({ heights: [50, 100, 10], width: 100 })
    c.onScroll(10)
    c.onScroll(11)
    c.onScroll(12)
    c.onTouchStart({ clientX: 0, clientY: 0 })

    assert.deepEqual(c.layout, [
      { translateX: 0, translateY: 0, width: 100, scrollY: 12 },
      { translateX: 100, translateY: 12, width: 100, scrollY: 0 },
      { translateX: 200, translateY: 12, width: 100, scrollY: 0 }
    ])
  })

  test('onScroll -> update translateY', () => {
    const c = new CarouselModel({ heights: [50, 100, 10], width: 100 })
    c.onScroll(5)

    c.onTouchStart({ clientX: 50, clientY: 0 })
    assert.deepEqual(c.layout, [
      { translateX: 0, translateY: 0, width: 100, scrollY: 5 },
      { translateX: 100, translateY: 5, width: 100, scrollY: 0 },
      { translateX: 200, translateY: 5, width: 100, scrollY: 0 }
    ])

    c.onTouchMove({ clientX: 10, clientY: 0 })
    c.onTouchEnd({ clientX: 10, clientY: 0 })

    assert.equal(c.containerHeight, 100)
    assert.equal(c.scrollY, 0)
    assert.deepEqual(c.layout, [
      { translateX: 0, translateY: -5, width: 100, scrollY: 5 },
      { translateX: 100, translateY: 0, width: 100, scrollY: 0 },
      { translateX: 200, translateY: 0, width: 100, scrollY: 0 }
    ])

    c.onScroll(7)
    c.onTouchStart({ clientX: 50, clientY: 0 })

    assert.deepEqual(c.layout, [
      { translateX: 0, translateY: 2, width: 100, scrollY: 5 },
      { translateX: 100, translateY: 0, width: 100, scrollY: 7 },
      { translateX: 200, translateY: 7, width: 100, scrollY: 0 }
    ])

    c.onTouchMove({ clientX: 90, clientY: 0 })
    c.onTouchEnd({ clientX: 90, clientY: 0 })

    assert.equal(c.containerHeight, 50)
    assert.equal(c.scrollY, 5)
    assert.deepEqual(c.layout, [
      { translateX: 0, translateY: 0, width: 100, scrollY: 5 },
      { translateX: 100, translateY: -7, width: 100, scrollY: 7 },
      { translateX: 200, translateY: 0, width: 100, scrollY: 0 }
    ])
  })

  test('isMoving', () => {
    const c = new CarouselModel({ heights: [50, 100, 10], width: 100 })
    assert.ok(c.isMoving() === false)
    c.onTouchStart({ clientX: 0, clientY: 0 })
    assert.ok(c.isMoving() === true)
    c.onTouchEnd({ clientX: 0, clientY: 0 })
    assert.ok(c.isMoving() === false)
  })

  test('currentX', () => {
    const c = new CarouselModel({ heights: [50, 100, 10], width: 100 })
    c.onTouchStart({ clientX: 0, clientY: 0 })
    c.onTouchMove({ clientX: 10, clientY: 50 })
    assert.ok(c.isScrolling() === true)
    assert.equal(c.currentX, 0)

    c.onTouchMove({ clientX: 10, clientY: 5 })
    assert.equal(c.currentX, 0)
    assert.ok(c.isScrolling() === true)

    c.onTouchEnd({ clientX: 10, clientY: 5 })
    assert.ok(c.isScrolling() === false)
    assert.ok(c.isMoving() === false)
  })
})
