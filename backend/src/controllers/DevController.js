const axios = require('axios')
const parseStringAsArray = require('../utils/parseStringAsArray')
const { findConnections, sendMessage } = require('../websocket')

const Dev = require('../models/Dev')

module.exports = {
    async index( request, response ) {
        const devs = await Dev.find()

        response.json(devs)
    },

    async store( request, response ) {
        const { github_username, techs, latitude, longitude } = request.body

        let dev = await Dev.findOne({ github_username })

        if( !dev ) {
            const apiResponse = await axios.get(`https://api.github.com/users/${ github_username }`)

            const { login, avatar_url, bio } = apiResponse.data
            let name = apiResponse.data.name

            if( !name ) {
                name = login
            }

            const techsArray = parseStringAsArray(techs)

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            }

            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            })

            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray,
              )

            sendMessage(sendSocketMessageTo, 'new-dev', dev)
        }

        return response.json(dev)
    }
}