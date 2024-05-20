document.addEventListener("DOMContentLoaded", () => {
  const postHandler = async (event) => {
    event.preventDefault();
    const title = document.querySelector("#post-title").value.trim();
    const content = document.querySelector("#post-content").value.trim();
    const url = document.querySelector("#post-url").value.trim();
    const board_id = window.location.toString().split("/")[
      window.location.toString().split("/").length - 2
    ];
    const file = document.querySelector("#post-source").files[0];

    // Debugging statements to check if elements are found
    const formData = new FormData();
    formData.append("image", file);

    const fileResponse = await fetch("/api/file/upload", {
      method: "POST",
      body: formData,
    }).then((response) => response.json());
    
    const response = await fetch("/api/post/", {
      method: "POST",
      body: JSON.stringify({ title, content, board_id, url, source: fileResponse.url }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      document.location.replace("/board/" + board_id);
    } else {
      alert("Failed to post.");
    }
  };

  document
    .querySelector("#create-post-form")
    .addEventListener("submit", postHandler);
});
