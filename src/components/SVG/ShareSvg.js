import * as React from "react";
import Svg, { Path } from "react-native-svg";
const ShareSvg = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={22}
    fill="none"
    {...props}
  >
    <Path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity={0.7}
      strokeWidth={1.5}
      d="M4.6 14.72a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2ZM17.4 21.12a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2ZM17.4 8.32a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2ZM7.8 12.72l6.4 3.2m-6.4-6.4 6.4-3.2"
    />
  </Svg>
);
export default ShareSvg;
