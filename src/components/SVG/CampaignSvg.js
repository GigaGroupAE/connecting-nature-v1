import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const Campaign = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={21}
    fill="none"
    {...props}
  >
    <Path
      stroke="#262626"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 1.833 8.218 8.916M21 1.833 10.698 19.167 8.218 8.916M21 1.833 1 1.834l7.218 7.082"
    />
  </Svg>
);
export default Campaign;
