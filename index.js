const maxDistance = 50;

let bgColors = ["#002791", "#187100", "#910000", "#cbda00"]

let matrix = [null,null,null,null,null,null,null,null,null]

let score = 0;
let scoreDiv = $("#score")

let cells = $("#field > div");
let blocks = $(".block");

const blockCount = 3;
let leftBlocks;

dragElement($(".trio"))

$(function () {
    updateBlocks();
    createTetrimino("I")
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
        let colorIndex = Math.floor(Math.random() * bgColors.length);
        blocks.eq(i).attr("color-index", colorIndex);
        blocks.eq(i).css("background-color", bgColors[colorIndex]);
    }
    for (let i = 0; i < blocks.length; i++) {
        dragElement(blocks.eq(i));
    }
}

function dragElement(draggableElem) {
    draggableElem.on("mousedown", function(e) {dragMouseDown(e)});
    console.log($(draggableElem));


    function dragMouseDown() {
        draggableElem.on("mousemove", function(e) {replaceElem(e)});
        draggableElem.on("mouseup", function() {dragOff()});
    }

    function replaceElem(e) {
        let elems = cells;
        for (let i = 0; i < elems.length; i++) {
            let cell = $(elems[i]);
            cell.css("background-color", "transparent");
        }

        let nearest = getNearest(draggableElem)
        showStrikes(nearest, draggableElem);
        if (nearest[0] !== null) {
            nearest[0].css("background-color", draggableElem.css("background-color"));
        }
        draggableElem.removeClass("on-place")
        draggableElem.css("top", e.clientY - draggableElem.outerHeight() / 2);
        draggableElem.css("left", e.clientX - draggableElem.outerWidth() / 2);
    }

    function dragOff() {
        draggableElem.off("mousemove")
        let [cell, mIndex] = getNearest(draggableElem);
        if (cell !== null) {
            draggableElem.css("left", cell.offset().left + "px");
            draggableElem.css("top", cell.offset().top + "px");
            draggableElem.addClass("busy")
            draggableElem.removeClass("on-place")
            $(cell).css("background-color", "transparent");
            matrix[mIndex] = draggableElem;
            draggableElem.off("mouseup");
            draggableElem.off("mousedown");
            leftBlocks--;
            if (leftBlocks === 0) updateBlocks();
            checkIfStrike();
        }
        if (cell === null && !$(draggableElem).hasClass("busy")) {
            draggableElem.css("left", draggableElem.attr("place-left"));
            draggableElem.css("top", draggableElem.attr("place-top"));
            draggableElem.addClass("on-place");
        }
    }
}

function getNearest(elem){
    let elems = cells;
    for (let i = 0; i < elems.length; i++) {
        const cell = $(elems[i]);
        if (Math.abs(cell.offset().left - elem.offset().left) <= maxDistance && Math.abs(cell.offset().top - elem.offset().top) <= maxDistance && matrix[i] === null) {
            return [cell, i];
        }
    }
    console.log(1234);
    return [null, null];
}


function getAllStrikes() {
    const strikes = [];
    const horizontalLines = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
    horizontalLines.forEach(line => {
        if (line.every(idx => matrix[idx] !== null)) {
            strikes.push(line);
        }
    });
    const verticalLines = [[0, 3, 6], [1, 4, 7], [2, 5, 8]];
    verticalLines.forEach(line => {
        if (line.every(idx => matrix[idx] !== null)) {
            strikes.push(line);
        }
    });
    return strikes;
}

function checkIfStrike() {
    let strikes;

    do {
        // Detect all strikes
        strikes = getAllStrikes();

        // Clear all detected strikes
        strikes.forEach(strike => {
            strike.forEach(idx => {
                if (matrix[idx] !== null) {
                    matrix[idx].remove();
                    matrix[idx] = null;
                }
            });
            score += 10; // Increment score for each strike
        });

    } while (strikes.length > 0);

    scoreDiv.text(score.toString());
}


function showStrikes(nearest, draggableElem) {
    for (let i = 0; i < matrix.length; i++) {
        if (matrix[i] !== null) {
            matrix[i].css("background-color", bgColors[matrix[i].attr("color-index")] );
        }
    }

    if (nearest[1] === null) return;

    let cellId = nearest[1];

    if (cellId !== null) {
        const potentialLines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8]
        ];

        potentialLines.forEach(line => {
            if (line.includes(cellId) && line.filter(idx => matrix[idx] !== null).length >= 2) {
                line.forEach(idx => {
                    if (matrix[idx]) {
                        matrix[idx].css("background-color", draggableElem.css("background-color"));
                    }
                });
            }
        });
    }
}






