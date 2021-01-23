import plugin from '../src/index'
import { configureRunner } from './internal/runner'
import { resolveFixture } from './internal/fixture-resolver'

const run = configureRunner([
  plugin({
    variables: {
      '--component-width': '10px',
      '--component-padding-vertical': '8px',
      '--component-padding-horizontal': '10px',
    },
  }),
])

test('should add fallback for variables', async () => {
  await run(
    `
      .component {
        width: var(--component-width);
        padding: var(--component-padding-vertical) var(--component-padding-horizontal);
      }
    `,
    `
      .component {
        width: var(--component-width, 10px);
        padding: var(--component-padding-vertical, 8px) var(--component-padding-horizontal, 10px);
      }
    `,
  )
})

test('should add fallback for variables with calc', async () => {
  await run(
    '.component { width: calc(var(--component-width) * 2) }',
    '.component { width: calc(var(--component-width, 10px) * 2) }',
  )
})

test('should skip empty selector', async () => {
  await run('.component {}', '.component {}')
})

test('should skip declaration without variable', async () => {
  await run('.component { width: 10px }', '.component { width: 10px }')
})

test('should skip variable if fallback already exists', async () => {
  await run(
    '.component { width: var(--component-width, 100px) }',
    '.component { width: var(--component-width, 100px) }',
  )
})

test('should warn if fallback not exists in theme', async () => {
  await run(
    '.component { height: var(--component-height) }',
    '.component { height: var(--component-height) }',
    '[postcss-theme-fallback]: Variable "--component-height" not exists in theme',
  )
})

test('should not warn if fallback not exists in theme (silent)', async () => {
  const run = configureRunner([
    plugin({
      variables: {},
      silent: true,
    }),
  ])

  await run(
    '.component { height: var(--component-height) }',
    '.component { height: var(--component-height) }',
    '',
  )
})

test('should throw error if variables not set', async () => {
  try {
    const run = configureRunner([plugin()])
    await run('', '')
  } catch (error) {
    expect(error.message).toBe('Option "variables" is not set')
  }
})

test('should add fallback for variables from theme', async () => {
  const run = configureRunner([
    plugin({
      themeSource: resolveFixture('variables.css'),
    }),
  ])

  await run(
    ' .component { width: var(--component-width) }',
    ' .component { width: var(--component-width, 10px) }',
  )
})
