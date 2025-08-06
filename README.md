# PerfTest Pilot

This is a Next.js starter application in Firebase Studio that generates performance test cases and JMeter scripts from Swagger/OpenAPI documentation using AI.

## Local Development and Deployment

To run this application on your local machine, you need to have Node.js and npm installed. You will run two processes in separate terminals: the Genkit AI server and the Next.js development server.

### 1. Installation

First, install the necessary npm packages:

```bash
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root of your project. This file will hold your environment variables. If you are using a local Ollama instance for generation, you can leave this file empty. If you are using a cloud-based model provider, you would add your API key here.

For example, for Google AI:
```
GEMINI_API_KEY=your_google_ai_api_key
```

### 3. Running the Genkit AI Server

The AI functionality is powered by Genkit. Run the following command in your first terminal to start the Genkit server. This will watch for any changes in your AI flow files.

```bash
npm run genkit:watch
```

This will start the Genkit server, typically on port 3400, and make the AI flows available for your Next.js application to call.

### 4. Running the Next.js Application

In a second terminal, run the Next.js development server:

```bash
npm run dev
```

This will start the frontend application, by default on `http://localhost:9002`.

### 5. Using the Application

- Open your web browser and navigate to `http://localhost:9002`.
- You can now upload your Swagger/OpenAPI documentation or use one of the provided examples.
- Use the settings dialog (top-right corner) to configure your AI provider if you are using a local model with Ollama.
- Click "Generate Test Cases" to have the AI generate both the human-readable test cases and the JMeter script.
