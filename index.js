#!/usr/bin/env node 

const fs = require('fs').promises;
const readline = require('readline/promises');
const chalk = require('chalk').default;

const SNIPPET_FILE = 'snippets.json';

const args = process.argv.slice(2);

const command = args[0];

async function prompt(query){
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answer = await rl.question(query);
  rl.close();
  
  return answer;
}

async function multilinePrompt(query){
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const END_KEYWORD = "scliptend";

  console.log(query);
  console.log(chalk.dim(`(Enter your content. Type ${END_KEYWORD} on a new line and press Enter to finish.)`));
  
  let lines = [];
  const contentPromise = new Promise(resolve => {
    rl.on('line', (line) => {
      if(line.trim().toLowerCase() === END_KEYWORD){
        rl.close();
        resolve(lines.join('\n'));
      }
      else{
        lines.push(line);
      }
    });
  });
  rl.write('');
  return contentPromise;
}

async function loadSnippets(){
  try{
    const data = await fs.readFile(SNIPPET_FILE, 'utf8');
    return JSON.parse(data);
  }
  catch(error){
    if(error.code === 'ENOENT') return [];
    throw(error);
  }
}

async function saveSnippets(snippets){
  const jsonString = JSON.stringify(snippets, null, 2);
  await fs.writeFile(SNIPPET_FILE, jsonString, 'utf8');
}



async function main(){
  const commandArg = args[1];
  if(!command){
    console.log("Welcome to sclipt! Your CLI Snippet Manager!");
    console.log("Usage: ./index.js <command> [options]");
    console.log("Try: ./index.js help");
    return;
  }

  switch(command){
    case 'add':
      await addSnippet();
      break;

    case 'list':
      await listSnippets();
      break;

    case 'view':
      if(!commandArg){
        console.log("Please provide a snippet ID to view.");
        break;
      }
      await viewSnippet(commandArg);
      break;

    case 'delete':
      if(!commandArg){
        console.log("Please provide a snippet ID to delete.");
        break;
      }
      await deleteSnippet(commandArg);
      break;

    case 'search':
      if(!commandArg){
        console.log("Please provide a search query.");
        break;
      }
      await searchSnippets(commandArg, args.slice(1));
      break;

    case 'help':
      console.log("Help text will go here.");
      console.log("Available commands: add, list, view, help");
      break;

    default:
      console.log(`Unknown command: '${command}'.`);
      console.log("Try: ./index.js help");
      break;
  }
}

async function addSnippet(){
  console.log("\n--- Add Snippet ---");
  const title = await prompt("Enter snippet title: ");
  const content = await multilinePrompt("Enter snippet content (paste and press Enter): ");
  const tagsInput = await prompt("Enter tags (comma-separated): ");

  const tags = tagsInput.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag != '');

  if(!title.trim() || !content.trim()){
    console.log("Title and content cannot be empty. Snippet not added.");
    return;
  }

  const snippets = await loadSnippets();

  const newSnippet = {
    id: Date.now().toString(),
    title: title.trim(),
    content: content.trim(),
    createdAt: new Date().toISOString(),
    tags: tags,
  }

  snippets.push(newSnippet);

  await saveSnippets(snippets);

  console.log(`\nSnippet '${title}' added successfully with ID: ${newSnippet.id}`);
  console.log("----------------------------\n");
}

async function listSnippets(){
  console.log("\n--- Your Snippets ---");
  const snippets = await loadSnippets();

  if(snippets.length === 0){
    console.log("No snippets found. Add some with: ./index.js add");
    console.log("----------------------------\n");
    return;
  }

  snippets.forEach(snippet => {
    console.log(`ID: ${snippet.id}`);
    console.log(`Title: ${snippet.title}`);
    console.log(`Created: ${new Date(snippet.createdAt).toLocaleString()}`);
    console.log(`Tags: ${snippet.tags && snippet.tags.length > 0 ? snippet.tags.join(', ') : 'None'}`);
    console.log("----------------------------");
  });
  console.log("----------------------------\n");
}

async function viewSnippet(id){
  console.log(`\n--- Snippet (ID: ${id}) ---`);
  const snippets = await loadSnippets();
  const snippet = snippets.find(s => s.id === id);

  if(!snippet){
    console.log("Snippet not found.");
    console.log("----------------------------\n");
    return;
  }

  console.log(`Title: ${snippet.title}`);
  console.log(`Created: ${new Date(snippet.createdAt).toLocaleString()}`);
  console.log("\n--- Content ---");
  console.log(snippet.content);
  console.log("----------------------------\n");
}

async function deleteSnippet(id){
  console.log(`\n--- Deleting Snippet (ID: ${id}) ---`);
  const snippets = await loadSnippets();
  
  const len = snippets.length;
  const filteredSnippets = snippets.filter(s => s.id !== id);

  if (filteredSnippets.length === len){
    console.log(`No snippet found with ID: ${id}`);
  }
  else{
    await saveSnippets(filteredSnippets);
    console.log(`Snippet with ID: ${id} deleted successfully.`);
  }
  console.log("----------------------------\n");
}

async function searchSnippets(query, additionalArgs){
  console.log(`\n--- Searching for tag: '${additionalArgs[1]}' ---`);
  const snippets = await loadSnippets();

  let requiredTag = additionalArgs[1];

  const foundSnippets = snippets.filter(snippet => {
    const matchesTag = requiredTag ? (snippet.tags && snippet.tags.includes(requiredTag)) : false;
    return matchesTag;
  });

  if(foundSnippets.length === 0){
    console.log(`No snippet found with the tag '${requiredTag}'`);
    console.log("----------------------------\n");
    return;
  }
  else{
    foundSnippets.forEach(snippet => {
      console.log(`Found ${foundSnippets.length} snippets`);
      console.log(`ID: ${snippet.id}`);
      console.log('Title: ${snippet.title}');
      console.log(`Tags: ${snippet.tags && snippet.tags.length > 0 ? snippet.tags.join(', ') : 'None'}`);
      console.log("----------------------------");

    })
      console.log("----------------------------\n");
      }
}

main();
