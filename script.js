// dependencies
const inquirer = require("inquirer");
const { OpenAI } = require("langchain/llms/openai");
const { PromptTemplate } = require("langchain/prompts");
const { StructuredOutputParser } = require("langchain/output_parsers");
require("dotenv").config();

// OpenAI model settings
const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
  model: "gpt-3.5-turbo",
});

// creating a model
const promptFunc = async (input) => {
  try {
    // defining a schema for the output with the StructuredOutputParser
    const parser = StructuredOutputParser.fromNamesAndDescriptions({
      adCopy: "Advertising copy provided based on the user's input",
      //   explanation: "Detailed explanation of the advertising copy provided",
    });
    const formatInstructions = parser.getFormatInstructions();

    // instantiating a new prompt template
    const prompt = new PromptTemplate({
      template:
        "You are an advertising expert and will be provided a product name and product description, and your task is to generate effective advertising copy that will be used for online advertising. \n{format_instructions}\n{product}\n{productdescription}",
      inputVariables: ["product", "productdescription"],
      partialVariables: { format_instructions: formatInstructions },
    });

    const promptInput = await prompt.format({
      product: input,
      productdescription: input,
    });

    const res = await model.call(promptInput);

    console.log(await parser.parse(res));
  } catch (err) {
    console.log(err);
  }
};

// init function that uses inquirer to prompt the user for input
const init = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "productName",
        message: "Provide a product name:",
      },
      {
        type: "input",
        name: "productdescription",
        message: "Provide a product description:",
      },
    ])
    .then((inquirerResponse) => {
      promptFunc(inquirerResponse.productName, inquirerResponse.productUVP);
    });
};

// calling the init function to start the script
init();
