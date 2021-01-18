import { plugin } from 'postcss'

interface ThemeFallbackOptions {}

export default plugin<ThemeFallbackOptions>('postcss-theme-fallback', (options = {}) => {
  return async (root) => {
    root.walkRules((rule) => {})
  }
})
