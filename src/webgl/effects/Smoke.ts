import GUI from 'lil-gui'
import * as THREE from 'three'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { gl } from '../core/WebGL'
import fragmentShader from '../shaders/smokeFrag.glsl'
import vertexShader from '../shaders/smokeVert.glsl'
import { mouse2d } from '../utils/Mouse2D'

class Smoke {
  public pass: ShaderPass
  private mousePos = new THREE.Vector2()

  constructor() {
    this.pass = this.createPass()
  }

  private createPass() {
    const shader: THREE.Shader = {
      uniforms: {
        tDiffuse: { value: null },
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(gl.size.width, gl.size.height) },
        uMouse: { value: new THREE.Vector2(99999, 99999) },
      },
      vertexShader,
      fragmentShader,
    }
    return new ShaderPass(shader)
  }

  resize() {
    this.pass.uniforms.uResolution.value.set(gl.size.width, gl.size.height)
  }

  update() {
    this.pass.uniforms.uTime.value += gl.time.delta

    this.mousePos.x = THREE.MathUtils.lerp(this.mousePos.x, mouse2d.position[0], 0.12)
    this.mousePos.y = THREE.MathUtils.lerp(this.mousePos.y, mouse2d.position[1], 0.12)

    this.pass.uniforms.uMouse.value.copy(this.mousePos)
  }
}

export const smoke = new Smoke()
