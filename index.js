const maxDistance = 50;

let bgColors = [
    ["#002791", "#001b60", "#2f5fdc"],
    ["#187100", "#155000", "#4dca23"],
    ["#910000", "#590000", "#d82a2a"],
    ["#cbda00", "#555c00", "#f3ff37"]
]

const disappearTo = ["L", "R", "U"];

const usualBoxShadow = "0 0 0 3px"
const strikeBoxShadow = "0 0 10px 2px"

let matrix = [0,0,0,0,0,0,0,0,0]

let score = 0;
let scoreDiv = $("#score")

let cells = $("#field > div");
let elements = $(".element");

const blockCount = 3;
let leftBlocks;

$(function () {
    updateBlocks();
});

function updateBlocks() {
    leftBlocks = blockCount;
    for (let i = 0; i < 3; i++) {
        $("body").append("<div class=\"element square\"><div></div></div>")
    }
    elements = $(".element");
    let container =  $("#block-container")
    for (let i = 0; i < elements.length; i++) {
        let left = (container.offset().left + container.outerWidth() / 3 * i) + container.outerWidth() / 6 / 2 + "px";
        let top = container.offset().top + container.outerWidth() / 6 / 2 + "px";
        elements.addClass("on-place");
        elements.eq(i).css("top", top);
        elements.eq(i).css("left", left);
        elements.eq(i).attr("place-left", left);
        elements.eq(i).attr("place-top", top);
        let colorIndex = Math.floor(Math.random() * bgColors.length);
        elements.eq(i).attr("color-index", colorIndex);
        elements.eq(i).children().css("background-color", bgColors[colorIndex][0]);
        elements.eq(i).children().css("box-shadow", `${bgColors[colorIndex][1]} ${usualBoxShadow}`);
    }
    for (let i = 0; i < elements.length; i++) {
        dragElement(elements.eq(i));
    }
}

function dragElement(draggableElem) {
    draggableElem.on("mousedown", function(e) {dragMouseDown(e)});

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
        if (nearest[0] !== null && matrix[nearest[1]] === 0) {
            nearest[0].css("background-color", bgColors[draggableElem.attr("color-index")][0]);
        }
        draggableElem.removeClass("on-place")
        draggableElem.css("top", e.clientY - draggableElem.outerHeight() / 2);
        draggableElem.css("left", e.clientX - draggableElem.outerWidth() / 2);
    }

    function dragOff() {
        draggableElem.off("mousemove")
        let [cell, mIndex] = getNearest(draggableElem);
        if (cell !== null && matrix[mIndex] === 0) {
            cell = $(cell);
            const colorIndex = draggableElem.attr("color-index");
            cell.children().attr("color-index", colorIndex);
            cell.children().css("background-color", bgColors[colorIndex][0]);
            cell.children().css("box-shadow", `${bgColors[colorIndex][1]} ${usualBoxShadow}`);
            cell.css("opacity", '1');
            cell.css("background-color", 'transparent');
            draggableElem.remove()
            matrix[mIndex] = 1;
            leftBlocks--;
            if (leftBlocks === 0) updateBlocks();
            strike();
        }
        else {
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
        if (Math.abs(cell.offset().left - elem.offset().left) <= maxDistance && Math.abs(cell.offset().top - elem.offset().top) <= maxDistance) {
            return [cell, i];
        }
    }
    return [null, null];
}


function getAllStrikes() {
    const strikes = [];
    const horizontalLines = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
    horizontalLines.forEach(line => {
        if (line.every(idx => matrix[idx] === 1)) {
            strikes.push(line);
        }
    });
    const verticalLines = [[0, 3, 6], [1, 4, 7], [2, 5, 8]];
    verticalLines.forEach(line => {
        if (line.every(idx => matrix[idx] === 1)) {
            strikes.push(line);
        }
    });
    return strikes;
}

function strike() {
    let strikes = getAllStrikes();
    while (strikes.length !== 0){
        strikes = getAllStrikes();
        strikes.forEach(strike => {
            strike.forEach(idx => {
                if (matrix[idx] === 1) {
                    cells.eq(idx).children().css("animation", `${disappearTo[Math.floor(Math.random() * disappearTo.length)]} 0.4s linear 1`);
                    cells.eq(idx).children().on("animationend", function () {
                        cells.eq(idx).children().css("background-color", "transparent");
                        cells.eq(idx).children().css("box-shadow", "");
                    })
                    matrix[idx] = 0;
                }
            });
        });
    }
}


function showStrikes(nearest, draggableElem) {
    draggableElem.children().css("box-shadow", `${bgColors[parseInt(draggableElem.attr("color-index"))][1]} ${usualBoxShadow}`);
    draggableElem.children().css("background-color", bgColors[parseInt(draggableElem.attr("color-index"))][0]);
    for (let i = 0; i < matrix.length; i++) {
        if (matrix[i] === 1) {
            cells.eq(i).children().css("background-color", bgColors[cells.eq(i).children().attr("color-index")][0]);
            cells.eq(i).children().css("box-shadow", `${bgColors[parseInt(cells.eq(i).children().attr("color-index"))][1]} ${usualBoxShadow}`);
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
            if (line.includes(cellId) && line.filter(idx => matrix[idx] === 1).length >= 2) {
                console.log()
                draggableElem.children().css("box-shadow", `${bgColors[parseInt(draggableElem.attr("color-index"))][2]} ${strikeBoxShadow}`);
                draggableElem.children().css("background-color", bgColors[parseInt(draggableElem.attr("color-index"))][2]);
                line.forEach(i => {
                    if (matrix[i]) {
                        cells.eq(i).children().css("background-color", bgColors[parseInt(draggableElem.attr("color-index"))][2]);
                        cells.eq(i).children().css("box-shadow", `${bgColors[parseInt(draggableElem.attr("color-index"))][2]} ${strikeBoxShadow}`);
                    }
                });
            }
        });
    }
}






