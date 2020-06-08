import React from 'react';
import cns from 'classnames';
import XTouch from '@joyfulljs/xtouch';
export default class DragItem extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { dragStarted: false };
        this.domRef = React.createRef();
        this.onStart = (e) => {
            this.__dragStartY = e.touches[0].pageY;
            this.__dragTarget = this.domRef.current;
            this.__dragItemHeight = this.__dragTarget.offsetHeight;
            this.__dragItems = Array.prototype.slice.call(this.__dragTarget.parentNode.querySelectorAll('.dragsort__item'), 0);
            this.__dragIndex = this.__dragItems.findIndex(item => item === this.__dragTarget);
            this.__dragTargetIndex = this.__dragIndex;
            this.__dragItems.forEach((item) => setTransition(item, true));
            this.setState({
                dragStarted: true,
            });
        };
        this.onMove = (e) => {
            if (this.state.dragStarted) {
                const currentY = e.touches[0].pageY;
                const deltY = currentY - this.__dragStartY;
                let targetIndex = Math.round(this.__dragIndex + deltY / this.__dragItemHeight);
                if (targetIndex <= 0) {
                    targetIndex = 0;
                }
                else if (targetIndex > this.props.items.length - 1) {
                    targetIndex = this.props.items.length - 1;
                }
                if (targetIndex !== this.__dragTargetIndex) {
                    let deltIndex = targetIndex - this.__dragTargetIndex;
                    if (deltIndex > 1) {
                        // 向下移动过快
                        do {
                            this.moveItem(this.__dragTargetIndex + 1);
                            deltIndex--;
                        } while (deltIndex);
                    }
                    else if (deltIndex < -1) {
                        // 向上移动过快
                        do {
                            this.moveItem(this.__dragTargetIndex - 1);
                            deltIndex++;
                        } while (deltIndex);
                    }
                    else {
                        this.moveItem(targetIndex);
                    }
                }
                setTransform(this.__dragTarget, deltY);
                e.preventDefault();
            }
        };
        this.onEnd = (e) => {
            if (this.state.dragStarted) {
                if (this.__dragTargetIndex !== this.__dragIndex) {
                    const { onChange, items } = this.props;
                    const newList = items.slice(0);
                    const dragItem = newList.splice(this.__dragIndex, 1);
                    newList.splice(this.__dragTargetIndex, 0, dragItem[0]);
                    onChange(newList);
                }
                this.__dragItems.forEach((item) => {
                    setTransition(item, false);
                    setTransform(item, 0);
                });
                this.setState({ dragStarted: false });
            }
        };
    }
    moveItem(targetIndex) {
        if (targetIndex > this.__dragTargetIndex) {
            // 向下拖动
            setDeltTransform(this.__dragItems[targetIndex], -this.__dragItemHeight);
        }
        else {
            // 向上拖动
            setDeltTransform(this.__dragItems[targetIndex], this.__dragItemHeight);
        }
        const temp = this.__dragItems[targetIndex];
        this.__dragItems[targetIndex] = this.__dragItems[this.__dragTargetIndex];
        this.__dragItems[this.__dragTargetIndex] = temp;
        this.__dragTargetIndex = targetIndex;
    }
    componentDidMount() {
        this.__dragHandle = this.domRef.current.querySelector('.dragsort__handle') || this.domRef.current;
        this.unbind = XTouch(this.__dragHandle, {
            onStart: this.onStart,
            onMove: this.onMove,
            onEnd: this.onEnd,
            capture: { passive: false }
        });
    }
    componentWillUnmount() {
        this.unbind();
    }
    render() {
        const { children, className, style } = this.props;
        const { dragStarted } = this.state;
        return (React.createElement("div", { ref: this.domRef, className: cns('dragsort__item', { 'dragsort--start': dragStarted }, className), style: style }, children));
    }
}
function setTransform(el, deltY) {
    // @ts-ignore
    el.__y = deltY;
    const transform = `translateY(${deltY}px)`;
    el.style.transform = el.style.webkitTransform = transform;
}
function setDeltTransform(el, deltY) {
    setTransform(el, getTransformY(el) + deltY);
}
function setTransition(el, flag) {
    el.style.webkitTransition = el.style.transition = flag ? 'all 0.2s' : 'none';
}
function getTransformY(el) {
    // @ts-ignore
    return el.__y || 0;
}
