import React from "react";
import { EmbedBoardCard } from "./EmbedBoardCard";
import { EmbedBoardScript } from "./EmbedBoardScript";

type Props = {
  public_id: string;
};

export const EmbedBoard = ({ public_id }: Props) => {
  const [hostUrl] = React.useState<string>(
    () =>
      import.meta.env.VITE_HOST_URL ||
      window.location.protocol + "//" + window.location.host
  );

  return (
    <div className="lg:col-span-9">
      {/* <EmbedBoardTitle
              title="Script"
              description="You can use this script to embed your bot to your website or web app"
            /> */}

      <EmbedBoardScript
      hostUrl={hostUrl}
      public_id={public_id}
      />
      <EmbedBoardCard
        title="Public URL"
        description="This is the public URL of your bot. You can use this URL to embed"
        content={`${hostUrl}/bot/${public_id}`}
      />

      <EmbedBoardCard
        title="Iframe"
        description="You can use this iframe to embed your bot"
        content={`<iframe src="${hostUrl}/bot/${public_id}?mode=iframe" width="400" height="500" />`}
      />
    </div>
  );
};
