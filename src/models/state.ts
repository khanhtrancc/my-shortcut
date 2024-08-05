import { Profile } from './profile';

export interface State {
  profiles: Profile[];
}

export const initState: State = {
  profiles: [],
};
