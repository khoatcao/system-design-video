import React from "react";
import { Composition } from "remotion";
import { SystemDesignScene } from "./scenes/SystemDesignScene";
import { SystemDesignCoreConceptsScene } from "./scenes/SystemDesignCoreConceptsScene";
import { WhySystemDesignMattersScene } from "./scenes/WhySystemDesignMattersScene";
import { URLRequestScene } from "./scenes/URLRequestScene";
import { urlRequest } from "../content/url-request";
import { FPS, createTimeline } from "./timeline";
import { systemDesign } from "../content/system-design";
const timeline = createTimeline(systemDesign);
const urlTimeline = createTimeline(urlRequest);
type Props = {};

export const MyComponent: React.FC<Props> = () => {
  return null;
};

export const MyComposition = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComponent}
        durationInFrames={timeline.totalFrames}
        fps={30}
        width={1080}
        height={1920}
      />

      <Composition
        id="SystemDesign"
        component={SystemDesignScene}
        durationInFrames={timeline.totalFrames}
        fps={30}
        width={1080}
        height={1920}
      />

      <Composition
        id="SystemDesignCoreConcepts"
        component={SystemDesignCoreConceptsScene}
        durationInFrames={timeline.totalFrames}
        fps={30}
        width={1080}
        height={1920}
      />

      <Composition
        id="WhySystemDesignMatters"
        component={WhySystemDesignMattersScene}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="URLRequest"
        component={URLRequestScene}
        durationInFrames={urlTimeline.totalFrames}
        fps={FPS}
        width={1080}
        height={1920}
      />
    </>
  );
};