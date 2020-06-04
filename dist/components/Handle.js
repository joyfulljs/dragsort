import React from 'react';
export default function DragHandle(props) {
    const { className, children } = props;
    return (React.createElement("div", { className: `dragsort__handle ${children ? 'dragsort__handle--custom' : ''} ${className || ''}` }, children));
}
