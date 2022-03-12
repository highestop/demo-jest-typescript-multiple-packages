import toMatchRenderedSnapshot from './helpers/renderedSnapshot';

expect.extend({
  toMatchRenderedSnapshot,
});

import '@testing-library/jest-dom';
