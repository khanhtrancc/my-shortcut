import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { ipcHandler } from './ipc.handler';
import { IpcMainEvent } from 'electron/main';
import { Profile, ProfileAction } from '../../models/profile';

export const configIpcListener = () => {
  ipcMain.handle('sync-profiles', (event: IpcMainInvokeEvent, data: any) => {
    return ipcHandler.syncProfiles();
  });

  ipcMain.handle(
    'create-or-update-profile',
    (event: IpcMainInvokeEvent, data: { profile: Profile }) => {
      return ipcHandler.createOrUpdateProfile(data.profile);
    },
  );

  ipcMain.handle('do-action', (event: IpcMainInvokeEvent, data: {action: ProfileAction}) => {
    return ipcHandler.doAction(data.action);
  });
};
