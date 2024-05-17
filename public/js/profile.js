const deleteHandler = async (event) => {
    event.preventDefault();
    const post_id = event.target.getAttribute("data-id");
    
    const response = await fetch(`/api/post/${post_id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });
    
    if (response.ok) {
        document.location.replace("/profile");
    } else {
        alert("Failed to delete post.");
    }
    };

document.querySelectorAll(".delete-post").forEach((button) => {
    button.addEventListener("click", deleteHandler);
});