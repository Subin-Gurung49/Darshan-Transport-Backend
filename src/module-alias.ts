import moduleAlias from 'module-alias';
import path from 'path';

// Determine the project root. This assumes module-alias.ts is in src/
const projectRoot = path.resolve(__dirname, '..'); 

// Define aliases relative to the 'dist' directory at the project root.
// This setup is for when the compiled JavaScript runs from the 'dist' folder.
moduleAlias.addAliases({
  '@config': path.join(projectRoot, 'dist', 'config'),
  '@controllers': path.join(projectRoot, 'dist', 'controllers'),
  '@interfaces': path.join(projectRoot, 'dist', 'interfaces'),
  '@routes': path.join(projectRoot, 'dist', 'routes'),
  '@services': path.join(projectRoot, 'dist', 'services'),
  '@utils': path.join(projectRoot, 'dist', 'utils'),
  '@middleware': path.join(projectRoot, 'dist', 'middleware')
});

// If running with ts-node (development), __dirname will be in 'src'. 
// module-alias needs to point to the .ts files in 'src' for ts-node.
if (__dirname.includes(path.join(projectRoot, 'src'))) { 
  moduleAlias.addAliases({
    '@config': path.join(projectRoot, 'src', 'config'),
    '@controllers': path.join(projectRoot, 'src', 'controllers'),
    '@interfaces': path.join(projectRoot, 'src', 'interfaces'),
    '@routes': path.join(projectRoot, 'src', 'routes'),
    '@services': path.join(projectRoot, 'src', 'services'),
    '@utils': path.join(projectRoot, 'src', 'utils'),
    '@middleware': path.join(projectRoot, 'src', 'middleware')
  });
}