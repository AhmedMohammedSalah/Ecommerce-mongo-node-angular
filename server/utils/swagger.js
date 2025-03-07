// swagger.js
import swaggerAutogen from "swagger-autogen";

const outputFile = "./swagger-output.json"; // Output file for Swagger docs
const endpointsFiles = ["./app.js"]; // Path to your main Express app file

const doc = {
  info: {
    title: "E-Commerce Backend API",
    version: "1.0.0",
    description:
      "API documentation for the E-Commerce Backend built with Node.js, Express, and MongoDB",
  },
  host: "localhost:3000", // Update with your server URL
  basePath: "/",
  schemes: ["http"],
};

swaggerAutogen(outputFile, endpointsFiles, doc);
