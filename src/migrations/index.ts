import * as migration_20260522_190605 from './20260522_190605';
import * as migration_20260523_031928 from './20260523_031928';

export const migrations = [
  {
    up: migration_20260522_190605.up,
    down: migration_20260522_190605.down,
    name: '20260522_190605',
  },
  {
    up: migration_20260523_031928.up,
    down: migration_20260523_031928.down,
    name: '20260523_031928'
  },
];
