import {
  Grid,
  Button,
  Stack,
  Typography,
  TextField,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import _, { set } from 'lodash';

import { appColor } from '../common/color';
import { commonAction } from '../redux/common';
import { RootState } from '../redux/store';
import { profileAction } from '../redux/profile';
import { ProfileAction, ProfileActionType } from '../../models/profile';
import { ActionItem } from '../components/ActionItem';

export function ProfileDetail() {
  const dispatch = useDispatch();
  const [seriesRecordIndex, setSeriesRecordIndex] = useState(0);
  const [seriesRecords, setSeriesRecords] = useState<ProfileAction[][]>([]);

  const profileState = useSelector((state: RootState) => state.profile);
  const profile = profileState.selectedProfile;

  useEffect(() => {
    if (!profile || !profile.seriesActions) {
      return;
    }

    let seriesTestActions: ProfileAction[][] = [];
    let rowRegex: any = /[\n\r]+/;
    let colRegex: any = /[\t]+/;
    if (
      profile.seriesRowSeparator &&
      profile.seriesRowSeparator.startsWith('/') &&
      profile.seriesRowSeparator.endsWith('/')
    ) {
      rowRegex = new RegExp(profile.seriesRowSeparator);
    } else if (profile.seriesRowSeparator) {
      rowRegex = profile.seriesRowSeparator;
    }

    if (
      profile.seriesColumnSeparator &&
      profile.seriesColumnSeparator.startsWith('/') &&
      profile.seriesColumnSeparator.endsWith('/')
    ) {
      colRegex = new RegExp(profile.seriesColumnSeparator);
    } else if (profile.seriesColumnSeparator) {
      colRegex = profile.seriesColumnSeparator;
    }

    const rows = profile.seriesActions.split(rowRegex);
    if (rows.length < 2) {
      return;
    }
    const headers = rows[0].split(colRegex);

    for (let i = 1; i < rows.length; i++) {
      const results = rows[i].split(colRegex);

      const actions: ProfileAction[] = [];
      for (let i = 0; i < headers.length; i++) {
        actions.push({
          title: headers[i],
          button: 'Copy',
          type: ProfileActionType.Copy,
          value: results[i],
        });
      }
      seriesTestActions.push(actions);
    }
    setSeriesRecords(seriesTestActions);
  }, [profile, profile?.seriesActions]);

  const editProfile = () => {
    if (!profile) {
      return;
    }
    dispatch(profileAction.edit(profile));
  };

  const previousSeriesActions = () => {
    if (seriesRecordIndex > 0) {
      setSeriesRecordIndex(seriesRecordIndex - 1);
    }
  };

  const nextSeriesActions = () => {
    if (seriesRecordIndex < seriesRecords.length - 1) {
      setSeriesRecordIndex(seriesRecordIndex + 1);
    }
  };

  if (!profile) {
    return null;
  }

  return (
    <Stack spacing={2}>
      <Typography
        variant="h5"
        color={appColor.primary.primaryText}
        textAlign={'center'}
      >
        {profile.title}
      </Typography>
      <Typography
        variant="body1"
        color={appColor.primary.primaryText}
        textAlign={'center'}
      >
        {profile.description}
      </Typography>

      <Accordion defaultExpanded>
        <AccordionSummary>
          <Typography fontSize={'1em'} variant="h6">
            Actions
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            {profile.actions.map((action, index) => {
              return (
                <ActionItem key={index} action={action} index={index + 1} />
              );
            })}
          </Stack>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary>
          <Typography fontSize={'1em'} variant="h6">
            Series Actions
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <Typography variant="body1" style={{ color: 'green' }}>
              Current {seriesRecordIndex}/{seriesRecords.length} records
            </Typography>
            {seriesRecords[seriesRecordIndex]?.map((action, index) => {
              return (
                <ActionItem key={index} action={action} index={index + 1} />
              );
            })}
          </Stack>
          <Stack direction={'row'} spacing={2} justifyContent={'center'}>
            <Button
              variant="contained"
              size="small"
              color="primary"
              style={{ width: '200px' }}
              onClick={() => {
                previousSeriesActions();
              }}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              size="small"
              color="primary"
              style={{ width: '200px' }}
              onClick={() => {
                nextSeriesActions();
              }}
            >
              Next
            </Button>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
}
