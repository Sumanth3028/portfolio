import { Suspense, useEffect, useState } from "react";

import { Canvas } from "@react-three/fiber";

import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";
// import { HemisphereLight, Mesh, PointLight } from "three";

const Computers = ({ isMobile }) => {
  const computer = useGLTF("./desktop_pc/scene.gltf");

  const [rotation, setRotation] = useState([0, -0.2, 0]);

  useEffect(() => {
    const rotateComputer = () => {
      setRotation((prevRotation) => [
        prevRotation[0],
        prevRotation[1] + -0.005,
        prevRotation[2],
      ]);
    };

    const rotateInterval = setInterval(rotateComputer, 16);

    return () => clearInterval(rotateInterval);
  }, []);

  return (
    <mesh rotation={rotation}>
      <hemisphereLight intensity={2.65} groundColor="black" />
      <pointLight intensity={1} />
      <spotLight
        position={[-20, 10, 50]}
        angle={0.12}
        penumbra={1}
        castShadow
        intensity={1}
        shadow-mapSize={1024}
      />
      <primitive
        object={computer.scene}
        scale={isMobile ? 0.6 : 0.75}
        position={isMobile ? [0, -3, -1.4] : [0, -3.55, -0.25]}
        // rotation={[-0.01, -0.2, -0.1]}
      />
    </mesh>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width:500px)");
    setIsMobile(mediaQuery.matches);
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
      mediaQuery.addEventListener("change", handleMediaQueryChange);
      return () => {
        mediaQuery.removeEventListener("change", handleMediaQueryChange);
      };
    };
  }, []);
  return (
    <Canvas
      frameloop="demand"
      shadows
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Computers isMobile={isMobile} />
        {/* <div className="bg-red w-full h-full"></div> */}
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;
