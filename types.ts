export enum AppMode {
  LANDING = 'LANDING',
  SONG_SEARCH = 'SONG_SEARCH',
  IMAGE_EDITOR = 'IMAGE_EDITOR',
  IMAGE_ANALYZER = 'IMAGE_ANALYZER',
}

export interface SongResult {
  title: string;
  artist: string;
  album?: string;
  description: string;
}

export interface AnalysisResult {
  text: string;
}

export interface GeneratedImage {
  mimeType: string;
  data: string; // Base64 string
}

export enum RequestStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}