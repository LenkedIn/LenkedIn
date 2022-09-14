# edit .env

# configure AWS credentials

```bash
serverless config credentials \
  --provider aws \
  --key AKIAIOSFODNN7EXAMPLE \
  --secret wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

# compiling

You can compile the ts files in this directory by 1st installing typescript via

`npm install -g typescript`

then

`npm i`

You can then run the compiler by running `tsc` in this directory. It will pull the settings from .tsconfig and extra @types
from package.json. The output create.js file is what will be uploaded by serverless.

lastly, install plugins:
`serverless plugin install -n serverless-dotenv-plugin`
`serverless plugin install -n serverless-plugin-typescript`

## Usage

invoke function locally
`serverless invoke local --function {function_name}`

deploy to AWS(cloudformationm dynamoDB and functions)
`serverless`
