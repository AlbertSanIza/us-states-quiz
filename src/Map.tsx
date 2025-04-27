import { geoAlbersUsa, geoPath, select } from 'd3'
import { FeatureCollection } from 'geojson'
import { useEffect, useRef, useState } from 'react'
import { feature } from 'topojson-client'
import { Topology } from 'topojson-specification'

const WIDTH = 800
const HEIGHT = 600

export default function Map() {
    const ref = useRef<SVGSVGElement>(null)
    const [geoJson, setGeoJson] = useState<FeatureCollection>()

    useEffect(() => {
        fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json')
            .then((res) => res.json())
            .then((topology: Topology) => {
                const gj = feature(topology, topology.objects.states)
                if (gj.type === 'FeatureCollection') {
                    setGeoJson(gj)
                }
            })
    }, [])

    useEffect(() => {
        if (!geoJson) {
            return
        }
        const svg = select(ref.current)
        svg.selectAll('*').remove()
        const projection = geoAlbersUsa().fitSize([WIDTH, HEIGHT], geoJson)
        const path = geoPath(projection)
        svg.selectAll('path')
            .data(geoJson.features)
            .enter()
            .append('path')
            .attr('d', path as any)
            .attr('fill', '#eee')
            .attr('stroke', '#333')
            .on('click', (event, d) => {
                // Placeholder for click handler
            })
    }, [geoJson])

    return <svg ref={ref} width="100%" height="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ display: 'block', width: '100%', height: '100%' }} />
}
