import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  formatDate,
  formatDateTime,
  formatFileSize,
  downloadFile,
  copyToClipboard,
  generateId,
  deepClone,
  sleep,
  safeJSONParse,
  truncateText,
  getRandomColor,
  isMobile,
  stripHtml,
  debounce,
  throttle,
} from '@/lib/utils'

describe('formatDate', () => {
  it('returns 待定 for undefined', () => {
    expect(formatDate(undefined)).toBe('待定')
  })

  it('returns 待定 for invalid date string', () => {
    expect(formatDate('invalid-date')).toBe('待定')
  })

  it('formats a Date object correctly', () => {
    const date = new Date(2024, 0, 15) // Jan 15, 2024
    expect(formatDate(date)).toBe('2024-01-15')
  })

  it('formats a date string correctly', () => {
    expect(formatDate('2024-06-01')).toMatch(/^2024-06-0[12]$/) // timezone-safe
  })

  it('pads month and day with zeros', () => {
    const date = new Date(2024, 2, 5) // March 5
    expect(formatDate(date)).toBe('2024-03-05')
  })
})

describe('formatDateTime', () => {
  it('returns 待定 for undefined', () => {
    expect(formatDateTime(undefined)).toBe('待定')
  })

  it('returns 待定 for invalid date', () => {
    expect(formatDateTime('not-a-date')).toBe('待定')
  })

  it('formats a Date with time correctly', () => {
    const date = new Date(2024, 0, 15, 9, 5) // Jan 15, 2024 09:05
    expect(formatDateTime(date)).toBe('2024-01-15 09:05')
  })
})

describe('formatFileSize', () => {
  it('returns 0 B for zero bytes', () => {
    expect(formatFileSize(0)).toBe('0 B')
  })

  it('formats bytes correctly', () => {
    expect(formatFileSize(512)).toBe('512.00 B')
  })

  it('formats kilobytes correctly', () => {
    expect(formatFileSize(1024)).toBe('1.00 KB')
  })

  it('formats megabytes correctly', () => {
    expect(formatFileSize(1024 * 1024)).toBe('1.00 MB')
  })

  it('formats gigabytes correctly', () => {
    expect(formatFileSize(1024 * 1024 * 1024)).toBe('1.00 GB')
  })
})

describe('generateId', () => {
  it('generates id with default prefix', () => {
    const id = generateId()
    expect(id).toMatch(/^id-\d+-[a-z0-9]+$/)
  })

  it('generates id with custom prefix', () => {
    const id = generateId('meeting')
    expect(id).toMatch(/^meeting-\d+-[a-z0-9]+$/)
  })

  it('generates unique ids', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()))
    expect(ids.size).toBe(100)
  })
})

describe('deepClone', () => {
  it('clones a primitive', () => {
    expect(deepClone(42)).toBe(42)
    expect(deepClone('hello')).toBe('hello')
    expect(deepClone(null)).toBeNull()
  })

  it('clones a Date object', () => {
    const date = new Date(2024, 0, 1)
    const cloned = deepClone(date)
    expect(cloned).toEqual(date)
    expect(cloned).not.toBe(date)
  })

  it('clones an array', () => {
    const arr = [1, 2, { a: 3 }]
    const cloned = deepClone(arr)
    expect(cloned).toEqual(arr)
    expect(cloned).not.toBe(arr)
    expect(cloned[2]).not.toBe(arr[2])
  })

  it('clones a nested object', () => {
    const obj = { a: 1, b: { c: 2 }, d: [1, 2] }
    const cloned = deepClone(obj)
    expect(cloned).toEqual(obj)
    expect(cloned.b).not.toBe(obj.b)
    expect(cloned.d).not.toBe(obj.d)
  })
})

describe('sleep', () => {
  it('resolves after specified milliseconds', async () => {
    const start = Date.now()
    await sleep(50)
    const elapsed = Date.now() - start
    expect(elapsed).toBeGreaterThanOrEqual(45)
  })
})

describe('safeJSONParse', () => {
  it('parses valid JSON', () => {
    expect(safeJSONParse('{"a":1}', {})).toEqual({ a: 1 })
  })

  it('returns default value for invalid JSON', () => {
    const defaultVal = { default: true }
    expect(safeJSONParse('not-json', defaultVal)).toBe(defaultVal)
  })

  it('parses JSON array', () => {
    expect(safeJSONParse('[1,2,3]', [])).toEqual([1, 2, 3])
  })

  it('returns default for empty string', () => {
    expect(safeJSONParse('', null)).toBeNull()
  })
})

describe('truncateText', () => {
  it('returns text unchanged if within maxLength', () => {
    expect(truncateText('hello', 10)).toBe('hello')
  })

  it('returns text unchanged if exactly maxLength', () => {
    expect(truncateText('hello', 5)).toBe('hello')
  })

  it('truncates text exceeding maxLength', () => {
    expect(truncateText('hello world', 5)).toBe('hello...')
  })

  it('handles empty string', () => {
    expect(truncateText('', 5)).toBe('')
  })
})

describe('getRandomColor', () => {
  it('returns a valid hex color', () => {
    const color = getRandomColor()
    expect(color).toMatch(/^#[0-9a-f]{6}$/i)
  })

  it('returns one of the defined colors', () => {
    const validColors = [
      '#2563eb', '#7c3aed', '#dc2626', '#ea580c',
      '#16a34a', '#0891b2', '#d946ef', '#ca8a04'
    ]
    for (let i = 0; i < 50; i++) {
      expect(validColors).toContain(getRandomColor())
    }
  })
})

describe('downloadFile', () => {
  it('creates and clicks download link', () => {
    const blob = new Blob(['hello'], { type: 'text/plain' })
    const mockUrl = 'blob:http://localhost/fake-url'
    const createObjectURL = vi.fn().mockReturnValue(mockUrl)
    const revokeObjectURL = vi.fn()
    const clickMock = vi.fn()

    globalThis.URL.createObjectURL = createObjectURL
    globalThis.URL.revokeObjectURL = revokeObjectURL

    const linkEl = { href: '', download: '', click: clickMock }
    vi.spyOn(document, 'createElement').mockReturnValueOnce(linkEl as unknown as HTMLElement)

    downloadFile(blob, 'test.txt')

    expect(createObjectURL).toHaveBeenCalledWith(blob)
    expect(linkEl.download).toBe('test.txt')
    expect(clickMock).toHaveBeenCalled()
    expect(revokeObjectURL).toHaveBeenCalledWith(mockUrl)
  })
})

describe('copyToClipboard', () => {
  it('returns true on success', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      writable: true,
      configurable: true,
    })

    const result = await copyToClipboard('test text')
    expect(result).toBe(true)
    expect(writeText).toHaveBeenCalledWith('test text')
  })

  it('returns false on failure', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('Permission denied'))
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      writable: true,
      configurable: true,
    })

    const result = await copyToClipboard('test text')
    expect(result).toBe(false)
  })
})

describe('isMobile', () => {
  it('returns true for mobile user agent', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
      writable: true,
      configurable: true,
    })
    expect(isMobile()).toBe(true)
  })

  it('returns false for desktop user agent', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      writable: true,
      configurable: true,
    })
    expect(isMobile()).toBe(false)
  })

  it('returns true for Android user agent', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Linux; Android 10; Pixel 3)',
      writable: true,
      configurable: true,
    })
    expect(isMobile()).toBe(true)
  })
})

describe('stripHtml', () => {
  it('removes HTML tags from string', () => {
    const result = stripHtml('<p>Hello <strong>World</strong></p>')
    expect(result).toBe('Hello World')
  })

  it('returns plain text unchanged', () => {
    expect(stripHtml('plain text')).toBe('plain text')
  })

  it('handles empty string', () => {
    expect(stripHtml('')).toBe('')
  })
})

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('only calls function once after delay', () => {
    const fn = vi.fn()
    const debouncedFn = debounce(fn, 100)

    debouncedFn()
    debouncedFn()
    debouncedFn()

    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('resets timer on subsequent calls', () => {
    const fn = vi.fn()
    const debouncedFn = debounce(fn, 100)

    debouncedFn()
    vi.advanceTimersByTime(50)
    debouncedFn()
    vi.advanceTimersByTime(50)

    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(50)
    expect(fn).toHaveBeenCalledTimes(1)
  })
})

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('calls function immediately on first call', () => {
    const fn = vi.fn()
    const throttledFn = throttle(fn, 100)

    throttledFn()

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('ignores calls within the delay period', () => {
    const fn = vi.fn()
    const throttledFn = throttle(fn, 100)

    throttledFn()
    throttledFn()
    throttledFn()

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('allows call after delay period', () => {
    const fn = vi.fn()
    const throttledFn = throttle(fn, 100)

    throttledFn()
    vi.advanceTimersByTime(100)
    throttledFn()

    expect(fn).toHaveBeenCalledTimes(2)
  })
})
