import React from 'react'

const Container = ({ children, className = '' }) => {
  return (
    <div className={`mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
};

export default Container
