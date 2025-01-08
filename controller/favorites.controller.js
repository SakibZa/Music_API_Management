const jwt = require('jsonwebtoken');
const Favorite = require('../models/favorites.models');

module.exports.addFavorite = async (req, res) => {
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

    let decoded;
    jwt.verify(token, process.env.JWT_SECRET, (err, result) => {
      if (err) {
        return res.status(401).json({
          status: 401,
          data: null,
          message: "Unauthorized Access",
          error: null,
        });
      }
      decoded = result;
    });


    const userId = decoded.id;

    const { category, item_id } = req.body;
    if (!category || !['artist', 'album', 'track'].includes(category)) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: "Invalid category. Allowed values are 'artist', 'album', 'track'.",
        error: null,
      });
    }
    if (!item_id) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: "Item ID is required.",
        error: null,
      });
    }
    const existingFavorite = await Favorite.findOne({ userId, category, itemId: item_id });
    if (existingFavorite) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: "Item is already in favorites.",
        error: null,
      });
    }
    const favorite = new Favorite({
      userId,
      category,
      itemId: item_id,
    });
    await favorite.save();

    return res.status(201).json({
      status: 201,
      data: {
        favorite_id: favorite._id,
        category: favorite.category,
        item_id: favorite.itemId,
        created_at: favorite.createdAt,
      },
      message: "Favorite added successfully.",
      error: null,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      data: null,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports.getFavoritesByCategory = async(req, res)=>{
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
    
        let decoded;
        jwt.verify(token, process.env.JWT_SECRET, (err, result) => {
          if (err) {
            return res.status(401).json({
              status: 401,
              data: null,
              message: "Unauthorized Access",
              error: null,
            });
          }
          decoded = result;
        });
    
        const userId = decoded.id;

        const { category } = req.params;
        if (!category || !['artist', 'album', 'track'].includes(category)) {
          return res.status(400).json({
            status: 400,
            data: null,
            message: "Invalid category. Allowed values are 'artist', 'album', 'track'.",
            error: null,
          });
        }

        const limit = parseInt(req.query.limit) || 5; 
        const offset = parseInt(req.query.offset) || 0; 
    
       
        const favorites = await Favorite.find({ userId, category })
          .populate('itemId', 'name') 
          .skip(offset)
          .limit(limit);
    
       
        return res.status(200).json({
          status: 200,
          data: favorites,
          message: "Favorites retrieved successfully.",
          error: null,
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          status: 500,
          data: null,
          message: "Internal Server Error",
          error: error.message,
        });
      }
}

module.exports.removeFavorite = async (req, res) => {
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
  
      let decoded;
      jwt.verify(token, process.env.JWT_SECRET, (err, result) => {
        if (err) {
          return res.status(401).json({
            status: 401,
            data: null,
            message: "Unauthorized Access",
            error: null,
          });
        }
        decoded = result;
      });
  
      const userId = decoded.id;
      const  favorite_id  = req.params.id;
      if (!favorite_id) {
        return res.status(400).json({
          status: 400,
          data: null,
          message: "Favorite ID is required.",
          error: null,
        });
      }
  

      const favorite = await Favorite.findOne({ _id: favorite_id, userId });
      if (!favorite) {
        return res.status(404).json({
          status: 404,
          data: null,
          message: "Favorite item not found or you do not have permission to delete it.",
          error: null,
        });
      }
  

      await Favorite.findByIdAndDelete(favorite_id);
 
      return res.status(200).json({
        status: 200,
        data: null,
        message: "Favorite removed successfully.",
        error: null,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 500,
        data: null,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  };