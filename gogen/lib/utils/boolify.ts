const boolify = (promise: Promise<any>) =>
  promise.then(
    (_: any) => true,
    (_: any) => false
  )

export default boolify
