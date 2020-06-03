var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import React from 'react';
var DragSort = /** @class */ (function (_super) {
    __extends(DragSort, _super);
    function DragSort() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { dragStarted: false };
        _this.domRef = React.createRef();
        _this.onStart = function (e) {
            _this.__dragIndex = _this.props.index;
            _this.__dragTargetIndex = _this.props.index;
            _this.__dragStartY = e.touches[0].pageY;
            _this.__dragTarget = _this.domRef.current;
            _this.__dragItemHeight = _this.__dragTarget.offsetHeight;
            _this.__dragItems = Array.prototype.slice.call(_this.__dragTarget.parentNode.querySelectorAll('.dragsort__item'), 0);
            _this.__dragItems.forEach(function (item) { return setTransition(item, true); });
            _this.setState({
                dragStarted: true,
            });
            e.stopPropagation();
        };
        _this.onMove = function (e) {
            if (_this.state.dragStarted) {
                var currentY = e.touches[0].pageY;
                var deltY = currentY - _this.__dragStartY;
                var targetIndex = Math.round(_this.props.index + deltY / _this.__dragItemHeight);
                if (targetIndex <= 0) {
                    targetIndex = 0;
                }
                else if (targetIndex > _this.props.list.length - 1) {
                    targetIndex = _this.props.list.length - 1;
                }
                if (targetIndex !== _this.__dragTargetIndex) {
                    if (targetIndex > _this.__dragTargetIndex) {
                        // 向下拖动
                        setDeltTransform(_this.__dragItems[targetIndex], -_this.__dragItemHeight);
                    }
                    else {
                        // 向上拖动
                        setDeltTransform(_this.__dragItems[targetIndex], _this.__dragItemHeight);
                    }
                    var temp = _this.__dragItems[targetIndex];
                    _this.__dragItems[targetIndex] = _this.__dragItems[_this.__dragTargetIndex];
                    _this.__dragItems[_this.__dragTargetIndex] = temp;
                }
                _this.__dragTargetIndex = targetIndex;
                setTransform(_this.__dragTarget, deltY);
                e.preventDefault();
                e.stopPropagation();
            }
        };
        _this.onEnd = function (e) {
            if (_this.state.dragStarted) {
                if (_this.__dragTargetIndex !== _this.__dragIndex) {
                    var _a = _this.props, onChange = _a.onChange, list = _a.list;
                    var newList = list.slice(0);
                    var dragItem = newList.splice(_this.__dragIndex, 1);
                    newList.splice(_this.__dragTargetIndex, 0, dragItem[0]);
                    onChange(newList);
                }
                _this.__dragItems.forEach(function (item) {
                    setTransition(item, false);
                    setTransform(item, 0);
                });
                _this.setState({ dragStarted: false });
                e.stopPropagation();
            }
        };
        return _this;
    }
    DragSort.prototype.componentDidMount = function () {
        window.addEventListener('touchend', this.onEnd);
        window.addEventListener('touchmove', this.onMove, { passive: false });
        this.__dragHandle = this.domRef.current.querySelector('.dragsort__handle') || this.domRef.current;
        this.__dragHandle.addEventListener('touchstart', this.onStart);
    };
    DragSort.prototype.componentWillUnmount = function () {
        window.removeEventListener('touchend', this.onEnd);
        window.removeEventListener('touchmove', this.onMove);
        this.__dragHandle.removeEventListener('touchstart', this.onStart);
    };
    DragSort.prototype.render = function () {
        var children = this.props.children;
        var dragStarted = this.state.dragStarted;
        return (React.createElement("div", { ref: this.domRef, className: "dragsort__item" + (dragStarted ? ' dragsort--start' : '') }, children));
    };
    return DragSort;
}(React.Component));
export default DragSort;
function setTransform(el, deltY) {
    // @ts-ignore
    el.__y = deltY;
    var transform = "translateY(" + deltY + "px)";
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
