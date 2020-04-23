module.exports = arrayAsString => {
    return arrayAsString.split(',').map( techs => techs.trim() )

}
