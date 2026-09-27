const { exec } = require('node:child_process');
const base64 = require('js-base64').Base64;
const { writeFileSync } = require('node:fs');

require('dotenv').config();

class App {
  async load_content() {
    try {
      const response = await fetch(process.env.SWAGGER_BACKEND_URL);
      const body = await response.text();

      console.log('.load_content status =', response.status);

      if (response.status !== 200) throw new Error(body);

      return body;
    } catch (e) {
      console.error('Error load_content', process.env.SWAGGER_BACKEND_URL, e);
    }
  }

  async upload_git(content) {
    try {
      let owner = 'StreamVi';
      const repo = 'streamvi_docs';
      const path = 'panama.json';
      const encodedContent = base64.encode(content);

      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
      const token = process.env.GITHUB_DOCS_TOKEN;

      // Посмотреть, существует ли файл и получить его SHA
      const old = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });
      let fileSha = null;
      if (old.ok) {
        const fileData = await old.json();
        fileSha = fileData.sha;
      }

      const body = {
        message: 'Add or update file via API',
        content: encodedContent,
        sha: fileSha,
      };

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `token ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/vnd.github.v3+json',
        },
        body: JSON.stringify(body),
      });
      let response_text = await response.text();
      console.log('.upload_git status =', response.status);

      if (![201, 200].includes(response.status)) {
        throw new Error(response_text);
      }
    } catch (e) {
      console.error('Error upload_git', process.env.SWAGGER_BACKEND_URL, e);
    }
  }

  async run() {
    try {
      let content = await this.load_content();
      await this.upload_git(content);
    } catch (e) {
      console.error('Error run', e);
    }
  }
}

let app = new App();
app.run().then();
