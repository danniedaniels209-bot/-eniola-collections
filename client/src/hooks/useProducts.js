import { useEffect, useState } from 'react'
import { api } from '../services/api'

// Generic product fetch hook. Pass a query string like 'newArrival=true&limit=8'.
export function useProducts(query = '') {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    setLoading(true)
    api
      .get(`/products${query ? `?${query}` : ''}`)
      .then((d) => alive && setItems(d.items || []))
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [query])

  return { items, loading, error }
}
