import Anthropic from '@anthropic-ai/sdk';
import axios from 'axios';
import os from 'os';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { argv } from 'process';
import { withPrompt } from './src/prompt/index.mjs';
import { formattedRatings } from './src/response/index.mjs';

// Model options, from most to least powerful and expensive:
// claude-3-opus-20240229
// claude-3-sonnet-20240229
// claude-3-haiku-20240307
const model = 'claude-3-haiku-20240307'

const usage = `Usage:
<text> specify text directly, e.g. node useful.mjs "your text" 
--test run useful's tests. ignores other arguments. you may view the example files in tests/
--txt specify a path to a .txt file
--url specify a url to static markup (spas, pdfs, images and other files not supported)`

if (argv.length <= 2) {
  console.log(usage);
  process.exit()
}

const args = argv.slice(2);
let inputText;
let runTests = false;
let txtFilePath;
let url;

if (args[0] === '--test') {
  runTests = true;
} else if (args[0] === '--txt' && args.length > 1) {
  txtFilePath = args[1];
} else if (args[0] === '--url' && args.length > 1) {
  url = args[1];
} else {
  inputText = args[0];
}

let text;

if (typeof inputText === 'string') {
  text = inputText.trim();
} else if (txtFilePath) {
  // Expand environment variables
  const path = txtFilePath.replace(/\$(\w+)/g, (_, key) => process.env[key] || '');

  // Expand tilde to home directory
  if (path.startsWith('~')) {
    path = os.homedir() + path.substr(1);
  }
  const filePath = resolve(path);
  text = readFileSync(filePath, 'utf8');
} else if (url) {
  const response = await axios.get(url);
  text = response.data;
} else {
  console.error('Unsupported argments')
  console.log(usage)
  process.exit(1)
}

if (runTests) {
  // run tests
  process.exit();
}

const anthropic = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

async function main(text) {
  if (!text) {
    console.error(
      text === ''
        ? 'Empty string provided'
        : `Expected text to be string, but got ${typeof text} ${text}`
    )
    process.exit(1)
  }
  const content = withPrompt(text)

  const message = await anthropic.messages.create({
    max_tokens: 1024,
    messages: [{ role: 'user', content }],
    model,
  }).catch(async (err) => {
    if (err instanceof Anthropic.APIError) {
      console.log(err.status); // 400
      console.log(err.name); // BadRequestError
      console.log(err.headers); // {server: 'nginx', ...}
    } else {
      throw err;
    }
  });

  if (Array.isArray(message?.content)) {
    message.content.forEach((contentItem) => {
      if (contentItem.type === 'text') {
        console.log(formattedRatings(contentItem.text));
      }
    });
  }
}

main(text);