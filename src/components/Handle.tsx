import React, { PropsWithChildren } from 'react';
import cns from 'classnames';

export default function DragHandle(props: PropsWithChildren<{ className?: string, style?: React.CSSProperties }>) {
  const { className, children, style } = props;
  return (
    <div className={cns({
      'dragsort__handle': !children,
      'dragsort__handle--custom': children,
    }, className)} style={style}>
      {children}
    </div>
  )
} 