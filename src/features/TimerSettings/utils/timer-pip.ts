export class TimerPip {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private video: HTMLVideoElement
  private isPip: boolean = false

  constructor() {
    this.canvas = document.createElement('canvas')
    this.canvas.width = 150
    this.canvas.height = 100
    this.ctx = this.canvas.getContext('2d')!
    this.video = document.createElement('video')
    this.video.srcObject = this.canvas.captureStream()
    this.video.muted = true
    this.video.play()
    this.drawPip(0, 0)
  }

  drawPip(minutes: number, seconds: number) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    if (seconds === 30) {
      this.ctx.fillStyle = 'yellow'
    } else if (seconds < 1) {
      this.ctx.fillStyle = 'red'
    } else {
      this.ctx.fillStyle = 'black'
    }
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.fillStyle = 'white'
    this.ctx.font = '48px sans-serif'
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'
    this.ctx.fillText(
      `${minutes}:${seconds.toString().padStart(2, '0')}`,
      this.canvas.width / 2,
      this.canvas.height / 2,
    )
  }

  async showPip() {
    await new Promise((resolve) => requestAnimationFrame(resolve))
    try {
      if (!this.isPip) {
        this.video.play()
        await this.video.requestPictureInPicture()
        this.isPip = true
      }
    } catch (err) {
      console.error('PiP failed', err)
    }
  }

  destroy() {
    if (this.isPip) {
      this.video.pause()
      document.exitPictureInPicture()
    }
    this.isPip = false
  }
}
