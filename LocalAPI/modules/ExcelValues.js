let csv = require("csvtojson");

class CsvParser {
  constructor(){
    this._values = [ ];
  }

  setup(file){
    return new Promise((fulfill, reject) => {
      csv().fromFile(file).then((csvRow)=>{
        console.log(csvRow);

        this._values = csvRow;
        fulfill();
      });
    })
  }

  getColumnTotals(){
    let columnTotals = [ ];
    for (let rowIndex = 0; rowIndex < this._values.length; rowIndex++){
      let row = this._values[rowIndex];
      for (let columnIndex in row){
        if (!columnTotals[columnIndex]) columnTotals[columnIndex] = 0;
        columnTotals[columnIndex] += parseInt(row[columnIndex]);
      }
    }
    return columnTotals;
  }
}

module.exports = CsvParser;
