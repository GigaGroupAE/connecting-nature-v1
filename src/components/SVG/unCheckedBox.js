import * as React from 'react';
import Svg, { Rect } from 'react-native-svg';
const UnCheckedBox = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={19}
    fill="none"
    {...props}
  >
    <Rect
      width={16.5}
      height={16.5}
      x={0.75}
      y={1.25}
      stroke="#B7B7B7"
      strokeWidth={1.5}
      rx={3.25}
    />
  </Svg>
);
export default UnCheckedBox;
