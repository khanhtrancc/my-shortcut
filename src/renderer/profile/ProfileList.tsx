import { Stack, Box, Typography, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';

import { appColor } from '../common/color';
import { RootState } from '../redux/store';
import { Profile } from '../../models/profile';
import { profileAction } from '../redux/profile';

export function ProfileList() {
  const dispatch = useDispatch();

  const profiles = useSelector((state: RootState) => state.profile.data);

  const selectedProfile = useSelector(
    (state: RootState) => state.profile.selectedProfile,
  );

  const selectProfile = (profile: Profile) => {
    dispatch(profileAction.updateState({ selectedProfile: profile }));
  };

  return (
    <Stack direction={'column'}>
      {profiles.length == 0 && (
        <Typography variant="body1" textAlign={'center'} style={{marginTop: 20}}>
          No profile
        </Typography>
      )}
      {profiles.map((item) => {
        const isActive = selectedProfile && item.id == selectedProfile.id;
        return (
          <>
            <Box
              sx={{
                cursor: 'pointer',
                background: isActive ? appColor.active.dark : undefined,
              }}
              padding={2}
              onClick={() => selectProfile(item)}
            >
              <Typography variant="h6" textAlign={'start'}>
                <span
                  style={{
                    color:
                      selectedProfile && item.id == selectedProfile.id
                        ? appColor.active.primaryText
                        : undefined,
                  }}
                >
                  {item.title}
                </span>
              </Typography>
              <Typography variant="body1" textAlign={'start'}>
                <span style={{}}>{item.description}</span>
              </Typography>
            </Box>
            <Divider />
          </>
        );
      })}
    </Stack>
  );
}
