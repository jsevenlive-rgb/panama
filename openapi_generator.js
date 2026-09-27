const { exec } = require('node:child_process');
const { writeFileSync } = require('node:fs');

require('dotenv').config();

let load = async () => {
  try {
    const response = await fetch(process.env.SWAGGER_BACKEND_URL);
    const body = await response.text();

    if (response.status !== 200) throw new Error(body);

    await writeFileSync('panama.json', body);

    exec(
      'openapi-generator-cli generate -g "typescript-fetch" -i panama.json -o "./src/panama" --additional-properties="enumPropertyNaming=original,modelPropertyNaming=original"',
      (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
      }
    );
  } catch (e) {
    console.error('Error get json', process.env.SWAGGER_BACKEND_URL, e);
  }
};

load().then();
