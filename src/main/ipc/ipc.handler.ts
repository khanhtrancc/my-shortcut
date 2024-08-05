import { Profile } from '../../models/profile';
import slug from 'slug';
import fs from 'fs';
import { appConfig } from '../config';
import { logger } from '../common/logger';
import { appUtils } from '../utils';
import { ipcSender } from './ipc.sender';

let profiles: Profile[] = [];

export const ipcHandler = {
  syncProfiles: async () => {
    try {
      logger.info('Sync profiles');
      const profilePaths = await appUtils.getFiles(appConfig.profileFolder);

      profiles = profilePaths
        .map((profilePath) => {
          try {
            const profile = fs.readFileSync(
              `${appConfig.profileFolder}/${profilePath.name}`,
              'utf8',
            );
            return JSON.parse(profile);
          } catch (err) {
            logger.error('Load profile error', profilePath, err);
            return null;
          }
        })
        .filter((item) => !!item);
      ipcSender.sendToAllWindows('on-profiles-changed', {
        profiles: profiles,
      });
      return;
    } catch (err) {
      logger.error('Sync profiles error', err);
      return null;
    }
  },
  selectProfile: (profileId: string) => {
    try {
      const profile = fs.readFileSync(
        `${appConfig.profileFolder}/${profileId}.json`,
        'utf8',
      );
      return JSON.parse(profile);
    } catch (err) {
      logger.error('Load profile error', profileId, err);
      return null;
    }
  },
  createOrUpdateProfile: (profile: Profile) => {
    try {
      if (profile.id) {
        profile.updatedAt = Date.now();
        fs.writeFileSync(
          `${appConfig.profileFolder}/${profile.id}.json`,
          JSON.stringify(profile),
        );
        for (let i = 0; i < profiles.length; i++) {
          if (profiles[i].id == profile.id) {
            profiles[i] = profile;
            break;
          }
        }
      } else {
        const id = slug(profile.title, { lower: true }) + '-' + Date.now();
        profile.id = id;
        profile.createdAt = Date.now();
        profile.updatedAt = Date.now();
        fs.writeFileSync(
          `${appConfig.profileFolder}/${id}.json`,
          JSON.stringify(profile),
        );
        profiles.push(profile);
      }
      ipcSender.sendToAllWindows('on-profiles-changed', {
        profiles: profiles,
      });
      return profile;
    } catch (err) {
      logger.error('Save profile error', profile, err);
    }
  },
};
