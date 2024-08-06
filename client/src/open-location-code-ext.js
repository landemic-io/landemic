import {OpenLocationCode} from 'open-location-code'

class OpenLocationCodeExt extends OpenLocationCode {

    between = (code1, code2) => {
        const area1 = this.decode(code1)
        const area2 = this.decode(code2)

        let x1 = area1.latitudeCenter
        let x2 = area2.latitudeCenter

        let y1 = area1.longitudeCenter
        let y2 = area2.longitudeCenter

        if (x2 < x1) {
            const tempx = x1
            x1 = x2
            x2 = tempx
        }
        if (y2 < y1) {
            const tempy = y1
            y1 = y2
            y2 = tempy
        }

        const inc = .001

        let codes = [code1, code2]

        for (let x = x1; x <= x2; x += inc) {
            for (let y = y1; y <= y2; y += inc) {
                const code = this.encode(x, y, 8)
                if (!codes.includes(code)) codes.push(code)
            }
        }

        return codes
    }
}

export default OpenLocationCodeExt
