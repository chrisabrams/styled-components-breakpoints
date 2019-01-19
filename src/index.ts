import { css } from 'styled-components'

type ACC = number | null | undefined
type Rule = 'minWidth' | 'maxWidth' | 'only'
interface Breakpoints {
  [key: string]: number
}

export const defaultBreakpoints: Breakpoints = {
  xxs: 0,
  xs: 320,
  s: 576,
  m: 768,
  l: 992,
  xl: 1200,
}

// Breakpoint
export const mediaWidthRule = (rule: Rule): string => (
  `${{ minWidth: 'min', maxWidth: 'max' }[rule] || 'min'}-width`
)

export const ruleTemplate = (rule: string, width: number): string => `(${rule}: ${width}px)`;
export const mediaTemplate = (rules: string): string => (
  `@media only screen and ${rules}`
)

export const getSmallestMedia = (breakpoints: Breakpoints): number => {
  const keys: string[] = Object.keys(breakpoints)

  return (
    Number(keys.reduce((acc: ACC, key: string): number => {
      if (acc) {
        return acc > breakpoints[key] ? breakpoints[key] : acc
      }
      return breakpoints[key]
    }, undefined))
  )
}

export const getNextMedia = (breakpoints: Breakpoints, width: number): number => {
  const keys: string[] = Object.keys(breakpoints)

  const nextBreakpoint = Number(keys.reduce((acc: ACC, key: string): number => {
    const current = breakpoints[key]

    if (acc && width - current <= 0) {
      return width - acc > Math.abs(width - current) || width - acc === 0 ? current : acc
    }

    return getSmallestMedia(breakpoints)
  }, undefined))

  if (nextBreakpoint === width) {
    throw new Error(`The breakpoint of value ${nextBreakpoint} is the heighst there is, did you mean to use "[media].minWidth"?`)
  }

  return nextBreakpoint
}

export const mediaRules =
(breakpoints: Breakpoints, widthKey: string, rule: Rule, boundKey?: string) => {
  const width = breakpoints[widthKey]
  const bound = breakpoints[boundKey]
  let baseWidthRule = mediaWidthRule(rule)
  let boudWidthRule

  let baseRule = ruleTemplate(baseWidthRule, width)
  let boundRule

  if (bound && width) {
    // Get correct rule based on width relative to bound
    baseWidthRule = mediaWidthRule(bound <= width ? 'maxWidth' : 'minWidth')
    boudWidthRule = mediaWidthRule(bound <= width ? 'minWidth' : 'maxWidth')

    baseRule = ruleTemplate(mediaWidthRule(bound <= width ? 'maxWidth' : 'minWidth'), width)
    boundRule = ruleTemplate(boudWidthRule, bound)

    return [].concat([baseRule], bound ? [boundRule] : []).join(' and ')
  }

  if (!bound && rule === 'only') {
    // Get correct rule based on width relative to bound
    boudWidthRule = mediaWidthRule(bound <= width ? 'minWidth' : 'maxWidth')
    boundRule = ruleTemplate(boudWidthRule, getNextMedia(breakpoints, width))
  }

  return [].concat([baseRule], boundRule ? [boundRule] : []).join(' and ')
};

export const getMixin = (breakpoints: Breakpoints, key: string, rule: Rule = 'minWidth') => (bound?: string) => (
  (...args) => css`
      ${mediaTemplate(mediaRules(breakpoints, key, rule, bound))}{
        ${css(...args)}
      }
    `
)

export const getMediaShorthands = (breakpoints, rule) => (
  Object.keys(breakpoints).reduce((acc: Object, key: string) => ({
    ...acc,
    [key]: getMixin(breakpoints, key, rule)(),
  }), {})
)

export const getMedia = (breakpoints: Breakpoints) => {
  const mediasUp = getMediaShorthands(breakpoints, 'minWidth')
  const list = Object.keys(breakpoints)

  return ({
    ...mediasUp,
    minWidth: (widthKey: string) => getMixin(breakpoints, widthKey, 'minWidth')(),
    maxWidth: (widthKey: string) => getMixin(breakpoints, widthKey, 'maxWidth')(),
    only: (widthKey: string, boundKey?: string) => getMixin(breakpoints, widthKey, 'only')(boundKey),
    list,
  })
}

export default getMedia
