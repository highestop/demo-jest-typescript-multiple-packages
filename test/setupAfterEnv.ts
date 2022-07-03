import toMatchRenderedSnapshot from './helpers/renderedSnapshot';
import toEqualAsJsonStr from './helpers/equalAsJsonStr';

expect.extend({
  toEqualAsJsonStr,
  toMatchRenderedSnapshot,
});
