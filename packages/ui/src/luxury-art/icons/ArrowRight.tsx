import React from 'react';
import { IconPrimitive, IconProps } from '../../primitives/Icon/IconPrimitive';

export const ArrowRight = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconPrimitive ref={ref} {...props}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </IconPrimitive>
));

ArrowRight.displayName = 'ArrowRight';
