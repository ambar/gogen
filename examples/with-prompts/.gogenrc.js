module.exports = async (
  {src, dest, pipeline, packages},
  {install, gitInit, prompts}
) => {
  const {devDeps} = await prompts(
    [
      {
        type: 'multiselect',
        name: 'devDeps',
        message: 'Choose dev dependencies',
        choices: [
          {title: 'ESLint', value: 'eslint'},
          {title: 'Jest', value: 'jest'},
          {title: 'Prettier', value: 'prettier', selected: true},
        ],
      },
    ],
    {onCancel: process.exit}
  )
  await pipeline(
    src('template/**'),
    packages({
      ...(devDeps.includes('jest') && {
        jest: {
          coverageReporters: ['html'],
        },
      }),
    }),
    dest()
  )
  await install(devDeps, {dev: true})
  await gitInit()
}
