require('dotenv').config({path: '../.env'});
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');
const { GoogleAIFileManager } = require('@google/generative-ai/server');


const app = express();
app.use(cors());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const fileManager = new GoogleAIFileManager(process.env.GEMINI_KEY);
console.log('Gemini Key:', process.env.GEMINI_KEY);


const questionSchema = {
    description: "List of multiple choice questions",
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        id: {
          type: SchemaType.NUMBER,
          description: "Unique identifier for the question",
          nullable: false,
        },
        text: {
          type: SchemaType.STRING,
          description: "The text of the question",
          nullable: false,
        },
        choices: {
          type: SchemaType.ARRAY,
          description: "List of answer choices",
          items: {
            type: SchemaType.STRING,
          },
          nullable: false,
        },
        answer: {
          type: SchemaType.STRING,
          description: "The correct answer",
          nullable: false,
        },
      },
      required: ["id", "text", "choices", "answer"],
    },
  };

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: questionSchema,
    },
  });

  app.get('/questions', async (req, res) => {
  try {
    //Change path to textbook you use, will eventually use what is stored in db
    const pdfFilePath = 'C:/Users/ishoz/OneDrive/Desktop/test.pdf';

    
    if (!fs.existsSync(pdfFilePath)) {
      return res.status(404).json({ error: 'PDF file not found' });
    }

    
    const uploadResponse = await fileManager.uploadFile(pdfFilePath, {
      mimeType: 'application/pdf',
      displayName: 'Gemini 1.5 PDF',
    });

    console.log(
      `Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`
    );

    
    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri,
        },
      },
      {
        text: 'Generate 10 multiple choice questions that test understanding of the core concepts and ideas presented in the textbook chapter. The questions should focus on the underlying principles and theories rather than specific examples or exercises mentioned in the textbook. Provide the questions in JSON format, with id, text, choices (array), answer'
      }
          ]);

    
    const generatedText = result.response.text ? result.response.text() : null;
    const parsedQuestions = JSON.parse(generatedText)
    console.log('Generated questions:', parsedQuestions);
    res.json({ questions: parsedQuestions });
  } catch (error) {
    console.error('Error processing the PDF file:', error);
    res.status(500).json({ error: 'Failed to process the PDF file' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
