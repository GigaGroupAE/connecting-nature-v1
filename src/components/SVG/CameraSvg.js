import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const CameraSvg = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={41}
    height={30}
    fill="none"
    {...props}
  >
    <Path
      fill="#999"
      d="M26.336 16.25a6.25 6.25 0 1 1-12.5 0 6.25 6.25 0 0 1 12.5 0Z"
    />
    <Path
      fill="#999"
      d="M5.086 5a5 5 0 0 0-5 5v15a5 5 0 0 0 5 5h30a5 5 0 0 0 5-5V10a5 5 0 0 0-5-5h-2.93a5 5 0 0 1-3.535-1.465l-2.07-2.07A5 5 0 0 0 23.016 0h-5.86a5 5 0 0 0-3.535 1.465l-2.07 2.07A5 5 0 0 1 8.016 5h-2.93Zm1.25 5a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Zm22.5 6.25a8.75 8.75 0 1 1-17.5 0 8.75 8.75 0 0 1 17.5 0Z"
    />
  </Svg>
);
export default CameraSvg;
