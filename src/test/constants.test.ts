import { describe, it, expect } from 'vitest'
import {
  MEETING_TYPES,
  MEETING_STATUS,
  GENERATION_TYPES,
  MEETING_DURATIONS,
  ATTENDEE_COUNTS,
  BUDGET_RANGES,
  EXPORT_FORMATS,
  APP_CONFIG,
  API_CONFIG,
  STORAGE_KEYS,
  ROUTES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from '@/lib/constants'

describe('MEETING_TYPES', () => {
  it('has at least one entry', () => {
    expect(MEETING_TYPES.length).toBeGreaterThan(0)
  })

  it('each entry has label and value', () => {
    MEETING_TYPES.forEach(type => {
      expect(type).toHaveProperty('label')
      expect(type).toHaveProperty('value')
      expect(typeof type.label).toBe('string')
      expect(typeof type.value).toBe('string')
    })
  })

  it('includes company meeting type', () => {
    const values = MEETING_TYPES.map(t => t.value)
    expect(values).toContain('company')
  })
})

describe('MEETING_STATUS', () => {
  it('has draft, completed, published statuses', () => {
    const values = MEETING_STATUS.map(s => s.value)
    expect(values).toContain('draft')
    expect(values).toContain('completed')
    expect(values).toContain('published')
  })
})

describe('GENERATION_TYPES', () => {
  it('has 4 generation types', () => {
    expect(GENERATION_TYPES.length).toBe(4)
  })

  it('each entry has icon and color', () => {
    GENERATION_TYPES.forEach(type => {
      expect(type).toHaveProperty('icon')
      expect(type).toHaveProperty('color')
    })
  })

  it('includes agenda, speech, poster, gifts', () => {
    const values = GENERATION_TYPES.map(t => t.value)
    expect(values).toContain('agenda')
    expect(values).toContain('speech')
    expect(values).toContain('poster')
    expect(values).toContain('gifts')
  })
})

describe('MEETING_DURATIONS', () => {
  it('all duration values are numeric strings', () => {
    MEETING_DURATIONS.forEach(d => {
      expect(parseFloat(d.value)).toBeGreaterThan(0)
    })
  })
})

describe('ATTENDEE_COUNTS', () => {
  it('all count values are numeric strings', () => {
    ATTENDEE_COUNTS.forEach(a => {
      expect(parseInt(a.value)).toBeGreaterThan(0)
    })
  })
})

describe('BUDGET_RANGES', () => {
  it('has at least one entry', () => {
    expect(BUDGET_RANGES.length).toBeGreaterThan(0)
  })

  it('each entry has label and value', () => {
    BUDGET_RANGES.forEach(b => {
      expect(b).toHaveProperty('label')
      expect(b).toHaveProperty('value')
    })
  })
})

describe('EXPORT_FORMATS', () => {
  it('supports pdf, docx, image', () => {
    const values = EXPORT_FORMATS.map(f => f.value)
    expect(values).toContain('pdf')
    expect(values).toContain('docx')
    expect(values).toContain('image')
  })

  it('each entry has mimeType', () => {
    EXPORT_FORMATS.forEach(f => {
      expect(f).toHaveProperty('mimeType')
      expect(f.mimeType).toBeTruthy()
    })
  })
})

describe('APP_CONFIG', () => {
  it('has required fields', () => {
    expect(APP_CONFIG).toHaveProperty('name')
    expect(APP_CONFIG).toHaveProperty('version')
    expect(APP_CONFIG).toHaveProperty('description')
  })

  it('name is non-empty string', () => {
    expect(typeof APP_CONFIG.name).toBe('string')
    expect(APP_CONFIG.name.length).toBeGreaterThan(0)
  })
})

describe('API_CONFIG', () => {
  it('has valid timeout', () => {
    expect(API_CONFIG.timeout).toBeGreaterThan(0)
  })

  it('has valid maxRetries', () => {
    expect(API_CONFIG.maxRetries).toBeGreaterThan(0)
  })

  it('has valid retryDelay', () => {
    expect(API_CONFIG.retryDelay).toBeGreaterThan(0)
  })
})

describe('STORAGE_KEYS', () => {
  it('all keys are non-empty strings', () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      expect(typeof key).toBe('string')
      expect(key.length).toBeGreaterThan(0)
    })
  })

  it('all keys are unique', () => {
    const values = Object.values(STORAGE_KEYS)
    const unique = new Set(values)
    expect(unique.size).toBe(values.length)
  })
})

describe('ROUTES', () => {
  it('HOME route is /', () => {
    expect(ROUTES.HOME).toBe('/')
  })

  it('LOGIN route is /login', () => {
    expect(ROUTES.LOGIN).toBe('/login')
  })

  it('MEETING_DETAIL generates correct path', () => {
    expect(ROUTES.MEETING_DETAIL('123')).toBe('/meetings/123')
  })

  it('DASHBOARD route is /dashboard', () => {
    expect(ROUTES.DASHBOARD).toBe('/dashboard')
  })
})

describe('ERROR_MESSAGES', () => {
  it('all messages are non-empty strings', () => {
    Object.values(ERROR_MESSAGES).forEach(msg => {
      expect(typeof msg).toBe('string')
      expect(msg.length).toBeGreaterThan(0)
    })
  })

  it('has required error types', () => {
    expect(ERROR_MESSAGES).toHaveProperty('NETWORK_ERROR')
    expect(ERROR_MESSAGES).toHaveProperty('AUTH_ERROR')
    expect(ERROR_MESSAGES).toHaveProperty('API_ERROR')
  })
})

describe('SUCCESS_MESSAGES', () => {
  it('all messages are non-empty strings', () => {
    Object.values(SUCCESS_MESSAGES).forEach(msg => {
      expect(typeof msg).toBe('string')
      expect(msg.length).toBeGreaterThan(0)
    })
  })

  it('has login success message', () => {
    expect(SUCCESS_MESSAGES).toHaveProperty('LOGIN_SUCCESS')
  })
})
