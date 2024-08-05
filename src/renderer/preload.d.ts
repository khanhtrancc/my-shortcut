import { ApiType } from "../main/preload";

declare global {
  interface Window {
    MyShortcutApi: ApiType
  }
}

export {};
