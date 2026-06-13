const errorMiddleware = (error, req, resp, next) => {
    
    console.log("An Error Occured: ", error.message)
    console.error(error)

    const statusCode = error.status || 500
    const user_warning = error.user_warning
    resp.status(statusCode).json({
        success: false,
        msg: error.message,
        user_warning
    })
}
export default errorMiddleware;