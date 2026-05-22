import * as migration_20260522_190605 from './20260522_190605';

export const migrations = [
  {
    up: migration_20260522_190605.up,
    down: migration_20260522_190605.down,
    name: '20260522_190605'
  },
];
