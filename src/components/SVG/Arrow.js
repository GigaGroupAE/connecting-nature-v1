import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const ArrowSvg = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={8}
    height={13}
    fill="none"
    {...props}
  >
    <Path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m1.5 1.5 5 5-5 5"
    />
  </Svg>
);
export default ArrowSvg;
