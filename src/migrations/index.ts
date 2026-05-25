import * as migration_20260522_190605 from './20260522_190605';
import * as migration_20260523_031928 from './20260523_031928';
import * as migration_20260523_033332 from './20260523_033332';
import * as migration_20260524_000221 from './20260524_000221';
import * as migration_20260524_001719 from './20260524_001719';
import * as migration_20260525_162520 from './20260525_162520';

export const migrations = [
  {
    up: migration_20260522_190605.up,
    down: migration_20260522_190605.down,
    name: '20260522_190605',
  },
  {
    up: migration_20260523_031928.up,
    down: migration_20260523_031928.down,
    name: '20260523_031928',
  },
  {
    up: migration_20260523_033332.up,
    down: migration_20260523_033332.down,
    name: '20260523_033332',
  },
  {
    up: migration_20260524_000221.up,
    down: migration_20260524_000221.down,
    name: '20260524_000221',
  },
  {
    up: migration_20260524_001719.up,
    down: migration_20260524_001719.down,
    name: '20260524_001719',
  },
  {
    up: migration_20260525_162520.up,
    down: migration_20260525_162520.down,
    name: '20260525_162520'
  },
];
