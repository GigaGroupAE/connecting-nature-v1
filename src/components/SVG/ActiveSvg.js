import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const ActiveHomeSvg = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={23}
    fill="none"
    {...props}
  >
    <Path
      stroke="#007BFF"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8.005 16.045a2.997 2.997 0 1 1 5.995 0V21.5h7V11.043L11 1.5 1 11.043V21.5h7.005v-5.455Z"
    />
  </Svg>
);
export default ActiveHomeSvg;
