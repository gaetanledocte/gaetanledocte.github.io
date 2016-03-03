var buttonOpen = document.getElementById("buttonOpen");
var buttonOpenWithExample = document.getElementById("buttonOpenWithExample");
var buttonSave = document.getElementById("buttonSave");
var buttonSaveClose = document.getElementById("buttonSaveClose");
var buttonPrint = document.getElementById("buttonPrint");

var buttonInsertMain = document.getElementById("buttonInsert__Main");
var buttonInsertIfElse = document.getElementById("buttonInsert__IfElse");
var buttonInsertSwitch = document.getElementById("buttonInsert__Switch");
var buttonInsertDoWhile = document.getElementById("buttonInsert__DoWhile");
var buttonInsertParagraph = document.getElementById("buttonInsert__Paragraph");
var buttonInsertModule = document.getElementById("buttonInsert__Module");
var buttonExtendedFormatting = document.getElementById("buttonExtendedFormatting");

var input = document.getElementById("input");
var output = document.getElementById("output");
var inputValue = input.value;

var parser = new PseudoCodeParser();
var extendedFormatting = true;

//------------------------------------------------------------------------------

var drawDiagram = function () {
    output.innerHTML = parser.drawDiagram(input.value, extendedFormatting);
};

var insert = function (input, text) {
    var position = input.selectionStart;
    var before = input.value.substring(0, position);
    var after = input.value.substring(position, input.value.length);

    input.value = before + text + after;
};

var save = function () {
    document.getElementById("informationBox__Save").style.display = "block";
};

//------------------------------------------------------------------------------

drawDiagram();

document.addEventListener("keypress", function (event) {
    // Crtl + s
    if (event.ctrlKey && event.charCode === 115) {
        event.preventDefault();
        save();
    }
});
input.addEventListener("keypress", function (event) {
    // Tab
    if (event.keyCode === 9) {
        event.preventDefault();
        insert(input, "   ");
    }
});
input.addEventListener("keyup", function () {
    if (inputValue !== this.value) {
        inputValue = this.value;
        drawDiagram();
    }
});

//------------------------------------------------------------------------------

buttonOpen.addEventListener("click", function (event) {
    var panel = document.getElementById("welcomePanel");

    event.preventDefault();
    panel.style.display = "none";
    input.focus();
});
buttonOpenWithExample.addEventListener("click", function (event) {
    var panel = document.getElementById("welcomePanel");

    event.preventDefault();
    panel.style.display = "none";
    input.value = "// Exemple\n\n// On souhaite ajouter, dans un tableau, des personnes identifiées par leurs noms\n// et prénoms. Ensuite, on souhaite afficher à l'écran le contenu du tableau.\n\n---* Exemple de diagramme\nnbPers = 0\nObtenir nomPrénom\n\ndo while (nomPrénom != \"ZZZ\")\n   module(AjoutPersonne;tabPersonnes, nbPersonnes, nomPrénom;tabPersonnes, nbPersonnes)\n   Obtenir nomPrénom\nenddo\nparagraphe(Sorties)\n------\n\n---* AjoutPersonne\niPers = 0\ndo while (iPers < nbPers AND tabPers[iPers] != nomPrénom)\n   iPers++\nenddo\nif (iPers = nbPers)\n   tabPers[iPers] = nomPrénom\nelse\n   Sortir nomPrénom, \"est déjà présent dans le tableau.\"\nendif\n------\n\n---* Sorties\niPers = 0\ndo while (iPers < nbPers)\n   Sortir tabPers[iPers]\n   iPers++\nenddo\n------";
    input.focus();

    drawDiagram();
});
buttonSave.addEventListener("click", function (event) {
    event.preventDefault();
    save();
});
buttonSaveClose.addEventListener("click", function (event) {
    event.preventDefault();

    document.getElementById("informationBox__Save").style.display = "none";
});
buttonPrint.addEventListener("click", function (event) {
    event.preventDefault();

    window.print();
});

//------------------------------------------------------------------------------

buttonInsertMain.addEventListener("click", function (event) {
    event.preventDefault();
    insert(input, "---*\n\n------");
    drawDiagram();
});
buttonInsertIfElse.addEventListener("click", function (event) {
    event.preventDefault();
    insert(input, "if ()\n\nelse\n\nendif");
    drawDiagram();
});
buttonInsertSwitch.addEventListener("click", function (event) {
    event.preventDefault();
    insert(input, "if ()\n\nelseif ()\n\nelseif ()\n\nelse\n\nendif");
    drawDiagram();
});
buttonInsertDoWhile.addEventListener("click", function (event) {
    event.preventDefault();
    insert(input, "do while ()\n\nenddo");
    drawDiagram();
});
buttonInsertParagraph.addEventListener("click", function (event) {
    event.preventDefault();
    insert(input, "paragraphe(MonParagraphe)");
    drawDiagram();
});
buttonInsertModule.addEventListener("click", function (event) {
    event.preventDefault();
    insert(input, "module(MonModule;;)");
    drawDiagram();
});
buttonExtendedFormatting.addEventListener("click", function (event) {
    event.preventDefault();

    if (this.classList.contains("active")) {
        this.classList.remove("active");
        extendedFormatting = false;
    } else {
        this.classList.add("active");
        extendedFormatting = true;
    }

    drawDiagram();
});
