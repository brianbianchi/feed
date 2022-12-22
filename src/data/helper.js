/**
 * Decodes HTML string. (&qot; -> ")
 * @param {string} input 
 * @returns decoded string
 */
export const htmlDecode = (input) => {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
};