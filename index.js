#!/usr/bin/env node 

const fs = require('fs').promises;
const readline = require('readline/promises');

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
  const id = args[1];
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
      if(!id){
        console.log("Please provide a snippet ID to view.");
        break;
      }
      await viewSnippet(id);
      break;

    case 'delete':
      if(!id){
        console.log("Please provide a snippet ID to delete.");
        break;
      }
      await deleteSnippet(id);
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
  const content = await prompt("Enter snippet content (paste and press Enter): ");

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

main();
