import React, { PropsWithChildren } from 'react';

export default function DragSortHandle(props: PropsWithChildren<{}>) {
  return (
    <div className="dragsort__handle">
      {props.children}
    </div>
  )
} 