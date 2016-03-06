/**
 * Pseudo Code Parser
 *
 * @author Gaëtan Le Docte <gaetan.ledocte@gmail.com>
 */
var PseudoCodeParser = function () {
    /**
     * All blocks delimiters
     * 
     * @var {Array}
     */
    this.delimiters = [
        { pattern: /---\*/i,        replacement: "┌─── *",      border: "│" },
        { pattern: /---[-]+/i,      replacement: "└──────────", border: false },
        { pattern: /\bif\b/i,       replacement: "┌── if",      border: "│" },
        { pattern: /\belseif\b/i,   replacement: "├── if",      border: true },
        { pattern: /\belse\b/i,     replacement: "├── else",    border: true },
        { pattern: /\bendif\b/i,    replacement: "└──",         border: false },
        { pattern: /\b___\b/i,      replacement: "└──",         border: false },
        { pattern: /\bdo\b/i,       replacement: "╔══ do",      border: "║" },
        { pattern: /\benddo\b/i,    replacement: "╙──",         border: false },
        { pattern: /\b===\b/i,      replacement: "╙──",         border: false }
     ];

    /**
     * Symbols
     * 
     * @var {Array}
     */
    this.symbols = [
        { pattern: /<=/g,      replacement: "≤" },
 		{ pattern: />=/g,      replacement: "≥" },
 		{ pattern: /!=/g,      replacement: "≠" },
 		{ pattern: /->/g,      replacement: "→" },
 		{ pattern: /=>/g,      replacement: "⇒" },
 		{ pattern: /sqrt\^/g,  replacement: "√" }
    ];

    /**
     * Expressions
     * 
     * @var {Array}
     */
    this.expressions = [
        { pattern: /"([^"\n]*)"/ig,         replacement: '<span style="color: #E01931">"$1"</span>' },
        { pattern: /'([^'\n]*)'/ig,         replacement: '<span style="color: #E01931">\'$1\'</span>' },
        { pattern: /\{(.*)\|(.*)\}/ig,      replacement: '<span style="color: $2">$1</span>' },
        { pattern: /\{(.*)\}/ig,            replacement: '<span style="color: #1C57E1">$1</span>' },
        { pattern: /\/\/ (.*)/ig,           replacement: '<span style="color: #16a085">// $1</span>' },
        { pattern: /\/\*([^*/]*)\*\//ig,    replacement: '<span style="color: #16a085">/*$1*/</span>' },
        { pattern: /\[([^\]]+)\]ent/ig,     replacement: '<span style="color: #973939">[</span>$1<span style="color: #973939">]<small>ENT</small></span>' },
        { pattern: /┌─── \* (.*)/ig,        replacement: '┌─── * <span style="color: #27AE60"><strong>$1</strong></span>' },
        { pattern: /\b(if|else|do|while|until|times|and|or|is|not|than)\b/ig,       replacement: '<span style="color: #1C57E1">$1</span>' },
        { pattern: /\b(true|false|break|stop|vrai|faux|hv|lv|null|nil)\b/ig,        replacement: '<span style="color: #1C57E1">$1</span>' },
        { pattern: /\b(obtenir|sortir|libérer|liberer|traiter|get|print|return|free|process)\b/ig,  replacement: '<span style="color: #27AE60">$1</span>' },
        {
            pattern: /([a-z0-9]+)\(([^=.\n]*)\)/ig,
            replacement: function (match, title, content) {
                if (content.length > 0) {
                    var index = "(";

                    content.split(")(").forEach(function (value) {
                        value.split(",").forEach(function (v) {
                            index += '<span style="color: #FF7416">' + v + '</span>,';
                        });
                        index = index.substring(0, index.length - 1);
                        index += ")(";
                    });

                    return title + index.substring(0, index.length - 1);
                } else {
                    return title + "()";
                }
            }
        },
        {
            pattern: /([a-z0-9]+)\[([a-z0-9 +,]*)\]/ig,
            replacement: function (match, title, content) {
                if (content.length > 0) {
                    var index = "(";

                    content.split("][").forEach(function (value) {
                        value.split(",").forEach(function (v) {
                            index += '<span style="color: #FF7416">' + v + '</span>,';
                        });
                        index = index.substring(0, index.length - 1);
                        index += ")(";
                    });

                    return title + index.substring(0, index.length - 1);
                } else {
                    return title + "()";
                }
            }
        }
    ];
};

/**
 * Draw action diagram from pseudo code
 *
 * @param {String} text Pseudo code
 * @return {String}
 */
PseudoCodeParser.prototype.drawDiagram = function (text, extendedFormatting) {
    var lines;

    this.borders = "";

    text = this.normalize(text);
    text = this.replaceSymbols(text);
    text = this.parseModules(text);

    lines = text.split("\n");

    lines.forEach(function (value, index, lines) {
        var line = value.trim();
        line = this.parseBlock(line);
        lines[index] = line;
    }, this);

    text = lines.join("\n");

    if (extendedFormatting) {
        text = this.replaceExpressions(text);
    }

    return text;
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
PseudoCodeParser.prototype.replaceSymbols = function (string) {
    this.symbols.forEach(function (symbol) {
        string = string.replace(symbol.pattern, symbol.replacement);
    });
    return string;
};

/**
 * Replace expressions
 *
 * @param {String} string
 * @return {String}
 */
PseudoCodeParser.prototype.replaceExpressions = function (string) {
    this.expressions.forEach(function (expression) {
        string = string.replace(expression.pattern, expression.replacement);
    });
    return string;
};

/**
 * Looking for module/paragraph expression and create the correspondant block
 *
 * @param {String} string
 * @return string
 */
PseudoCodeParser.prototype.parseModules = function (string) {
    string = string.replace(/paragraph[e]?\((.+)\)/g, (function (match, title) {
        return this.createModule(title, "", "", {
            topLeft:    '┌',    topRight:   '┐',
            bottomLeft: '└',    bottomRight:'┘',
        });
    }).bind(this));

    string = string.replace(/module?\(([^;)\n]+)[;]?([^;)\n]*)[;]?([^)\n]*)\)/ig, (function (match, title, inputs, outputs) {
        inputs = (inputs.trim().length > 0) ? " ↓ " + inputs : "";
        outputs = (outputs.trim().length > 0) ? " ↓ " + outputs : "";

        return this.createModule(title, inputs, outputs, {
            topLeft:    'o',    topRight:   'o',
            bottomLeft: 'o',    bottomRight:'o',
        });
    }).bind(this));

    return string;
};

/**
 * Create a module block
 *
 * @param {String} title
 * @param {String} inputs
 * @param {String} outputs
 * @param {Object} corners
 * @return {String}
 */
PseudoCodeParser.prototype.createModule = function (title, inputs, outputs, corners) {
    var block = "";
    var border = "";
    var length = title.length;

    for (var i = 0; i < length; i++) {
        border += "─";
    }

    block += corners.topLeft + "─" + border + "─" + corners.topRight + inputs + "\n";
    block += "│ " + title  + " │\n";
    block += corners.bottomLeft + "─" + border + "─" + corners.bottomRight + outputs;

    return block;
};

 /**
  * Looking for a block delimiter and replace it
  *
  * @param {String} string
  * @return {String}
  */
PseudoCodeParser.prototype.parseBlock = function (string) {
    var index;
    var length;
    var firstWord;
    var delimiters = [
        "---*", "------",
        "if", "elseif", "else", "endif", "___",
        "do", "enddo", "==="
    ];

    firstWord = (string.match(/^[a-z-_\*=]+/i)) ? string.match(/^[a-z-_\*=]+/i)[0] : "";

    if (firstWord.length === 0 || delimiters.indexOf(firstWord) < 0) {
        return this.addBorders(string, "", true);
    }

    // -------------------------------------------------------------------------

    index = 0;
    length = this.delimiters.length;

    while (index < length && !string.match(this.delimiters[index].pattern)) {
        index++;
    }

    if (index < length) {
        var delimiter = this.delimiters[index];

        string = string.replace(delimiter.pattern, delimiter.replacement);
        string = this.addBorders(string, delimiter.border, false);
    }

    return string;
};

/**
 * Add left borders
 *
 * @param {String} string
 * @param {String}|boolean border
 * @param boolean whitespace
 * @return {String}
 */
PseudoCodeParser.prototype.addBorders = function (string, border, whitespace) {
    var borders = this.borders;

    if (typeof border === "string" && border.length > 0) {
        this.borders += border;
    } else if (typeof border === "boolean") {
        borders = borders.substring(0, borders.length - 1);

        if (!border) {
            this.borders = borders;
        }
    }

    return (whitespace) ? borders + " " + string : borders + string;
};
