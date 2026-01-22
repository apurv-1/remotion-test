import { Composition } from "remotion";
import { HybtraIntro } from "./HybtraIntro";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HybtraIntro"
        component={HybtraIntro}
        durationInFrames={900} // 15 seconds at 60fps - buttery smooth!
        fps={60}
        width={1920}
        height={1080}
      />
    </>
  );
};
