export const init = (count) => {
  return {
    positions: R.times(
      R.applySpec({
        translateX: R.compose()
      }),
      count
    )
  }
}
export const update = () => {

}