export function SceneLighting() {
  return (
    <>
      <hemisphereLight args={['#fff8e8', '#7f725f', 1.65]} />
      <directionalLight
        position={[4.5, 7, 9]}
        intensity={2.6}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0005}
      />
      <mesh position={[0, 0, -0.27]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <shadowMaterial transparent opacity={0.15} />
      </mesh>
    </>
  );
}
