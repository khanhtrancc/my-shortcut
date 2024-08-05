/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
require('dotenv').config();
import path from 'path';
import { app, BrowserWindow, shell, session } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './utils';
import { configIpcListener } from './ipc/ipc.listener';
import {
  addWindowToIpcSender,
  ipcSender,
  removeWindowFromIpcSender,
} from './ipc/ipc.sender';
import { logger } from './common/logger';
import { appConfig } from './config';
import fs from 'fs';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = logger;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

configIpcListener();

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

export const createWindow = async (width: number, height: number) => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const newWindow = new BrowserWindow({
    show: false,
    width: process.env.NODE_ENV === 'production' ? width : width + 300,
    height,
    minWidth: 600,
    minHeight: 400,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  newWindow.loadURL(resolveHtmlPath('index.html'));

  newWindow.webContents.session.enableNetworkEmulation({
    offline: true,
  });

  newWindow.on('ready-to-show', () => {
    if (!newWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      newWindow.minimize();
    } else {
      newWindow.show();
    }
  });

  const menuBuilder = new MenuBuilder(newWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  newWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  addWindowToIpcSender(newWindow);

  newWindow.on('close', (event) => {
    removeWindowFromIpcSender(newWindow);
    if (mainWindow && newWindow && mainWindow.id == newWindow.id) {
      mainWindow = null;
    }
  });

  return newWindow;

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  // new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  // if (process.platform !== 'darwin') {
  app.quit();
  // }
});

const maxInitWidth = 1368;
const maxInitHeight = 720;
let initSWidth = maxInitWidth;
let initSHeight = maxInitHeight;
app
  .whenReady()
  .then(() => {
    session.defaultSession.enableNetworkEmulation({
      offline: true,
    });

    // We cannot require the screen module until the app is ready.
    const { screen } = require('electron');
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    initSWidth = Math.min(width, maxInitWidth);
    initSHeight = Math.min(height, maxInitHeight);

    createWindow(initSWidth, initSHeight).then((window) => {
      mainWindow = window;
    });

    logger.info('Config: ', appConfig);
    logger.info('Window size: %o', { initSWidth, initSHeight });

    if (!fs.existsSync(appConfig.profileFolder)) {
      fs.mkdirSync(appConfig.profileFolder, { recursive: true });
    }

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null)
        createWindow(initSWidth, initSHeight).then((window) => {
          mainWindow = window;
        });
    });

    //
  })
  .catch((err) => {
    logger.error('Create app error %o', err);
  });
