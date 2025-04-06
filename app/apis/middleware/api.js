export const apiMiddleware = handler => async (req, res) => {
    try {
      // Set common headers
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30')
  
      // Handle preflight requests
      if (req.method === 'OPTIONS') {
        return res.status(200).end()
      }
  
      await handler(req, res)
  
    } catch (error) {
      console.error('API Error:', error)
      res.status(500).json({ 
        error: error.message || 'Internal server error',
        code: error.code
      })
    }
  }
  
  // Wrap your API handlers:
  // export default apiMiddleware(handler)