import {
  Box,
  Typography,
  Stack,
  Button,
  Chip,
  TextField,
  IconButton,
} from '@mui/material';
import { ProfileAction } from '../../models/profile';
import { Delete, Edit } from '@mui/icons-material';

export function ActionItem({
  action,
  index,
  showEdit,
  showRemove,
  showFull,
  onEdit,
  onRemove,
}: {
  action: ProfileAction;
  index?: number;
  showEdit?: boolean;
  showRemove?: boolean;
  showFull?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
}) {

  const doAction = () => {
    window.MyShortcutApi.doAction(action);
  };

  return (
    <Stack
      style={{
        border: '1px solid gray',
        borderRadius: '5px',
        padding: '8px',
      }}
      spacing={1}
    >
      <Stack
        direction={'row'}
        spacing={2}
        textAlign={'center'}
        alignItems={'center'}
      >
        <Typography variant="body1">
          {index ? `${index}-` : ''}
          {action.title}{' '}
          <span style={{ fontSize: '10px' }}>({action.type})</span>
        </Typography>
        <Button variant="outlined" size="small" onClick={() => doAction()}>
          {action.button}
        </Button>

        {showEdit && (
          <IconButton
            size="small"
            onClick={() => {
              if (onEdit) {
                onEdit();
              }
            }}
          >
            <Edit fontSize={'small'} color="disabled" />
          </IconButton>
        )}

        {showRemove && (
          <IconButton
            style={{ marginLeft: 0 }}
            size="small"
            onClick={() => {
              if (onRemove) {
                onRemove();
              }
            }}
          >
            <Delete fontSize={'small'} color="disabled" />
          </IconButton>
        )}
      </Stack>

      {showFull && (
        <TextField
          multiline
          maxRows={5}
          value={action.value}
          fullWidth
          size="small"
          disabled
        />
      )}
    </Stack>
  );
}
