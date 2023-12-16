import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector, shallowEqual } from "react-redux";
import { useActions } from "../hooks/useAction";

export const initialState = {
  fullName: null,
  phoneNumber: null,
  type: null,
  profile: null,
  email: null,
  token: null,
  desc: null,
  posts: null,
  comments: null,
  reactions: null,
  followers: null,
  following: null,
  expoPushToken: null,
  id: null,
  location: null,
  blockedUsers: null,
  blockedByUsers: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetState: () => {
      return initialState;
    },
    setUser: (state, action) => {
      state.id = action.payload._id;
      state.fullName = action.payload.fullName;
      state.phoneNumber = action.payload.phoneNumber;
      state.profile = action.payload.profile;
      state.type = action.payload.type;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.desc = action.payload.description;
      state.comments = action.payload.comments;
      state.reactions = action.payload.reactions;
      state.posts = action.payload.posts;
      state.followers = action.payload.followers;
      state.following = action.payload.following;
      state.location = action.payload.location;
      state.blockedUsers = action.payload.blockedUsers;
      state.blockedByUsers = action.payload.blockedByUsers;
    },
    setfullName: (state, action) => {
      state.fullName = action.payload;
    },
    setprofile: (state, action) => {
      state.profile = action.payload;
    },
    settype: (state, action) => {
      state.type = action.payload;
    },
    setemail: (state, action) => {
      state.email = action.payload;
    },
    settoken: (state, action) => {
      state.token = action.payload;
    },
    setDesc: (state, action) => {
      state.desc = action.payload;
    },
    setExpoPushToken: (state, action) => {
      state.expoPushToken = action.payload;
    },
    setFollowing: (state, action) => {
      state.following = action.payload;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
  },
});

export const actions = userSlice.actions;

export const useUserStateActions = () => useActions({ actions });

const userSelector = (state) => state.user;
export const useUserState = () => useSelector(userSelector, shallowEqual);

export default userSlice.reducer;
