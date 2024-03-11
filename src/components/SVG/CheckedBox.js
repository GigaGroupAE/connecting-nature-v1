import * as React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';
const CheckedBox = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={19}
    fill="none"
    {...props}
  >
    <Rect width={18} height={18} y={0.5} fill="#9E02AB" rx={4} />
    <Path
      fill="#fff"
      d="M13.306 5.654c-.221.07-.23.076-3.044 2.89l-2.77 2.768-1.253-1.254c-1.165-1.16-1.264-1.255-1.394-1.316a.849.849 0 0 0-1.22.9c.053.282.019.246 1.767 1.988 1.53 1.525 1.624 1.615 1.753 1.672.164.072.39.093.541.053.257-.07.148.034 3.431-3.25 3.4-3.404 3.206-3.196 3.26-3.497a.856.856 0 0 0-.616-.954.977.977 0 0 0-.455 0Z"
    />
  </Svg>
);
export default CheckedBox;
