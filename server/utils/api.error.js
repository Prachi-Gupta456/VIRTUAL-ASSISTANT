class ApiError extends Error{
     
    constructor(status,message,user_warning=false){
        super(message)
        this.status = status
        this.user_warning = user_warning
    }
}

export default ApiError;