uniform sampler2D uImage;
varying vec2 vUv;

void main() {
  vec4 tex = texture2D(uImage, vUv);
  vec3 color = 1.0 - tex.rgb;

  gl_FragColor = vec4(color, tex.a);
}