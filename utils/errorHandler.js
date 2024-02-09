exports.errorHandler = (err, req, res, next) => {
    console.log('Error occured:', err)
    const {message, status} = err
    res.status(status||400).json({message})
}