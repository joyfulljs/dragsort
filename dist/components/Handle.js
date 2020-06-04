import React from 'react';
import cns from 'classnames';
export default function DragHandle(props) {
    const { className, children, style } = props;
    return (React.createElement("div", { className: cns({
            'dragsort__handle': !children,
            'dragsort__handle--custom': children,
        }, className), style: style }, children));
}
