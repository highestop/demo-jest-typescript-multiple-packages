import React from 'react';

const Button: React.FC = (props: React.PropsWithChildren<any>) => (
  <button>{props.children}</button>
);

export { Button };
