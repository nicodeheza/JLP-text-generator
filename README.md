# Japanese Text Generator

## Overview

This project provides an interface to generate bigener friendly Japanese text, including features like AI-powered content creation, furigana annotation, and dictionary integration. It's designed to be used for educational purposes.

## Features

- **AI-Powered Text Generation:** Utilizes Google's Gemini AI model to generate contextually relevant Japanese text based on user prompts.
- **Furigana Support:** Automatically adds furigana (reading aids) to kanji, making the text more accessible to learners.
- **Dictionary Integration:** Includes a dictionary setup for looking up words and their meanings.
- **Streaming Responses:** Supports streaming responses from the AI model for a more interactive experience.

## Technologies Used

- **Backend:**
  - Node.js
  - Express
  - TypeScript
  - Google GenAI
  - @enjoyjs/node-mecab
  - Furigana
  - Wanakana
  - better-sqlite3
  - Drizzle orm
- **Frontend:**
  - React
  - Vite
  - Zustand
  - @radix-ui/react-popover

## Prerequisites

You need to have [MeCab](https://taku910.github.io/mecab/) installed. On Ubuntu/Debian, install it with:

```bash
sudo apt-get install mecab libmecab-dev mecab-ipadic-utf8
```

For other platforms, see the [MeCab installation guide](https://taku910.github.io/mecab/#install).

Also, you need to set up the dictionary

1. Create a directory in the root called `jmDict`
2. Add a Japanese JSON dictionary from [jmdict-simplified](https://github.com/scriptin/jmdict-simplified/releases)
3. Run the script to generate the dictionary database

```bash
yarn push:dict
yarn setup
```

## Setup Instructions

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/nicodeheza/JLP-text-generator.git
    cd japanese-text-generator
    ```

2.  **Install dependencies:**

    ```bash
    yarn
    cd frontend
    yarn
    cd ..
    ```

3.  **Set up environment variables:**

    - Create a `.env` file in the root directory.
    - Add your Google Gemini API key:

      ```
      GEMINI_API_KEY=<your_api_key>
      ```

4.  **Build the frontend:**

    ```bash
    cd frontend
    yarn build
    cd ..
    ```

5.  **Run the application:**

    ```bash
    yarn start
    ```
