# test-gpt

A simple FastAPI testing repository demonstrating basic web API functionality. This repository serves as an example project for learning and testing purposes, showcasing a minimal FastAPI application with a REST endpoint.

## Overview

This repository contains a lightweight FastAPI application that provides a simple "Hello World" API endpoint. It's designed to be used for testing, learning, and demonstration purposes.

## Features

- **FastAPI Framework**: Modern, fast web framework for building APIs with Python
- **Simple REST Endpoint**: Single `/hello` endpoint returning JSON response
- **Minimal Setup**: Clean, straightforward project structure

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/calexandre/test-gpt.git
   cd test-gpt
   ```

2. Install FastAPI and Uvicorn:
   ```bash
   pip install fastapi uvicorn
   ```

## Usage

1. Start the development server:
   ```bash
   uvicorn test:app --reload
   ```

2. Open your browser and navigate to:
   - API endpoint: `http://localhost:8000/hello`
   - Interactive API docs: `http://localhost:8000/docs`

## API Endpoints

### GET /hello

Returns a simple greeting message.

**Response:**
```json
{
  "Hello": "World"
}
```

## Contributing

Welcome contributors! Quickly create a pull request with your changes. See [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

## Project Structure

```
test-gpt/
├── test.py           # Main FastAPI application
├── README.md         # Project documentation
└── CONTRIBUTING.md   # Contributing guidelines
```
