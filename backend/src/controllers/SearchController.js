const Dev = require('../models/Dev')
const parseStringAsArray = require('../utils/parseStringAsArray')

module.exports = {
    async update( request, response ) {

        const github_username = request.query.github_username
        const dev = await Dev.findOne({ github_username })

        let { name, techs, avatar_url, bio, latitude, longitude } = request.query

        if( !name )
            name = dev.name
        
        if( !techs )
            techs = dev.techs

        if( !avatar_url )
            avatar_url = dev.avatar_url

        if( !bio )
            bio = dev.bio

        if( !longitude )
            longitude = dev.location.coordinates[0]
        
        if( !latitude )
            latitude = dev.location.coordinates[1]
            

        const location = {
            type: 'Point',
            coordinates: [longitude, latitude]
        }

        const techsArray = parseStringAsArray(techs)

        await dev.updateOne({ name: name })
        await dev.updateOne({ techs: techsArray })
        await dev.updateOne({ avatar_url: avatar_url })
        await dev.updateOne({ bio: bio })
        await dev.updateOne({ location: location })

        return response.json({ dev })
    },
    async destroy( request, response ) {
        const github_username = request.query.github_username

        const dev = await Dev.findOne({ github_username })

        await dev.remove()

        return response.json({ message: "Deletado com sucesso!" })
    },

    async index( request, response ) {
        const { latitude, longitude, techs } = request.query

        const techsArray = parseStringAsArray(techs)

        const devs = await Dev.find({
            techs: {
                $in: techsArray,
            },
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: 10000
                }
            }
        })

        return response.json(devs)
    }
}