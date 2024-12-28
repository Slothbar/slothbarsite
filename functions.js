document.addEventListener("DOMContentLoaded", () => {
    const puzzleSlots = document.querySelectorAll(".puzzle-slot");
    const puzzlePiecesContainer = document.getElementById("puzzle-pieces");
    const gameBox = document.querySelector(".game-box");
    let draggedPiece = null;

    // Create Puzzle Pieces
    const totalPieces = 10;
    for (let i = 1; i <= totalPieces; i++) {
        const piece = document.createElement("div");
        piece.classList.add("puzzle-piece");
        piece.setAttribute("data-piece", i);
        piece.setAttribute("draggable", true);
        piece.style.background = `url('sloth-puzzle.jpg') no-repeat`;
        piece.style.backgroundSize = "300px 120px";
        piece.style.backgroundPosition = `${((i - 1) % 5) * -60}px ${Math.floor((i - 1) / 5) * -60}px`;
        puzzlePiecesContainer.appendChild(piece);
    }

    // Drag-and-Drop Logic
    document.addEventListener("dragstart", (e) => {
        if (e.target.classList.contains("puzzle-piece")) {
            draggedPiece = e.target;
            draggedPiece.style.opacity = "0.6";
        }
    });

    document.addEventListener("dragend", (e) => {
        if (e.target.classList.contains("puzzle-piece")) {
            e.target.style.opacity = "1";
            draggedPiece = null;
        }
    });

    document.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    document.addEventListener("drop", (e) => {
        if (e.target.classList.contains("puzzle-slot") && draggedPiece) {
            const slotNumber = e.target.getAttribute("data-slot");
            const pieceNumber = draggedPiece.getAttribute("data-piece");

            if (slotNumber === pieceNumber) {
                e.target.appendChild(draggedPiece);
                draggedPiece.style.position = "relative";
                draggedPiece.style.left = "0";
                draggedPiece.style.top = "0";
                draggedPiece.style.opacity = "1";
                draggedPiece = null;
                checkCompletion();
            }
        }
    });

    // Check Completion
    function checkCompletion() {
        const allSlotsFilled = [...puzzleSlots].every((slot) => slot.children.length > 0);
        if (allSlotsFilled) {
            alert("Puzzle Complete! Thank you for playing.");
        }
    }
});
