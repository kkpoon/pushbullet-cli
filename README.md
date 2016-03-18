# PushBullet command line tool

## Install

```npm install -g pbl-cli```

## Setup

```export PB_ACCESS_TOKEN=<YOUR_PUSHBULLET_ACCESS_TOKEN>```

## Usages

### List Contacts

```pbl list-contacts```

### List Devices

```pbl list-devices```

### Push Note

```pbl push note --title "Hello" --body "World"```

### Push Link

```pbl push link --title "Github" --body "Git" --url "https://www.github.com"```

### Push File

```pbl push file --body "My File" --file myfile.png```
