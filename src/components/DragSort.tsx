import React from 'react';

interface PropTypes {
  list: any[],
  handle: React.ReactNode,
  index: number,
  onChange: (e: any[]) => void
}

export default class DragSort extends React.Component<PropTypes, {}>{

  state = { dragStarted: false };

  private domRef = React.createRef<HTMLDivElement>();
  private __dragIndex: number;
  private __dragTargetIndex: number;
  private __dragStartY: number;
  private __dragTarget: HTMLElement;
  private __dragItemHeight: number;
  private __dragHandle: Element;
  private __dragItems: HTMLElement[];

  onStart = (e: TouchEvent) => {
    this.__dragIndex = this.props.index;
    this.__dragTargetIndex = this.props.index;
    this.__dragStartY = e.touches[0].pageY;
    this.__dragTarget = this.domRef.current;
    this.__dragItemHeight = this.__dragTarget.offsetHeight;
    this.__dragItems = Array.prototype.slice.call(this.__dragTarget.parentNode.querySelectorAll('.dragsort__item'), 0);
    this.__dragItems.forEach((item) => setTransition(item, true));
    this.setState({
      dragStarted: true,
    });
    e.stopPropagation();
  };

  onMove = (e: TouchEvent) => {
    if (this.state.dragStarted) {
      const currentY = e.touches[0].pageY;
      const deltY = currentY - this.__dragStartY;
      let targetIndex = Math.round(this.props.index + deltY / this.__dragItemHeight);
      if (targetIndex <= 0) {
        targetIndex = 0;
      } else if (targetIndex > this.props.list.length - 1) {
        targetIndex = this.props.list.length - 1;
      }
      if (targetIndex !== this.__dragTargetIndex) {
        if (targetIndex > this.__dragTargetIndex) {
          // 向下拖动
          setDeltTransform(this.__dragItems[targetIndex], -this.__dragItemHeight);
        } else {
          // 向上拖动
          setDeltTransform(this.__dragItems[targetIndex], this.__dragItemHeight);
        }
        const temp = this.__dragItems[targetIndex];
        this.__dragItems[targetIndex] = this.__dragItems[this.__dragTargetIndex];
        this.__dragItems[this.__dragTargetIndex] = temp;
      }
      this.__dragTargetIndex = targetIndex;
      setTransform(this.__dragTarget, deltY);
      e.preventDefault();
      e.stopPropagation();
    }
  };

  onEnd = (e: TouchEvent) => {
    if (this.state.dragStarted) {
      if (this.__dragTargetIndex !== this.__dragIndex) {
        const { onChange, list } = this.props;
        const newList = list.slice(0);
        const dragItem = newList.splice(this.__dragIndex, 1);
        newList.splice(this.__dragTargetIndex, 0, dragItem[0]);
        onChange(newList);
      }
      this.__dragItems.forEach((item) => {
        setTransition(item, false);
        setTransform(item, 0);
      });
      this.setState({ dragStarted: false });
      e.stopPropagation();
    }
  };

  componentDidMount() {
    window.addEventListener('touchend', this.onEnd);
    window.addEventListener('touchmove', this.onMove, { passive: false });
    this.__dragHandle = this.domRef.current.querySelector('.dragsort__handle') || this.domRef.current;
    this.__dragHandle.addEventListener('touchstart', this.onStart);
  }

  componentWillUnmount() {
    window.removeEventListener('touchend', this.onEnd);
    window.removeEventListener('touchmove', this.onMove);
    this.__dragHandle.removeEventListener('touchstart', this.onStart);
  }

  render() {
    const { children } = this.props;
    const { dragStarted } = this.state;
    return (
      <div ref={this.domRef} className={`dragsort__item${dragStarted ? ' dragsort--start' : ''}`}>
        {children}
      </div>
    );
  }
}

function setTransform(el: HTMLElement, deltY: number) {
  // @ts-ignore
  el.__y = deltY;
  const transform = `translateY(${deltY}px)`;
  el.style.transform = el.style.webkitTransform = transform;
}

function setDeltTransform(el: HTMLElement, deltY: number) {
  setTransform(el, getTransformY(el) + deltY);
}

function setTransition(el: HTMLElement, flag: Boolean) {
  el.style.webkitTransition = el.style.transition = flag ? 'all 0.2s' : 'none';
}

function getTransformY(el: HTMLElement) {
  // @ts-ignore
  return el.__y || 0;
}