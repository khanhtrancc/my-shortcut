import { BrowserWindow } from 'electron';

let mainWindows: BrowserWindow[] = [];

const sendToAllWindows = (type: string, data: any) => {
  for (const window of mainWindows) {
    window.webContents.send(type, data);
  }
};

export const ipcSender = {
  sendMessage: (type: 'success' | 'error', msg: string) => {
    sendToAllWindows('new-message', { type, msg });
  },
  sendToAllWindows,
};

export const addWindowToIpcSender = (window: BrowserWindow) => {
  mainWindows.push(window);
};

export const removeWindowFromIpcSender = (window: BrowserWindow) => {
  for (let i = 0; i < mainWindows.length; i++) {
    if (mainWindows[i].id == window.id) {
      mainWindows.splice(i, 1);
      return;
    }
  }
};
