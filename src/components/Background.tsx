import { Canvas } from '@react-three/fiber'
import { Sparkles, Stars } from '@react-three/drei'

export function Background() {
  return (
    <>
      <div className="fixed inset-0 -z-10">
        <Canvas>
          <Sparkles
            count={80}
            scale={[10, 6, 4]}
            size={4}
            speed={0.3}
            color="#ff9a5c"
          />
          <Stars
            radius={100}
            depth={25}
            count={2000}
            factor={5}
            saturation={0}
            fade
            speed={1.5}
          />
        </Canvas>
      </div>
    </>
  )
}
