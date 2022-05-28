module.exports = {
  getById: (id, collection) => collection.find(c => c.id === id),
  get: function (req, res, collection) {
    const maxResults = req.query.maxResults ? parseInt(req.query.maxResults, 10) : 50;
    const firstResult = req.query.firstResult ? parseInt(req.query.firstResult, 10) : 0;
    let json = collection.slice(firstResult, maxResults + firstResult);
    if (req.params.id) {
      json = collection.find(item => item.id === parseInt(req.params.id, 10));
    }
    res.json(json);
  },
  
  post: function (req, res, collection) {
    let object = req.body;
    object.id = collection.length + 1;
    collection.push(object);
    res.json(object);
    return collection;
  },
  
  put: function (req, res, collection) {
    const object = req.body;
    const updatedCollection = collection.map(item => {
      if (item.id === parseInt(object.id, 10)) {
        return object;
      }
      return item;
    });
    res.json(object);
    return updatedCollection;
  },
  
  delete: function (req, res, collection) {
    const updatedCollection = collection.filter(x => x.id !== parseInt(req.params.id, 10));
    res.status(200).json();
    return updatedCollection;
  }
};
