import React from "react";
import { ActivityIndicator, Dimensions, LogBox, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import persistStore from "redux-persist/es/persistStore";
import { store } from "./store";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { Provider as PaperProvider } from "react-native-paper";
import { isEqual } from "lodash";

import { QueryClient, QueryClientProvider } from "react-query";

import {
  useUserState,
  initialState as initialUserState,
} from "./src/slices/userSlice.js";
import { useFonts } from "expo-font";

import {
  AdminHome,
  AllCampaigns,
  CameraScreen,
  CampaignsScreen,
  ChatList,
  ChatPage,
  ChatPageCN,
  Checkout,
  CreateGroup,
  CreatePost,
  DirectChat,
  DoDay,
  EditProfile,
  GroupSettings,
  GroupSettingsCN,
  Home,
  Invite,
  Invitescreen,
  LivePoll,
  ManageVolunteers,
  MultipleContactSelect,
  NewPost,
  NotificationsScreen,
  OTPScreen,
  OrderCompleted,
  PostView,
  ProfileSettings,
  SearchScreen,
  SelectContact,
  Settings,
  ShowCase,
  SplashScreen,
  Support,
  Teams,
  UpgradeAccountScreen,
  UpgradeRequestsScreen,
  UserProfile,
  ViewImage,
  VolunteersScreen,
  Comments,
  CompleteProfile,
  SignIn,
  BlockedUsers,
  ManagePointnsScreen,
  UserList,
  AddProduct,
  ProductList,
  CheckList,
  TeamVolunteers,
  DoDayPortal,
  VolunteersList,
  Setting,
  Members,
  MsgShare,
  MessageForwardCRM,
  Followers,
  TopStories,
  StoryComment,
  StoriesPosts,
  ExpandedPost,
  Welcome,
  PostsLike,
  PostViewNotify,
  MediaScreen,
  FullPostView,
  CampaignWithPosts,
  PointsSharePost,
  ArchivedScreen,
  ArchivedCampaign,
  dodaylist,
} from "./src/screens";
//contexts
import {
  ContextProvider,
  useStateContext,
} from "./src/contexts/ContextProvider";
import SnackBar from "./src/components/SnackBar";
import Color from "./assets/colors/Color";
import OrderRequest from "./src/screens/Order Request/OrderRequest";
import PostShare from "./src/components/PostShare";
import Animation from "./src/screens/Animation";
import LivePointsComment from "./src/components/LivePointsComment";
import CreateCampaignPost from "./src/components/CreateCampaignPost";
import PostSkeleton from "./src/components/PostSkeleton";
import { SafeAreaProvider } from "react-native-safe-area-context";
import CustomStatsBar from "./src/components/CustomStatsBar";
let customFonts = {
  Roboto_300Light: require("./assets/fonts/Roboto-Light.ttf"),
  Roboto_400Regular: require("./assets/fonts/Roboto-Regular.ttf"),
  Roboto_500Medium: require("./assets/fonts/Roboto-Medium.ttf"),
  Roboto_600SemiBold: require("./assets/fonts/Roboto-Bold.ttf"),
  Roboto_700Bold: require("./assets/fonts/Roboto-Bold.ttf"),
};

const Stack = createStackNavigator();
const Height = Dimensions.get("screen").height;

let persistor = persistStore(store);

//REACT-QUERY

const queryClient = new QueryClient();
function Main() {
  const { loading } = useStateContext();
  const UserState = useUserState();
  const initialRouteName = isEqual(initialUserState, UserState)
    ? "SignIn"
    : "Home";
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="CreatePost" component={CreatePost} />
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="SignUp" component={CompleteProfile} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="OtpScreen" component={OTPScreen} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="PostView" component={PostView} />
        <Stack.Screen name="Comments" component={Comments} />
        <Stack.Screen name="CampaignComments" component={LivePointsComment} />
        <Stack.Screen name="AddPost" component={NewPost} />
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="CreateDoDay" component={DoDay} />
        <Stack.Screen name="Campaign" component={CampaignsScreen} />
        <Stack.Screen name="Invite" component={Invitescreen} />
        {/* <Stack.Screen name="Notification" component={Notifications} /> */}
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        {/* <Stack.Screen name="ChatBox" component={ChatBox} />*/}
        <Stack.Screen name="ChatList" component={ChatList} />
        <Stack.Screen name="LivePoll" component={LivePoll} />
        <Stack.Screen name="AdminHome" component={AdminHome} />
        <Stack.Screen name="DirectChat" component={DirectChat} />
        <Stack.Screen name="CreateGroup" component={CreateGroup} />
        <Stack.Screen name="SelectContact" component={SelectContact} />
        <Stack.Screen name="InviteUsers" component={Invite} />
        <Stack.Screen name="SettingsCRM" component={ProfileSettings} />
        <Stack.Screen name="ChatCRM" component={ChatPage} />
        <Stack.Screen name="ViewImage" component={ViewImage} />
        <Stack.Screen name="GroupSettings" component={GroupSettings} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="ChatCN" component={ChatPageCN} />
        <Stack.Screen name="ChatSettingsCN" component={GroupSettingsCN} />
        <Stack.Screen name="AllCampaigns" component={AllCampaigns} />
        <Stack.Screen name="ManageVolunteers" component={ManageVolunteers} />
        <Stack.Screen name="Teams" component={Teams} />
        <Stack.Screen name="SearchScreen" component={SearchScreen} />
        <Stack.Screen name="Checkout" component={Checkout} />
        <Stack.Screen name="AddProduct" component={AddProduct} />
        <Stack.Screen name="ProductList" component={ProductList} />
        <Stack.Screen name="UserList" component={UserList} />
        <Stack.Screen name="TeamVolunteers" component={TeamVolunteers} />
        <Stack.Screen name="VolunteersList" component={VolunteersList} />
        <Stack.Screen name="DoDayPortal" component={DoDayPortal} />
        <Stack.Screen name="CheckList" component={CheckList} />
        <Stack.Screen name="Setting " component={Setting} />
        <Stack.Screen name="Members" component={Members} />
        <Stack.Screen name="MsgShare" component={MsgShare} />
        <Stack.Screen name="MessageForwardCRM" component={MessageForwardCRM} />
        <Stack.Screen name="Followers" component={Followers} />
        <Stack.Screen name="TopStories" component={TopStories} />
        <Stack.Screen name="StoryComment" component={StoryComment} />
        <Stack.Screen name="StoriesPosts" component={StoriesPosts} />
        <Stack.Screen name="ExpandedPost" component={ExpandedPost} />
        <Stack.Screen name="PostsLike" component={PostsLike} />
        <Stack.Screen name="MediaScreen" component={MediaScreen} />
        <Stack.Screen name="FullPostView" component={FullPostView} />
        <Stack.Screen name="CampaignWithPosts" component={CampaignWithPosts} />
        <Stack.Screen name="PointsSharePost" component={PointsSharePost} />
        <Stack.Screen name="ArchivedScreen" component={ArchivedScreen} />
        <Stack.Screen name="ArchivedCampaign" component={ArchivedCampaign} />
        <Stack.Screen name="dodaylist" component={dodaylist} />
        <Stack.Screen name="postShare" component={PostShare} />
        <Stack.Screen name="Animation" component={Animation} />
        <Stack.Screen
          name="CreateCampaignPost"
          component={CreateCampaignPost}
        />

        <Stack.Screen
          name="NotificationsScreen"
          component={NotificationsScreen}
        />

        <Stack.Screen name="PostViewNotify" component={PostViewNotify} />

        <Stack.Screen
          name="UpgradeAccountScreen"
          component={UpgradeAccountScreen}
        />
        <Stack.Screen
          name="UpgradeRequestsScreen"
          component={UpgradeRequestsScreen}
        />
        <Stack.Screen
          name="MultiContactSelect"
          component={MultipleContactSelect}
        />
        <Stack.Screen name="VolunteersScreen" component={VolunteersScreen} />
        <Stack.Screen name="Support" component={Support} />
        <Stack.Screen name="ShowCase" component={ShowCase} />
        <Stack.Screen name="OrderCompleted" component={OrderCompleted} />
        <Stack.Screen name="OrderRequest" component={OrderRequest} />
        <Stack.Screen name="BlockedUsers" component={BlockedUsers} />
        <Stack.Screen
          name="ManagePointsScreen"
          component={ManagePointnsScreen}
        />
      </Stack.Navigator>
      {loading && (
        <ActivityIndicator
          style={{ position: "absolute", bottom: "20%", left: "48%" }}
          size={"large"}
          color={Color.Blue}
        />
      )}

      <SnackBar />
    </NavigationContainer>
  );
}

export default function App() {
  const [isLoaded] = useFonts(customFonts);
  if (!isLoaded) {
    return (
      <View style={{ flex: 1, marginTop: 30 }}>
        <PostSkeleton />
      </View>
    );
  }
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider>
          <ContextProvider>
            <QueryClientProvider client={queryClient}>
              <SafeAreaProvider>
                <CustomStatsBar backgroundColor={Color.White} />
                <Main />
              </SafeAreaProvider>
            </QueryClientProvider>
          </ContextProvider>
        </PaperProvider>
      </PersistGate>
    </ReduxProvider>
  );
}
