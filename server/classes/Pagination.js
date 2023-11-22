class Pagination {
    paginateItems(items, offset, limit) {
        const itemCount = items.length;
        const totalPages = Math.ceil(itemCount / limit);
        const paginatedItems = items.slice(offset, offset + limit);

        return { paginatedItems, totalPages, itemCount };
    }
}

module.exports = new Pagination();