import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector, shallowEqual } from "react-redux";
import { useActions } from "../hooks/useAction";

export const initialState = {
  posts: [],
  status: false,
};

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    resetState: () => {
      return initialState;
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts
      //return action.payload.posts;
    },
  },
});

export const actions = postsSlice.actions;

export const usePostsStateActions = () => useActions({ actions });

const postsSelector = (state) => state.posts;
export const usePostState = () => useSelector(postsSelector, shallowEqual);

export default postsSlice.reducer;
