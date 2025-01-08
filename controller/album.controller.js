const Album = require('../models/Album.models');
const jwt = require('jsonwebtoken');
module.exports.addAlbum = async(req, res)=>{

    try{
        const token = req.headers['authorization']?.split(' ')[1];
        if(!token){
            return res.status(401).json({
                status: 401,
                data: null,
                message: "Unauthorized Access",
                error: null
            });
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err){
                return res.status(401).json({
                    status: 401,
                    data: null,
                    message: "Unauthorized Access",
                    error: null
                });
            }
            req.user = decoded;
        });
        const adminRole = req.user?.role;
        if(adminRole !== 'Admin'){
            return res.status(403).json({
                status: 401,
                data: null,
                message: "Unauthorized Access",
                error: null
            });
        }
        const { artistId, name, year, hidden} = req.body;
        if(!artistId || !name || !year ){
            return res.status(400).json({
                status: 400,
                data: null,
                message: "Bad Request",
                error: null
            });
        }
        const album = new Album({artistId , name, year, hidden});
        await album.save();
        return res.status(201).json({
            status: 201,
            data: album,
            message: "Album added successfully",
            error: null
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: "Internal Server Error",
            error: error.message
    });
    }
}

module.exports.getAlbumById = async (req, res)=>{
    try{

        const token = req.headers['authorization']?.split(' ')[1];
        if(!token){
            return res.status(401).json({
                status: 401,
                data: null,
                message: "Unauthorized Access",
                error: null
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err){
                return res.status(401).json({
                    status: 401,
                    data: null,
                    message: "Unauthorized Access",
                    error: null
                });
            }
            req.user = decoded;
        });
        const adminRole = req.user?.role;
        console.log("adminRole ", adminRole);
        if(adminRole !== 'Admin' && adminRole !== 'Editor' && adminRole !== 'Viewer'){
            return res.status(403).json({
                status: 401,
                data: null,
                message: "Unauthorized Access",
                error: null
            });
        }
        const {id} = req.params;
        const album = await Album.findById(id);
        if(!album){
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Album not found",
                error: null
            });
        }
        return res.status(200).json({
            status: 200,
            data: album,
            message: "Album found",
            error: null
        })
    }catch(error){
        console.error(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: "Bad Request",
            error: error.message
    });
    }
}
module.exports.getAllAlbum = async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                status: 401,
                data: null,
                message: "Unauthorized Access",
                error: null
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    status: 401,
                    data: null,
                    message: "Unauthorized Access",
                    error: null
                });
            }
            req.user = decoded;
        });
        const adminRole = req.user?.role;
        if (adminRole !== 'Admin' && adminRole !== 'Editor' && adminRole !== 'Viewer') {
            return res.status(403).json({
                status: 403,
                data: null,
                message: "Unauthorized Access",
                error: null
            });
        }
        const { limit = 5, offset = 0, artistId, hidden } = req.query;

        const filter = {};
        if (artistId) {
            filter.artistId = artistId;
        }
        if (hidden !== undefined) {
            filter.hidden = hidden === 'true'; 
        }
        const albums = await Album.find(filter)
            .skip(Number(offset))
            .limit(Number(limit));
        if (!albums || albums.length === 0) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "No albums found",
                error: null
            });
        }
        return res.status(200).json({
            status: 200,
            data: albums,
            message: "Albums retrieved successfully",
            error: null
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

module.exports.updateAlbum = async(req, res)=>{
    try{

    const token = req.headers['authorization']?.split(' ')[1];
        if(!token){
            return res.status(401).json({
                status: 401,
                data: null,
                message: "Unauthorized Access",
                error: null
            });
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err){
                return res.status(401).json({
                    status: 401,
                    data: null,
                    message: "Unauthorized Access",
                    error: null
                });
            }
            req.user = decoded;
        });
        const adminRole = req.user?.role;
        if(adminRole !== 'Admin' && adminRole !== 'Editor'){
            return res.status(403).json({
                status: 403,
                data: null,
                message: "Unauthorized Access",
                error: null
            });
        }
        const {id} = req.params;
        const {name, year, hidden} = req.body;
        const album = await Album.findById(id);
        if(!album){
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Album not found",
                error: null
                })
            }
            const updatedAlbum = await Album.findByIdAndUpdate(id, {name, year, hidden}, {new: true});
            return res.status(200).json({
                status: 200,
                data: updatedAlbum,
                message: "Album updated successfully",
                error: null
            })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: "Internal Server Error",
            error: error.message
    });
    }
}

module.exports.deleteAlbum = async(req, res)=> {
    try{
        const token = req.headers['authorization']?.split(' ')[1];
        if(!token){
            return res.status(401).json({
                status: 401,
                data: null,
                message: "Unauthorized Access",
                error: null
            });
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err){
                return res.status(401).json({
                    status: 401,
                    data: null,
                    message: "Unauthorized Access",
                    error: null
                });
            }
            req.user = decoded;
        });
        const adminRole = req.user?.role;
        if(adminRole !== 'Admin' && adminRole !== 'Editor'){
            return res.status(403).json({
                status: 403,
                data: null,
                message: "Forbidden Access",
                error: null
            });
        }
        const {id} = req.params;
        const album = await Album.findById(id);
        if(!album){
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Album not found",
                error: null
                })
            }
                const deletedAlbum = await Album.findByIdAndDelete(id);
                return res.status(200).json({
                    status: 200,
                    data: deletedAlbum,
                    message: "Album deleted successfully",
                    error: null
                })

}
catch(error){
     console.log(error);
    return res.status(500).json({
        status: 500,
        data: null,
        message: "Internal Server Error",
        error: error.message
    });
}
}
