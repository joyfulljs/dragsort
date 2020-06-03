import React, { Component } from 'react';
import cn from 'classnames';
import { AtIcon } from 'taro-ui';

export default class Dragger extends Component {
  domRef = Taro.createRef();
  state = { dragStarted: false };

  onStart = (e) => {
    this.__dragIndex = this.props.index;
    this.__dragTargetIndex = this.props.index;
    this.__dragStartY = e.touches[0].pageY;
    this.__dragTarget = this.domRef.current;
    this.__dragItemHeight = this.__dragTarget.offsetHeight;
    this.__allItems = Array.prototype.slice.call(this.__dragTarget.parentNode.querySelectorAll('.dragsort__item'), 0);
    this.setState({
      dragStarted: true,
    });
    this.__allItems.forEach((item) => setTransition(item, 1));
    e.stopPropagation();
  };

  onMove = (e) => {
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
          setDeltTransform(this.__allItems[targetIndex], -this.__dragItemHeight);
        } else {
          // 向上拖动
          setDeltTransform(this.__allItems[targetIndex], this.__dragItemHeight);
        }
        const temp = this.__allItems[targetIndex];
        this.__allItems[targetIndex] = this.__allItems[this.__dragTargetIndex];
        this.__allItems[this.__dragTargetIndex] = temp;
      }
      this.__dragTargetIndex = targetIndex;
      setTransform(this.__dragTarget, deltY);
      e.preventDefault();
      e.stopPropagation();
    }
  };

  onEnd = (e) => {
    if (this.state.dragStarted) {
      if (this.__dragTargetIndex !== null && this.__dragTargetIndex !== this.__dragIndex) {
        const { onChange, list } = this.props;
        const newList = [...list];
        const dragItem = newList.splice(this.__dragIndex, 1);
        newList.splice(this.__dragTargetIndex, 0, dragItem[0]);
        onChange(newList);
      }
      this.__allItems.forEach((item) => {
        // if (this.__dragTarget !== item) {
        setTransition(item, 0);
        // }
        setTransform(item, 0);
      });
      this.setState({ dragStarted: false });
      e.stopPropagation();
    }
  };

  componentDidMount() {
    window.addEventListener('touchend', this.onEnd);
    window.addEventListener('touchmove', this.onMove, { passive: false });
    this.__handle = this.domRef.current.querySelector('.dragsort__handle');
    this.__handle.addEventListener('touchstart', this.onStart);
  }

  componentWillUnmount() {
    window.removeEventListener('touchend', this.onEnd);
    window.removeEventListener('touchmove', this.onMove);
    this.__handle.removeEventListener('touchstart', this.onStart);
  }

  render() {
    const { children, handle = false } = this.props;
    const { dragStarted } = this.state;
    return (
      <div ref={this.domRef} className={cn('dragsort__item bg-fff', { 'dragsort--start': dragStarted })}>
        {children}
        {handle && (
          <div className="dragsort__handle" onTouchStart={this.onStart}>
            <AtIcon value="menu" color="#D8D8D8"></AtIcon>
          </div>
        )}
      </div>
    );
  }
}

function setTransform(el, deltY) {
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
  return el.__y || 0;
}
