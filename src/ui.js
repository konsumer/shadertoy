import { readFileSync } from 'fs'
import { join } from 'path'
import { document as doc } from 'node-webgl'
import Effect from './Effect'

export const document = doc()
export const requestAnimationFrame = document.requestAnimationFrame

export class App {
  constructor () {
    this.render = this.render.bind(this)
    this.loadPreset = this.loadPreset.bind(this)

    this.startTime = Date.now()
    this.cnv = document.createElement('canvas', 800, 600)
    this.ctx = this.cnv.getContext('experimental-webgl')
    this.mEffect = new Effect(this.ctx, this.cnv.width, this.cnv.height)

    this.mouseOrigin = [ 0, 0 ]
    this.mousePosition = [ 0, 0 ]

    document.on('resize', (evt) => {
      this.ctx.viewportWidth = evt.width
      this.ctx.viewportHeight = evt.height
      this.mEffect.SetSize(evt.width, evt.height)
    })

    document.on('mousedown', (ev) => {
      this.mouseOrigin[0] = ev.x
      this.mouseOrigin[1] = ev.y
    })

    document.on('mousemove', (ev) => {
      if (this.mouseOrigin[0] > 0) {
        this.mousePosition[0] = ev.pageX
        this.mousePosition[1] = ev.pageY
      }
    })

    document.on('mouseup', (ev) => {
      this.mouseOrigin[0] = -1
      this.mouseOrigin[1] = -1
    })

    document.on('keyup', (ev) => {
      if (ev.keyCode === 32) { // space
        this.preset = this.presets[ (this.presets.indexOf(this.preset) + 1) % this.presets.length ]
        this.loadPreset(this.preset)
      }
    })

    this.preset = 'deform'
    this.presets = [
      'deform',
      '704',
      'water',
      'mandelbulb',
      'landscape',
      'clod',
      'droid',
      'slisesix',
      'square_tunnel',
      'earth',
      'sult',
      'kinderpainter',
      'red',
      'quaternion',
      'lunaquatic',
      'metatunnel',
      'leizex',
      'mandel',
      'julia',
      'shapes',
      'apple'
    ]

    this.loadPreset(this.preset)
    this.render()
  }

  loadPreset (preset) {
    const presets = join(__dirname, 'presets')
    this.mEffect.NewShader(readFileSync(join(presets, `${preset}.fs`), 'utf8'))
    switch (preset) {
      case 'kinderpainter':
      case 'square_tunnel':
      case 'water':
        this.mEffect.NewTexture(0, join(presets, 'tex0.jpg'))
        break
      case 'earth':
        this.mEffect.NewTexture(0, join(presets, 'earth_day.jpg'))
        break
      case 'deform':
        this.mEffect.NewTexture(0, join(presets, 'tex3.jpg'))
        break
    }
  }

  render (t) {
    const time = t - this.startTime
    this.mEffect.Paint(time / 1000.0, this.mouseOrigin[0], this.mouseOrigin[1], this.mousePosition[0], this.mousePosition[1])
    this.ctx.flush()
    requestAnimationFrame(this.render, 0)
  }
}

const app = new App()
export default app
