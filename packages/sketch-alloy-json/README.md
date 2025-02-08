# Alloy JSON Emitter

This project is a fork of the [TypeSpec](https://github.com/microsoft/typespec) repository, containing the `alloy-json` branch with a simple JSON emitter. The emitter traverses a TypeSpec specification and emits a JSON object with one property per model defined in the spec. The value of each property is the number of properties that the corresponding model has.

## Requirements

- **Node.js** – Make sure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
- **PNPM** – This project uses PNPM for package management. If you don’t have it installed, you can install it globally with:

  ```bash
  npm install -g pnpm
  ```

## Getting Started

Follow these steps to get the project up and running:

1. **Clone the Repository**

   Clone this fork of the TypeSpec repo:

   ```bash
   git clone https://github.com/joheredi/typespec.git
   ```

2. **Checkout the `alloy-json` Branch**

   Navigate into the repository directory and switch to the `alloy-json` branch:

   ```bash
   cd typespec
   git checkout alloy-json
   ```

3. **Install Dependencies**

   Run the following command in the root of the repository to install all required dependencies:

   ```bash
   pnpm install
   ```

4. **Build the Project**

   Build the project and all its dependencies within the monorepo using:

   ```bash
   pnpm --filter sketch-alloy-json... build
   ```

5. **Emit a Sample JSON Output**
   [within packages/sketch-alloy-json]
   Generate the sample JSON output from the TypeSpec file located at `sample/main.tsp` by running:

   ```bash
   pnpm emit:sample
   ```

   The generated output will be located in the `sample/output/` directory.

## Project Overview

This skeleton project demonstrates:

- **JSON Emitter:**  
  The emitter creates a JSON object where each key corresponds to a model defined in the spec, and the value is the number of properties that model contains.

- **Type Graph Traversal:**  
  A simple example of traversing the type graph to collect types from the spec.

- **TypeKit Usage:**  
  The project includes a couple of examples of how to use TypeKit - a toolset for querying and interacting with the type graph.
