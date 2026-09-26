import { Canvas } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'

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
        </Canvas>
      </div>
    </>
  )
}
