const boardHandler = async (event) => {
    event.preventDefault();
    const title = document.querySelector("#board-title").value.trim();
    const tags = document.querySelector("#board-tags").value.trim().split(",");
    const response = await fetch("/api/boards/", {
        method: "POST",
        body: JSON.stringify({ title, tags }),
        headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
        const board = await response.json();
        document.location.replace("/board/" + board.id);
    } else {
        alert("Failed to create board.");
    }
};

document.querySelector(".board-form").addEventListener("submit", boardHandler);