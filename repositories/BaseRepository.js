class BaseRepository {
  /**
   * @param {import('mongoose').Model} model - The Mongoose model
   */
  constructor(model) {
    this.model = model;
  }

  async create(item) {
    return await this.model.create(item);
  }

  /**
   * Find a document by ID
   * @param {string} id - Document ID
   * @param {string|Object} [populate] - Fields to populate
   * @returns {Promise<import('mongoose').Document|null>}
   */
  async findById(id, populate) {
    let query = this.model.findById(id);
    if (populate) query = query.populate(populate);
    return await query.exec();
  }

  /**
   * Find one document by query
   * @param {Object} query - Search criteria
   * @param {string|Object} [select] - Fields to select
   * @param {string|Object} [populate] - Fields to populate
   * @returns {Promise<import('mongoose').Document|null>}
   */
  async findOne(query, select, populate) {
    let q = this.model.findOne(query);
    if (select) q = q.select(select);
    if (populate) q = q.populate(populate);
    return await q.exec();
  }

  /**
   * Get all documents
   * @param {Object} [query] - Search criteria
   * @param {Object} [options] - Pagination/Sorting options
   * @returns {Promise<Array<import('mongoose').Document>>}
   */
  async getAll(query = {}, options = {}) {
    return await this.model.find(query, null, options).exec();
  }

  /**
   * Update a document by ID
   * @param {string} id - Document ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<import('mongoose').Document|null>}
   */
  async update(id, updateData) {
    return await this.model.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  /**
   * Delete a document by ID
   * @param {string} id - Document ID
   * @returns {Promise<import('mongoose').Document|null>}
   */
  async delete(id) {
    return await this.model.findByIdAndDelete(id).exec();
  }
}

module.exports = BaseRepository;
