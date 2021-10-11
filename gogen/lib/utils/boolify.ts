const boolify = (promise: Promise<unknown>) =>
  promise.then(
    () => true,
    () => false
  )

export default boolify
