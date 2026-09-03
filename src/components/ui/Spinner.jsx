import React from 'react';

const sizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-[3px]',
};

const Spinner = ({ size = 'md', className = '' }) => (
  <span
    className={`inline-block rounded-full border-brand/25 border-t-brand animate-spin ${sizes[size]} ${className}`}
    role="status"
    aria-label="loading"
  />
);

export default Spinner;
