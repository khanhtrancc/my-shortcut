import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import { CommonState, initialCommonState } from './initial-value';

export const commonSlice = createSlice({
  name: 'common',
  initialState: initialCommonState,
  reducers: {
    updateState: (state, action: PayloadAction<Partial<CommonState>>) => {
      for (const key of Object.keys(action.payload)) {
        _.set(state, key, (action.payload as any)[key]);
      }
    },
  },
});

export const commonAction = commonSlice.actions;

export const commonReducer = commonSlice.reducer;
