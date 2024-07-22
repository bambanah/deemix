import { aggregateDownloadLinks } from '../../../src/utils/downloads'

describe('download utils', () => {
  describe('aggregateDownloadLinks', () => {
    it('merges links into a single string', () => {
      const release = { link: 'abcde' }
      const aggregated = aggregateDownloadLinks([release, release])

      expect(aggregated).toBe('abcde;abcde')
    })
  })
})
