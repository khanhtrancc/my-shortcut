// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { Profile } from '../models/profile';
const api = {
  onMessage(callback: (event: IpcRendererEvent, data: any) => void) {
    ipcRenderer.on('new-message', callback);
  },
  onProfilesChanged(
    callback: (event: IpcRendererEvent, data: { profiles: Profile[] }) => void,
  ) {
    ipcRenderer.on('on-profiles-changed', callback);
  },
  syncProfiles: () => {
    return ipcRenderer.invoke('sync-profiles');
  },
  createOrUpdateProfile: (profile: Profile) => {
    return ipcRenderer.invoke('create-or-update-profile', { profile });
  },
};

export type ApiType = typeof api;

contextBridge.exposeInMainWorld('MyShortcutApi', api);
