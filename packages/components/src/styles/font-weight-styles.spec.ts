import { getFontWeight } from './font-weight-styles';

describe('getFontWeight()', () => {
  it.each<Parameters<typeof getFontWeight>>([['thin'], ['regular'], ['semibold'], ['semi-bold'], ['bold']])(
    'should return correct numeric value for weight: %s',
    (...args) => {
      expect(getFontWeight(...args)).toMatchSnapshot();
    }
  );
});
