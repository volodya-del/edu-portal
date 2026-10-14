function toEmbedUrl(uri: string): string | null {
  try {
    const url = new URL(uri);
    let id: string | null = null;

    if (url.hostname === "youtu.be") {
      id = url.pathname.slice(1);
    } else if (url.hostname.endsWith("youtube.com")) {
      if (url.pathname === "/watch") id = url.searchParams.get("v");
      else if (url.pathname.startsWith("/embed/")) id = url.pathname.split("/")[2];
    }
    if (!id) return null;

    const list = url.searchParams.get("list");
    return `https://www.youtube.com/embed/${id}${list ? `?list=${list}` : ""}`;
  } catch {
    return null;
  }
}

export default function VideoEmbed({ uri, title }: { uri: string; title: string }) {
  const src = toEmbedUrl(uri);

  if (!src) {
    return (
      <a href={uri} target="_blank" rel="noopener noreferrer" className="text-accent underline">
        {uri}
      </a>
    );
  }

  return (
    <div className="aspect-video overflow-hidden rounded-xl bg-black">
      <iframe
        src={src}
        title={title}
        className="h-full w-full"
        allow="accelerometer; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}