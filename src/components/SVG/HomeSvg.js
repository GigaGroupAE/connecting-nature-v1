import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const HomeSvg = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      stroke="#262626"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.005 16.545a2.997 2.997 0 1 1 5.995 0V22h7V11.543L12 2 2 11.543V22h7.005v-5.455Z"
    />
  </Svg>
);
export default HomeSvg;
