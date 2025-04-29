import { geoAlbersUsa, geoPath, select } from 'd3'
import { FeatureCollection } from 'geojson'
import { useEffect, useRef, useState } from 'react'
import { feature } from 'topojson-client'
import { Topology } from 'topojson-specification'

import { useGameStore } from './lib/store'

const WIDTH = 1000
const HEIGHT = 500

export default function Map() {
    const ref = useRef<SVGSVGElement>(null)
    const [geoJson, setGeoJson] = useState<FeatureCollection>()
    const { started, finished, answered, answer } = useGameStore()

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
        svg.append('g')
            .selectAll('path')
            .data(geoJson.features)
            .join('path')
            .attr('d', path)
            .attr('fill', (data) =>
                answered[data.properties?.name] === 'correct'
                    ? 'oklch(84.1% 0.238 128.85)' // Green
                    : answered[data.properties?.name] === 'incorrect'
                      ? 'oklch(63.7% 0.237 25.331)' // Red
                      : 'black'
            )
            .attr('stroke', 'oklch(58.8% 0.158 241.966)')
            .attr('stroke-width', 1)
            .style('cursor', (data) => (started && !finished && !answered[data.properties?.name] ? 'pointer' : 'default'))
            .on('click', (_, data) => started && !finished && !answered[data.properties?.name] && answer(data.properties?.name))
            .on('mouseover', function (_, data) {
                if (started && !finished && !answered[data.properties?.name]) {
                    select(this).attr('fill', 'oklch(82.8% 0.111 230.318)')
                }
            })
            .on('mouseout', function (_, data) {
                if (started && !finished && !answered[data.properties?.name]) {
                    select(this).attr('fill', 'black')
                }
            })
    }, [geoJson, started, finished, answered, answer])

    return <svg className="size-full" ref={ref} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} />
}
