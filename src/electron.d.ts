export {};

declare global {
  interface Window {
    electronAPI?: {
      platform: string;
      versions: {
        node: string;
        chrome: string;
        electron: string;
      };
      window: {
        minimize: () => Promise<void>;
        toggleMaximize: () => Promise<{ isMaximized: boolean }>;
        close: () => Promise<void>;
        getState: () => Promise<{
          isMaximized: boolean;
          isMinimized: boolean;
          isFullScreen: boolean;
        }>;
        setAlwaysOnTop: (flag: boolean) => Promise<{ ok: boolean }>;
        setFullScreen: (flag: boolean) => Promise<{ ok: boolean }>;
      };
      system: {
        getInfo: () => Promise<{
          appVersion: string;
          platform: string;
          release: string;
          arch: string;
          hostname: string;
          uptimeSeconds: number;
          totalMemory: number;
          freeMemory: number;
          cpuModel: string;
          cpuCores: number;
          homeDir: string;
          userName: string;
          shell: string;
          tempDir: string;
          locale: string;
          timezone: string;
          darkMode: boolean;
          displays: Array<{
            id: number;
            label: string;
            scaleFactor: number;
            size: { width: number; height: number };
            workArea: { x: number; y: number; width: number; height: number };
            rotation: number;
            internal: boolean;
            touchSupport: string;
          }>;
        }>;
        openSettings: () => Promise<{ ok: boolean }>;
        getBattery: () => Promise<{
          hasBattery: boolean;
          isCharging: boolean;
          percent: number;
        }>;
        getVolume: () => Promise<{ level?: number; error?: string }>;
        setVolume: (level: number) => Promise<{ ok: boolean; error?: string }>;
        getNetworkStatus: () => Promise<{ name: string; address: string; mac: string } | null>;
      };
      fs: {
        listDirectory: (targetPath: string) => Promise<
          Array<{
            name: string;
            path: string;
            type: "file" | "folder";
            size: number | null;
            modified: string;
          }>
        >;
        readFile: (filePath: string) => Promise<{ content?: string; error?: string }>;
        writeFile: (filePath: string, content: string) => Promise<{ ok?: boolean; error?: string }>;
        getStats: (filePath: string) => Promise<{
          size?: number;
          isDirectory?: boolean;
          isFile?: boolean;
          created?: string;
          modified?: string;
          accessed?: string;
          error?: string;
        }>;
        createDirectory: (dirPath: string) => Promise<{ ok?: boolean; error?: string }>;
        deleteItem: (itemPath: string) => Promise<{ ok?: boolean; error?: string }>;
        moveItem: (src: string, dest: string) => Promise<{ ok?: boolean; error?: string }>;
        copyItem: (src: string, dest: string) => Promise<{ ok?: boolean; error?: string }>;
      };
      shell: {
        openPath: (targetPath: string) => Promise<string>;
        showItemInFolder: (itemPath: string) => Promise<{ ok: boolean }>;
        openExternal: (url: string) => Promise<{ ok?: boolean; error?: string }>;
        getDownloadsPath: () => Promise<string>;
        getAppSupportPath: () => Promise<string>;
      };
      app: {
        getVersion: () => Promise<string>;
        getName: () => Promise<string>;
        getPath: (name: string) => Promise<string>;
        quit: () => Promise<void>;
        relaunch: () => Promise<void>;
      };
      storage: {
        get: (key: string) => Promise<unknown>;
        set: (key: string, value: unknown) => Promise<{ ok: boolean }>;
        remove: (key: string) => Promise<{ ok: boolean }>;
        clear: () => Promise<{ ok: boolean }>;
      };
      clipboard: {
        read: () => Promise<string>;
        write: (text: string) => Promise<{ ok: boolean }>;
        readImage: () => Promise<string | null>;
        writeImage: (base64Data: string) => Promise<{ ok: boolean }>;
      };
      notifications: {
        show: (title: string, options?: { body?: string; silent?: boolean; icon?: string }) => Promise<{ supported: boolean }>;
        isSupported: () => Promise<boolean>;
      };
      process: {
        list: () => Promise<Array<{ pid: number; name: string; memory: number }>>;
        kill: (pid: number) => Promise<{ ok: boolean; error?: string }>;
      };
    };
  }
}