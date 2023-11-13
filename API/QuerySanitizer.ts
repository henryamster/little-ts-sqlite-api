import {  LogEvent } from "../Utilities/Logger";



export class QuerySanitizer{
  public static santizieQuery(q: string) {
    LogEvent.fromString("Sanitizing query: " + q);
      // Sanitize the query string q here
  // First, split the query string into an array of words
  const words = q.split(" ");
  // Next, sanitize each word
  const sanitizedWords = words.map((word) => this.sanitize(word));
  // Finally, join the words back together
  const sanitizedQuery = sanitizedWords.join(" ");
  LogEvent.fromString("Query sanitized: " + sanitizedQuery);
  return sanitizedQuery;
  }

  public static sanitize(word: string) {  
    const banned_words = ["drop", "delete", "update", "insert", "create", "alter",
      "grant", "revoke", "truncate", "backup", "restore", "use", "exec", "execute",
      "xp_", "sp_"];
    const banned_characters = [";", "'", '"', "`", "{", "}", "[", "]",];
    // Remove banned characters
    for (const character of banned_characters) {
      //alert if found
      if (word.includes(character)) {
        LogEvent.fromString("Banned character found: " + character);
      }
      word = word.replace(character, "");
    }
    // Remove banned words
    for (const banned_word of banned_words) {
      //alert if found
      if (word.includes(banned_word)) {
        LogEvent.fromString("Banned word found: " + banned_word);
      }
      word = word.replace(banned_word, "");
    }
    return word;
  }
}
