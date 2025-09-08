interface TimerOptions {
  onTickSubscribers?: ((minutes: number, seconds: number) => void)[]
  onFinishSubscribers?: (() => void)[]
}

interface TimerScopedState {
  startTime: number
  endTime: number
  pausedTime: number
  status: 'running' | 'paused' | 'stopped'
}

interface InternalTimerOptions {
  state: TimerScopedState
  onFinish: () => void
  onTick: (minutes: number, seconds: number) => void
}

const _runTimerInternal = ({ state, onFinish, onTick }: InternalTimerOptions): void => {
  if (state.status !== 'running') {
    return
  }
  const now = Date.now()
  const remaining = Math.max(0, state.endTime - now)

  const minutes = Math.floor(remaining / 60000)
  const seconds = Math.floor((remaining % 60000) / 1000)
  onTick(minutes, seconds)
  if (remaining > 0) {
    setTimeout(() => _runTimerInternal({ state, onFinish, onTick }), 1000)
  } else {
    onFinish()
  }
}

export class Timer {
  private state: TimerScopedState
  private onTickSubscribers: ((minutes: number, seconds: number) => void)[] = []
  private onFinishSubscribers: (() => void)[] = []

  constructor(options: TimerOptions) {
    this.state = {
      startTime: 0,
      endTime: 0,
      pausedTime: 0,
      status: 'stopped',
    }
    this.onTickSubscribers = options.onTickSubscribers || []
    this.onFinishSubscribers = options.onFinishSubscribers || []
  }

  start(minutes: number, seconds: number) {
    this.state.startTime = Date.now()
    this.state.endTime = this.state.startTime + minutes * 60000 + seconds * 1000
    this.state.status = 'running'
    _runTimerInternal({
      state: this.state,
      onFinish: this.onFinish.bind(this),
      onTick: this.onTick.bind(this),
    })
  }

  pause() {
    this.state.startTime = Date.now()
    this.state.pausedTime = this.state.endTime - this.state.startTime
    this.state.status = 'paused'
  }

  resume() {
    this.state.startTime = Date.now()
    this.state.endTime = this.state.startTime + this.state.pausedTime
    this.state.status = 'running'
  }

  stop() {
    this.state.startTime = 0
    this.state.endTime = 0
    this.state.pausedTime = 0
    this.state.status = 'stopped'
    this.onFinish()
    this.clearSubscribers()
  }

  onFinish() {
    this.onFinishSubscribers?.forEach((subscriber) => subscriber())
  }

  onTick(minutes: number, seconds: number) {
    this.onTickSubscribers?.forEach((subscriber) => subscriber(minutes, seconds))
  }

  onFinishSubscribe(subscriber: () => void) {
    this.onFinishSubscribers?.push(subscriber)
  }

  onTickSubscribe(subscriber: (minutes: number, seconds: number) => void) {
    this.onTickSubscribers?.push(subscriber)
  }

  clearSubscribers() {
    this.onFinishSubscribers = []
    this.onTickSubscribers = []
  }
}
