import * as fs from 'fs';

function load(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(path)) {
      reject(new Error('Not state file'));
      return;
    }
    fs.readFile(path, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data.toString('utf-8'));
    });
  });
}

function save(path: string, data: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

export const dataProvider = {
  load,
  save,
};
