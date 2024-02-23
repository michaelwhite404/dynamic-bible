import fetch from "sync-fetch";
import ShortUniqueId from "short-unique-id";
import { BibleBook } from "../types/BibleBook";
import { BibleQueryAPIResponse } from "../types/BibleQueryAPIResponse";

const BIBLE_URI = "https://query.getbible.net/v2";

export interface PassageParams {
  translation?: string;
  book: BibleBook;
  chapter: number;
  verse: number | string;
}

interface FormattedPassage {
  translation: string;
  book: BibleBook;
  chapter: number;
  verse: number | string;
  text: string;
}

export class Passage {
  readonly uid: string;
  private translation: string;
  private book: BibleBook;
  private chapter: number;
  private verse: string | number;
  private data: BibleQueryAPIResponse | undefined;
  valid: boolean;
  constructor({ translation = "kjv", book, chapter, verse }: PassageParams) {
    this.uid = new ShortUniqueId().randomUUID(32);
    this.translation = translation;
    this.book = book;
    this.chapter = chapter;
    this.verse = verse;
    this.data = this.getData();
    this.valid = !!this.data;
  }

  private getData(): BibleQueryAPIResponse | undefined {
    const res = fetch(this.buildUri());
    if (res.status === 200) return res.json();
    return undefined;
  }

  private buildUri() {
    return `${BIBLE_URI}/${this.translation}/${this.book} ${this.chapter}:${this.verse}`;
  }

  toString() {
    if (!this.valid) return "";
    return Object.values(this.data!)
      .reduce((p, next) => {
        p.push(next.verses.map(({ text }) => text).join(" "));
        return p;
      }, [] as string[])
      .join(" ");
  }

  formatPassage(): FormattedPassage {
    return {
      translation: this.translation,
      book: this.book,
      chapter: this.chapter,
      verse: this.verse,
      text: this.toString(),
    };
  }
}
