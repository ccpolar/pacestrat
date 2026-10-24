import * as migration_20261002_190042 from './20261002_190042';
import * as migration_20261003_190123 from './20261003_190123';
import * as migration_20261024_063627_security_upgrade_3_92 from './20261024_063627_security_upgrade_3_92';

export const migrations = [
  {
    up: migration_20261002_190042.up,
    down: migration_20261002_190042.down,
    name: '20261002_190042',
  },
  {
    up: migration_20261003_190123.up,
    down: migration_20261003_190123.down,
    name: '20261003_190123',
  },
  {
    up: migration_20261024_063627_security_upgrade_3_92.up,
    down: migration_20261024_063627_security_upgrade_3_92.down,
    name: '20261024_063627_security_upgrade_3_92'
  },
];
