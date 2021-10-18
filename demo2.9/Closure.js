function asyncFunction (callback) {
  setTimeout(callback, 200)
}

let color = 'blue'

// 因为异步执行，这里输出green
asyncFunction(() => {
  console.log(`The color is ${color}`)
})

// 加上闭包，这里输出blue
void (color => {
  asyncFunction(() => {
    console.log(`The color is ${color}`)
  })
})(color)

color = 'green'

