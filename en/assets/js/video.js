document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("newsletterVideoContainer");

  if (!container) return;

  try {
    const response = await fetch(
      "https://avanti-backend-67wk.onrender.com/api/homepage/video"
    );

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error("Aucune vidéo disponible");
    }

    const { video_url, embed_code, poster_url } = result.data;

    // On vide le container actuel (placeholder)
    container.innerHTML = "";

    // CAS 1 : L’API renvoie directement un embed HTML
    if (embed_code) {
      container.innerHTML = embed_code;
      return;
    }

    // CAS 2 : URL YouTube
    if (video_url.includes("youtube.com") || video_url.includes("youtu.be")) {
      const iframe = document.createElement("iframe");

      let embedUrl = video_url;

      if (video_url.includes("watch?v=")) {
        embedUrl = video_url.replace("watch?v=", "embed/");
      } else if (video_url.includes("youtu.be")) {
        const id = video_url.split("youtu.be/")[1];
        embedUrl = `https://www.youtube.com/embed/${id}`;
      }

      iframe.src = embedUrl;
      iframe.width = "100%";
      iframe.height = "315";
      iframe.frameBorder = "0";
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;

      container.appendChild(iframe);
      return;
    }

    // CAS 3 : Fichier vidéo normal (mp4 depuis Cloudinary par ex)
    const video = document.createElement("video");
    video.controls = true;
    video.style.width = "100%";

    if (poster_url) {
      video.poster = poster_url;
    }

    const source = document.createElement("source");
    source.src = video_url;
    source.type = "video/mp4";

    video.appendChild(source);
    container.appendChild(video);
  } catch (error) {
    console.error("Erreur chargement vidéo:", error);

    container.innerHTML = `
      <div class="newsletter__video-error">
       Failed to load video
      </div>
    `;
  }
});
