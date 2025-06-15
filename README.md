# sclipt - Your CLI Snippet Manager 🚀

sclipt is a command-line interface tool that helps you quickly store, list, view, delete, and search your code snippets right from your terminal. Designed for developers, it provides a fast and efficient way to manage reusable pieces of code without leaving your workflow.

## ✨ Features
- **Add Snippets**: Interactively add new snippets with a title, multi-line content, and tags.
- **List All Snippets**: Get a quick overview of all your saved snippets with their IDs, titles, and tags.
- **View Snippet Details**: Display the full content of any snippet by its unique ID.
- **Delete Snippets**: Easily remove outdated or unwanted snippets using their ID.
- **Search by Tag**: Find snippets efficiently by specifying a tag (e.g., `js`, `react`, `node`).
- **Beautiful Output**: Leverages `chalk` for vibrant colors and `boxen` for elegant terminal boxes, making your CLI experience visually appealing.
- **Multi-line Input**: Supports multi-line code input, perfect for storing larger code blocks.

## 🛠️ Installation
To get sclipt up and running on your system, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/notsugee/sclipt.git
   cd sclipt
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## 🚀 Usage
Navigate to the `sclipt` directory in your terminal. You can make sclipt available as a direct command (e.g., `sclipt add`) by running `npm link` in the project's root directory.

### Getting Help
To see a list of available commands and their usage:
```bash
sclipt help
```
or
```bash
sclipt
```

### Add a New Snippet
Interactively prompts you for a title, multi-line content, and comma-separated tags. To finish multi-line content, type `scliptend` on a new line and press Enter.
```bash
sclipt add
```

### List All Snippets
Displays a list of all your saved snippets.
```bash
sclipt list
```

### View a Snippet
View the full content of a specific snippet by its unique ID.
```bash
sclipt view <snippet_id>
```
Example:
```bash
sclipt view 1718063234567
```

### Delete a Snippet
Permanently remove a snippet by its unique ID.
```bash
sclipt delete <snippet_id>
```
Example:
```bash
sclipt delete 1718063234567
```

### Search Snippets by Tag
Find snippets that have a specific tag.
```bash
sclipt search --tag <tag_name>
```
Example:
```bash
sclipt search --tag js
```
Or to find snippets tagged with `node`:
```bash
sclipt search --tag node
```

## 💻 Technologies Used
- **Node.js**: The JavaScript runtime environment.
- **fs.promises**: Node.js built-in module for asynchronous file system operations (to store snippets).
- **readline**: Node.js built-in module for interactive command-line input.
- **chalk**: For adding vibrant colors and styles to terminal output.
- **boxen**: For drawing beautiful ASCII art boxes around output sections and prompts.

## ✨ Future Enhancements (Ideas)
- **Search by Title/Content**: Extend search functionality to include keywords in titles or content.
- **Update Snippets**: Allow editing of existing snippet titles, content, or tags.
- **Export/Import**: Export snippets to a file (e.g., JSON, Markdown) or import from one.
- **Tag Management**: List all unique tags, rename tags.
- **Configuration**: Allow users to customize the `scliptend` keyword or default file location.

## 📄 License
This project is open-source and available under the MIT License.
