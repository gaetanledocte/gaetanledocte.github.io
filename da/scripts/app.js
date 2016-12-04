var welcomePanel = document.getElementById("welcomePanel");

var header = document.getElementById("header");
var sidebar = document.getElementById("sidebar");
var editor = document.getElementById("editor");
var preview = document.getElementById("preview");
var toolbar = document.getElementById("toolbar");
var input = document.getElementById("input");
var output = document.getElementById("output");

var parser = new PseudoCodeParser({
    delimiters: [
        { pattern: /\bperform\b/i, replacement: "╔══ perform", border: "║" },
        { pattern: /\bendperform\b/i, replacement: "╙──", border: false },
    ],
    extendedExpressions: [
        { pattern: /\b(perform|varying|from|by)\b/ig, replacement: '<span class="reserved-word">$1</span>' }
    ]
});
var useExtendedFormatting = true;
var liveReload = true;
var inputValue = input.value;

window.addEventListener("load", function() {
    drawDiagram();
    setEditorSize();

    if (input.value !== "") {
        welcomePanel.style.display = "none";
    }
});

window.addEventListener("resize", setEditorSize);

input.addEventListener("keyup", function() {
    if (liveReload && inputValue !== input.value) {
        inputValue = input.value;
        drawDiagram();
    }
});

input.addEventListener("keypress", function (event) {
    // Tabulation
    if (event.keyCode === 9) {
        event.preventDefault();

        var cursor = input.selectionStart;
        insert(input, "  ");
        input.selectionStart = cursor + 2;
        input.selectionEnd = input.selectionStart;
    }
});

// --- Welcome panel ---

buttonOpen.addEventListener("click", function(event) {
    event.preventDefault();

    welcomePanel.style.display = "none";
    input.focus();
});

buttonOpenWithExample.addEventListener("click", function(event) {
    event.preventDefault();

    welcomePanel.style.display = "none";
    input.value = "// Exemple\n\n// On souhaite ajouter, dans un tableau, des personnes identifiées par leurs noms\n// et prénoms. Ensuite, on souhaite afficher à l'écran le contenu du tableau.\n\n---* Exemple de diagramme\nnbPers = 0\nObtenir nomPrénom\n\ndo while (nomPrénom != \"ZZZ\")\n   module(AjoutPersonne;tabPersonnes, nbPersonnes, nomPrénom;tabPersonnes, nbPersonnes)\n   Obtenir nomPrénom\nenddo\nparagraphe(Sorties)\n------\n\n---* AjoutPersonne\niPers = 0\ndo while (iPers < nbPers AND tabPers[iPers] != nomPrénom)\n   iPers++\nenddo\nif (iPers = nbPers)\n   tabPers[iPers] = nomPrénom\nelse\n   Sortir nomPrénom, \" déjà présent dans le tableau.\"\nendif\n------\n\n---* Sorties\niPers = 0\ndo while (iPers < nbPers)\n   Sortir tabPers[iPers]\n   iPers++\nenddo\n------";
    input.focus();

    drawDiagram();
});

// --- Tools - buttons ---

var buttonInsertMain = document.getElementById("buttonInsert__Main");
var buttonInsertCondition = document.getElementById("buttonInsert__Condition");
var buttonInsertSwitch = document.getElementById("buttonInsert__Switch");
var buttonInsertLoop = document.getElementById("buttonInsert__Loop");
var buttonInsertParagraph = document.getElementById("buttonInsert__Paragraph");
var buttonInsertModule = document.getElementById("buttonInsert__Module");

var buttonReload = document.getElementById("buttonReload");
var buttonLiveReload = document.getElementById("buttonLiveReload");
var buttonExtendedFormatting = document.getElementById("buttonExtendedFormatting");
var buttonPrint = document.getElementById("buttonPrint");

buttonInsertMain.addEventListener("click", function(event) {
    event.preventDefault();

    insert(input, "---*\n\n------");
    drawDiagram();
});

buttonInsertCondition.addEventListener("click", function(event) {
    event.preventDefault();

    insert(input, "if ()\n\nelse\n\nendif");
    drawDiagram();
});

buttonInsertSwitch.addEventListener("click", function(event) {
    event.preventDefault();

    insert(input, "if ()\n\nelseif ()\n\nelseif ()\n\nelse\n\nendif");
    drawDiagram();
});

buttonInsertLoop.addEventListener("click", function(event) {
    event.preventDefault();

    insert(input, "do while ()\n\nenddo");
    drawDiagram();
});

buttonInsertModule.addEventListener("click", function(event) {
    event.preventDefault();

    insert(input, "module(MonModule;;)");
    drawDiagram();
});

buttonInsertParagraph.addEventListener("click", function(event) {
    event.preventDefault();

    insert(input, "paragraphe(MonParagraphe)");
    drawDiagram();
});

buttonReload.addEventListener("click", function(event) {
    event.preventDefault();

    drawDiagram();
});

buttonLiveReload.addEventListener("click", function(event) {
    event.preventDefault();
    
    this.classList.toggle("active");

    liveReload = !liveReload;
    drawDiagram();
});

buttonExtendedFormatting.addEventListener("click", function(event) {
    event.preventDefault();
    
    this.classList.toggle("active");

    useExtendedFormatting = !useExtendedFormatting;
    drawDiagram();
});

buttonPrint.addEventListener("click", function(event) {
    event.preventDefault();

    window.print();
});

// --- Functions ---

function setEditorSize() {
    var containerHeight = window.innerHeight - header.offsetHeight;
    var containerWidth = (window.innerWidth - sidebar.offsetWidth) / 2;

    sidebar.style.height = containerHeight + "px";
    editor.style.height = containerHeight + "px";
    preview.style.height = containerHeight + "px";

    editor.style.width = containerWidth + "px";
    preview.style.width = containerWidth + "px";

    var contentHeight = editor.offsetHeight - toolbar.offsetHeight;

    input.style.height = contentHeight + "px";
    input.style.minHeight = contentHeight + "px";
    input.style.maxHeight = contentHeight + "px";
    output.style.height = contentHeight + "px";
}

function drawDiagram() {
    output.innerHTML = parser.getFormattedDiagram(input.value, useExtendedFormatting);
}

function insert(input, string) {
    var position = input.selectionStart;
    var before = input.value.substring(0, position);
    var after = input.value.substring(position, input.value.length);

    input.value = before + string + after;
    input.selectionStart = position + string.length;
    input.selectionEnd = input.selectionStart;
    input.focus();
};