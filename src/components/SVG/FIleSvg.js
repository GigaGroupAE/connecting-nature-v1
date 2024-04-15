import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const FileSvg = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={15}
    height={12}
    fill="none"
    {...props}
  >
    <Path
      fill="#000"
      d="M1.5 12c-.413 0-.765-.147-1.059-.44A1.447 1.447 0 0 1 0 10.5v-9C0 1.087.147.735.441.441.735.147 1.088.001 1.5 0H6l1.5 1.5h6c.412 0 .766.147 1.06.441.294.294.44.647.44 1.059v7.5c0 .412-.147.766-.44 1.06a1.44 1.44 0 0 1-1.06.44h-12Zm0-1.5h12V3H6.881l-1.5-1.5H1.5v9Z"
    />
  </Svg>
);
export default FileSvg;
