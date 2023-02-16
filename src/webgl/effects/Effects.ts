import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { gl } from '../core/WebGL'
import { smoke } from './Smoke'

class Effects {
  private composer!: EffectComposer

  constructor() {
    this.init()
  }

  private init() {
    this.composer = new EffectComposer(gl.renderer)
    this.composer.setPixelRatio(window.devicePixelRatio)
    this.composer.addPass(new RenderPass(gl.scene, gl.camera))

    this.composer.addPass(smoke.pass)
  }

  resize() {
    const { width, height } = gl.size
    smoke.resize()
    this.composer.setSize(width, height)
  }

  render() {
    smoke.update()
    this.composer.render()
  }
}

export const effects = new Effects()
