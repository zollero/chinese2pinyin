
import isString from 'is-string';

import { FULL_DICT } from '../dict'


// interface getPinyinOfWordsOptions {
//     separator?: string // text to join the pinyin of words
//     capitalizeFirstLetter?: boolean // whether to capitalize the first letter of every word's pinyin
// }

type Words = Array<string>

/**
 * Return an array of single word
 * @param words array of words
 * @param options 
 */
export function getEveryLetters(
    words: string, 
    escapeText?: string
): Words {

    if (escapeText) {
       return words.split('').map(v => isSimplifiedChineseWord(v) ? v : escapeText)
    } else {
        return typeof words === 'string' ? words.split('') : []
    }
}

/**
 * Return the pinyin the words of chinese
 * @param words array of chinese word
 * @param separator the separator to join the pinyin of words
 * @param capitalizeFirstLetter whether to capitalize the first letter of every word's pinyin
 */
export function getPinyinOfWords(
    words: Words, 
    separator: string = '',
    capitalizeFirstLetter: boolean = true
): string {
    return words.map(v => getPiyinOfWord(v, capitalizeFirstLetter)).join(separator)
}

/**
 * Return the first letter of chinese words
 * @param words array of chinese word
 * @param separator the separator to join the first letters
 * @param uppercase whether to capitalize the letters
 */
export function extractFirstLetters(
    words: Words,
    separator: string = '',
    uppercase: boolean = true
): string {
    return words.map(v => extractFirstLetter(getPiyinOfWord(v, false), uppercase)).join(separator)
}

/**
 * Return the first letter of a chinese word's pinyin
 * @param pinyin a chinese word's pinyin
 * @param uppercase whether to uppercase the first letter
 */
function extractFirstLetter(pinyin: string, uppercase: boolean): string {
    if (isString(pinyin) && pinyin.length > 0) {
        const firstLetter = pinyin.charAt(0)
        return uppercase ? firstLetter.toLocaleUpperCase() : firstLetter
    }
    return pinyin
}

/**
 * Return the pinyin of a chinese word
 * @param word chinese word
 * @param capitalizeFirstLetter whether to capitalize the first letter of every word's pinyin
 */
function getPiyinOfWord(word: string, capitalizeFirstLetter: boolean = true): string {
    const keys = Object.keys(FULL_DICT);
    let key
    for (let i = 0; i < keys.length; i++) {
        const value = FULL_DICT[keys[i]]
        if (value.indexOf(word) !== -1) {
            key = capitalizeFirstLetter ? capitalizeTheFirstLetter(keys[i]) : keys[i]
            break;
        }
    }
    return key
}

/**
 * Capitialize the first letter of the pinyin and return the capitialized value
 * @param pinyin a chinese word's pinyin
 */
function capitalizeTheFirstLetter(pinyin: string): string {
    if (isString(pinyin) && pinyin.length > 1) {
        const firstLetter = pinyin.charAt(0)
        return pinyin.replace(new RegExp(`^${firstLetter}`), firstLetter.toLocaleUpperCase())
    }
    return pinyin
}

/**
 * Check whether the words are all chinese words
 * @param word chinese words string
 */
function isSimplifiedChineseWord(word: string): boolean {
    if (shouldBeString(word)) {
        return word.split('').every(v => isChineseUnicode(v.charCodeAt(0)))
    }
    return false
}

/**
 * Check the word's char code is in the range of chinese code
 * @param charCode word's char code
 */
function isChineseUnicode(charCode: number): boolean {
    return charCode >= 19968 && charCode <= 40869
}

/**
 * Check whether the word's type is string
 * @param word 
 */
function shouldBeString(word: string): boolean {
    if (isString(word)) {
        return true
    } else {
        throw new Error('word is not a string value')
    }
} 