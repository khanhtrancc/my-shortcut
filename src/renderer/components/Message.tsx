import { Snackbar, Alert } from '@mui/material';

export default ({
  message,
  type,
  onHide,
  autoHideDuration,
}: {
  message: string | null;
  type: 'success' | 'error';
  onHide: () => any;
  autoHideDuration?: number;
}) => {
  return (
    <Snackbar
      open={!!message}
      autoHideDuration={autoHideDuration  && autoHideDuration> 0 ? autoHideDuration : 6000}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      onClose={onHide}
    >
      <Alert onClose={onHide} severity={type} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};
