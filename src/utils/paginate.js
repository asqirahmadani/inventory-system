const paginate = async ({ model, page = 1, limit = 10 }) => {
    const skip = (page - 1) * limit;

    const result = await model.findMany({
        skip,
        take: limit
    });

    const total = await model.count();

    const data = { total };

    if (skip > 0) {
        data.previous = { page: page - 1, limit };
    }

    data.result = result;

    if (skip + result.length < total) {
        data.next = { page: page + 1, limit };
    }

    return data;
}

module.exports = paginate;