import * as THREE from 'three'
import { gl } from './core/WebGL'
import { effects } from './effects/Effects'
import fragmentShader from './shaders/planeFrag.glsl'
import vertexShader from './shaders/planeVert.glsl'
import { Assets, loadAssets } from './utils/assetLoader'

export class TCanvas {
  private assets: Assets = {
    creative: { path: 'resources/creative.png' },
  }

  constructor(private parentNode: ParentNode) {
    loadAssets(this.assets).then(() => {
      this.init()
      this.createObjects()
      gl.requestAnimationFrame(this.anime)
    })
  }

  private init() {
    gl.setup(this.parentNode.querySelector('.three-container')!)
    gl.scene.background = new THREE.Color('#000')
    gl.camera.position.z = 1.5

    gl.setResizeCallback(() => effects.resize())
  }

  private createObjects() {
    const texture = this.assets.creative.data as THREE.Texture
    const aspect = texture.image.width / texture.image.height
    const scale = 1.8
    const geometry = new THREE.PlaneGeometry(scale, scale / aspect)

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uImage: { value: texture },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.name = 'plane'

    gl.scene.add(mesh)
  }

  // ----------------------------------
  // animation
  private anime = () => {
    effects.render()
  }

  // ----------------------------------
  // dispose
  dispose() {
    gl.dispose()
  }
}
