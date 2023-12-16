import Color from "../../../assets/colors/Color";
import {
  FontAwesome,
  MaterialIcons,
  Feather,
  FontAwesome5,
  Octicons,
} from "react-native-vector-icons";
export const SETTINGS_DATA = [
  {
    title: "Edit Profile",
    icon: <FontAwesome name="user-circle-o" size={24} color={Color.Black} />,
    screenToNavigate: "EditProfile",
  },
  // {
  //   title: "Privacy & Security",
  //   icon: <Feather name="settings" size={24} color={Color.Black} />,
  //   screenToNavigate: null,
  // },
  {
    title: "Upgrade Account",
    icon: <MaterialIcons name="upgrade" size={24} color={Color.Black} />,
    screenToNavigate: "UpgradeAccountScreen",
  },
  {
    title: "Blocked Users",
    icon: <Octicons name="blocked" size={24} color={Color.Black} />,
    screenToNavigate: "BlockedUsers",
  },
  {
    title: "Logout",
    icon: <MaterialIcons name="logout" size={25} color={Color.Black} />,
    screenToNavigate: null,
  },
];
