#!/usr/bin/env node 

const fs = require('fs').promises;
const readline = require('readline/promises');
const chalk = require('chalk').default;
const boxen = require('boxen').default;

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


  console.log(query);
  console.log(chalk.dim(`>>> (Type 'scliptend' on a new line and press Enter to finish.)`));
  
  let lines = [];
  const contentPromise = new Promise(resolve => {
    rl.on('line', (line) => {
      if(line.trim().toLowerCase() === "scliptend"){
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
    console.log(chalk.bold.blue("Welcome to sclipt! Your CLI Snippet Manager!"));
    console.log(chalk.dim("Usage: sclipt <command> [options]"));
    console.log(chalk.dim("Try: sclipt help"));
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
        console.log(chalk.red("Please provide a snippet ID to view."));
        break;
      }
      await viewSnippet(commandArg);
      break;

    case 'delete':
      if(!commandArg){
        console.log(chalk.red("Please provide a snippet ID to delete."));
        break;
      }
      await deleteSnippet(commandArg);
      break;

    case 'search':
      if(!commandArg){
        console.log(chalk.red("Please provide a search query."));
        break;
      }
      await searchSnippets(commandArg, args.slice(1));
      break;

    case 'help':
      const helpMessage = `${chalk.bold('Usage:')} ${chalk.yellow('sclipt add/list/view/delete [options]')}`;
      console.log(boxen(helpMessage, {
        padding: 1,
        margin: 1,
        borderStyle: 'single',
        borderColor: 'green',
        title: 'help',
        titleAlignment: 'center'
      }));
      
      break;

    default:
      console.log(chalk.red(`Unknown command: '${command}'.`));
      console.log(chalk.dim("Try: sclipt help"));
      break;
  }
}

async function addSnippet(){
  const title = await prompt(chalk.green.bold('>>> ') + "Enter snippet title: ");
  const content = await multilinePrompt(chalk.magenta.bold('>>> ') + "Enter snippet content: ");
  const tagsInput = await prompt(chalk.yellow.bold('>>> ') + "Enter tags (comma-separated): ");

  const tags = tagsInput.split(',').map(tag => tag.trim().toLowerCase());

  if(!title.trim() || !content.trim()){
    const failedAdd = chalk.red("Title and content cannot be empty. Snippet not added.");
    console.log(boxen(failedAdd, {
      padding: 1,
      margin: 1,
      borderStyle: 'single',
      borderColor: 'red',
      title: 'Failed',
      titleAlignment: 'center'
    }));
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

  const addMessage = `\nSnippet '${chalk.bold(title)}' added successfully with ID: ${chalk.yellow(newSnippet.id)}`;
  console.log(boxen(addMessage, {
    padding: 1,
    margin: 1,
    borderStyle: 'single',
    borderColor: 'green',
    title: 'Snippet Added',
    titleAlignment: 'center'
  }));
}

async function listSnippets(){
  const snippets = await loadSnippets();

  if(snippets.length === 0){
    const noSnippetsMsg = chalk.dim("No snippets found. Add some with: ") + chalk.yellow("sclipt add");
    console.log(boxen(noSnippetsMsg, {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'yellow',
      title: 'No Snippets',
      titleAlignment: 'center'
    }));
    return;
  }

  const contentList = [];
  snippets.forEach(snippet => {
    contentList.push(`ID: ${chalk.yellow(snippet.id)}`);
    contentList.push(`Title: ${chalk.bold(snippet.title)}`);
    contentList.push(`Created: ${chalk.dim(new Date(snippet.createdAt).toLocaleString())}`);
    contentList.push(`Tags : ${chalk.green(snippet.tags && snippet.tags.length > 0 ? snippet.tags.join(', ') : 'None')}`);
    contentList.push(chalk.blue("----------------------------"));
  });

    if(contentList.length > 0){
    contentList.pop();
  }

  console.log(boxen(contentList.join('\n'), {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'blue',
    title: 'Your Snippets',
    titleAlignment: 'center'
  }));
}

async function viewSnippet(id){
  const snippets = await loadSnippets();
  const snippet = snippets.find(s => s.id === id);

  if(!snippet){
    const notFoundMsg = chalk.red("Snippet not found.");
    console.log(boxen(notFoundMsg, {
    padding: 1,
    margin: 1,
    borderStyle: 'single',
    borderColor: 'red',
    title: 'Error',
    titleAlignment: 'center'
  }));
    return;
  }

  const viewContent = [
  `Title: ${chalk.bold(snippet.title)}`,
  `Created: ${chalk.dim(new Date(snippet.createdAt).toLocaleString())}`,
  '',
  chalk.cyan.bold("\n--- Content ---"),
  '',
  snippet.content
  ].join('\n');

  console.log(boxen(viewContent, {
    padding: 1,
    margin: 1,
    borderStyle: 'none',
    borderColor: 'green',
    title: `Snippet ID: ${chalk.yellow(id)}`,
    titleAlignment: 'center'
  }));
}

async function deleteSnippet(id){
  const snippets = await loadSnippets();
  
  const len = snippets.length;
  const filteredSnippets = snippets.filter(s => s.id !== id);

  let deleteMessage;
  let borderColor;
  let boxTitle;

  if (filteredSnippets.length === len){
    deleteMessage = chalk.yellow(`No snippet found with ID: ${id}`);
    borderColor = 'yellow';
    boxTitle = 'Deletion Failed';
  }
  else{
    await saveSnippets(filteredSnippets);
    deleteMessage = chalk.green(`Snippet with ID: ${id} deleted successfully.`);
    borderColor = 'green';
    boxTitle = 'Deleted';
  }
  console.log(boxen(deleteMessage, {
    padding: 1,
    margin: 1,
    borderStyle: 'single',
    borderColor: borderColor,
    title: boxTitle,
    titleAlignment: 'center'
  }));
}

async function searchSnippets(query, additionalArgs){
  const snippets = await loadSnippets();

  let requiredTag = additionalArgs[1];

  const foundSnippets = snippets.filter(snippet => {
    const matchesTag = requiredTag ? (snippet.tags && snippet.tags.includes(requiredTag)) : false;
    return matchesTag;
  });
  
  let noResultMsg;
  if(foundSnippets.length === 0){
    noResultMsg = chalk.yellow(`No snippet found with the tag '${requiredTag}'`);
    console.log(boxen(noResultMsg, {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'yellow',
      title: 'No Results',
      titleAlignment: 'center'
    }));
    return;
  }
  else{
    const searchResults = [chalk.green(`Found ${chalk.bold(foundSnippets.length)} snippets`)];
    foundSnippets.forEach(snippet => {
      searchResults.push(`ID: ${chalk.yellow(snippet.id)}`);
      searchResults.push(`Title: ${chalk.bold(snippet.title)}`);
      searchResults.push(`Tags: ${chalk.green(snippet.tags && snippet.tags.length > 0 ? snippet.tags.join(', ') : 'None')}`);
      searchResults.push(chalk.dim("----------------------------"));
    });
    searchResults.pop();

    console.log(boxen(searchResults.join('\n'), {
      padding: 1,
      margin: 1,
      borderStyle: 'doubleSingle',
      borderColor: 'blue',
      title: 'Search Results',
      titleAlignment: 'center'
    }));
  }
}

main();
