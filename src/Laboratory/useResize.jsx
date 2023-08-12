import {
  useEffect,
  useState,
} from 'react';

export default function useResize () {
    const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight })
    useEffect(() => {
        const updateSize = () => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight
            })}
        window.addEventListener('resize', updateSize)
        return () => window.removeEventListener('resize', updateSize)
    }, [window, setSize])
    return size
}