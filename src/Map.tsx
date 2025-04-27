import { geoAlbersUsa, geoPath, select } from 'd3'
import { useEffect, useRef, useState } from 'react'
import { feature } from 'topojson-client'

const WIDTH = 660
const HEIGHT = 660

export default function Map() {
    const ref = useRef<SVGSVGElement>(null)
    const [states, setStates] = useState<any[]>([])

    useEffect(() => {
        fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json')
            .then((res) => res.json())
            .then((us) => {
                const geojson = feature(us, us.objects.states)
                console.log('🚀 ~ .then ~ geojson:', geojson)
                setStates(geojson.features)
            })
    }, [])

    useEffect(() => {
        if (states.length > 0) {
        }
        const svg = select(ref.current)
        svg.selectAll('*').remove()
        const projection = geoAlbersUsa().fitSize([WIDTH, HEIGHT], { type: 'FeatureCollection', features: states })
        const path = geoPath(projection)
        svg.selectAll('path')
            .data(states)
            .enter()
            .append('path')
            .attr('d', path as any)
            .attr('fill', '#eee')
            .attr('stroke', '#333')
            .on('click', (event, d) => {
                // Placeholder for click handler
            })
    }, [states])

    return <svg ref={ref} width={WIDTH} height={HEIGHT} />
}
