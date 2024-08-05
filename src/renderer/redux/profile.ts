import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import { ProfileState, initProfileState } from './initial-value';
import { Profile } from '../../models/profile';

export const profileSlice = createSlice({
  name: 'profile',
  initialState: initProfileState,
  reducers: {
    updateState: (state, action: PayloadAction<Partial<ProfileState>>) => {
      for (const key of Object.keys(action.payload)) {
        _.set(state, key, (action.payload as any)[key]);
      }
    },
    edit: (state, action: PayloadAction<Profile | null>) => {
      state.page = 'edit';
      state.selectedProfile = action.payload;
      if (action.payload) {
        state.form = _.clone(initProfileState.form);
        for (const key of Object.keys(action.payload)) {
          _.set(state.form, key, (action.payload as any)[key]);
        }
      } else {
        state.form = _.clone(initProfileState.form);
      }
    },
  },
});

export const profileAction = profileSlice.actions;

export const profileReducer = profileSlice.reducer;
