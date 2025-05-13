export interface JapaneseWord {
  word?: string;
  reading: string;
}

export interface WordSense {
  english_definitions: string[];
  parts_of_speech: string[];
}

export interface WordData {
  id: string;
  japanese: JapaneseWord[];
  senses: WordSense[];
  is_common: boolean;
  jlpt: string[];
}

export interface APIWordResponse {
  id: string;
  word: string;
  reading: string;
  meaning: string;
  partOfSpeech: string;
  is_common: boolean;
  jlpt?: string[];
}