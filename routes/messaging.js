const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Messaging = require("../model/messaging");
const excel = require("excel4node");
const fs = require("fs");
// Get all existing products
router.get("/", (req, res, next) => {
  Messaging.find()
    .then(doc => {
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(500).json("Cannot be found");
      }
    })
    .catch(error => console.log(error));
});

router.post("/create", (req, res, next) => {
  console.log(req.body);
  const messageItems = req.body;
  const headerInfo = [
    "SegId",
    "ElmPos",
    "ElmId",
    "Name",
    "MaxUse",
    "BaseReq",
    "ElemType",
    "ElemLength",
    "MappingRule"
  ];

  // Create new Workbook
  const workbook = new excel.Workbook();

  // Create desired style
  const style = workbook.createStyle({
    font: {
      color: "#FF0800",
      size: 12
    },

    numberFormat: "$#,##0.00; ($#,##0.00); -"
  });

  const emptyStyle = workbook.createStyle({
    fill: {
      type: "pattern",
      patternType: "solid",
      bgColor: "#FFFF00",
      fgColor: "#FFFF00"
    }
  });

  messageItems.map(item => {
    // Add Worksheets to the workbook
    const parse = item.selectedItems.map(stringObj => JSON.parse(stringObj));

    let row = 1;
    const worksheet = workbook.addWorksheet(item.name);
    headerInfo.map((header, index) =>
      worksheet
        .cell(row, index + 1)
        .string(header)
        .style(style)
    );
    try {
      parse.forEach((input, index) => {
        // Set value of cells
        let cellRow = row + 1;
        let cellIndex = 1;

        worksheet
          .cell(cellRow, cellIndex)
          .string(input._id)
          .style(style);
        cellIndex++;

        worksheet
          .cell(cellRow, cellIndex)
          .string(input.elmPos)
          .style(style);
        cellIndex++;

        worksheet
          .cell(cellRow, cellIndex)
          .string(input.elmId)
          .style(style);
        cellIndex++;

        worksheet
          .cell(cellRow, cellIndex)
          .string(input.elmName)
          .style(style);
        cellIndex++;

        worksheet
          .cell(cellRow, cellIndex)
          .string("1")
          .style(style);
        cellIndex++;

        worksheet
          .cell(cellRow, cellIndex)
          .string(input.baseReq)
          .style(style);
        cellIndex++;

        worksheet
          .cell(cellRow, cellIndex)
          .string(input.elemType)
          .style(style);
        cellIndex++;

        worksheet
          .cell(cellRow, cellIndex)
          .string(input.elemLength)
          .style(style);
        cellIndex++;

        worksheet
          .cell(cellRow, cellIndex)
          .string(input.mapping)
          .style(style);

        row++;
        cellIndex = 1;
      });
    } catch (error) {
      console.log(error);
    }
  });
  workbook.write("Excel.xlsx", res);
});
router.get("/:id", (req, res, next) => {
  Messaging.findById(req.body.id)
    .then(doc => {
      if (doc) {
        res.status(200).json({
          message: doc
        });
      } else {
        res.status(500).json("Cannot be found");
      }
    })
    .catch(error => console.log(error));
});

router.post("/", (req, res, next) => {
  const messaging = new Messaging({
    _id: new mongoose.Types.ObjectId(),
    segId: req.body.segId,
    position: req.body.position.map(position => position)
  });

  messaging
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Message Created",
        createdProduct: {
          result
        }
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Something went wrong",
        error: error
      });
    });
});

module.exports = router;
