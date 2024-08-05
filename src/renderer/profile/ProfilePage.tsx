import { Fab, Grid, Stack, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';

import Message from '../components/Message';
import { Add } from '@mui/icons-material';
import { commonAction } from '../redux/common';
import { createRef } from 'react';
import { RootState } from '../redux/store';
import { ProfileList } from './ProfileList';
import { ProfileDetail } from './ProfileDetail';
import { ProfileForm } from './ProfileForm';
import { profileAction } from '../redux/profile';
import { Profile } from '../../models/profile';

export function ProfilePage() {
  const rightContainerRef = createRef<HTMLDivElement>();
  const dispatch = useDispatch();

  const profileState = useSelector((state: RootState) => state.profile);
  const profile = profileState.selectedProfile;
  const page = profileState.page;

  let mainPart = null;

  const editProfile = (profile: Profile | null) => {
    dispatch(profileAction.edit(profile));
  };

  if (page === 'detail') {
    if (profile) {
      mainPart = <ProfileDetail />;
    } else {
      mainPart = (
        <Stack alignItems={'center'} justifyContent={'center'} paddingTop={16}>
          <Typography variant="body1">
            Select or create profile to view
          </Typography>
        </Stack>
      );
    }
  } else {
    mainPart = <ProfileForm />;
  }

  return (
    <Grid
      container
      style={{
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
      }}
      direction={'row'}
    >
      <Fab
        color="primary"
        aria-label="add"
        size="small"
        style={{ right: 20, bottom: 20, position: 'fixed' }}
        onClick={() => {
          editProfile(null);
        }}
      >
        <Add />
      </Fab>

      <Grid
        item
        sm={4}
        md={3}
        lg={2}
        style={{
          height: '100vh',
          overflowY: 'auto',
          borderRight: '1px solid gray',
          position: 'relative',
        }}
      >
        <ProfileList />
      </Grid>
      <Grid
        ref={rightContainerRef}
        item
        sm={8}
        md={9}
        lg={10}
        paddingTop={2}
        paddingX={2}
        style={{
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        {mainPart}
      </Grid>
    </Grid>
  );
}
