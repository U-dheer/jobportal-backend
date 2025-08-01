import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
    provide: 'CLOUDINARY',
    useFactory: () => {
        return cloudinary.config({
            cloud_name: 'diuxlld62',
            api_key: '717738974916236',
            api_secret: '7ZOrOZGPEsnY5kA0nHLtjlQOI_g',
        });
    },
}; 