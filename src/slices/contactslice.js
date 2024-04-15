import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSelector, shallowEqual } from 'react-redux';
import { useActions } from '../hooks/useAction';

export const initialState = {
  contacts: [],
  status: false,
};

export const contactslice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    resetState: () => {
      return initialState;
    },
    setContacts: (state, action) => {
      return action.payload;
    },
  },
});

export const actions = contactslice.actions;

export const useContactsStateActions = () => useActions({ actions });

const contactSelector = (state) => state.contacts;
export const useContactState = () => useSelector(contactSelector, shallowEqual);

export default contactslice.reducer;
