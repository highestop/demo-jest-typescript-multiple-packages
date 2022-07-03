import React from 'react';

const Button = (props: React.PropsWithChildren<any>) => (
  <button>{props.children}</button>
);

export { Button };
