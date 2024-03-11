import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SavedSvg = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={31}
    height={36}
    fill="none"
    {...props}
  >
    <Path
      fill="#000"
      d="M19.09 7.998h-8a3 3 0 0 0-3 3v16a1 1 0 0 0 1.5.87l5.5-3.18 5.5 3.18a.999.999 0 0 0 .5.13.999.999 0 0 0 .5-.13 1 1 0 0 0 .5-.87v-16a3 3 0 0 0-3-3Zm1 17.27-4.5-2.6a1 1 0 0 0-1 0l-4.5 2.6v-14.27a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v14.27Z"
    />
  </Svg>
);
export default SavedSvg;
