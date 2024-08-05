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
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import _ from 'lodash';

import { appColor } from '../common/color';
import { commonAction } from '../redux/common';
import { RootState } from '../redux/store';
import { profileAction } from '../redux/profile';
import { ProfileState } from '../redux/initial-value';
import { Tag } from '@mui/icons-material';
import { ActionItem } from '../components/ActionItem';
import {
  Profile,
  ProfileAction,
  ProfileActionType,
} from '../../models/profile';

export function ProfileForm() {
  const dispatch = useDispatch();

  const profileState = useSelector((state: RootState) => state.profile);
  const profile = profileState.selectedProfile;
  const form = profileState.form;
  const actionForm = profileState.actionForm;

  const changeFields = (data: any) => {
    dispatch(profileAction.updateState(data));
  };

  const submitActionForm = () => {
    if (!actionForm.title) {
      changeFields({
        'actionForm.titleError': 'Title is required',
      });
      return;
    }
    if (!actionForm.button) {
      changeFields({
        'actionForm.buttonError': 'Button is required',
      });
      return;
    }
    if (!actionForm.value) {
      changeFields({
        'actionForm.valueError': 'Value is required',
      });
      return;
    }

    const newAction = {
      title: actionForm.title,
      button: actionForm.button,
      type: actionForm.type,
      value: actionForm.value,
    };

    const actions = [...form.actions];

    if (
      actionForm.index != null &&
      actionForm.index >= 0 &&
      actionForm.index < form.actions.length
    ) {
      actions[actionForm.index] = newAction;
    } else {
      actions.push(newAction);
    }

    changeFields({
      'form.actions': actions,
      'actionForm.title': '',
      'actionForm.button': '',
      'actionForm.type': 'copy',
      'actionForm.value': '',
    });
  };

  const removeAction = (index: number) => {
    if (index < 0 || index >= form.actions.length) {
      return;
    }

    changeFields({
      'form.actions': [
        ...form.actions.slice(0, index),
        ...form.actions.slice(index + 1),
      ],
    });
  };

  const editAction = (index: number, action?: ProfileAction) => {
    if (action && index >= 0) {
      changeFields({
        'actionForm.index': index,
        'actionForm.title': action.title,
        'actionForm.button': action.button,
        'actionForm.type': action.type,
        'actionForm.value': action.value,
      });
    } else {
      changeFields({
        'actionForm.index': null,
        'actionForm.title': '',
        'actionForm.button': '',
        'actionForm.type': 'copy',
        'actionForm.value': '',
      });
    }
  };

  const save = () => {
    const newProfile: Profile = {
      id: form.id || undefined,
      title: form.title,
      description: form.description,
      actions: form.actions,
      seriesActions: form.seriesActions,
      seriesRowSeparator: form.seriesRowSeparator,
      seriesColumnSeparator: form.seriesColumnSeparator,
      children: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    window.MyShortcutApi.createOrUpdateProfile(newProfile).then((result) => {
      if (result) {
        dispatch(
          profileAction.updateState({
            selectedProfile: result,
            page: 'detail',
          }),
        );
      }
    });
  };

  let seriesTestActions: ProfileAction[] = [];
  let seriesRecordCount = 0;
  if (form.seriesActions) {
    let rowRegex: any = /[\n\r]+/;
    let colRegex: any = /[\t]+/;
    if (
      form.seriesRowSeparator &&
      form.seriesRowSeparator.startsWith('/') &&
      form.seriesRowSeparator.endsWith('/')
    ) {
      rowRegex = new RegExp(form.seriesRowSeparator);
    } else if (form.seriesRowSeparator) {
      rowRegex = form.seriesRowSeparator;
    }

    if (
      form.seriesColumnSeparator &&
      form.seriesColumnSeparator.startsWith('/') &&
      form.seriesColumnSeparator.endsWith('/')
    ) {
      colRegex = new RegExp(form.seriesColumnSeparator);
    } else if (form.seriesColumnSeparator) {
      colRegex = form.seriesColumnSeparator;
    }

    const rows = form.seriesActions.split(rowRegex);
    if (rows.length < 2) {
      return;
    }
    seriesRecordCount = rows.length - 1;
    const headers = rows[0].split(colRegex);
    const results = rows[1].split(colRegex);

    console.log(rows, headers, results);
    for (let i = 0; i < headers.length; i++) {
      seriesTestActions.push({
        title: headers[i],
        button: 'Copy',
        type: ProfileActionType.Copy,
        value: results[i],
      });
    }
  }

  return (
    <Stack spacing={2}>
      <Typography
        variant="h5"
        color={appColor.primary.primaryText}
        textAlign={'center'}
      >
        {form.id ? 'Edit Profile' : 'Create Profile'}
      </Typography>
      <TextField
        fullWidth
        label="Title"
        size="small"
        value={form.title}
        error={form.titleError != null}
        helperText={form.titleError}
        onChange={(event) => {
          changeFields({
            'form.title': event.target.value,
            'form.titleError': null,
          });
        }}
      />
      <TextField
        fullWidth
        size="small"
        multiline
        minRows={2}
        label="Description"
        value={form.description}
        error={form.descriptionError != null}
        helperText={form.descriptionError}
        onChange={(event) => {
          changeFields({
            'form.description': event.target.value,
            'form.descriptionError': null,
          });
        }}
      />
      <Accordion>
        <AccordionSummary>
          <Typography fontSize={'1em'} variant="h6">
            Actions
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            {form.actions.map((action, index) => {
              return (
                <ActionItem
                  key={index}
                  action={action}
                  index={index + 1}
                  showEdit
                  onEdit={() => {
                    editAction(index, action);
                  }}
                  showRemove
                  onRemove={() => {
                    removeAction(index);
                  }}
                />
              );
            })}

            <Stack direction={'row'} spacing={2}>
              <TextField
                size="small"
                label="Title"
                value={actionForm.title}
                error={actionForm.titleError != null}
                helperText={actionForm.titleError}
                onChange={(event) => {
                  changeFields({
                    'actionForm.title': event.target.value,
                    'actionForm.titleError': null,
                  });
                }}
              />

              <TextField
                size="small"
                label="Button"
                value={actionForm.button}
                error={actionForm.buttonError != null}
                helperText={actionForm.buttonError}
                onChange={(event) => {
                  changeFields({
                    'actionForm.button': event.target.value,
                    'actionForm.buttonError': null,
                  });
                }}
              />
              <Select
                title="Type"
                size="small"
                value={actionForm.type}
                onChange={(event) => {
                  changeFields({
                    'actionForm.type': event.target.value,
                  });
                }}
              >
                <MenuItem value="copy">Copy</MenuItem>
                <MenuItem value="cmd">Execute</MenuItem>
              </Select>
            </Stack>

            <TextField
              size="small"
              label="Value"
              multiline
              minRows={2}
              value={actionForm.value}
              error={actionForm.valueError != null}
              helperText={actionForm.valueError}
              onChange={(event) => {
                changeFields({
                  'actionForm.value': event.target.value,
                  'actionForm.valueError': null,
                });
              }}
            />

            <Stack
              direction={'row'}
              spacing={2}
              alignItems={'center'}
              justifyContent={'center'}
            >
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={() => {
                  submitActionForm();
                }}
              >
                {actionForm.index != null ? 'Update' : 'Add'}
              </Button>

              <Button
                variant="contained"
                size="small"
                color="error"
                onClick={() => {
                  editAction(-1);
                }}
              >
                {actionForm.index != null ? 'Cancel' : 'Clear'}
              </Button>
            </Stack>
          </Stack>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary>
          <Typography fontSize={'1em'} variant="h6">
            Series Actions
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <Typography
              variant="body1"
              style={{ color: seriesRecordCount > 0 ? 'green' : 'red' }}
            >
              Found {seriesRecordCount} records
            </Typography>
            {seriesTestActions.map((action, index) => {
              return (
                <ActionItem key={index} action={action} index={index + 1} />
              );
            })}

            <Stack direction={'row'} spacing={2} alignItems={'center'}>
              <TextField
                size="small"
                label="Row Separator"
                value={form.seriesRowSeparator}
                onChange={(event) => {
                  changeFields({
                    'form.seriesRowSeparator': event.target.value,
                  });
                }}
              />
              <TextField
                size="small"
                label="Col Separator"
                value={form.seriesColumnSeparator}
                onChange={(event) => {
                  changeFields({
                    'form.seriesColumnSeparator': event.target.value,
                  });
                }}
              />

              <Typography variant="body1">
                Supported regex. Regex example: /[\r\n]/
              </Typography>

              {/* <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() => testSeriesAction()}
              >
                Test
              </Button> */}
            </Stack>

            <TextField
              size="small"
              label="Value"
              multiline
              minRows={10}
              value={form.seriesActions}
              onChange={(event) => {
                changeFields({
                  'form.seriesActions': event.target.value,
                });
              }}
            />
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* <Accordion>
        <AccordionSummary>
          <Typography fontSize={'1em'} variant="h6">
            Children
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            {form.actions.map((action, index) => {
              return (
                <ActionItem
                  key={index}
                  action={action}
                  index={index + 1}
                  showEdit
                  onEdit={() => {
                    editAction(index, action);
                  }}
                  showRemove
                  onRemove={() => {
                    removeAction(index);
                  }}
                />
              );
            })}

            <Stack direction={'row'} spacing={2}>
              <TextField
                size="small"
                label="Title"
                value={actionForm.title}
                error={actionForm.titleError != null}
                helperText={actionForm.titleError}
                onChange={(event) => {
                  changeFields({
                    'actionForm.title': event.target.value,
                    'actionForm.titleError': null,
                  });
                }}
              />

              <TextField
                size="small"
                label="Button"
                value={actionForm.button}
                error={actionForm.buttonError != null}
                helperText={actionForm.buttonError}
                onChange={(event) => {
                  changeFields({
                    'actionForm.button': event.target.value,
                    'actionForm.buttonError': null,
                  });
                }}
              />
              <Select
                title="Type"
                size="small"
                value={actionForm.type}
                onChange={(event) => {
                  changeFields({
                    'actionForm.type': event.target.value,
                  });
                }}
              >
                <MenuItem value="copy">Copy</MenuItem>
                <MenuItem value="cmd">Execute</MenuItem>
              </Select>
            </Stack>

            <TextField
              size="small"
              label="Value"
              multiline
              minRows={2}
              value={actionForm.value}
              error={actionForm.valueError != null}
              helperText={actionForm.valueError}
              onChange={(event) => {
                changeFields({
                  'actionForm.value': event.target.value,
                  'actionForm.valueError': null,
                });
              }}
            />

            <Stack
              direction={'row'}
              spacing={2}
              alignItems={'center'}
              justifyContent={'center'}
            >
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={() => {
                  submitActionForm();
                }}
              >
                {actionForm.index != null ? 'Update' : 'Add'}
              </Button>

              <Button
                variant="contained"
                size="small"
                color="error"
                onClick={() => {
                  editAction(-1);
                }}
              >
                {actionForm.index != null ? 'Cancel' : 'Clear'}
              </Button>
            </Stack>
          </Stack>
        </AccordionDetails>
      </Accordion> */}

      <Stack direction={'row'} spacing={2} justifyContent={'center'}>
        <Button
          variant="contained"
          size="small"
          color="primary"
          style={{ width: '200px' }}
          onClick={() => {
            save();
          }}
        >
          Save
        </Button>
      </Stack>
    </Stack>
  );
}
