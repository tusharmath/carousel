import * as assert from 'assert'
import {CarouselStatus} from '../src/CarouselStatus'

suite('CarouselStatus', () => {
  test('construct -> positions', () => {
    const actual = new CarouselStatus(2, 100).positions
    const expected = [
      { translateX: 0, translateY: 0 },
      { translateX: 100, translateY: 0 }
    ]
    assert.deepEqual(actual, expected)
  })

  test('onTouchStart', () => {
    const c = new CarouselStatus(2, 100)
    c.onTouchStart({ clientX: 50 })
    c.onTouchMove({ clientX: 30 })
    assert.equal(c.currentX, -20)
  })

  test('onTouchEnd -> selected remains unchanged', () => {
    const c = new CarouselStatus(2, 100)
    c.onTouchStart({ clientX: 50 })
    c.onTouchMove({ clientX: 30 })
    c.onTouchEnd({ clientX: 30 })
    assert.equal(c.selected, 0)
    assert.equal(c.currentX, 0)
  })

  test('onTouchEnd -> selected increases', () => {
    const c = new CarouselStatus(2, 100)
    c.onTouchStart({ clientX: 50 })
    c.onTouchMove({ clientX: 10 })
    c.onTouchEnd({ clientX: 10 })
    assert.equal(c.selected, 1)
    assert.equal(c.currentX, -100)
  })

  test('onTouchEnd -> selected remains unchanged at right most', () => {
    const c = new CarouselStatus(2, 100)
    c.onTouchStart({ clientX: 50 })
    c.onTouchEnd({ clientX: 10 })
    c.onTouchStart({ clientX: 50 })
    c.onTouchEnd({ clientX: 10 })
    assert.equal(c.selected, 1)
    assert.equal(c.currentX, -100)
  })

  test('onTouchEnd -> selected remains unchanged at left most', () => {
    const c = new CarouselStatus(2, 100)
    c.onTouchStart({ clientX: 50 })
    c.onTouchEnd({ clientX: 90 })
    assert.equal(c.selected, 0)
    assert.equal(c.currentX, 0)
  })
})
