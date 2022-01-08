const advancedResults = (model, populate) => async (req, res, next) => {
    // new variable that will be assigned a trade value after advanced filtering
    let query;

    // making a copy of req.query using spread operator
    const reqQuery = { ...req.query };

    // Creating an arroy of fields to exclude from query parameters
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    // console.log(reqQuery);

    // getting request parameters and creating a query string
    // let queryStr = JSON.stringify(req.query); 
    let queryStr = JSON.stringify(reqQuery); // changed as we made a copy of req.query
    // console.log(queryStr);

    // searching for specific parameters and adding "$" sign as per documentation so we can later filter trades database using query numbers 
    // https://docs.mongodb.com/manual/reference/operator/query-comparison/
    // /api/v1/trades?careers[in]=Cook
    // /api/v1/trades?averagePricePerCouple[gte]=15
    // /api/v1/trades?averagePricePerCouple[gte]=15&location.city=Skrzeszewo
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    // console.log(queryStr);

    // assiging a trade value based on filter query parameters
    //query = Trade.find(JSON.parse(queryStr));

    // above changed to below as we created reverse virtual to include proffesions associated with the trade to response
    // query = Trade.find(JSON.parse(queryStr)).populate('proffesions');
    query = model.find(JSON.parse(queryStr));

    // SELECT FIELDS 
    // we can explicitly set what to get back from the request - "/api/v1/trades?select=name,description"
    // we can combine it with filtering - "/api/v1/trades?select=name,description,hiring&hiring=true"
    // https://mongoosejs.com/docs/queries.html
    if(req.query.select){
        const fields = req.query.select.split(',').join(' ');
        // console.log("Fields: ", fields);

        query = query.select(fields);
    }

    // SORT 
    // /api/v1/trades?select=name,description,hiring&sort=name
    // /api/v1/trades?select=name,description,hiring&sort=-name
    // https://mongoosejs.com/docs/queries.html
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');

        query = query.sort(sortBy);
    } else {
        // creatind default sortBy if none is specified in query request
        query = query.sort('-createdAt');
    }

    // PAGINATION
    // /api/v1/trades?limit=2
    // /api/v1/trades?limit=2&select=name
    // /api/v1/trades?page=2&limit=2&select=name
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page -1)*limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    if(populate) {
        query = query.populate(populate);
    }

    // const trades = await Trade.find();
    const results = await query;

    // Pagination result
    const pagination = {};

    if(endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit: limit
        }
    }

    if(startIndex > 0) {
        pagination.prev = {
            page: page -1,
            limit: limit
        }
    }

    res.advancedResults = {
        success: true,
        count: results.length,
        pagination,
        data: results
    }

    next()
};

module.exports = advancedResults;