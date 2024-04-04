import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const AddparticipantsSvg = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    {...props}
  >
    <Path
      stroke="#000"
      strokeLinecap="round"
      strokeWidth={2}
      d="M9.267 12.2V8.733m0 0V5.267m0 3.466h3.466m-3.466 0H5.8M17 9A8 8 0 1 1 1 9a8 8 0 0 1 16 0Z"
    />
  </Svg>
);
export default AddparticipantsSvg;
