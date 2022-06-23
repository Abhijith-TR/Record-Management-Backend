const showRecords = (req, res) => {
  res.send("Show all records");
};

const showSingleRecord = (req, res) => {
  res.send("Show single record");
};

const updateRecord = (req, res) => {
  res.send("Update single record");
};

const deleteRecord = (req, res) => {
  res.send("Delete single record");
};

const deleteAllRecord = (req, res) => {
  res.send("Delete all instances of a subject");
};

const createRecord = (req, res) => {
  res.send("Create record");
};

module.exports = {
  showRecords,
  showSingleRecord,
  updateRecord,
  deleteAllRecord,
  deleteRecord,
  createRecord,
};
