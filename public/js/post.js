const postHandler = async (event) => {
  event.preventDefault();
  const title = document.querySelector("#post-title").value.trim();
  const content = document.querySelector("#post-content").value.trim();
  const board_id = window.location.toString().split("/")[
    window.location.toString().split("/").length - 2
  ];
  // upload file to api/file
  const fileResponse = await fetch("/api/file/", {
    method: "POST",
    body: new FormData(document.querySelector("#post-source")),
  });
  const response = await fetch("/api/posts/", {
    method: "POST",
    body: JSON.stringify({ title, content, board_id, url: fileResponse.url}),
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    document.location.replace("/board/" + board_id);
  } else {
    alert("Failed to post.");
  }
};

document.querySelector("#create-post-form").addEventListener("submit", postHandler);