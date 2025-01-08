const Track = require('../models/track.models');
const jwt = require('jsonwebtoken');
module.exports.addTrack = async(req, res)=>{

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
                status: 403,
                data : null,
                message: "Unauthorized Access",
                error: null
                })
            }
            const {artistId, albumId, name, duration, hidden} = req.body;
            if(!artistId || !albumId || !name || !duration){
                return res.status(400).json({
                    status: 400,
                    data: null,
                    message: "Bad Request",
                    error: null
                });

            }
            const track = new Track({artistId, albumId, name, duration, hidden});
            await track.save();
            return res.status(201).json({
                status: 201,
                data: track,
                message: "Track added successfully",
                error: null
                })

    }catch(error){
        console.error(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: "Internal Server Error",
            error: error.message
        });
    }
    
}
module.exports.getTrackById = async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                status: 401,
                data: null,
                message: "Unauthorized Access",
                error: null,
            });
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    status: 401,
                    data: null,
                    message: "Unauthorized Access",
                    error: null,
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
                error: null,
            });
        }

        const { id } = req.params;
        const track = await Track.findById(id)
            .populate({ path: 'albumId', select: 'name' })
            .populate({ path: 'artistId', select: 'name' }); 

        if (!track) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Track not found",
                error: null,
            });
        }

        return res.status(200).json({
            status: 200,
            data: track,
            message: "Track found",
            error: null,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
module.exports.getAllTracks = async (req, res) => {
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
        const { limit = 5, offset = 0, artist_id, album_id, hidden } = req.query;
        const filter = {};
        if (artist_id) filter.artistId = artist_id;
        if (album_id) filter.albumId = album_id;
        if (hidden !== undefined) filter.hidden = hidden === 'true';
        const tracks = await Track.find(filter)
            .skip(parseInt(offset)) 
            .limit(parseInt(limit)) 
            .populate({ path: 'albumId', select: 'name' })
            .populate({ path: 'artistId', select: 'name' });

        return res.status(200).json({
            status: 200,
            data: tracks,
            message: "Tracks retrieved successfully",
            error: null
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

module.exports.updateTrack = async(req, res)=>{
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
        const {name, duration, hidden} = req.body;
        const track = await Track.findById(id);
        if(!track){
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Artist not found",
                error: null
                })
            }
            track.name = name;
            track.duration = duration;
            track.hidden = hidden;
            await track.save();
            return res.status(204).json({
                status: 204,
                data: track,
                message: "track updated successfully",
                error : "null"
            })
    }catch(error)
    {
        console.log(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}
module.exports.deleteTrackById = async(req, res)=>{
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
        const track = await Track.findById(id);
        if(!track){
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Track not found",
                error: null
                })
        }
          await Track.findByIdAndDelete(id);          
            return res.status(200).json({
                status: 200,
                data: track.id,
                message: "Track deleted successfully",
                error : "null"
            })

    }catch(error)
    {
        console.log(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}