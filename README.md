
This repo is my personal setup and configuration needed to setup a new Mac.

# Prerequisites

- *Git* to be able to checkout this repository.
- *Node* to npm install this package and to run the commands you see below.

# Commands

### npm run config
---

This will run *config.js* and will either copy a file, create a symlink for it or just open the file.
The configurations of this is inside of config.json, for every file you can add the following:

- The source directory it can be found in, e.g. *configs/test*
- The filename, e.g. *test.txt*
- The target directory, e.g. *~/test* (needed for copy or symlink actions)



```
[
    {
        "type": "symlink",
        "value": "file1",
        "name": "File",
        "source": "example/files",
        "file": "file1.json",
        "target": "/Users/User1/"
    }
]
```

### npm run install 
---

This will run *install.js* and will install various services and apps.
The apps and services are configured inside of *install.json*.
You just add the terminal command it needs to install the app or services. Additionally you can also add some configurations commands, for example to update a package, create a file or to start a service after it has been installed.

Without any extra arguments the *npm run install* command will install everything in the order defined by the objects inside of *install.json*.
Alternatively you can also install just one of the configurations inside of *install.json*, for example:

*npm run install -- brew* will only perform the terminal commands configured inside of the JSON object with the name "brew":

```
    {
        "name": "brew",
        "commands": [
            "/bin/bash -c \"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)\"",
            "brew update"
        ]
    }
```

### Examples of install.json
---

Inside of the install.json file you will find examples of packages, tools and apps I personally install when configuring a Mac.
All of these are pretty self explanatory, except the **mas** apps, these are Mac Appstore apps installed via a CLI tool called **mas**.
In the install.json file you will across a list of these apps, but listed with their ID instead of their name.

e.g.

```
    "commands": [
        "mas install 422293948", // IP Scanner
        "mas install 441258766", // Magnet
        "mas install 1298486723", // FileZilla Pro
        "mas install 931571202", // Quickshade
        "mas install 507257563", // Sip
        "mas install 1176895641", // Spark
        "mas install 1153157709", // Speedtest
        "mas install 1452453066" // Hidden Bar
    ]
```

Instead of using the **mas install** command, you can also use the **mas lucky** command to make searching for an app a bit easier.
For more information about this I suggest going over to the [mas GitHub page](https://github.com/mas-cli/mas)