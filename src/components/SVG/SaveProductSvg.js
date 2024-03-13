import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SavedProductSvg = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={15}
    height={20}
    fill="none"
    {...props}
  >
    <Path
      fill="#000"
      d="M11.09-.002h-8a3 3 0 0 0-3 3v16a1 1 0 0 0 1.5.87l5.5-3.18 5.5 3.18a.999.999 0 0 0 .5.13.999.999 0 0 0 .5-.13 1 1 0 0 0 .5-.87v-16a3 3 0 0 0-3-3Zm1 17.27-4.5-2.6a1 1 0 0 0-1 0l-4.5 2.6V2.998a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v14.27Z"
    />
    <Path
      fill="#000"
      d="m12.09 17.268-4.5-2.6a1 1 0 0 0-1 0l-4.5 2.6V2.998a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v14.27Z"
    />
  </Svg>
);
export default SavedProductSvg;
