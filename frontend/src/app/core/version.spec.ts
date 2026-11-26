import pkg from '../../../package.json';
import { APP_VERSION } from './version';

describe('versión', () => {
  it('coincide con package.json', () => expect(APP_VERSION).toBe(pkg.version));
});
