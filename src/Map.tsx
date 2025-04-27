import { select } from 'd3'
import { useEffect, useRef } from 'react'

const WIDTH = 660
const HEIGHT = 660

export default function Map() {
    const ref = useRef<SVGSVGElement>(null)

    useEffect(() => {
        const svg = select(ref.current)
    }, [])

    return <svg ref={ref} width={WIDTH} height={HEIGHT} />
}
