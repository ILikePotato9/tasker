#!/usr/bin/env node
const fs = require('node:fs');
const command = process.argv[2];
if (!command) {
  console.log("INVALID USAGE\nUsage:\nnode main.js <command> (name)");
  process.exit(1);
}
let name = false;
let nameList = [];
if (command !== 'list' && command !== 'help') {
  name = process.argv[3];
  if (!name) {
    console.log("INVALID USAGE\nUsage:\nnode main.js <command> (name)");
    process.exit(1);
  }
}
let id = 0;
let data = JSON.parse(fs.readFileSync('info.json','utf8'));
let lastId = -1;
for (let i = 0; i < data.tasks.length; i++) {
  const task = data.tasks[i];
  lastId = task.id;
  nameList.push(task.name);
}
switch (command) {
  case 'list':
    for (let i = 0; i < data.tasks.length; i++) {
      const task = data.tasks[i];
      console.log(`Name: ${task.name} ID: ${task.id} Completed: ${task.status}`);
    }
    break;
  case 'help':
    console.log('Commands:\nhelp,list,add,rem,tick');
    break;
  case 'add':
    if (nameList.includes(name)) {
      console.log('TASK ALREADY EXISTS!');
      process.exit(1);
    } else {
      lastId += 1;
      data.tasks[lastId] = {"name":name,"id":lastId,"status":false};
      console.log(`Added ${name}`);
      fs.writeFileSync('info.json',JSON.stringify(data,null,2));
      nameList.push(name);
    }
    break;
  case 'rem':
    id = parseInt(name,10);
    if (Number.isNaN(id)) {
      console.log('INVALID ID!');
      process.exit(1);
    } else {
      for (let i = 0; i < data.tasks.length; i++) {
        const task = data.tasks[i];
        if (task.id === id) {
          data.tasks.splice(i,1)
          console.log('Deleted task!');
          break
        }
      }
      for (let i = 0; i < data.tasks.length; i++) {
        data.tasks[i].id = i;
      }
      fs.writeFileSync('info.json',JSON.stringify(data,null,2));
    }
    break
  case 'tick':
    id = parseInt(name,10);
    if (Number.isNaN(id)) {
      console.log('INVALID ID!');
      process.exit(1);
    } else {
      for (let i = 0; i < data.tasks.length; i++) {
        const task = data.tasks[i];
        if (task.id === id) {
          task.status = !task.status;
          console.log('Ticked task!');
          break
        }
      }
      fs.writeFileSync('info.json',JSON.stringify(data,null,2));
    }
    break
  default:
    console.log('INVALID COMMAND');
}
