/**
 * Constructor
 */
function PseudoCodeParser(args) {
    /**
     * @var {Array} Array of blocks delimiters
     */
    this.delimiters = [
        { pattern: /---\*/i,    replacement: "┌─── *",      borderType: 1 },
        { pattern: /---[-]+/i,  replacement: "└─────────",  borderType: 0 },
        { pattern: /\bendif\b/i,    replacement: "└──",         borderType: 0 },
        { pattern: /\b___\b/i,      replacement: "└──",         borderType: 0 },
        { pattern: /\belseif\b/i,   replacement: "├── if",      borderType: -1 },
        { pattern: /\belse\b/i,     replacement: "├── else",    borderType: -1 },
        { pattern: /\bif\b/i,       replacement: "┌── if",      borderType: 1 },
        { pattern: /\benddo\b/i,    replacement: "╙──",         borderType: 0 },
        { pattern: /\b===\b/i,      replacement: "╙──",         borderType: 0 },
        { pattern: /\bdo\b/i,       replacement: "╔══ do",      borderType: 2 }
    ];

    /**
     * @var {Array} Array of symbols
     */
    this.symbols = [
	    { pattern: /<=/g,      replacement: "&le;" },
		{ pattern: />=/g,      replacement: "&ge;" },
		{ pattern: /!=/g,      replacement: "&ne;" },
		{ pattern: /->/g,      replacement: "&rarr;" },
		{ pattern: /=>/g,      replacement: "&rArr;" },
		{ pattern: /sqrt\^/g,  replacement: "&radic;" }
    ];

    /**
     * @var {Array} Array of reserved keywords (for extended formatting)
     */
    this.reservedKeywords = [
        // Colored in green
        // - English keywords
        { keyword: "get",       color: "#08a200" },
        { keyword: "print",     color: "#08a200" },
        { keyword: "return",    color: "#08a200" },
        { keyword: "free",      color: "#08a200" },
        // - French keywords
        { keyword: "obtenir",   color: "#08a200" },
        { keyword: "sortir",    color: "#08a200" },
        { keyword: "libérer",   color: "#08a200" },
        { keyword: "liberer",   color: "#08a200" },

        // Colored in blue
        // - English keywords
        { keyword: "and",   color: "#094ecd" },
        { keyword: "or",    color: "#094ecd" },
        { keyword: "if",    color: "#094ecd" },
        { keyword: "else",  color: "#094ecd" },
        { keyword: "do",    color: "#094ecd" },
        { keyword: "times", color: "#094ecd" },
        { keyword: "until", color: "#094ecd" },
        { keyword: "while", color: "#094ecd" },
        { keyword: "is",    color: "#094ecd" },
        { keyword: "not",   color: "#094ecd" },
        { keyword: "than",  color: "#094ecd" },
        { keyword: "break", color: "#094ecd" },
        { keyword: "stop",  color: "#094ecd" },
        { keyword: "hv",    color: "#094ecd" },
        { keyword: "lv",    color: "#094ecd" },
        { keyword: "true",  color: "#094ecd" },
        { keyword: "false", color: "#094ecd" },
        { keyword: "null",  color: "#094ecd" },
        { keyword: "nil",   color: "#094ecd" },
        // - French keywords
        { keyword: "vrai",   color: "#094ecd" },
        { keyword: "faux",   color: "#094ecd" }
    ];

    /**
     * @var {Array} Array of expressions (for extended formatting)
     */
    this.expressions = [
        { pattern: /"([^"]+)"/ig,           replacement: '<span style="color: #c0392b">"$1"</span>' },
        { pattern: /'([^']+)'/ig,           replacement: '<span style="color: #c0392b">\'$1\'</span>' },
        { pattern: /\/\/ (.+)/i,            replacement: '<span style="color: #16a085">// $1</span>' },
        { pattern: /\[([^\]]+)\]ent/ig,       replacement: '<span style="color: #094ecd">[</span>$1<span style="color: #094ecd">]<small>ENT</small></span>' },
        { pattern: /^┌─── \* (.+)$/i,       replacement: '┌─── * <span style="color: #8e44ad">$1</span>' },
        { pattern: /([a-zA-Z0-9]+)\(([^\(]+)\)/ig, replacement: '$1(<span style="color: #e67e22">$2</span>)' },
        { pattern: /([a-zA-Z0-9]+)\[([^\]]+)\]/ig, replacement: '$1(<span style="color: #e67e22">$2</span>)' }
    ];

    /**
     * @var boolean
     */
    this.extendedFormatting = (args.extendedFormatting) ? args.extendedFormatting : false;

    /**
     * @var {Array} Border types
     */
    this.borderTypes = [
        '', '│', '║'
    ];

    /**
     * @var {String} Reserved keywords, separated by "|" in a string
     *
     * Auto-generated !
     */
    var keywordsString = "";

    for (var i in this.reservedKeywords) {
        keywordsString += this.reservedKeywords[i].keyword + "|";
    }

    keywordsString = keywordsString.substr(0, keywordsString.length - 1);

    this.reservedKeywordsString = keywordsString;

     /**
      * @var {Object} Used as an associative array
      *
      * Auto-generated !
      */
    this.blocks = {};

    /**
     * @var int
     *
     * Auto-generated !
     */
    this.levelBlocks = 0;
};

/**
 * Draw the action diagram
 *
 * @param {String} string Diagram description
 * @return {String}
 */
PseudoCodeParser.prototype.drawDiagram = function(string) {
    var lines;

    this.blocks = {};
    this.levelBlocks = 0;

    string = this.normalize(string);
    console.log(string);
    lines = string.split("\n");

    lines.forEach(function (line, index, lines) {
        line = line.trim();
        line = this.replaceSymbols(line);
        line = this.addModules(line);
        line = this.addBlocks(line);

        if (this.extendedFormatting) {
            line = this.colorExpressions(line);
            line = this.colorKeywords(line);
        }

        lines[index] = line;
    }, this);

    string = lines.join("\n");
    return string;
};

/**
 * Normalize string
 *
 * @param {String} string String to normalize
 * @return {String}
 */
PseudoCodeParser.prototype.normalize = function(string) {
    // Remove surrounding whitespaces
    string = string.trim();
    // Standardize line breaks
    string = string.replace(/\r\n|\r/g, "\n");
    // Strip any lines consisting only of spaces
    string = string.replace(/^[ ]+$/m, "");

    return string;
};

/**
 * Replace symbols
 *
 * @param {String} string
 * @return {String}
 */
PseudoCodeParser.prototype.replaceSymbols = function(string) {
    this.symbols.forEach(function (symbol, index) {
        string = string.replace(symbol.pattern, symbol.replacement);
    });
    return string;
};

/**
 * Create blocks
 *
 * @param {String} string
 * @return {String}
 */
PseudoCodeParser.prototype.addBlocks = function(string) {
    var delimiterIndex = 0;

    while (delimiterIndex < this.delimiters.length && !string.match(this.delimiters[delimiterIndex].pattern)) {
        delimiterIndex++;
    }

    if (delimiterIndex != this.delimiters.length) {
        var pattern = this.delimiters[delimiterIndex].pattern;
        var replacement = this.delimiters[delimiterIndex].replacement;
        var borderType = this.delimiters[delimiterIndex].borderType;

        string = string.replace(pattern, replacement);

        if (borderType == 0) {
            this.blocks[--this.levelBlocks] = 0;
            string = this.borders(false) + string;
        }
        else if (borderType > 0) {
            string = this.borders(false) + string;
            this.blocks[this.levelBlocks++] = borderType;
        }
        else {
            // In "else" and "else if" special cases, we don't need to add a new block
            // We just need to repeat the border of the parent "if" block
            this.blocks[this.levelBlocks - 1] = 0;
            string = this.borders(false) + string;
            this.blocks[this.levelBlocks - 1] = 1;
        }
    }
    else {
        string = this.borders(true) + string;
    }

    return string;
};

/**
 * Create modules and paragraphs blocks
 *
 * @param {String} string
 * @return {String}
 */
PseudoCodeParser.prototype.addModules = function (string) {
    var parts = [];
    var border = "";

    if (string.match(/module\(([^)]+)\)/i)) {
        var args = string.replace(/module\(([^)]+)\)/i, function (whole, args) { return args; });
        var parameters = args.split(";");

        var title = (0 in parameters && parameters[0].length > 0) ? parameters[0] : "";
        var inputs = (1 in parameters && parameters[1].length > 0) ? " ↓ " + parameters[1] : "";
        var outputs = (2 in parameters && parameters[2].length > 0) ? " ↓ " + parameters[2] : "";

        for (var i = 0; i < title.length; i++) {
            border += "─";
        }

        parts[0] = "o─" + border + "─o" + inputs;
        parts[1] = this.borders(true) + "│ " + title + " │";
        parts[2] = this.borders(true) + "o─" + border + "─o" + outputs;

        string = parts.join("\n");
    }
    else if (string.match(/paragraph[e]?\(([^(]+)\)/i)) {
        var args = string.replace(/paragraph[e]?\(([^(]+)\)/i, function (whole, args) { return args; });
        var parameters = args.split(";");

        var title = (0 in parameters && parameters[0].length > 0) ? parameters[0] : "";

        for (var i = 0; i < title.length; i++) {
            border += "─";
        }

        parts[0] = "┌─" + border + "─┐";
        parts[1] = this.borders(true) + "│ " + title + " │";
        parts[2] = this.borders(true) + "└─" + border + "─┘";

        string = parts.join("\n");
    }

    return string;
};

/**
 * Add left borders
 *
 * @param boolean addWhitespace Add a whitespace next to the borders
 * @return {String}
 */
PseudoCodeParser.prototype.borders = function(addWhitespace) {
    var borders = "";

    for (var i in this.blocks) {
        borders += this.borderTypes[this.blocks[i]];
    }

    return (addWhitespace) ? borders + " " : borders;
};

/**
 * Set color to reserved keywords
 *
 * @param {String} string
 * @return {String}
 */
PseudoCodeParser.prototype.colorKeywords = function(string) {
    var keywordsRegExp = new RegExp("\\b(" + this.reservedKeywordsString + ")\\b", "ig");

    if (string.match(keywordsRegExp)) {
        string = string.replace(keywordsRegExp, (function (keyword) {
            var keywordIndex = 0;
            var keywordLowerCase = keyword.toLowerCase();

            while (keywordIndex < this.reservedKeywords.length && this.reservedKeywords[keywordIndex].keyword != keywordLowerCase) {
                keywordIndex++;
            }

            if (keywordIndex < this.reservedKeywords.length) {
                keyword = '<span style="color:' + this.reservedKeywords[keywordIndex].color + '">' + keyword + '</span>';
            }

            return keyword;
        }).bind(this));
    }

    return string;
};

/**
 * Extended formatting for expressions
 *
 * @param {String} string
 * @return {String}
 */
PseudoCodeParser.prototype.colorExpressions = function(string) {
    var expressionIndex = 0;
    var expressions = [];

    while (expressionIndex < this.expressions.length) {
        if (string.match(this.expressions[expressionIndex].pattern)) {
            string = string.replace(this.expressions[expressionIndex].pattern, this.expressions[expressionIndex].replacement);
        }
        expressionIndex++;
    }

    return string;
};
