import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  strokeWidth?: number;
}

export const IconPrimitive = React.forwardRef<SVGSVGElement, IconProps & { children: React.ReactNode }>(
  ({ size = 16, strokeWidth = 1.5, children, className, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`inline-block select-none align-middle transition-colors duration-200 ${className || ''}`}
        {...props}
      >
        {children}
      </svg>
    );
  }
);

IconPrimitive.displayName = 'IconPrimitive';
