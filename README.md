# dragsort
drag to sort. support both pc and mobile

# installation

```
npm install @joyfulljs/dragsort
```

# usage

```js
import DragItem, { DragHandle } from '@joyfulljs/dragsort';
import '@joyfulljs/dragsort/src/index.css';

// ...
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
            {/* use default drag handle */ }
            <DragHandle />
            {/* customize drag handle
            <DragHandle>Drag Me</DragHandle>
            */}
          </DragItem>
        );
      })}
    </div>
  );
}
// ...
```

# note

- It will use `DragItem` as the drag handle when `DragHandle` is omitted

# licese

MIT@[elvinzhu](https://github.com/elvinzhu)
