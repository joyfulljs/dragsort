import React from 'react';
interface PropTypes {
    list: any[];
    handle: React.ReactNode;
    index: number;
    onChange: (e: any[]) => void;
}
export default class DragSort extends React.Component<PropTypes, {}> {
    state: {
        dragStarted: boolean;
    };
    private domRef;
    private __dragIndex;
    private __dragTargetIndex;
    private __dragStartY;
    private __dragTarget;
    private __dragItemHeight;
    private __dragHandle;
    private __dragItems;
    onStart: (e: TouchEvent) => void;
    onMove: (e: TouchEvent) => void;
    onEnd: (e: TouchEvent) => void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export {};
