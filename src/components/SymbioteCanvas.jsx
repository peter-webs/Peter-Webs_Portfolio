import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';

// 1. Define the GLSL Shader Math
const SymbioteMaterial = shaderMaterial(
  { uTime: 0, uProgress: 0, texLight: null, texDark: null },
  // Vertex Shader (Positions the flat plane)
  `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  // Fragment Shader (Calculates the liquid pixel colors)
  `
  uniform float uTime;
  uniform float uProgress;
  uniform sampler2D texLight;
  uniform sampler2D texDark;
  varying vec2 vUv;

  // Math function for organic noise
  float random(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123); }
  float noise(vec2 st) {
      vec2 i = floor(st); vec2 f = fract(st);
      float a = random(i); float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0)); float d = random(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    // Distort coordinates to create tendril edges
    vec2 distortedUv = vUv + noise(vUv * 8.0 + uTime * 0.5) * 0.1;
    
    // Calculate distance from bottom center (where the toggle button is)
    float dist = distance(vUv, vec2(0.5, 0.0));
    
    // Mix distance with noise, expand based on uProgress
    float edgeNoise = noise(distortedUv * 4.0) * 0.3;
    float expansion = uProgress * 2.5; 
    
    // Create the sharp but jagged mask
    float mask = smoothstep(expansion - 0.1, expansion + 0.1, dist + edgeNoise);
    
    vec4 colorLight = texture2D(texLight, vUv);
    vec4 colorDark = texture2D(texDark, vUv);
    
    // Blend the Spider-Man and Venom textures based on the mask
    gl_FragColor = mix(colorDark, colorLight, mask);
  }
  `
);

// Register the custom shader with React Three Fiber
extend({ SymbioteMaterial });

function Scene({ isDark }) {
  const materialRef = useRef();
  
  // Load images (Ensure these exact filenames are in your public folder)
  const [lightTex, darkTex] = useTexture(['/spiderman-bg.jpg', '/venom-bg.jpg']);

  // Animate the shader values on every frame (60fps)
  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uTime += delta;
      
      // Smoothly animate uProgress toward 1 (Dark) or 0 (Light)
      const target = isDark ? 1 : 0;
      materialRef.current.uProgress += (target - materialRef.current.uProgress) * 0.05;
    }
  });

  return (
    <mesh>
      {/* 2D Plane covering the screen */}
      <planeGeometry args={[2, 2]} />
      <symbioteMaterial 
        ref={materialRef} 
        texLight={lightTex} 
        texDark={darkTex} 
      />
    </mesh>
  );
}

export default function SymbioteCanvas({ isDark }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Set up orthographic camera for flat 2D rendering */}
      <Canvas orthographic camera={{ position: [0, 0, 1], zoom: 1 }}>
        <Scene isDark={isDark} />
      </Canvas>
      
      {/* White overlay to maintain readability over the harsh images */}
      <div className={`absolute inset-0 bg-white/85 transition-opacity duration-700 ${isDark ? 'opacity-0' : 'opacity-100'}`} />
      <div className={`absolute inset-0 bg-black/85 transition-opacity duration-700 ${isDark ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  );
}