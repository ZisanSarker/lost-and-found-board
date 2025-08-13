const Item = require('../models/item.model');
exports.createItem = async (req, res) => {
  try {
    const {
      type,
      title,
      description,
      category,
      location,
      date,
      contactInfo,
      userId,
      imageUrl
    } = req.body;

    if (!type || !title || !description || !category || !location || !date || !contactInfo || !userId) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    if (!['lost', 'found'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type must be either "lost" or "found"'
      });
    }

    if (imageUrl && typeof imageUrl !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'imageUrl must be a valid string'
      });
    }

    const itemData = {
      type,
      title,
      description,
      category,
      location,
      date,
      contactInfo,
      userId
    };

    if (imageUrl && imageUrl.trim()) {
      itemData.imageUrl = imageUrl.trim();
    }

    const newItem = new Item(itemData);

    const savedItem = await newItem.save();

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: savedItem
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};


exports.getItemsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    if (!['lost', 'found'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid type. Must be either "lost" or "found"'
      });
    }

    // Get total count for pagination
    const totalCount = await Item.countDocuments({ type: type });
    const totalPages = Math.ceil(totalCount / limit);

    // Get paginated items
    const items = await Item.find({ type: type })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
      .skip(skip)
      .limit(limit)
      .lean();

    const transformedItems = items.map(item => ({
      id: item._id.toString(),
      title: item.title,
      description: item.description,
      category: item.category,
      location: item.location,
      date: item.date,
      type: item.type,
      contactInfo: item.contactInfo,
      userId: item.userId,
      image: item.imageUrl,
      imageUrl: item.imageUrl,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));

    const response = {
      success: true,
      data: transformedItems,
      count: transformedItems.length,
      totalCount: totalCount,
      totalPages: totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} items retrieved successfully`
    };

    res.status(200).json(response);

  } catch (error) {
    console.error(`❌ Error fetching ${req.params.type} items:`, error);
    res.status(500).json({
      success: false,
      message: `Failed to fetch ${req.params.type} items`,
      error: error.message
    });
  }
};

exports.getUserItems = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Get total count for pagination
    const totalCount = await Item.countDocuments({ userId: userId });
    const totalPages = Math.ceil(totalCount / limit);

    // Get paginated items
    const items = await Item.find({ userId: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const transformedItems = items.map(item => ({
      id: item._id.toString(),
      title: item.title,
      description: item.description,
      category: item.category,
      location: item.location,
      date: item.date,
      type: item.type,
      contactInfo: item.contactInfo,
      userId: item.userId,
      imageUrl: item.imageUrl,
      status: item.status || 'active',
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));

    res.status(200).json({
      success: true,
      data: transformedItems,
      count: transformedItems.length,
      totalCount: totalCount,
      totalPages: totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    });

  } catch (error) {
    console.error('Error fetching user items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user items',
      error: error.message
    });
  }
};

exports.getItemById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: 'Item ID is required' });
  }

  try {
    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Item retrieved successfully',
      data: {
        id: item._id.toString(),
        title: item.title,
        description: item.description,
        category: item.category,
        location: item.location,
        date: item.date,
        type: item.type,
        contactInfo: item.contactInfo,
        userId: item.userId,
        imageUrl: item.imageUrl || null,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }
    });

  } catch (error) {
    const isInvalidId = error.name === 'CastError';
    res.status(isInvalidId ? 400 : 500).json({
      success: false,
      message: isInvalidId ? 'Invalid item ID format' : 'Server error while retrieving item',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


exports.updateItem = async (req, res) => {
  try {
    const id = req.params.id || req.body.id;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Item ID is required'
      });
    }

    const {
      title,
      category,
      description,
      location,
      date,
      contactInfo,
      type
    } = req.body;

    const userId = req.userId; // Get userId from auth middleware

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    if (item.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own items'
      });
    }

    if (title !== undefined) item.title = title;
    if (category !== undefined) item.category = category;
    if (description !== undefined) item.description = description;
    if (location !== undefined) item.location = location;
    if (date !== undefined) item.date = date;
    if (contactInfo !== undefined) item.contactInfo = contactInfo;
    if (type !== undefined) item.type = type;

    const updatedItem = await item.save();

    const transformedItem = {
      id: updatedItem._id.toString(),
      title: updatedItem.title,
      description: updatedItem.description,
      category: updatedItem.category,
      location: updatedItem.location,
      date: updatedItem.date,
      type: updatedItem.type,
      contactInfo: updatedItem.contactInfo,
      userId: updatedItem.userId,
      imageUrl: updatedItem.imageUrl,
      createdAt: updatedItem.createdAt,
      updatedAt: updatedItem.updatedAt
    };

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: transformedItem
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid item ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};


exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId; // Get userId from auth middleware instead of req.body

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    if (item.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own items'
      });
    }

    await Item.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully'
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid item ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

exports.searchItems = async (req, res) => {
  try {
    const {
      query,
      type,
      category,
      location,
      page = 1,
      limit = 6
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build search filter
    const filter = {};

    // Add type filter if provided
    if (type && ['lost', 'found'].includes(type)) {
      filter.type = type;
    }

    // Add category filter if provided
    if (category && category !== 'all') {
      filter.category = category;
    }

    // Add location filter if provided
    if (location && location !== 'all') {
      filter.location = { $regex: location, $options: 'i' };
    }

    // Add text search if query provided
    if (query && query.trim()) {
      const searchRegex = { $regex: query.trim(), $options: 'i' };
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { location: searchRegex }
      ];
    }

    // Get total count for pagination
    const totalCount = await Item.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    // Get paginated search results
    const items = await Item.find(filter)
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const transformedItems = items.map(item => ({
      id: item._id.toString(),
      title: item.title,
      description: item.description,
      category: item.category,
      location: item.location,
      date: item.date,
      type: item.type,
      contactInfo: item.contactInfo,
      userId: item.userId,
      image: item.imageUrl,
      imageUrl: item.imageUrl,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));

    res.status(200).json({
      success: true,
      data: transformedItems,
      count: transformedItems.length,
      totalCount: totalCount,
      totalPages: totalPages,
      currentPage: parseInt(page),
      hasNextPage: parseInt(page) < totalPages,
      hasPrevPage: parseInt(page) > 1,
      searchParams: {
        query: query || null,
        type: type || null,
        category: category || null,
        location: location || null
      },
      message: `Search completed successfully. Found ${totalCount} items.`
    });

  } catch (error) {
    console.error('Error searching items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search items',
      error: error.message
    });
  }
};

exports.getAllItems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await Item.countDocuments({});
    const totalPages = Math.ceil(totalCount / limit);

    // Get paginated items
    const items = await Item.find({})
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
      .skip(skip)
      .limit(limit)
      .lean();

    const transformedItems = items.map(item => ({
      id: item._id.toString(),
      title: item.title,
      description: item.description,
      category: item.category,
      location: item.location,
      date: item.date,
      type: item.type,
      contactInfo: item.contactInfo,
      userId: item.userId,
      image: item.imageUrl,
      imageUrl: item.imageUrl,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));

    res.status(200).json({
      success: true,
      data: transformedItems,
      count: transformedItems.length,
      totalCount: totalCount,
      totalPages: totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      message: 'All items retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching all items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch all items',
      error: error.message
    });
  }
};