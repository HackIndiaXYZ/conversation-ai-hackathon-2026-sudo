export default function errorHandler(err, req, res, next) {
  console.error(err.stack)

  const status = err.status || 500
  const payload = {
    status,
    error: err.message || 'Internal server error',
  }

  if (process.env.NODE_ENV !== 'production' && err.detail) {
    payload.detail = err.detail
  }

  res.status(status).json(payload)
}
