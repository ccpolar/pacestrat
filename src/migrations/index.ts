import * as migration_20261002_190042 from './20261002_190042';
import * as migration_20261003_190123 from './20261003_190123';

export const migrations = [
  {
    up: migration_20261002_190042.up,
    down: migration_20261002_190042.down,
    name: '20261002_190042',
  },
  {
    up: migration_20261003_190123.up,
    down: migration_20261003_190123.down,
    name: '20261003_190123'
  },
];
