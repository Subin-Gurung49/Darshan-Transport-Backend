import { addAliases } from 'module-alias';
import { join } from 'path';

addAliases({
  '@config': join(__dirname, 'config'),
  '@controllers': join(__dirname, 'controllers'),
  '@interfaces': join(__dirname, 'interfaces'),
  '@routes': join(__dirname, 'routes'),
  '@services': join(__dirname, 'services'),
  '@utils': join(__dirname, 'utils')
});