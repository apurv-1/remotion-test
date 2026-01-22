import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
  Audio,
  staticFile,
  Easing,
} from "remotion";
import React from "react";

// ============================================
// HYBTRA BRAND COLORS
// ============================================
const brand = {
  // Core brand color from Hybtra
  cyan: "#22d3ee",
  cyanLight: "#67e8f9",
  cyanDark: "#06b6d4",

  // Supporting palette
  indigo: "#6366f1",
  violet: "#8b5cf6",

  // Neutrals
  black: "#000000",
  dark: "#0a0a0a",
  darkGray: "#111111",
  gray: "#1a1a1a",
  grayMid: "#333333",
  grayLight: "#666666",
  white: "#ffffff",
  offWhite: "#f0f0f0",
};

// ============================================
// CINEMATIC BACKGROUND
// ============================================
const CinematicBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  // Animated gradient positions
  const pos1 = 30 + Math.sin(time * 0.5) * 20;
  const pos2 = 70 + Math.cos(time * 0.3) * 15;

  return (
    <AbsoluteFill>
      {/* Base gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 80% 50% at ${pos1}% 20%, ${brand.cyan}12 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at ${pos2}% 80%, ${brand.indigo}08 0%, transparent 50%),
            linear-gradient(180deg, ${brand.dark} 0%, ${brand.black} 100%)
          `,
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================
// ANIMATED GRID
// ============================================
const AnimatedGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 60], [0, 0.08], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundImage: `
          linear-gradient(${brand.cyan}15 1px, transparent 1px),
          linear-gradient(90deg, ${brand.cyan}15 1px, transparent 1px)
        `,
        backgroundSize: "100px 100px",
        maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
      }}
    />
  );
};

// ============================================
// LIGHT BEAM EFFECT
// ============================================
const LightBeam: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const adjustedFrame = Math.max(0, frame - delay);

  const beamProgress = interpolate(adjustedFrame, [0, 30], [-100, 200], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const opacity = interpolate(adjustedFrame, [0, 15, 30], [0, 0.4, 0], {
    extrapolateRight: "clamp",
  });

  if (adjustedFrame < 0 || adjustedFrame > 40) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: `${beamProgress}%`,
        width: "3%",
        height: "100%",
        background: `linear-gradient(90deg, transparent, ${brand.cyan}${Math.round(opacity * 255).toString(16).padStart(2, '0')}, transparent)`,
        filter: "blur(20px)",
        transform: "skewX(-15deg)",
      }}
    />
  );
};

// ============================================
// HYBTRA LOGO - PROPER BRAND
// ============================================
const HybtraLogo: React.FC<{
  scale?: number;
  showText?: boolean;
  animate?: boolean;
}> = ({ scale = 1, showText = true, animate = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation springs
  const containerSpring = animate ? spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 100, mass: 1 },
  }) : 1;

  const wave1Progress = animate ? spring({
    frame,
    fps,
    config: { damping: 25, stiffness: 150 },
  }) : 1;

  const wave2Progress = animate ? spring({
    frame: frame - 10,
    fps,
    config: { damping: 25, stiffness: 150 },
  }) : 1;

  const wave3Progress = animate ? spring({
    frame: frame - 20,
    fps,
    config: { damping: 25, stiffness: 150 },
  }) : 1;

  const textProgress = animate ? spring({
    frame: frame - 30,
    fps,
    config: { damping: 18, stiffness: 80 },
  }) : 1;

  const glowIntensity = 0.6 + Math.sin(frame * 0.05) * 0.2;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18 * scale,
        transform: `scale(${containerSpring * scale})`,
      }}
    >
      {/* Logo Icon */}
      <div style={{ position: "relative" }}>
        {/* Glow layer */}
        <svg
          width={60 * scale}
          height={60 * scale}
          viewBox="0 0 60 60"
          fill="none"
          style={{
            position: "absolute",
            filter: `blur(12px)`,
            opacity: glowIntensity * 0.5,
          }}
        >
          <path d="M14 48 C14 28, 24 14, 32 14" stroke={brand.cyan} strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M26 48 C26 34, 34 24, 42 24" stroke={brand.cyan} strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M38 48 C38 40, 44 34, 52 34" stroke={brand.cyan} strokeWidth="6" strokeLinecap="round" fill="none" />
        </svg>

        {/* Main logo */}
        <svg
          width={60 * scale}
          height={60 * scale}
          viewBox="0 0 60 60"
          fill="none"
          style={{ position: "relative" }}
        >
          {/* Wave 1 - tallest */}
          <path
            d="M14 48 C14 28, 24 14, 32 14"
            stroke={brand.cyan}
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            strokeDasharray="55"
            strokeDashoffset={55 * (1 - wave1Progress)}
            style={{ filter: `drop-shadow(0 0 6px ${brand.cyan})` }}
          />
          {/* Wave 2 - medium */}
          <path
            d="M26 48 C26 34, 34 24, 42 24"
            stroke={brand.cyanLight}
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            strokeDasharray="45"
            strokeDashoffset={45 * (1 - wave2Progress)}
            opacity={0.7}
            style={{ filter: `drop-shadow(0 0 4px ${brand.cyan})` }}
          />
          {/* Wave 3 - shortest */}
          <path
            d="M38 48 C38 40, 44 34, 52 34"
            stroke={brand.cyan}
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            strokeDasharray="35"
            strokeDashoffset={35 * (1 - wave3Progress)}
            opacity={0.5}
            style={{ filter: `drop-shadow(0 0 3px ${brand.cyan})` }}
          />
        </svg>
      </div>

      {/* Logo Text */}
      {showText && (
        <span
          style={{
            fontFamily: "'SF Pro Display', -apple-system, system-ui, sans-serif",
            fontSize: 52 * scale,
            fontWeight: 600,
            color: brand.white,
            letterSpacing: "-0.02em",
            opacity: textProgress,
            transform: `translateX(${interpolate(textProgress, [0, 1], [-15, 0])}px)`,
          }}
        >
          Hybtra
        </span>
      )}
    </div>
  );
};

// ============================================
// HEADLINE TEXT
// ============================================
const Headline: React.FC<{
  children: string;
  delay?: number;
  size?: "xl" | "lg" | "md";
  gradient?: boolean;
  center?: boolean;
}> = ({ children, delay = 0, size = "lg", gradient = false, center = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 22, stiffness: 100, mass: 0.9 },
  });

  const fontSize = size === "xl" ? 110 : size === "lg" ? 80 : 48;
  const y = interpolate(progress, [0, 1], [80, 0]);
  const blur = interpolate(progress, [0, 1], [12, 0]);

  const gradientStyle = gradient ? {
    background: `linear-gradient(135deg, ${brand.white} 0%, ${brand.cyan} 50%, ${brand.cyanLight} 100%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  } : {};

  return (
    <div style={{ overflow: "hidden", textAlign: center ? "center" : "left" }}>
      <h1
        style={{
          fontFamily: "'SF Pro Display', -apple-system, system-ui, sans-serif",
          fontSize,
          fontWeight: 700,
          color: brand.white,
          margin: 0,
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          opacity: progress,
          transform: `translateY(${y}px)`,
          filter: `blur(${blur}px)`,
          ...gradientStyle,
        }}
      >
        {children}
      </h1>
    </div>
  );
};

// ============================================
// SUBTEXT
// ============================================
const Subtext: React.FC<{
  children: string;
  delay?: number;
  size?: number;
}> = ({ children, delay = 0, size = 24 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, stiffness: 60 },
  });

  return (
    <p
      style={{
        fontFamily: "'SF Pro Text', -apple-system, system-ui, sans-serif",
        fontSize: size,
        fontWeight: 400,
        color: brand.grayLight,
        margin: 0,
        opacity,
        letterSpacing: "0.01em",
      }}
    >
      {children}
    </p>
  );
};

// ============================================
// BRAND BADGE
// ============================================
const BrandBadge: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 20px",
        borderRadius: 100,
        background: `${brand.cyan}15`,
        border: `1px solid ${brand.cyan}30`,
        opacity: progress,
        transform: `scale(${interpolate(progress, [0, 1], [0.9, 1])})`,
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: brand.cyan,
          boxShadow: `0 0 10px ${brand.cyan}`,
        }}
      />
      <span
        style={{
          fontFamily: "'SF Pro Text', -apple-system, system-ui, sans-serif",
          fontSize: 14,
          fontWeight: 500,
          color: brand.cyan,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        AI Prompt Platform
      </span>
    </div>
  );
};

// ============================================
// CTA BUTTON
// ============================================
const CTAButton: React.FC<{
  children: string;
  delay?: number;
}> = ({ children, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const shimmer = interpolate(
    (frame - delay) % 120,
    [0, 120],
    [-100, 200]
  );

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        padding: "20px 40px",
        borderRadius: 16,
        background: brand.cyan,
        opacity: progress,
        transform: `translateY(${interpolate(progress, [0, 1], [30, 0])}px)`,
        boxShadow: `0 20px 50px -10px ${brand.cyan}50`,
        overflow: "hidden",
      }}
    >
      {/* Shimmer effect */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: `${shimmer}%`,
          width: "30%",
          height: "100%",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
          transform: "skewX(-20deg)",
        }}
      />

      {/* Icon */}
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke={brand.dark} strokeWidth="2.5" />
        <path d="M16 16L20 20" stroke={brand.dark} strokeWidth="2.5" strokeLinecap="round" />
      </svg>

      <span
        style={{
          fontFamily: "'SF Pro Text', -apple-system, system-ui, sans-serif",
          fontSize: 18,
          fontWeight: 600,
          color: brand.dark,
          position: "relative",
        }}
      >
        {children}
      </span>
    </div>
  );
};

// ============================================
// AI TOOL BADGE
// ============================================
const AIToolBadge: React.FC<{
  name: string;
  color: string;
  delay: number;
}> = ({ name, color, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 150, mass: 0.5 },
  });

  const float = Math.sin((frame - delay) * 0.05) * 3;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 24px",
        borderRadius: 14,
        background: brand.gray,
        border: `1px solid ${brand.grayMid}`,
        opacity: progress,
        transform: `translateY(${interpolate(progress, [0, 1], [40, 0]) + float}px)`,
      }}
    >
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 12px ${color}80`,
        }}
      />
      <span
        style={{
          fontFamily: "'SF Pro Text', -apple-system, system-ui, sans-serif",
          fontSize: 16,
          fontWeight: 500,
          color: brand.offWhite,
        }}
      >
        {name}
      </span>
    </div>
  );
};

// ============================================
// FEATURE BLOCK
// ============================================
const FeatureBlock: React.FC<{
  emoji: string;
  title: string;
  subtitle: string;
  delay: number;
}> = ({ emoji, title, subtitle, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 120, mass: 0.6 },
  });

  return (
    <div
      style={{
        width: 320,
        padding: 32,
        borderRadius: 24,
        background: `linear-gradient(135deg, ${brand.gray} 0%, ${brand.darkGray} 100%)`,
        border: `1px solid ${brand.grayMid}`,
        opacity: progress,
        transform: `translateY(${interpolate(progress, [0, 1], [60, 0])}px) scale(${interpolate(progress, [0, 1], [0.95, 1])})`,
      }}
    >
      <div
        style={{
          fontSize: 40,
          marginBottom: 20,
        }}
      >
        {emoji}
      </div>
      <h3
        style={{
          fontFamily: "'SF Pro Display', -apple-system, system-ui, sans-serif",
          fontSize: 24,
          fontWeight: 600,
          color: brand.white,
          margin: 0,
          marginBottom: 8,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: "'SF Pro Text', -apple-system, system-ui, sans-serif",
          fontSize: 16,
          color: brand.grayLight,
          margin: 0,
          lineHeight: 1.5,
        }}
      >
        {subtitle}
      </p>
    </div>
  );
};

// ============================================
// STAT COUNTER
// ============================================
const StatCounter: React.FC<{
  value: string;
  label: string;
  delay: number;
}> = ({ value, label, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  return (
    <div
      style={{
        textAlign: "center",
        opacity: progress,
        transform: `translateY(${interpolate(progress, [0, 1], [30, 0])}px)`,
      }}
    >
      <div
        style={{
          fontFamily: "'SF Pro Display', -apple-system, system-ui, sans-serif",
          fontSize: 64,
          fontWeight: 700,
          color: brand.cyan,
          lineHeight: 1,
          textShadow: `0 0 40px ${brand.cyan}40`,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: "'SF Pro Text', -apple-system, system-ui, sans-serif",
          fontSize: 16,
          color: brand.grayLight,
          marginTop: 8,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        {label}
      </div>
    </div>
  );
};

// ============================================
// SCENE 1: INTRO HOOK
// ============================================
const SceneIntro: React.FC = () => {
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <LightBeam delay={20} />
      <div style={{ textAlign: "center" }}>
        <BrandBadge delay={10} />
        <div style={{ height: 40 }} />
        <Headline delay={30} size="lg">
          Stop searching for
        </Headline>
        <Headline delay={45} size="xl" gradient>
          the perfect prompt
        </Headline>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE 2: LOGO REVEAL
// ============================================
const SceneLogoReveal: React.FC = () => {
  const frame = useCurrentFrame();

  // Ring animation
  const ringScale = interpolate(frame, [0, 40], [0.3, 2], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const ringOpacity = interpolate(frame, [20, 40], [0.5, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <LightBeam delay={0} />

      {/* Expanding ring */}
      <div
        style={{
          position: "absolute",
          width: 120,
          height: 120,
          borderRadius: "50%",
          border: `2px solid ${brand.cyan}`,
          transform: `scale(${ringScale})`,
          opacity: ringOpacity,
          boxShadow: `0 0 30px ${brand.cyan}40`,
        }}
      />

      <HybtraLogo scale={2} animate />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE 3: TAGLINE
// ============================================
const SceneTagline: React.FC = () => {
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <Subtext delay={0} size={28}>
          Your infinite
        </Subtext>
        <div style={{ height: 16 }} />
        <Headline delay={15} size="xl" gradient>
          Prompt Directory
        </Headline>
        <div style={{ height: 16 }} />
        <Subtext delay={35} size={28}>
          for AI
        </Subtext>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE 4: AI TOOLS
// ============================================
const SceneAITools: React.FC = () => {
  const tools = [
    { name: "ChatGPT", color: "#10a37f", delay: 15 },
    { name: "Claude", color: "#cc785c", delay: 22 },
    { name: "Gemini", color: "#4285f4", delay: 29 },
    { name: "Grok", color: "#ffffff", delay: 36 },
    { name: "Perplexity", color: "#20b2aa", delay: 43 },
    { name: "Meta AI", color: "#0668E1", delay: 50 },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <Subtext delay={0} size={20}>
          Works seamlessly with
        </Subtext>
        <div style={{ height: 50 }} />
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", maxWidth: 800 }}>
          {tools.map((tool) => (
            <AIToolBadge key={tool.name} {...tool} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE 5: FEATURES
// ============================================
const SceneFeatures: React.FC = () => {
  const features = [
    { emoji: "⚡", title: "Coding", subtitle: "Debug and build faster with expert prompts", delay: 15 },
    { emoji: "✨", title: "Writing", subtitle: "Create compelling content effortlessly", delay: 30 },
    { emoji: "📈", title: "Marketing", subtitle: "Optimize campaigns that convert", delay: 45 },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <Subtext delay={0} size={20}>
          Curated prompts for every workflow
        </Subtext>
        <div style={{ height: 50 }} />
        <div style={{ display: "flex", gap: 24, justifyContent: "center" }}>
          {features.map((f) => (
            <FeatureBlock key={f.title} {...f} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE 6: CTA
// ============================================
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const urlOpacity = spring({
    frame: frame - 70,
    fps,
    config: { damping: 15, stiffness: 60 },
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <LightBeam delay={0} />
      <div style={{ textAlign: "center" }}>
        <div style={{ marginBottom: 50 }}>
          <HybtraLogo scale={1.6} animate />
        </div>

        <CTAButton delay={40}>
          Explore Prompts
        </CTAButton>

        <p
          style={{
            fontFamily: "'SF Pro Text', -apple-system, system-ui, sans-serif",
            fontSize: 20,
            color: brand.grayLight,
            marginTop: 40,
            opacity: urlOpacity,
          }}
        >
          <span style={{ color: brand.cyan, fontWeight: 500 }}>hybtra.com</span>
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// MAIN COMPOSITION
// ============================================
export const HybtraIntro: React.FC = () => {
  const frame = useCurrentFrame();

  const getOpacity = (start: number, end: number, fadeIn = 15, fadeOut = 15) => {
    if (frame < start) return 0;
    if (frame < start + fadeIn) {
      return interpolate(frame, [start, start + fadeIn], [0, 1], {
        easing: Easing.out(Easing.cubic),
      });
    }
    if (frame < end - fadeOut) return 1;
    if (frame < end) {
      return interpolate(frame, [end - fadeOut, end], [1, 0], {
        easing: Easing.in(Easing.cubic),
      });
    }
    return 0;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: brand.black }}>
      {/* Background */}
      <CinematicBackground />
      <AnimatedGrid />

      {/* Music */}
      <Audio
        src={staticFile("music.mp3")}
        volume={(f) => {
          if (f < 60) return interpolate(f, [0, 60], [0, 0.5]);
          if (f < 840) return 0.5;
          return interpolate(f, [840, 900], [0.5, 0]);
        }}
      />

      {/* Scene 1: Intro (0-180) */}
      <Sequence from={0} durationInFrames={195}>
        <AbsoluteFill style={{ opacity: getOpacity(0, 195, 12, 18) }}>
          <SceneIntro />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 2: Logo (165-330) */}
      <Sequence from={165} durationInFrames={185}>
        <AbsoluteFill style={{ opacity: getOpacity(165, 350, 12, 18) }}>
          <SceneLogoReveal />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 3: Tagline (310-490) */}
      <Sequence from={310} durationInFrames={200}>
        <AbsoluteFill style={{ opacity: getOpacity(310, 510, 12, 18) }}>
          <SceneTagline />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 4: AI Tools (470-640) */}
      <Sequence from={470} durationInFrames={190}>
        <AbsoluteFill style={{ opacity: getOpacity(470, 660, 12, 18) }}>
          <SceneAITools />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 5: Features (620-800) */}
      <Sequence from={620} durationInFrames={200}>
        <AbsoluteFill style={{ opacity: getOpacity(620, 820, 12, 18) }}>
          <SceneFeatures />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 6: CTA (780-900) */}
      <Sequence from={780} durationInFrames={120}>
        <AbsoluteFill style={{ opacity: getOpacity(780, 900, 12, 0) }}>
          <SceneCTA />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
