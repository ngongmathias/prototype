declare module 'leaflet' {
  export = L;
  export as namespace L;
}

declare namespace L {
  interface Map {
    invalidateSize(): void;
  }
}

