class ResponseHandler {
    handle(response, handleSuccess, errorMessage) {
        if (!response.errorStatus) {
            handleSuccess(response)
        } else {
            alert(errorMessage)
        }
    }
}

export const responseHandler = new ResponseHandler()