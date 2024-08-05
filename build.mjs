import 'dotenv/config';
import { exec } from 'child_process';

exec('yarn run build', (reactError, reactStdout, reactStderr) => {
  if (reactError) {
    console.error(`리액트 빌드 실패: ${reactError}`);
    return;
  }
  console.log(`리액트 빌드 성공: ${reactStdout}`);
  
  // 리액트 빌드 성공 후, 일렉트론 앱 빌드 시작
  exec('electron-builder build --win --publish always', (electronError, electronStdout, electronStderr) => {
    if (electronError) {
      console.error(`일렉트론 빌드 실패: ${electronError}`);
      return;
    }
    console.log(`일렉트론 빌드 성공: ${electronStdout}`);
  });
});