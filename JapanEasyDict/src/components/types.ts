export interface Japanese {
  word?: string;
  reading: string;
}

export interface Sense {
  english_definitions: string[];
  parts_of_speech: string[];
}

export interface WordData {
  id?: string;
  slug?: string;
  japanese: Japanese[];
  senses: Sense[];
  is_common?: boolean;
  jlpt?: string[];
}