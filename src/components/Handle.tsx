import React, { PropsWithChildren } from 'react';

export default function DragHandle(props: PropsWithChildren<{}> & { className?: string }) {
  const { className, children } = props;
  return (
    <div className={
      `dragsort__handle ${children ? 'dragsort__handle--custom' : ''} ${className || ''}`
    }>
      {children}
    </div>
  )
} 