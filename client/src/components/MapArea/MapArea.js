import React, { Component } from 'react'
import { Switch, Route, withRouter } from "react-router-dom";
import queryString from 'query-string/index';
import {Map, Polygon, GoogleApiWrapper} from 'google-maps-react'
import {Field, Form} from 'react-final-form';
import Color from 'color'
import Tile from '../../Tile.js'
import './styles.scss';
import Sidebar from "../Sidebar";
import FullScreenButton from './components/FullScreenButton';
import TileInfoRouter from "../TileInfoRouter";
import MapLoading from "./components/MapLoading";
import Defi from '../Defi';

const sumArrays = (a, b) => {
    return a.map((value, index) => value + b[index])
}

const subArrays = (a, b) => {
    return a.map((value, index) => value - b[index])
}

const aveArray = (a, childCount) => {
    if (childCount === 0) {
        return a.map(value => value)
    }
    return a.map(value => Math.floor(value / childCount))
}

const codePartToNumber = (code) => {
    const languageMap = {
        '2': '0',
        '3': '1',
        '4': '2',
        '5': '3',
        '6': '4',
        '7': '5',
        '8': '6',
        '9': '7',
        'C': '8',
        'F': '9',
        'G': 'A',
        'H': 'B',
        'J': 'C',
        'M': 'D',
        'P': 'E',
        'Q': 'F',
        'R': 'G',
        'V': 'H',
        'W': 'I',
        'X': 'J'
    }
    return parseInt(code.split('').map(digit => languageMap[digit]).join(''), 20)
}

const codeToNumberCoords = (code) => {
    const y = `${code[0]}${code[2] || ''}${code[4] || ''}${code[6] || ''}`
    const x = `${code[1]}${code[3] || ''}${code[5] || ''}${code[7] || ''}`
    return {
        x: codePartToNumber(x),
        y: codePartToNumber(y)
    }
}

const numberToCode = (number, detailsLevel) => {
    const languageMap = {
        '0': '2',
        '1': '3',
        '2': '4',
        '3': '5',
        '4': '6',
        '5': '7',
        '6': '8',
        '7': '9',
        '8': 'C',
        '9': 'F',
        'A': 'G',
        'B': 'H',
        'C': 'J',
        'D': 'M',
        'E': 'P',
        'F': 'Q',
        'G': 'R',
        'H': 'V',
        'I': 'W',
        'J': 'X'
    }
    return `000${number.toString(20)}`
        .slice(-detailsLevel)
        .toUpperCase()
        .split('')
        .map(digit => languageMap[digit])
        .join('')
}

const numberCoordsToCode = ({x, y}, detailsLevel) => {
    const lat = numberToCode(y, detailsLevel)
    const lng = numberToCode(x, detailsLevel)
    return `${lat[0]}${lng[0]}${lat[1] || ''}${lng[1] || ''}${lat[2] || ''}${lng[2] || ''}${lat[3] || ''}${lng[3] || ''}`
}

const MAX_TILES_TO_RENDER = 35000

export class MapArea extends Component {
    constructor(props) {
        super(props);
        const { lat, lng } = queryString.parse(props.location.search);

        this.state = {
            shifted: false,
            mapBounds: undefined,
            zoom: 14,
            initialCenter: (lat && lng) ? { lat, lng } : { lat: 40.715665, lng: -74.000195 },
            center: undefined,
            isFullScreen: false,
            loading: true,
            googleSearchValue: ''
        }

        // Polygons for all the owned tiles, for 4 different details level.
        this.polygonTree = {
            // '87': {
            //     'G8': {
            //         'Q2': {
            //             '2X': {
            //                 rgb: [0, 0, 0],
            //                 polygon: Polygon
            //             },
            //             rgbSums: [0, 0, 0],
            //             childCount: 0,
            //             polygon: Polygon
            //         }
            //         rgbSums: [0, 0, 0],
            //         childCount: 0,
            //         polygon: Polygon
            //     },
            //     rgbSums: [0, 0, 0],
            //     childCount: 0,
            //     polygon: Polygon
            // }
        }
        this.boundsStopped = setTimeout(() => {}, 0)
        this.tilesProcessed = 0

        this.handleKey = this.handleKey.bind(this) // breaking convention here because we need to reference it in removeListener
    }

    onMapSelect = (coords) => {

        const { olc } = this.props
        const code = olc.encode(coords.lat(), coords.lng(), 8)
        let codes = this.props.selectedCodes.slice(0) // copy

        if (this.state.shifted) {
            if (codes.includes(code))
                codes = codes.filter(e => e !== code)
            else if (codes.length < 25)
                codes.push(code)
            else
                return
        } else {
            if (codes.includes(code))
                codes = []
            else
                codes = [code]
        }

        if (codes.length > 0) {
            this.props.history.push(`/buy/${codes.join(',')}`);
            this.props.setSelectedCodes(codes);
        } else {
            this.props.history.push(`/`);
        }
    }

    getPolygon = (tree, code) => {
        if (code.length < 2) {
            return tree.polygon
        }
        const innerTree = tree[code.slice(0, 2)]
        if (!innerTree) {
            return null
        }
        return this.getPolygon(innerTree, code.slice(2))
    }

    renderPolygons = (southWest, northEast, detailsLevel = null) => {
        const olc = this.props.olc
        const polygons = []
        // Might be more than 2 longitude overlaps.
        if (this.state.zoom <= 4) {
            for (const key in this.polygonTree) {
                polygons.push(this.polygonTree[key].polygon)
            }
            return polygons
        }
        const southWestCode = olc.encode(southWest.lat, southWest.lng, 8)
        const southEastCode = olc.encode(southWest.lat, northEast.lng, 8)
        const northWestCode = olc.encode(northEast.lat, southWest.lng, 8)
        const southWestCoords = codeToNumberCoords(southWestCode)
        const southEastCoords = codeToNumberCoords(southEastCode)
        let maxWidth = southEastCoords.x - southWestCoords.x + 1
        let maxHeight = codeToNumberCoords(northWestCode).y - southWestCoords.y + 1
        let overlap = maxWidth < 0
        if (overlap) {
            // VXXX is the maximum eastern latitude, overlapping point.
            maxWidth = codeToNumberCoords('2V2X2X2X').x - southWestCoords.x + southEastCoords.x
        }
        if (!detailsLevel) {
            detailsLevel = 4
            for (let i = 0; i < 3; i++) {
                if ((maxWidth * maxHeight) <= MAX_TILES_TO_RENDER) {
                    break
                }
                maxWidth = Math.ceil(maxWidth / 20)
                maxHeight = Math.ceil(maxHeight / 20)
                detailsLevel--
            }
        } else {
            const divisor = 20 ** (4 - detailsLevel)
            maxWidth = Math.ceil(maxWidth / divisor)
            maxHeight = Math.ceil(maxHeight / divisor)
        }
        if (overlap) {
            // Render left part, then right part, then concat.
            return this.renderPolygons(southWest, {lat: northEast.lat, lng: 179.999}, detailsLevel)
                .concat(this.renderPolygons({lat: southWest.lat, lng: -179.999}, northEast, detailsLevel))
        }
        const targetSWNumberCoords = codeToNumberCoords(southWestCode.slice(0, detailsLevel * 2))
        for (let w = 0; w < maxWidth; w++) {
            for (let h = 0; h < maxHeight; h++) {
                const polygon = this.getPolygon(
                    this.polygonTree,
                    numberCoordsToCode({
                        x: targetSWNumberCoords.x + w,
                        y: targetSWNumberCoords.y + h
                    }, detailsLevel)
                )
                if (polygon) {
                    polygons.push(polygon)
                }
            }
        }
        return polygons
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        const tiles = nextProps.tiles
        if (this.tilesProcessed !== tiles.length) {
            const newTiles = tiles.slice(this.tilesProcessed)
            this.tilesProcessed = tiles.length
            this.processTiles(newTiles)
            return true
        }
        // if (!Object.is(this.state.center, nextState.center)) {
        //     return true;
        // }
        //
        // if (!Object.is(this.props.transactionStackOngoing, nextProps.transactionStackOngoing)) {
        //     return true;
        // }
        // if (!Object.is(this.props.transactionStack, nextProps.transactionStack)) {
        //     return true;
        // }
        // if (!Object.is(this.props.transactions, nextProps.transactions)) {
        //     return true;
        // }
        // if (!Object.is(this.props.contract, nextProps.contract)) {
        //     return true;
        // }
        // if (!Object.is(this.props.account, nextProps.account)) {
        //     return true;
        // }
        //
        // if (this.props.selected !== nextProps.selected) {
        //     return true
        // }
        // if (!this.state.mapBounds && !nextState.mapBounds) {
        //     return true;
        // }
        // if (!Object.is(this.state.mapBounds, nextState.mapBounds)) {
        //     return true;
        // }
        return true
    }

    handleKey(event) {
        if (event.type === "keyup" && event.keyCode === 16)
            this.setState({shifted: false})
        else if (event.type === "keydown" && event.keyCode === 16)
            this.setState({shifted: true})
    }

    componentDidMount() {

        const { google } = this.props;
        this.googleSearchBox = new google.maps.places.SearchBox(this.searchBox);
        this.searchBoxListener = this.googleSearchBox.addListener('places_changed', this.handleSearch);
        document.addEventListener("keydown",this.handleKey,false)
        document.addEventListener("keyup",this.handleKey,false)
    }

    componentWillUnmount() {
        const { google } = this.props;
        google.maps.event.removeListener(this.searchBoxListener);
        document.removeEventListener("keydown",this.handleKey,false)
        document.removeEventListener("keyup",this.handleKey,false)
    }

    handleSearch = () => {
        const address = this.googleSearchBox.getPlaces()[0];
        if (!address || !address.name.length) { return; }
        const center = {
            lat: address.geometry.location.lat(),
            lng: address.geometry.location.lng()
        };

        this.setState({ center, googleSearchValue: address.name }, () => {
            this.searchForm.form.mutators.setSearch();
        });
        this.props.setSelectedCodes([]);
        this.props.history.push('/');
    }

    onBoundsChanged = (props, map, event) => {
        clearTimeout(this.boundsStopped)
        this.boundsStopped = setTimeout(() => {
            this.setState({ mapBounds: map.getBounds(), zoom: map.zoom })
        }, 100)
    }

    onPlotClick = (props, polygon, event) => {
        this.onMapSelect(event.latLng)
    }

    polygonForCodeArea(area, color, cursorBool, key) {
        const maxLat = 85.05115 // https://stackoverflow.com/questions/11849636/maximum-lat-and-long-bounds-for-the-world-google-maps-api-latlngbounds
        if (area.latitudeHi > maxLat)
            area.latitudeHi = maxLat
        else if (area.latitudeLo < -1 * maxLat)
            area.latitudeLo = -1 * maxLat

        const rectBounds = [
            {lat: area.latitudeLo, lng: area.longitudeLo},
            {lat: area.latitudeLo, lng: area.longitudeHi},
            {lat: area.latitudeHi, lng: area.longitudeHi},
            {lat: area.latitudeHi, lng: area.longitudeLo}
        ]

        let stroke, fill
        stroke = fill = new Color(color)
        if (cursorBool && stroke.luminosity() > .5) {
            stroke = stroke.darken(.5)
        }

        fill = fill.saturate(1)

        return <Polygon
            paths={rectBounds}
            strokeColor={stroke.hex()}
            strokeOpacity={cursorBool ? 1 : .7}
            strokeWeight={cursorBool ? 2 : 0}
            fillColor={key.includes('selected') ? 'rgba(0, 0, 0, 0)' : fill.hex()}
            fillOpacity={cursorBool ? .5 : .39}
            key={key}
            onClick={this.onPlotClick}
        />
    }

    polygonForTile(code, tile) {
        return this.polygonForCodeArea(
            tile.area,
            tile.color,
            tile.cursorBool,
            `${code}${tile.color}`
        )
    }

    tileForCode = (code, color, cursorBool) => {
        const olc = this.props.olc
        if (code.length > 8) {
            return new Tile(olc.decode(code), color, cursorBool)
        }
        const areaLongtitudeLoLatitudeHi = olc.decode(`${code}X2X2X2`.slice(0, 8) + '+')
        const areaLongtitudeHiLatitudeLo = olc.decode(`${code}2X2X2X`.slice(0, 8) + '+')
        const area = {
            longitudeLo: areaLongtitudeLoLatitudeHi.longitudeLo,
            latitudeHi: areaLongtitudeLoLatitudeHi.latitudeHi,
            longitudeHi: areaLongtitudeHiLatitudeLo.longitudeHi,
            latitudeLo: areaLongtitudeHiLatitudeLo.latitudeLo
        }
        return new Tile(area, color, cursorBool)
    }

    polygonForCode = (code, color, cursorBool) => {
        return this.polygonForTile(code, this.tileForCode(code, color, cursorBool))
    }

    averageColor = (rgbSums, childCount) => {
        return '#' + aveArray(rgbSums, childCount).map(value => `0${value.toString(16)}`.slice(-2)).join('')
    }

    processTiles = (newTiles) => {
        for (const {code, tile} of newTiles) {
            const codeParts = code.match(/^(..)(..)(..)(..)/).slice(1, 5)
            const rgb = tile.color.match(/^#(..)(..)(..)/).slice(1, 4).map(hex => parseInt(hex, 16))
            let levels = [null, null, null, null]
            if (!this.polygonTree[codeParts[0]]) {
                this.polygonTree[codeParts[0]] = {rgbSums: [0, 0, 0], childCount: 0}
            }
            levels[0] = this.polygonTree[codeParts[0]]
            if (!this.polygonTree[codeParts[0]][codeParts[1]]) {
                this.polygonTree[codeParts[0]][codeParts[1]] = {rgbSums: [0, 0, 0], childCount: 0}
            }
            levels[1] = this.polygonTree[codeParts[0]][codeParts[1]]
            if (!this.polygonTree[codeParts[0]][codeParts[1]][codeParts[2]]) {
                this.polygonTree[codeParts[0]][codeParts[1]][codeParts[2]] = {rgbSums: [0, 0, 0], childCount: 0}
            }
            levels[2] = this.polygonTree[codeParts[0]][codeParts[1]][codeParts[2]]
            levels[3] = this.polygonTree[codeParts[0]][codeParts[1]][codeParts[2]][codeParts[3]]
            if (!levels[3]) {
                levels[3] = {rgb: [0, 0, 0]}
                this.polygonTree[codeParts[0]][codeParts[1]][codeParts[2]][codeParts[3]] = levels[3]
                levels[0].childCount++
                levels[1].childCount++
                levels[2].childCount++
            } else {
                levels[0].rgbSums = subArrays(levels[0].rgbSums, levels[3].rgb)
                levels[1].rgbSums = subArrays(levels[1].rgbSums, levels[3].rgb)
                levels[2].rgbSums = subArrays(levels[2].rgbSums, levels[3].rgb)
            }
            levels[0].rgbSums = sumArrays(levels[0].rgbSums, rgb)
            levels[1].rgbSums = sumArrays(levels[1].rgbSums, rgb)
            levels[2].rgbSums = sumArrays(levels[2].rgbSums, rgb)
            levels[3].rgb = rgb

            levels[3].polygon = this.polygonForTile(code, tile)
            levels[2].polygon = this.polygonForCode(codeParts.slice(0, 3).join(''), this.averageColor(levels[2].rgbSums, levels[2].childCount), false)
            levels[1].polygon = this.polygonForCode(codeParts.slice(0, 2).join(''), this.averageColor(levels[1].rgbSums, levels[1].childCount), false)
            levels[0].polygon = this.polygonForCode(codeParts.slice(0, 1).join(''), this.averageColor(levels[0].rgbSums, levels[0].childCount), false)
        }
        this.setState({ loading: false });
    }

    renderSelectedTiles = (codes) => {

        const hex = this.props.account ? "#" + this.props.account.slice(-6) : '#025089';

        return codes.map((code) => {
            const tile = new Tile(this.props.olc.decode(code), hex, true)
            return this.polygonForCodeArea(
                tile.area,
                tile.color,
                tile.cursorBool,
                `selected${code}${tile.color}`
            )
        })
    }

    setCurrentCenter = (mapProps, map) => {
        this.props.setCurrentCenter({ lat: map.center.lat(), lng: map.center.lng() });
    }

    handleSubmit = ({ search }) => {
        const searchValue = search.trim();
        const placesService = new this.props.google.maps.places.PlacesService(this.map);
        const isCode = searchValue.length === 9 && searchValue[searchValue.length - 1] === '+';
        placesService.findPlaceFromQuery({ query: search, fields: ['geometry'] }, (results, status) => {
            if (status !== this.props.google.maps.places.PlacesServiceStatus.OK) { return; }
            if (!results || !results[0]) { return; }
            const { geometry } = results[0];
            const center = {
                lat: geometry.location.lat(),
                lng: geometry.location.lng() + (isCode ? 0.01 : 0)
            };

            this.setState({ center });

            if (isCode) {
                this.props.setSelectedCodes([searchValue]);
                this.props.history.push(`/buy/${searchValue}`);
            } else {
                this.props.setSelectedCodes([]);
                this.props.history.push(`/`);
            }
        });
    };

    selectCode = (code) => {
        this.handleSubmit({ search: code });
        this.props.setSelectedCodes([code]);
        this.props.history.push(`/buy/${code}`);
    };

    handleFullScreenClick = () => {
        this.setState({ isFullScreen: !this.state.isFullScreen });
    }

    render() {

        const { google } = this.props
        const mapBounds = this.state.mapBounds
        const polygons = !mapBounds ? [] : this.renderPolygons(
            {lat: mapBounds.getSouthWest().lat(), lng: mapBounds.getSouthWest().lng()},
            {lat: mapBounds.getNorthEast().lat(), lng: mapBounds.getNorthEast().lng()}
        )

        const center = this.state.center || this.state.initialCenter;

        return (
            <div className='tiles'>
                <Sidebar 
                    myTiles={this.props.myTiles}
                    account={this.props.account}                    
                    selectCode={this.selectCode}
                    loading={this.state.loading}
                    transactionStackOngoing={this.props.transactionStackOngoing}
                    transactions={this.props.transactions}
                    transactionStack={this.props.transactionStack}
                    myTilesAmount={this.props.myTilesAmount}
                    dataJSON={this.props.dataJSON}
                  />

                <div className='map-wrapper'>

                    <div className='map-wrapper-header'>
                          <Form
                            onSubmit={this.handleSubmit}
                            ref={(ref) => this.searchForm = ref}
                            mutators={{
                                setSearch: (args, state, { changeValue }) => {
                                    changeValue(state, 'search', () => this.state.googleSearchValue)
                                },
                            }}
                            render={({handleSubmit, pristine, invalid}) => (
                              <form onSubmit={handleSubmit}>

                                  <Field
                                    name='search'
                                    render={({ input }) => (
                                      <input
                                        {...input}
                                        ref={(ref) => this.searchBox = ref}
                                        placeholder='Enter a landmark, street address, or Plus Code'
                                      />
                                    )}
                                  />
                                  <button type="submit" disabled={pristine || invalid}>Search</button>
                              </form>
                            )}
                          />
                      </div>

                      <div className={`map ${this.state.isFullScreen ? 'full-screen' : ''}`}>
                          {this.state.loading && <MapLoading />}
                          <FullScreenButton onClick={this.handleFullScreenClick} isFullScreen={this.state.isFullScreen} />

                          <Map
                            className={`google-map ${this.state.loading ? 'loading' : ''}`}
                            onReady={(props, map) => this.map = map}
                            onClick={(props, map, event) => this.onMapSelect(event.latLng)}
                            onBounds_changed={(props, map, event) => this.onBoundsChanged(props, map, event)}
                            onDragend={this.setCurrentCenter}
                            center={center}
                            google={google}
                            zoom={14}
                            zoomControl={true}
                            disableDoubleClickZoom={true}
                            initialCenter={this.state.initialCenter}
                            fullscreenControl={false}
                            streetViewControl={false}
                            mapTypeControl={false}
                          >
                              {polygons}
                              {this.props.selectedCodes.length > 0 && this.renderSelectedTiles(this.props.selectedCodes)}
                          </Map>

                          <Switch>
                            <Route exact path='/defi' render={({ match }) => (
                              <Defi />
                            )} />
                          </Switch>

                          <TileInfoRouter
                            account={this.props.account}
                            contract={this.props.contract}
                            metadataForToken={this.props.contract.metadataForToken}
                            defaultMultiple={this.props.defaultMultiple}
                            grabCodes={(codes, wei) => {this.props.grabCodes(codes, wei)}}
                            setTransactionStackOngoing={this.props.setTransactionStackOngoing}
                            transactionStackOngoing={this.props.transactionStackOngoing}
                            transactions={this.props.transactions}
                            transactionStack={this.props.transactionStack}
                            onClose={this.props.onClose}
                            dataJSON={this.props.dataJSON}
                          />
                      </div>
                  </div>
              </div>
        )
    }
}

var apiKey = 'AIzaSyCk3em0Xd-WvCzKMW7HgEklrNCfGoKlKfg'
if (process.env.REACT_APP_GOOGLE_MAPS_KEY)
    apiKey = process.env.REACT_APP_GOOGLE_MAPS_KEY

export default withRouter(GoogleApiWrapper({
    apiKey: (apiKey)
})(MapArea));
