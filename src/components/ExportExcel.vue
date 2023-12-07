<template>
  <div :id="idName" @click="generate">
    <slot> Download {{ name }} </slot>
  </div>
</template>

<script>
import XLSX from "xlsx";

export default {
  name: "ExportExcel",
  props: {
    // mime type [xlsx]
    type: {
      type: String,
      default: "xlsx",
    },
    // Json to download
    data: {
      type: Array,
      required: false,
      default: null,
    },
    // fields inside the Json Object that you want to export
    // if no given, all the properties in the Json are exported
    fields: {
      type: Object,
      required: false,
    },
    // Title(s) for the data, could be a string or an array of strings (multiple titles)
    title: {
      default: null,
    },
    // filename to export
    name: {
      type: String,
      default: "data.xlsx",
    },
    worksheet: {
      type: String,
      default: "Sheet1",
    },
    fetch: {
      type: Function,
    },
    meta: {
      type: Array,
      default: () => [],
    },
    //event before generate was called
    beforeGenerate: {
      type: Function,
    },
    //event before download pops up
    beforeFinish: {
      type: Function,
    },
    defaultValue: {
      type: String,
      required: false,
      default: "",
    },
  },
  computed: {
    // unique identifier
    idName() {
      var now = new Date().getTime();
      return "export_" + now;
    },
  },
  methods: {
    async generate() {
      if (typeof this.beforeGenerate === "function") {
        await this.beforeGenerate();
      }

      let data = this.data;
      if (typeof this.fetch === "function" || !data) {
        data = await this.fetch();
      }

      if (!data || !data.length) {
        return;
      }

      let createXLSLFormatObj = [];
      let newXlsHeader = [];
      // supposed to be endpoint get ALL Data
      let columns = this.fields;
      let title = this.title;
      let filename = this.name;
      let worksheetName = this.worksheet;
      let mergeTitle = [];
      let wsCol = [];
      let dataTable = this.getProcessedJson(data, columns);

      if (title != null) {
        if (Array.isArray(title)) {
          let i = 0;
          title.forEach((value) => {
            mergeTitle.push({
              s: { r: i, c: 0 },
              e: { r: i, c: Object.keys(columns).length - 1 },
            });
            i++;
            newXlsHeader.push(value);
            createXLSLFormatObj.push(newXlsHeader);
            newXlsHeader = [];
          });
        } else {
          mergeTitle.push({
            s: { r: 0, c: 0 },
            e: { r: 0, c: Object.keys(columns).length - 1 },
          });
          newXlsHeader.push(title);
          createXLSLFormatObj.push(newXlsHeader);
          newXlsHeader = [];
        }
      }

      for (let x in dataTable[0]) {
        // console.log(x)
        newXlsHeader.push(x);
        wsCol.push({
          wch: 18,
        });
      }

      createXLSLFormatObj.push(newXlsHeader);

      dataTable.map(function (item, index) {
        let innerRowData = [];
        for (let key in item) {
          innerRowData.push(item[key]);
        }
        createXLSLFormatObj.push(innerRowData);
      });

      let wb = XLSX.utils.book_new(),
        ws = XLSX.utils.aoa_to_sheet(createXLSLFormatObj),
        range = XLSX.utils.decode_range(ws["!ref"]);

      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          let cell_address = { c: C, r: R };
          let cell_ref = XLSX.utils.encode_cell(cell_address);

          if (!ws[cell_ref]) continue;

          if (ws[cell_ref].t === "n") {
            ws[cell_ref].z = "@";
            // styling is not applicable unless it's pro version
            // ws[cell_ref].s = {
            //     alignment: {
            //         vertical: 'center'
            //     },
            //     font: {
            //         bold: true
            //     }
            // }
          }
        }
      }

      ws["!cols"] = wsCol;
      ws["!merges"] = mergeTitle;

      XLSX.utils.book_append_sheet(wb, ws, worksheetName);
      XLSX.writeFile(wb, filename);
    },

    getProcessedJson(data, header) {
      let keys = this.getKeys(data, header);
      let newData = [];
      let _self = this;

      data.map(function (item, index) {
        let newItem = {};
        for (let label in keys) {
          let property = keys[label];
          newItem[label] = _self.getValue(property, item);
        }
        newData.push(newItem);
      });

      return newData;
    },
    getKeys(data, header) {
      if (header) {
        return header;
      }

      let keys = {};
      for (let key in data[0]) {
        keys[key] = key;
      }
      return keys;
    },
    getValue(key, item) {
      const field = typeof key !== "object" ? key : key.field;
      let indexes = typeof field !== "string" ? [] : field.split(".");
      let value = this.defaultValue;

      if (!field) value = item;
      else if (indexes.length > 1)
        value = this.getValueFromNestedItem(item, indexes);
      else value = this.parseValue(item[field]);

      if (key.hasOwnProperty("callback"))
        value = this.getValueFromCallback(value, key.callback);

      return value;
    },
    getValueFromNestedItem(item, indexes) {
      let nestedItem = item;
      for (let index of indexes) {
        if (nestedItem) nestedItem = nestedItem[index];
      }
      return this.parseValue(nestedItem);
    },
    getValueFromCallback(item, callback) {
      if (typeof callback !== "function") return this.defaultValue;
      const value = callback(item);
      return this.parseValue(value);
    },
    parseValue(value) {
      return value || value === 0 || typeof value === "boolean"
        ? value
        : this.defaultValue;
    },
  },
};
</script>
