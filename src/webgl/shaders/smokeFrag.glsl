uniform sampler2D tDiffuse;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
varying vec2 vUv;

const int LOOP = 30;

#include '../glsl/rotate.glsl'
#include '../glsl/snoise.glsl'
#include '../glsl/blend.glsl'

void main() {
  vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
  vec2 uv = vUv * aspect;

  vec2 mouse = (uMouse + 1.0) * 0.5 * aspect;
  float mDist = distance(uv, mouse);
  vec2 mouseDistortion = normalize(uv - mouse);

  vec2 dir = normalize(rotate(uv, snoise(vec3(uv, uTime * 0.2))));

  vec4 smoke;
  for (int i = 0; i < LOOP; i++) {
    float n = snoise(vec3(vUv * 10.0 + float(i) * 0.01 + uTime * 0.3, uTime * 0.1));
    n = pow(n, 5.0);
    vec4 t = texture2D(tDiffuse, vUv + dir * n * 0.05 - mouseDistortion * (1.0 - smoothstep(0.01, 0.05, mDist)) * 0.015);
    smoke += t - n * t.r;
  }
  smoke /= float(LOOP);  
  
  float light = 1.01 - mDist * 0.9;
  light = pow(light, 8.0);
  light *= 1.0 - step(0.9, mDist);

  float nn = snoise(vec3(uv * 1.3 - uTime * 0.1, uTime * 0.1));
  nn = smoothstep(-0.5, 0.5, nn);

  smoke.rgb *= light * (0.4 - 0.1) + 0.1 + nn * 0.4;
  smoke.rgb += light;
  smoke.rgb = blendScreen(smoke.rgb, vec3(nn * 0.05), 1.0);

  gl_FragColor = smoke;
}