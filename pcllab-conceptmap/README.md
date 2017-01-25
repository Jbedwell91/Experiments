# Concept Map

Basic Configuration:
- `@param {string} [title="Concept Map"]` - This title will appear on the left side above the text.
- `@param {boolean} [lock=false]` - Lock the concept map, so nodes cannot be edited or created. However, they can be added by dragging words from the left.
- `@param {boolean} [linkText=false]` - Allow editable texts per connection

The Concept Map supports two modes, *wordlist* or *text* mode. *Wordlist* is word bank style list, while *text* is used for paragraph text. Supply either data to `wordlist` or `text` parameters. If neither supplied, the left will be blank. If both are supplied, it defaults to using data from `text`.

WordList Mode
- `@param {string[]} [wordlist]` - A list of words used for a word bank on the left.
- `@param {boolean} [shuffle=true]` - Whether or not to shuffle the `wordlist`. Shuffle *only* applies to wordlist mode.

Text Mode  
- `@param {string | string[]} [text]` - Text that is displayed on the left. If an array of strings is passed, a line break is inserted between them. To make a word draggable, wrap the word with the delimiter (default is \*).
- `@param {char | string} [delimiter='*']` - The delimiter used around a word ( like \*word\* ) to make the word draggable into the concept map. *Only* applies to text mode.
