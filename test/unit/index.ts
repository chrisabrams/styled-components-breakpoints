import { expect } from 'test/helpers'
import media, {
  defaultBreakpoints as breakpoints,
  mediaWidthRule,
  ruleTemplate,
  mediaTemplate,
  getSmallestMedia,
  getNextMedia,
  mediaRules,
} from 'src/index'

describe('mediaWidthRule', () => {

  it('returns min-witdh for string "minWidth"', () => {
    expect(mediaWidthRule('minWidth')).to.equal('min-width')
  })

  it('returns max-witdh for string "maxWidth"', () => {
    expect(mediaWidthRule('maxWidth')).to.equal('max-width')
  })

  /*it('returns min-width when rule is not found', () => {
    expect(mediaWidthRule('unknown')).to.equal('min-width')
  })

  it('returns min-width when rule is undefined', () => {
    expect(mediaWidthRule()).to.equal('min-width')
  })*/

})

describe('ruleTemplate', () => {

  it('Returns a width rule', () => {
    expect(ruleTemplate('min-width', 600)).to.equal('(min-width: 600px)')
  })

})

describe('mediaTemplate', () => {

  it('Returns a @media query', () => {
    expect(mediaTemplate('(min-width: 600px)')).to.equal('@media only screen and (min-width: 600px)')
  })

})

describe('getSmallestMedia', () => {

  it('should get smallest media', () => {

    expect(getSmallestMedia(breakpoints)).to.equal(320)

  })

})


describe('getNextMedia', () => {

  it('finds the next breakpoint and returns it as a number', () => {

    expect(getNextMedia({
      xs: 10, s: 20, m: 30, l: 40,
    }, 20)).to.equal(30)

  })

  it('throws an error if the passed width is equal to the widest breakpoint', () => {
    
    try {
      getNextMedia({
        xs: 10, s: 20, m: 30, l: 40,
      }, 40)
    }
    catch(e) {
      expect(typeof e).to.be.a('string')
    }

  })

})


describe('mediaRules', () => {

  it('returns min-width when the rule is "minWidth"', () => {
    expect(mediaRules(breakpoints, 'm', 'minWidth')).to.equal('(min-width: 768px)')
  })

  it('returns max-width rule when the rule is "maxWidth"', () => {
    expect(mediaRules(breakpoints, 'm', 'maxWidth')).to.equal('(max-width: 768px)')
  })

  it('returns a range rule between min and max-width when both width and bound are present', () => {
    expect(mediaRules(breakpoints, 'm', 'only', 'l')).to.equal('(min-width: 768px) and (max-width: 992px)')
  })

  it('returns a range rule between max and min-width when the bound is lower than the width', () => {
    expect(mediaRules(breakpoints, 'm', 'only', 's')).to.equal('(max-width: 768px) and (min-width: 576px)')
  })

  it('returns a range rule between the width and the next minWidthper breakpoint when the rule is "only" and the bound is undefined', () => {
    expect(mediaRules(breakpoints, 'm', 'only')).to.equal('(min-width: 768px) and (max-width: 992px)')
  })

})

describe('breakpoint', () => {

  const bp = media(breakpoints)

  describe('utilities', () => {

    describe('only', () => {
      it('Implicitly returns a range media query between breakpoint "m" and the next minWidthper breakpoint', () => {
        expect(bp.only('m')`baground: red;`[1]).to.equal('@media only screen and (min-width: 768px) and (max-width: 992px)');
      })

      it('Returns a range media query between the first and second arguemt', () => {
        expect(bp.only('m', 'xl')`baground: red;`[1]).to.equal('@media only screen and (min-width: 768px) and (max-width: 1200px)');
      })

      it('Returns a range media query stating from a higher breakpoint going maxWidth', () => {
        expect(bp.only('xl', 'm')`baground: red;`[1]).to.equal('@media only screen and (max-width: 1200px) and (min-width: 768px)');
      })
    })

    describe('maxWidth', () => {
      it('Returns a max-widht media query', () => {
        expect(bp.maxWidth('m')`baground: red;`[1]).to.equal('@media only screen and (max-width: 768px)');
      })
    })

    describe('minWidth', () => {
      it('Returns a min-widht media query', () => {
        expect(bp.minWidth('m')`baground: red;`[1]).to.equal('@media only screen and (min-width: 768px)');
      })
    })

    describe('list', () => {
      it('stores an array of breakpoints in the order they where defined', () => {
        expect(bp.list).to.eql(['xxs', 'xs', 's', 'm', 'l', 'xl'])
      })
    })
  })
})
