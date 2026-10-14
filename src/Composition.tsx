import React from "react";
import { Composition } from "remotion";

import { SystemDesignScene } from "./scenes/SystemDesignScene";
import { SystemDesignCoreConceptsScene } from "./scenes/SystemDesignCoreConceptsScene";
import { WhySystemDesignMattersScene } from "./scenes/WhySystemDesignMattersScene";
import { URLRequestScene } from "./scenes/URLRequestScene";
import { LoadBalancerScene } from "./scenes/LoadBalancerScene";
import { LoadBalancingAlgorithmsScene } from "./scenes/LoadBalancingAlgorithmsScene";
import { DatabaseIndexingScene } from "./scenes/DatabaseIndexingScene";
import { DatabaseScalingScene } from "./scenes/DatabaseScalingScene";
import { MicroservicesCommunicationScene } from "./scenes/MicroservicesCommunicationScene";
import { ApiRateLimitingScene } from "./scenes/ApiRateLimitingScene";
import { DatabaseDeadlocksScene } from "./scenes/DatabaseDeadlocksScene";
import { CircuitBreakerScene } from "./scenes/CircuitBreakerScene";
import { MicroservicePatternsScene } from "./scenes/MicroservicePatternsScene";
import { SagaVs2PCScene } from "./scenes/SagaVs2PCScene";
import { ApiSecurityPatternsScene } from "./scenes/ApiSecurityPatternsScene";
import { ObservabilityPillarsScene } from "./scenes/ObservabilityPillarsScene";

import { systemDesign } from "../content/system-design";
import { urlRequest } from "../content/url-request";
import { loadBalancer } from "../content/load-balancer";
import { loadBalancing } from "../content/load-balancing_algorithms";
import { databaseIndexing } from "../content/database-indexing";
import databaseScaling from "../content/database-scaling";
import microservicesCommunication from "../content/microservices-communication";
import { apiRateLimiting } from "../content/api-rate-limiting";
import { databaseDeadlocks } from "../content/database-deadlocks";
import { microservicePatterns } from "../content/microservice-patterns";
import { sagaVs2pc } from "../content/saga-vs-2pc";
import {
  CachingStrategiesScene,
  CACHING_STRATEGIES_DURATION,
} from "./scenes/CachingStrategiesScene";
import { circuitBreaker } from "../content/circuit-breaker";
import { apiSecurityPatterns } from "../content/api-security-patterns";
import { observabilityPillars } from "../content/observability-pillars";

import { FPS, createTimeline } from "./timeline";



const timeline = createTimeline(systemDesign);
const urlTimeline = createTimeline(urlRequest);
const loadBalancerTimeline = createTimeline(loadBalancer);
const loadBalancingTimeline = createTimeline(loadBalancing);
const databaseIndexingTimeline = createTimeline(databaseIndexing);
const databaseScalingTimeline = createTimeline(databaseScaling);

const microservicesCommunicationTimeline = createTimeline(
  microservicesCommunication
);

const apiRateLimitingTimeline = createTimeline(
  apiRateLimiting
);

const databaseDeadlocksTimeline = createTimeline(
  databaseDeadlocks
);

const circuitBreakerTimeline = createTimeline(circuitBreaker);
const microservicePatternsTimeline = createTimeline(microservicePatterns);

const sagaVs2pcTimeline = createTimeline(sagaVs2pc);
const apiSecurityPatternsTimeline = createTimeline(apiSecurityPatterns);
const observabilityPillarsTimeline = createTimeline(observabilityPillars);

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
        fps={FPS}
        width={1080}
        height={1920}
      />

      <Composition
        id="SystemDesign"
        component={SystemDesignScene}
        durationInFrames={timeline.totalFrames}
        fps={FPS}
        width={1080}
        height={1920}
      />

      <Composition
        id="SystemDesignCoreConcepts"
        component={SystemDesignCoreConceptsScene}
        durationInFrames={timeline.totalFrames}
        fps={FPS}
        width={1080}
        height={1920}
      />

      <Composition
        id="WhySystemDesignMatters"
        component={WhySystemDesignMattersScene}
        durationInFrames={timeline.totalFrames}
        fps={FPS}
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

      <Composition
        id="LoadBalancer"
        component={LoadBalancerScene}
        durationInFrames={loadBalancerTimeline.totalFrames}
        fps={FPS}
        width={1080}
        height={1920}
      />

      <Composition
        id="LoadBalancingAlgorithms"
        component={LoadBalancingAlgorithmsScene}
        durationInFrames={loadBalancingTimeline.totalFrames}
        fps={FPS}
        width={1080}
        height={1920}
      />

      <Composition
        id="CachingStrategies"
        component={CachingStrategiesScene}
        durationInFrames={CACHING_STRATEGIES_DURATION}
        fps={FPS}
        width={1080}
        height={1920}
      />

      <Composition
        id="DatabaseIndexing"
        component={DatabaseIndexingScene}
        durationInFrames={databaseIndexingTimeline.totalFrames}
        fps={FPS}
        width={1080}
        height={1920}
      />

      <Composition
        id="DatabaseScaling"
        component={DatabaseScalingScene}
        durationInFrames={databaseScalingTimeline.totalFrames}
        fps={FPS}
        width={1080}
        height={1920}
      />

      <Composition
        id="MicroservicesCommunication"
        component={MicroservicesCommunicationScene}
        durationInFrames={microservicesCommunicationTimeline.totalFrames}
        fps={FPS}
        width={1080}
        height={1920}
      />

      <Composition
        id="ApiRateLimiting"
        component={ApiRateLimitingScene}
        durationInFrames={apiRateLimitingTimeline.totalFrames}
        fps={FPS}
        width={1080}
        height={1920}
      />

      <Composition
        id="DatabaseDeadlocks"
        component={DatabaseDeadlocksScene}
        durationInFrames={databaseDeadlocksTimeline.totalFrames}
        fps={FPS}
        width={1080}
        height={1920}
      />


      <Composition
        id="CircuitBreaker"
        component={CircuitBreakerScene}
        durationInFrames={circuitBreakerTimeline.totalFrames}
        fps={FPS}
        width={1080}
        height={1920}
      />

      <Composition
        id="MicroservicePatterns"
        component={MicroservicePatternsScene}
        durationInFrames={microservicePatternsTimeline.totalFrames}
        fps={FPS}
        width={1080}
        height={1920}
      />

      <Composition
        id="SagaVs2PC"
        component={SagaVs2PCScene}
        durationInFrames={sagaVs2pcTimeline.totalFrames}
        fps={FPS}
        width={1080}
        height={1920}
      />

      <Composition
        id="ApiSecurityPatterns"
        component={ApiSecurityPatternsScene}
        durationInFrames={apiSecurityPatternsTimeline.totalFrames}
        fps={FPS}
        width={1080}
        height={1920}
      />

      <Composition
        id="ObservabilityPillars"
        component={ObservabilityPillarsScene}
        durationInFrames={observabilityPillarsTimeline.totalFrames}
        fps={FPS}
        width={1080}
        height={1920}
      />
    </>
  );
};