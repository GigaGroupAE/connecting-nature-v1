import * as React from 'react';
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';
const NewPostSvg = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={25}
    fill="none"
    {...props}
  >
    <G
      stroke="#262626"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      clipPath="url(#a)"
    >
      <Path d="M2 12.5v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.955 22 18.8 22 15.95V9.052c0-2.849-.698-4.006-1.606-4.945-.94-.907-2.098-1.607-4.946-1.607H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 5.047 2 6.203 2 9.052V12.5ZM6.545 12.501h10.91M12.003 7.045v10.91" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 .5h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default NewPostSvg;
