import { Core } from "@walletconnect/core";
import { WalletKit } from "@reown/walletkit";
import WalletConnect from "@walletconnect/client";
import QRCode from "qrcode";


document.addEventListener("DOMContentLoaded", async () => {
    // ==========================
    // WalletConnect Initialization
    // ==========================
    const core = new Core({
        projectId: "c9bd95d06db97382f3b5598a74800e3f", // Your WalletConnect Project ID
    });

    const metadata = {
        name: "SlothbarSite",
        description: "AppKit Example",
        url: "https://reown.com/appkit", // Match your actual domain
        icons: ["https://assets.reown.com/reown-profile-pic.png"],
    };

    const walletKit = await WalletKit.init({
        core, // Pass the shared 'core' instance
        metadata,
    });

    const connectWalletButton = document.getElementById("connect-wallet");
    const gameAccess = document.getElementById("game-access");

    async function connectWallet() {
        try {
            const accounts = await walletKit.connect();
            console.log("Connected accounts:", accounts);

            alert(`Wallet connected successfully: ${accounts[0]}`);
            enableGameAccess();
        } catch (error) {
            console.error("Error connecting wallet:", error);
            alert("Failed to connect wallet. Please try again.");
        }
    }

    connectWalletButton.addEventListener("click", connectWallet);

    function enableGameAccess() {
        gameAccess.style.display = "block";
        document.querySelector(".wallet-connection").style.display = "none";
    }

    // ==========================
    // Puzzle Game Logic
    // ==========================
    const puzzleSlots = document.querySelectorAll(".puzzle-slot");
    const puzzlePiecesContainer = document.getElementById("puzzle-pieces");
    const successMessage = document.getElementById("success-message");

    let draggedPiece = null;

    // Create Puzzle Pieces
    const totalPieces = 10;
    for (let i = 1; i <= totalPieces; i++) {
        const piece = document.createElement("div");
        piece.classList.add("puzzle-piece");
        piece.setAttribute("data-piece", i);
        piece.setAttribute("draggable", true);
        piece.style.background = `url('sloth-puzzle.jpg') no-repeat`;
        piece.style.backgroundSize = "300px 120px"; // Matches puzzle board dimensions
        piece.style.backgroundPosition = `${((i - 1) % 5) * -60}px ${Math.floor((i - 1) / 5) * -60}px`;
        puzzlePiecesContainer.appendChild(piece);
    }

    // Drag-and-Drop Support (Desktop)
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

    // Touch Support (Mobile)
    const puzzlePieces = document.querySelectorAll(".puzzle-piece");
    puzzlePieces.forEach((piece) => {
        piece.addEventListener("touchstart", (e) => {
            draggedPiece = e.target;
            draggedPiece.style.opacity = "0.6";
        });

        piece.addEventListener("touchmove", (e) => {
            const touch = e.touches[0];
            const offsetX = touch.clientX - puzzlePiecesContainer.getBoundingClientRect().left;
            const offsetY = touch.clientY - puzzlePiecesContainer.getBoundingClientRect().top;

            draggedPiece.style.position = "absolute";
            draggedPiece.style.left = `${offsetX - draggedPiece.offsetWidth / 2}px`;
            draggedPiece.style.top = `${offsetY - draggedPiece.offsetHeight / 2}px`;
        });

        piece.addEventListener("touchend", (e) => {
            if (!draggedPiece) return;

            // Check if dropped in a valid slot
            const rect = draggedPiece.getBoundingClientRect();
            let placedInSlot = false;

            puzzleSlots.forEach((slot) => {
                const slotRect = slot.getBoundingClientRect();

                if (
                    rect.x < slotRect.x + slotRect.width &&
                    rect.x + rect.width > slotRect.x &&
                    rect.y < slotRect.y + slotRect.height &&
                    rect.y + rect.height > slotRect.y
                ) {
                    const slotNumber = slot.getAttribute("data-slot");
                    const pieceNumber = draggedPiece.getAttribute("data-piece");

                    if (slotNumber === pieceNumber && slot.children.length === 0) {
                        slot.appendChild(draggedPiece);
                        draggedPiece.style.position = "relative";
                        draggedPiece.style.left = "0";
                        draggedPiece.style.top = "0";
                        draggedPiece.style.opacity = "1";
                        placedInSlot = true;
                        checkCompletion();
                    }
                }
            });

            if (!placedInSlot) {
                // Reset piece to original position if not placed in a valid slot
                draggedPiece.style.position = "relative";
                draggedPiece.style.left = "0";
                draggedPiece.style.top = "0";
                draggedPiece.style.opacity = "1";
            }

            draggedPiece = null;
        });
    });

    // Check Completion
    function checkCompletion() {
        const allSlotsFilled = [...puzzleSlots].every((slot) => slot.children.length > 0);
        if (allSlotsFilled) {
            successMessage.style.display = "block";
        }
    }
});
