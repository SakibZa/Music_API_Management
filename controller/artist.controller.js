const Artist = require('../models/Artist.models');
const jwt = require('jsonwebtoken');
module.exports.addArtist = async(req, res)=>{

    try
    {

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
        const {name, grammy, hidden} = req.body;
        if(!name || !grammy ){
            return res.status(400).json({
                status: 400,
                data: null,
                message: "Bad Request",
                error: null
            });
        }
        const artist = new Artist({name, grammy, hidden});
        await artist.save();
        return res.status(201).json({
            status: 201,
            data: artist,
            message: "Artist added successfully",
            error: null
        });
        
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

module.exports.getArtistById = async (req, res)=>{
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
        const artist = await Artist.findById(id);
        if(!artist){
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Artist not found",
                error: null
            });
        }
        return res.status(200).json({
            status: 200,
            data: artist,
            message: "Artist found",
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
module.exports.getAllArtist = async (req, res) => {
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

        const { limit = 5, offset = 0, grammy, hidden } = req.query;
        const filter = {};

        if (grammy !== undefined) {
            const grammyStr = grammy.toString();
            if (grammyStr && !isNaN(Number(grammyStr))) {
                filter.grammy = grammyStr; 
            }
        }
        if (hidden !== undefined) {
            filter.hidden = hidden === 'true';
        }
        const artists = await Artist.find(filter)
            .skip(Number(offset))
            .limit(Number(limit));

        if (!artists || artists.length === 0) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "No artists found",
                error: null
            });
        }

        return res.status(200).json({
            status: 200,
            data: artists,
            message: "Artists retrieved successfully",
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

module.exports.updateArtist = async(req, res)=>{
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
                })
            }
        const {id} = req.params;
        const {name, grammy, hidden} = req.body;
        const artist = await Artist.findById(id);
        if(!artist){
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Artist not found",
                error: null
                })
            }
            artist.name = name;
            artist.grammy = grammy;
            artist.hidden = hidden;
            await artist.save();
            return res.status(204).json({
                status: 204,
                data: artist,
                message: "Artist updated successfully",
                error : "null"
            })

    }catch(error)
    {
        console.error(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

module.exports.deleteArtist = async(req, res)=>{
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
                message: "forbidden Access",
                error: null
                })
            }
        const {id} = req.params;
        const artist = await Artist.findById(id);
        if(!artist){
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Artist not found",
                error: null
                })
        }
          await Artist.findByIdAndDelete(id);          
            return res.status(200).json({
                status: 200,
                data: artist.id,
                message: "Artist deleted successfully",
                error : "null"
            })

    }catch(error)
    {
        console.error(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: "Internal Server Error",
            error: error.message
    });
}
}


