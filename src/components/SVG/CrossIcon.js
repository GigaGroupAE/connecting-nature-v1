import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const CrossSvg = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    {...props}
  >
    <Path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m12.2 5.8-6.4 6.4m0-6.4 6.4 6.4M17 9A8 8 0 1 1 1 9a8 8 0 0 1 16 0Z"
    />
  </Svg>
);
export default CrossSvg;
