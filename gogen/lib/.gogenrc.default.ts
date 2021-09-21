export default async ({src, dest, pipeline, install, gitInit}: any) => {
  await pipeline(src('template/**'), dest())
  await install()
  await gitInit()
}
