import React from 'react';
import { Dialog, DialogTitle, DialogActions, Button } from '@mui/material';

export default (props: {
  isShow: boolean;
  onCancel: () => any;
  onConfirm: () => any;
  confirmText?: string;
  cancelText?: string;
  message: any;
}) => {
  return (
    <Dialog
      open={props.isShow}
      onClose={props.onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{props.message}</DialogTitle>
      <DialogActions>
        <Button onClick={props.onCancel}>{props.cancelText || 'Cancel'}</Button>
        <Button onClick={props.onConfirm} autoFocus>
          {props.confirmText || 'Sure'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
