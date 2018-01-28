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
    c.onTouchStart(50)
    c.onTouchMove(30)

    assert.equal(c.currentX, -20)
  })

  test('onTouchMove -> currentX updates', () => {
    const c = new CarouselModel({ heights: [100, 200], width: 100 })
    c.onTouchStart(50)
    c.onTouchEnd(10)
    assert.equal(c.selected, 1)
    assert.equal(c.currentX, -100)

    c.onTouchStart(50)
    c.onTouchMove(40)
    assert.equal(c.currentX, -110)
    c.onTouchMove(30)
    assert.equal(c.currentX, -120)
  })

  test('onTouchEnd -> selected remains unchanged', () => {
    const c = new CarouselModel({ heights: [100, 200], width: 100 })
    c.onTouchStart(50)
    c.onTouchMove(30)
    c.onTouchEnd(30)

    assert.equal(c.selected, 0)
    assert.equal(c.currentX, 0)
    assert.equal(c.containerHeight, 100)
  })

  test('onTouchEnd -> selected increases', () => {
    const c = new CarouselModel({ heights: [100, 200], width: 100 })
    c.onTouchStart(50)
    c.onTouchMove(10)
    c.onTouchEnd(10)

    assert.equal(c.selected, 1)
    assert.equal(c.currentX, -100)
    assert.equal(c.containerHeight, 200)
  })

  test('onTouchEnd -> selected remains unchanged at right most', () => {
    const c = new CarouselModel({ heights: [100, 200], width: 100 })
    c.onTouchStart(50)
    c.onTouchEnd(10)
    c.onTouchStart(50)
    c.onTouchEnd(10)

    assert.equal(c.selected, 1)
    assert.equal(c.currentX, -100)
    assert.equal(c.containerHeight, 200)
  })

  test('onTouchEnd -> selected remains unchanged at left most', () => {
    const c = new CarouselModel({ heights: [100, 200], width: 100 })
    c.onTouchStart(50)
    c.onTouchEnd(90)
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
    c.onTouchStart(0)

    assert.deepEqual(c.layout, [
      { translateX: 0, translateY: 0, width: 100, scrollY: 12 },
      { translateX: 100, translateY: 12, width: 100, scrollY: 0 },
      { translateX: 200, translateY: 12, width: 100, scrollY: 0 }
    ])
  })

  test('onScroll -> update translateY', () => {
    const c = new CarouselModel({ heights: [50, 100, 10], width: 100 })
    c.onScroll(5)

    c.onTouchStart(50)
    assert.deepEqual(c.layout, [
      { translateX: 0, translateY: 0, width: 100, scrollY: 5 },
      { translateX: 100, translateY: 5, width: 100, scrollY: 0 },
      { translateX: 200, translateY: 5, width: 100, scrollY: 0 }
    ])

    c.onTouchMove(10)
    c.onTouchEnd(10)

    assert.equal(c.containerHeight, 100)
    assert.equal(c.scrollY, 0)
    assert.deepEqual(c.layout, [
      { translateX: 0, translateY: -5, width: 100, scrollY: 5 },
      { translateX: 100, translateY: 0, width: 100, scrollY: 0 },
      { translateX: 200, translateY: 0, width: 100, scrollY: 0 }
    ])


    c.onScroll(7)
    c.onTouchStart(50)

    assert.deepEqual(c.layout, [
      { translateX: 0, translateY: 2, width: 100, scrollY: 5 },
      { translateX: 100, translateY: 0, width: 100, scrollY: 7 },
      { translateX: 200, translateY: 7, width: 100, scrollY: 0 }
    ])

    c.onTouchMove(90)
    c.onTouchEnd(90)

    assert.equal(c.containerHeight, 50)
    assert.equal(c.scrollY, 5)
    assert.deepEqual(c.layout, [
      { translateX: 0, translateY: 0, width: 100, scrollY: 5 },
      { translateX: 100, translateY: -7, width: 100, scrollY: 7 },
      { translateX: 200, translateY: 0, width: 100, scrollY: 0 }
    ])
  })
})
