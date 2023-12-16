import * as React from "react";
import Svg, { Path } from "react-native-svg";
const CommentSvg = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={23}
    height={21}
    fill="none"
    {...props}
  >
    <Path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity={0.7}
      strokeWidth={2}
      d="M13.5 17.385c3.771 0 5.657 0 6.828-1.172 1.172-1.17 1.172-3.057 1.172-6.828 0-3.77 0-5.657-1.172-6.828-1.171-1.172-3.057-1.172-6.828-1.172h-4c-3.771 0-5.657 0-6.828 1.172C1.5 3.728 1.5 5.614 1.5 9.385c0 3.771 0 5.657 1.172 6.828.653.654 1.528.943 2.828 1.07"
    />
    <Path
      stroke="#000"
      strokeLinecap="round"
      strokeOpacity={0.7}
      strokeWidth={2}
      d="M13.5 17.385c-1.236 0-2.598.5-3.841 1.145-1.998 1.037-2.997 1.556-3.489 1.225-.492-.33-.399-1.355-.212-3.404L6 15.885"
    />
  </Svg>
);
export default CommentSvg;
