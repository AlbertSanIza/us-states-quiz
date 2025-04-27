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
    const { started, finished, answeredStates, answerState, setStates } = useGameStore()

    useEffect(() => {
        fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json')
            .then((res) => res.json())
            .then((topology: Topology) => {
                const gj = feature(topology, topology.objects.states)
                if (gj.type === 'FeatureCollection') {
                    setGeoJson(gj)
                    setStates(gj.features.map((feature) => feature.properties?.name || '').filter(Boolean))
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
                answeredStates[data.properties?.name] === 'correct' ? 'green' : answeredStates[data.properties?.name] === 'incorrect' ? 'red' : 'black'
            )
            .attr('stroke', 'white')
            .attr('stroke-width', 0.5)
            .style('cursor', started && !finished ? 'pointer' : 'default')
            .on('click', (_, data) => answerState(data.properties?.name))
    }, [geoJson, started, finished, answeredStates, answerState])

    return <svg className="size-full" ref={ref} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} />
}
