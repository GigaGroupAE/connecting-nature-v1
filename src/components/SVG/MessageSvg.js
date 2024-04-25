import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const MessageSvg = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={18}
    fill="none"
    {...props}
  >
    <Path
      fill="#000"
      d="M19.22 7.109v8.442c0 1.03-.842 1.872-1.872 1.872H2.372A1.878 1.878 0 0 1 .5 15.551V4.32c0-1.03.842-1.872 1.872-1.872h9.454c-.056.3-.094.618-.094.936 0 1.386.609 2.612 1.563 3.473L9.86 8.999 2.372 4.32v1.872l7.488 4.68 4.96-3.107c.506.187 1.03.3 1.592.3a4.661 4.661 0 0 0 2.808-.955Z"
    />
    <Path
      fill="#007BFF"
      d="M16.412 6.192a2.804 2.804 0 0 1-2.808-2.808A2.804 2.804 0 0 1 16.412.576a2.804 2.804 0 0 1 2.808 2.808 2.804 2.804 0 0 1-2.808 2.808Z"
    />
  </Svg>
);
export default MessageSvg;
