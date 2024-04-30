import { basename, dirname, join } from 'path'

export function getCallerInfo(pth?: string): [directoryPath: string | undefined, fileName: string | undefined] {
  // return [undefined, undefined]

  if (pth) {
    const dirPath = dirname(pth)
    const fileName = basename(pth)
    return [dirPath, fileName]
  }

  let errorStack = new Error().stack

  console.log({ errorStack })
  /* istanbul ignore else */
  if (errorStack && process.platform === 'win32') {
    errorStack = errorStack?.replace(/\\/g, '/')
  }

  const errorLine = errorStack?.split('\n').find(line => line.includes('/src/app'))
  const fileInfo = errorLine?.split(/:\d+:\d+/)

  console.log({ errorLine, fileInfo })

  /* istanbul ignore else */
  if (!fileInfo?.length) {
    return [undefined, undefined]
  }

  const fileName = fileInfo?.[0].trim().split('/src/app/') ?? ''

  return [
    join('/src/app', dirname(fileName[fileName.length - 1])).replace(/\\/g, '/'),
    basename(fileName[fileName.length - 1])
  ]
}
