import { exec } from 'child_process';

const executeTest = (command, description, expectedExitCode = 0) => {
  console.log(`Test: ${description}`);
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error && error.code !== expectedExitCode) {
        console.error(`exec error: ${error}`);
        reject(error);
        return;
      }
      if (error && error.code === expectedExitCode) {
        console.log(`Expected exit code: ${expectedExitCode}`);
      }
      console.log(`stdout: ${stdout}`);
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      resolve({ stdout, stderr, exitCode: error ? error.code : 0 });
    });
  });
};

// Test 1: Execute with an empty string, expecting exit code 1
await executeTest('node useful.mjs ""', 'Executing with an empty string', 1);

// Test 2: Execute with a space, expecting exit code 1
await executeTest('node useful.mjs " "', 'Executing with a space', 1);

// Test 3: Execute with a joke
await executeTest('node useful.mjs "Why did the function stop calling? Because it had too many arguments!"', 'Executing with a joke');

// Test 4: Execute with a --txt flag and a file path
await executeTest('node useful.mjs --txt ./test/shameless-plug.txt', 'Executing with --txt flag and a relative file path');
// Test 5: Execute with a --url flag and a URL
await executeTest('node useful.mjs --url https://hawleypeters.com/budget-game/', 'Executing with --url flag and a URL');

process.exit();
