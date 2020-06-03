import React from 'react';
export var Hello = function (props) {
  return React.createElement('h1', null, 'Hello from ', props.compiler, ' and ', props.framework, '!');
};
