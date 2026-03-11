import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    // 如果你的 repo 不是 bloom-picker，請把 base 改成對應路徑
    base: '/bloom-picker/',
    plugins: [react()],
});
