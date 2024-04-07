import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SubscriptionSvg = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    {...props}
  >
    <Path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.413 6.186a1.25 1.25 0 0 0-1.179-.834h-.968a1.116 1.116 0 0 0-.239 2.206l1.474.322a1.25 1.25 0 0 1-.268 2.472H7.4a1.25 1.25 0 0 1-1.179-.832m1.596-4.168v-1.25m0 7.5v-1.249m-5.212 4.61v-2.679h2.679m9.527-5.566a6.966 6.966 0 0 1-12.206 5.733m-1.486-3.17a6.966 6.966 0 0 1 12.206-5.733m0-2.512v2.68h-2.679"
    />
  </Svg>
);
export default SubscriptionSvg;
