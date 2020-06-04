import React from 'react';
import DragItem, { DragHandle } from '@joyfulljs/dragsort';

import './index.less';
import '@joyfulljs/dragsort/src/index.css';

export default class PageDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: (() => {
        const list = [];
        for (let i = 0; i < 10; i++) {
          list.push({
            label: 'drag item ' + i,
            id: i,
          });
        }
        return list;
      })(),
    };
  }

  handeSortChange = (list) => {
    this.setState({ list });
  };

  render() {
    const { list } = this.state;
    return (
      <div>
        {list.map((item, index) => {
          return (
            <DragItem key={index} items={list} onChange={this.handeSortChange}>
              {item.label}
              <DragHandle />
            </DragItem>
          );
        })}
      </div>
    );
  }
}
