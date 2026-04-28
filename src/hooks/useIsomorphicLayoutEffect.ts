import { useEffect, useLayoutEffect } from 'react'

// useLayoutEffect throws a warning on the server; this resolves it
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export default useIsomorphicLayoutEffect
