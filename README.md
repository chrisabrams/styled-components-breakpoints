# Styled Components Breakpoints
Provides a mixin for Styled Components to handle media query widths & ranges by logical names.

## Installation
    yarn add styled-components-breakpoints
    # or
    npm install styled-components-breakpoints

## Usage

    import breakpoints from 'styled-components-breakpoints'

    const media = breakpoints({
      xxs: 0,
      xs: 320,
      s: 576,
      m: 768,
      l: 992,
      xl: 1200,
    })

If you just want to use the default breakpoints (Which are shown above):

    import breakpoints, { defaultBreakpoints }  from 'styled-components-breakpoints'

    const media = breakpoints(defaultBreakpoints)

It is recommended that the `const media` be placed in a file so that `breakpoints` only has to be defined once. Said file can then be imported across the project.

### Min-width

    media.minWidth('m')
    // Will return a media query with a min-width of 768
    // @media only screen and (min-width: 768px)

### Max-width

    media.maxWidth('m')
    // Will return a media query with a max-width of 768
    // @media only screen and (max-width: 768px)

### Only
    breakpoint.only('m')
    // Will return a range media query between "m" and the next upper breakpoint "l"
    // @media only screen and (min-width: 768px) and (max-width: 1200px)

    breakpoint.only('m', 'xl')
    // Will return a range media query between "m" and the breakpoint passed as the second argument, "xl"
    // @media only screen and (min-width: 768px) and (max-width: 1200px)

## Example
    import breakpoints, { defaultBreakpoints }  from 'styled-components-breakpoints'

    const media = breakpoints(defaultBreakpoints)

    // Styled Components
    import styled from 'styled-components'

    const Button = styled.button`
      background: white;
      font-size: 12px;

      ${media.minWidth('m')`
        font-size: 18px;
      `}
    `

In the above example a `Button` is created with a default font-size of 12px and a media query is set for medium and larger devices. This means on `xs` and `s` devices the font-size is 12px and `m` devices and up the font-size is 18px.

## Testing

    yarn install
    yarn test
