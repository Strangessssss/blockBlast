
let bgColors = ["#002791", "#187100", "#910000", "#cbda00"]

let matrix = [0,0,0,0,0,0,0,0,0]

let cells = $("#field");
let blocks = $(".block");

const blockCount = 3;
let leftBlocks;


$(function () {
    updateBlocks();
});

function updateBlocks() {
    leftBlocks = blockCount;
    for (let i = 0; i < 3; i++) {
        $("body").append("<div class=\"block\"></div>")
    }
    blocks = $(".block").not(".busy");
    let container =  $("#block-container")
    for (let i = 0; i < blocks.length; i++) {
        let left = (container.offset().left + container.outerWidth() / 3 * i) + container.outerWidth() / 6 / 2 + "px";
        let top = container.offset().top + container.outerWidth() / 6 / 2 + "px";
        blocks.addClass("on-place");
        blocks.eq(i).css("top", top);
        blocks.eq(i).css("left", left);
        blocks.eq(i).attr("place-left", left);
        blocks.eq(i).attr("place-top", top);
        let colorIndex = Math.floor(Math.random() * bgColors.length + 1);
        blocks.eq(i).attr("color-index", colorIndex);
        blocks.eq(i).css("background-color", bgColors[colorIndex]);
    }
    for (let i = 0; i < blocks.length; i++) {
        dragElement(blocks.eq(i));
    }
}

function dragElement(draggableElem) {
    draggableElem.on("mousedown", function(e) {dragMouseDown(e)});

    function dragMouseDown() {
        draggableElem.on("mousemove", function(e) {replaceElem(e)});
        draggableElem.on("mouseup", function() {dragOff()});
    }

    function replaceElem(e) {
        draggableElem.removeClass("on-place")
        draggableElem.css("top", e.clientY - draggableElem.outerHeight() / 2);
        draggableElem.css("left", e.clientX - draggableElem.outerWidth() / 2);
    }

    function dragOff() {
        draggableElem.off("mousemove")
        let maxDistance = 50;
        let elems = cells.children();
        for (let i = 0; i < elems.length; i++) {
            const cell = $(elems[i]);
            if (Math.abs(cell.offset().left - draggableElem.offset().left) <= maxDistance && Math.abs(cell.offset().top - draggableElem.offset().top) <= maxDistance && matrix[i] !== 1) {
                draggableElem.css("left", cell.offset().left + "px");
                draggableElem.css("top", cell.offset().top + "px");
                draggableElem.addClass("busy")
                matrix[i] = 1;
                draggableElem.off("mousedown");
                leftBlocks--;
                if (leftBlocks === 0) {
                    updateBlocks();
                }
                break;
            }
        }
        if (!draggableElem.hasClass("busy")) {
            draggableElem.css("left", draggableElem.attr("place-left"));
            draggableElem.css("top", draggableElem.attr("place-top"));
            draggableElem.addClass("on-place");

        }
    }
}





