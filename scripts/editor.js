var button = document.getElementById("openEditor");
var inputAera = document.getElementById("input");
var outputAera = document.getElementById("output");

button.addEventListener("click", function (event) {
    event.preventDefault();

    var overlay = document.getElementById("overlay");

    if (overlay.classList) {
        overlay.classList.add("fadeOut");
    } else {
        overlay.className += ' ' + "fadeOut";
    }
});

// -----------------------------------------------------------------------------

var parser = new PseudoCodeParser({
    extendedFormatting: true
});

outputAera.innerHTML = parser.drawDiagram(inputAera.value);

inputAera.addEventListener("keyup", function () {
    outputAera.innerHTML = parser.drawDiagram(inputAera.value);
});
