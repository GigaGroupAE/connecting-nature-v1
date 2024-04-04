import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const UnitSvg = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={10}
    height={10}
    fill="none"
    {...props}
  >
    <Path
      fill="#000"
      d="M7.778 4.444V0H2.222v2.222H0V10h4.444V7.778h1.112V10H10V4.444H7.778ZM2.222 8.89h-1.11V7.778h1.11v1.11Zm0-2.222h-1.11V5.556h1.11v1.11Zm0-2.223h-1.11v-1.11h1.11v1.11Zm2.222 2.223h-1.11V5.556h1.11v1.11Zm0-2.223h-1.11v-1.11h1.11v1.11Zm0-2.222h-1.11v-1.11h1.11v1.11Zm2.223 4.445H5.556V5.556h1.11v1.11Zm0-2.223H5.556v-1.11h1.11v1.11Zm0-2.222H5.556v-1.11h1.11v1.11ZM8.889 8.89H7.778V7.778h1.11v1.11Zm0-2.222H7.778V5.556h1.11v1.11Z"
    />
  </Svg>
);
export default UnitSvg;
