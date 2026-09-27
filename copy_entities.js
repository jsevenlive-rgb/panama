const fs = require('node:fs');
const os = require('node:os');
const files = fs.readdirSync('./entities/');

capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

let dto_file = '';

debug = true;

for (let file of files) {
  let name = file.split('.');
  if (name[0] !== 'index') {
    let folder = './src/' + name[0];
    let entity_folder = folder + '/entities/';
    let dto_folder = folder + '/dto/';

    try {
      fs.mkdirSync(folder);
    } catch (e) {
      if (debug) console.error(e);
    }

    try {
      fs.mkdirSync(entity_folder);
      fs.copyFileSync('./entities/' + file, entity_folder + name[0] + '.entity.ts');
    } catch (e) {
      if (debug) console.error(e);
    }

    try {
      fs.mkdirSync(dto_folder);
      dto_file =
        `import { IsInt, IsString } from 'class-validator'` +
        os.EOL +
        os.EOL +
        `export class Create` +
        capitalizeFirstLetter(name[0]) +
        `Dto {` +
        os.EOL +
        `}` +
        os.EOL;

      fs.writeFileSync(dto_folder + 'create-' + name[0] + '.dto.ts', dto_file);
    } catch (e) {
      if (debug) console.error(e);
    }
  }
}
