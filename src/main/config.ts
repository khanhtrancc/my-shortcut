import { homedir } from 'os';
import { join } from 'path';
import _ from 'lodash';
import { app } from 'electron';
import { AppConfig } from '../models/app-config';

const isDev = process.env.NODE_ENV !== 'production';

let usingEnv = {
  ROOT_PATH: '',
  OS: 'windows',
};

if (isDev) {
  try {
    usingEnv = require('./env.json');
  } catch (err) {}
} else {
  try {
    usingEnv = require('./production-env.json');
  } catch (err) {}
}

const rootFolder = isDev
  ? usingEnv.ROOT_PATH
  : join(
      app.getAppPath(),
      usingEnv.OS == 'windows' ? '../../../' : '../../../../',
    );

const logFolder = join(rootFolder, './logs');

export const appConfig: AppConfig = {
  isDev,
  logFolder,
  rootFolder,
  os: usingEnv.OS,
  statePath: join(rootFolder, './state.json'),
  profileFolder: join(rootFolder, './profiles'),
  userPath: homedir(),
};

export function getClientConfig(): AppConfig {
  return _.cloneDeep({
    ...appConfig,
  });
}
