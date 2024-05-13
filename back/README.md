# Back-End Project README

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)

## Description

This project is a Node.js API designed to efficiently handle CSV files, separate them based on gender, compress the result, and send it back to the client. It utilizes various libraries for CSV parsing, file compression, and API documentation.

## Features

- API route to receive CSV files.
- Efficient handling and processing of CSV files.
- Separation of CSV files based on gender.
- Compression (zipping) of the result before sending it back to the client.
- Error handling for various scenarios.

## Technologies Used

- Node.js: JavaScript runtime environment for building server-side applications.
- ExcelJS: Library for reading, manipulating, and writing spreadsheet files in JavaScript.
- Adm-zip: Library for creating and extracting Zip files in Node.js.
- Swagger: Tool for documenting RESTful APIs.
- Csv-parse: Library for parsing CSV data.
- NestJS: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.

## Getting Started

To get started with this project, you will need Node.js and npm (Node Package Manager) installed on your machine.

## Installation

1. Clone the repository to your local machine.
2. Navigate to the project directory in your terminal.
3. Run `npm install` to install the project dependencies.

## Usage

1. Once the dependencies are installed, run `npm run start:dev` to start the server.
2. Use the provided API route to send CSV files to the server.
3. The server will efficiently handle the CSV files, separate them based on gender, compress the result, and send it back to the client.
4. Errors, if any, will be appropriately managed and returned to the client.
