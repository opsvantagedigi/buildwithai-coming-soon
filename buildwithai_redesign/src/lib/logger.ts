export function logInfo(msg: string, meta?: any) {
  console.log(`[info] ${new Date().toISOString()} - ${msg}`, meta || '')
}

export function logError(msg: string, meta?: any) {
  console.error(`[error] ${new Date().toISOString()} - ${msg}`, meta || '')
}

export default { logInfo, logError }
