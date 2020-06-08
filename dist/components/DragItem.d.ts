import React from 'react';
interface PropTypes {
    className?: string;
    style?: React.CSSProperties;
    items: any[];
    handle: React.ReactNode;
    index: number;
    onChange: (e: any[]) => void;
}
export default class DragItem extends React.Component<PropTypes, {}> {
    state: {
        dragStarted: boolean;
    };
    private domRef;
    private unbind;
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
    moveItem(targetIndex: number): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export {};
