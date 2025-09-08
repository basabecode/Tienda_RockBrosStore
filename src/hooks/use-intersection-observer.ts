import * as React from 'react'

type Args = {
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
}

export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  { root = null, rootMargin = '0px', threshold = 0 }: Args = {}
) {
  const [isIntersecting, setIsIntersecting] = React.useState(false)

  React.useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          setIsIntersecting(entry.isIntersecting)
        })
      },
      { root, rootMargin, threshold }
    )

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [ref, root, rootMargin, threshold])

  return isIntersecting
}
