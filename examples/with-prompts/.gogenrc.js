/**
 * @type {import('gogen').Generator}
 */
module.exports = async ({
  src,
  dest,
  pipeline,
  packages,
  install,
  gitInit,
  prompts,
}) => {
  const {description, devDeps} = await prompts(
    [
      {
        type: 'text',
        name: 'description',
        message: 'Description',
      },
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
      description,
      ...(devDeps.includes('jest') && {
        jest: {
          coverageReporters: ['html'],
        },
      }),
    }),
    dest()
  )
  await install(devDeps, {dev: true}).catch(console.warn)
  await gitInit()
}
