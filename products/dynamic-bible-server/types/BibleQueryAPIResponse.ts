export interface BibleQueryAPIResponse {
  [x: string]: {
    translation: string;
    abbreviation: string;
    lang: string;
    language: string;
    direction: string;
    encoding: string;
    book_nr: number;
    book_name: string;
    chapter: number;
    name: string;
    ref: string[];
    verses: Verse[];
  };
}

interface Verse {
  chapter: number;
  verse: number;
  name: string;
  text: string;
}
