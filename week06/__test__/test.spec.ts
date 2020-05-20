import { matchString } from '../work'

describe('week06', function() {
  test('状态机处理匹配abababx', () => {
    expect(matchString('abababx')).toBe(true);
    expect(matchString('afbdfdfeafdfa')).toBe(false)
  })
})