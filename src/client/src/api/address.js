import axios from 'axios'

const provinceAPIUrl = 'https://vapi.vnappmob.com'

class Address {

    getProvince(){
        return axios({
            method: "GET",
            url: `${provinceAPIUrl}/api/province`
        })
    }
    getDistrict(provinceId){
        return axios({
            method: "GET",
            url: `${provinceAPIUrl}/api/province/district/${provinceId}`
        })
    }
    getWard(districtId){
        return axios({
            method: "GET",
            url: `${provinceAPIUrl}/api/province/ward/${districtId}`
        })
    }
}

export default new Address()