import cloudinary from "../config/cloudinary.js"

const uploadOnCloudinary = async (file) => {

    const uploadResult = await new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream({ folder: "uploads" }, (error, result) => {

            if (error) {
                return reject(error)
            }

            resolve(result)
        })

        stream.end(file.buffer)
    })

    return uploadResult.secure_url
}

export default uploadOnCloudinary;