export interface StreamStatus {
  isFirstRun: boolean
  waitingCount: number
}

export let sharedData = {
  streamStatus: null as StreamStatus
}
