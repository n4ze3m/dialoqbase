export default {
  async load() {
    const version = await fetch(
      "https://api.github.com/repos/n4ze3m/dialoqbase/releases/latest"
    )
      .then((res) => {
        if (res.ok) {
          const releaseData = res.json() as Promise<{ tag_name: string }>;

          return releaseData;
        }
        return null;
      })
      .then((res) => res?.tag_name || "v0.0.0");

    return {
      version,
    };
  },
};
