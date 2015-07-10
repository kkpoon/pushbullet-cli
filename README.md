# PushBullet command line tool

## Install

```npm install -g kkpoon-pushbullet-cli```

## Setup

```export PB_ACCESS_TOKEN=<YOUR_PUSHBULLET_ACCESS_TOKEN>```

## Usages

### List Devices

```pushbullet list-devices```

### Push Note

```pushbullet push note --title "Hello" --body "World"```

### Push Link

```pushbullet push link --title "Github" --body "Git" --url "https://www.github.com"```

### Push File

```pushbullet push file --body "My File" --file myfile.png```
