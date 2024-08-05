import _ from 'lodash';
import {
  Profile,
  ProfileAction,
  ProfileActionType,
} from '../../models/profile';

export interface ProfileState {
  data: Profile[];
  selectedProfile: Profile | null;
  page: 'detail' | 'edit';
  form: {
    id: string | null;
    title: string;
    titleError: string | null;
    description: string;
    descriptionError: string | null;
    actions: ProfileAction[];
    children: Profile[];
    seriesActions: string;
    seriesActionIndex: number;
    seriesRowSeparator: string;
    seriesColumnSeparator: string;
  };
  actionForm: {
    index: number | null;
    title: string;
    titleError: string | null;
    value: string;
    valueError: string | null;
    button: string;
    buttonError: string | null;
    type: ProfileActionType;
  };
}

export const initProfileState: ProfileState = {
  data: [],
  page: 'detail',
  selectedProfile: null,
  actionForm: {
    index: null,
    title: '',
    titleError: null,
    value: '',
    valueError: null,
    button: '',
    buttonError: null,
    type: ProfileActionType.Copy,
  },
  form: {
    id: null,
    title: '',
    titleError: null,
    description: '',
    descriptionError: null,
    actions: [],
    children: [],
    seriesActions: '',
    seriesActionIndex: 0,
    seriesRowSeparator: '',
    seriesColumnSeparator: '',
  },
};

export interface CommonState {
  message: {
    type: 'success' | 'error';
    msg: null | string;
  };
}

export const initialCommonState: CommonState = {
  message: {
    type: 'success',
    msg: null,
  },
};
