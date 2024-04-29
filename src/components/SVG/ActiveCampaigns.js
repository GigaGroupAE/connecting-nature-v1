import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const ActiveCampaigns = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={25}
    fill="none"
    {...props}
  >
    <Path
      stroke="#007BFF"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M22 3.833 9.218 10.916M22 3.833 11.698 21.167l-2.48-10.251M22 3.833 2 3.834l7.218 7.082"
    />
  </Svg>
);
export default ActiveCampaigns;
